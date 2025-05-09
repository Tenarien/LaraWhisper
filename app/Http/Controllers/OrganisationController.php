<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrganisationRequest;
use App\Http\Resources\OrganisationResource;
use App\Mail\OrganisationExistingUserInviteMail;
use App\Mail\OrganisationInvitationMail;
use App\Models\Organisation;
use App\Models\OrganisationInvitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class OrganisationController extends Controller
{
    public function show(OrganisationRequest $request)
    {
        $org = $request->user()->organisation()->with(['users','groups'])->first();

        $invites = OrganisationInvitation::where('organisation_id', $org->id)->get();

        return inertia('Organisation/Show', [
            'organisation' => new OrganisationResource($org),
            'invites' => $invites,
        ]);
    }

    public function update(OrganisationRequest $request)
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
        ]);

        $org = $request->user()->organisation;
        $org->update($data);

        return back()->with('success','Organisation name updated.');
    }

    public function destroy(Organisation $organisation, User $user)
    {
        if ($user->id === auth()->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user->organisation()->dissociate();
        $user->save();

        return response()->json([
            'message' => "{$user->name} was removed"
        ]);
    }

    public function invite(OrganisationRequest $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $org = $request->user()->organisation;

        $existing = User::where('email', $data['email'])->first();

        if ($existing && $existing->organisation_id === $org->id) {
            return back()->withErrors([
                'email' => 'That user is already a member of your organisation.',
            ]);
        }

        $invite = OrganisationInvitation::updateOrCreate(
            [
                'organisation_id' => $org->id,
                'email'           => $data['email'],
            ],
            [
                'user_id'   => $existing?->id,
                'token'     => Str::uuid(),
                'expires_at'=> now()->addDays(7),
            ]
        );

        if ($existing) {
            Mail::to($existing)->send(new OrganisationExistingUserInviteMail($invite));
        } else {
            Mail::to($data['email'])->send(new OrganisationInvitationMail($invite));
        }

        return back()->with('success', "Invitation sent to {$data['email']}");
    }
}
