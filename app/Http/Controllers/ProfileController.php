<?php

namespace App\Http\Controllers;


use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function edit()
    {
        return inertia('Profile/Edit',);
    }

    public function update(Request $request): \Inertia\Response|\Inertia\ResponseFactory
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
            'avatar' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp,gif',
                'max:2048'
            ],
        ]);

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $request->file('avatar')
                ->store('avatars', 'public');

            $user->avatar = Storage::url($path);
        }

        $user->save();

        return inertia('Profile/Edit')->with('message', 'Profile Updated Successfully');
    }

    public function destroy(Request $request): \Inertia\Response|\Inertia\ResponseFactory
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return inertia('Home');
    }

    public function updatePassword(Request $request): \Inertia\Response|\Inertia\ResponseFactory
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'         => ['required', 'string', Password::min(8), 'confirmed'],
        ]);


        $request->user()
            ->forceFill([
                'password' => Hash::make($validated['password']),
            ])->save();

        return inertia('Profile/Edit')->with('message', 'Password Updated Successfully');
    }
}
