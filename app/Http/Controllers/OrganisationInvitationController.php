<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use App\Models\OrganisationInvitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class OrganisationInvitationController extends Controller
{
    public function accept(string $token)
    {
        $invite = OrganisationInvitation::where('token', $token)
            ->where('expires_at', '>', now())
            ->firstOrFail();

        return inertia('Auth/AcceptInvitation', [
            'invite' => [
                'email' => $invite->email,
                'organisationName' => $invite->organisation->name,
                'token' => $invite->token,
            ],
        ]);
    }

    public function register(Request $request, string $token)
    {
        $invite = OrganisationInvitation::where('token', $token)
            ->where('expires_at', '>', now())
            ->first();

        if (! $invite) {
            throw ValidationException::withMessages([
                'token' => 'This invitation is invalid or has expired.',
            ]);
        }

        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'password' => ['required','string','min:8','confirmed'],
        ]);

        // Create the user
        $user = User::create([
            'name' => $data['name'],
            'email' => $invite->email,
            'password' => Hash::make($data['password']),
            'organisation_id' => $invite->organisation_id,
        ]);

        // delete the invite so it can’t be reused
        $invite->delete();

        Auth::login($user);

        return redirect('/')->with('success', 'Welcome aboard! You’ve joined ' . $invite->organisation->name);
    }

    public function destroy(Request $request, Organisation $organisation, OrganisationInvitation $invite)
    {
        if ($request->user()->id !== $organisation->owner_id) {
            abort(403, 'You do not have permission to revoke this invitation.');
        }

        if ($invite->organisation_id !== $organisation->id) {
            abort(404);
        }

        $invite->delete();

        return response()->json([
            'message' => 'Invitation cancelled successfully.',
        ]);
    }

    public function acceptExisting(string $token)
    {
        $invite = OrganisationInvitation::where('token', $token)
            ->where('expires_at', '>', now())
            ->firstOrFail();

        $user = auth()->user();

        if ($user->email !== $invite->email) {
            abort(403, 'This invitation belongs to a different account.');
        }

        $user->organisation()->associate($invite->organisation_id);
        $user->save();

        $invite->delete();

        return redirect('/dashboard')
            ->with('message', 'You have joined ' . $user->organisation->name);
    }
}
