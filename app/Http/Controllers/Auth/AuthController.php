<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Organisation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function index()
    {
        return inertia('Auth/Login');
    }

    public function create()
    {
        return inertia('Auth/Register');
    }

    public function login(Request $request)
    {
        $validatedData = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:4'],
        ]);

        if (Auth::attempt($validatedData)) {
            $request->session()->regenerate();
            return redirect()->intended('/dashboard')->with('success', 'You are now logged in!');
        } else {
            throw ValidationException::withMessages([
                'password' => 'The provided credentials do not match our records.',
            ]);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => bcrypt($validatedData['password'])
            ]);

            $org = Organisation::create([
                'name'     => "{$user->name}'s Organisation",
                'owner_id' => $user->id,
            ]);

            $user->organisation_id = $org->id;
            $user->save();

            Auth::login($user);

            return redirect()->intended('/')->with('success', 'You are now logged in!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->with('error', 'There was an error, try again.');
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'You have been logged out.');
    }
}
