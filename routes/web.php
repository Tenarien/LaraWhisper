<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OrganisationController;
use App\Http\Controllers\OrganisationInvitationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', \App\Http\Middleware\EnsureSameOrganisation::class])->group(function () {
    Route::get('/dashboard', function () {return inertia('Home');})->name('home');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::put('/profile', [ProfileController::class, 'updatePassword'])->name('password.update');

    Route::get('user/{user}', [MessageController::class, 'byUser'])->name('chat.user');
    Route::get('group/{group}', [MessageController::class, 'byGroup'])->name('chat.group');

    Route::post('/message', [MessageController::class, 'store'])->name('message.store');
    Route::delete('message/{message}', [MessageController::class, 'destroy'])->name('message.destroy');
    Route::get('/message/older/{message}', [MessageController::class, 'loadOlder'])->name('message.loadOlder');

    Route::post('/group', [GroupController::class, 'store'])->name('group.store');
    Route::put('/group/{group}', [GroupController::class, 'update'])->name('group.update');
    Route::delete('/group/{group}', [GroupController::class, 'destroy'])->name('group.destroy');

    Route::get('/organisation', [OrganisationController::class,'show'])->name('organisation.show');
    Route::patch('/organisation', [OrganisationController::class,'update'])->name('organisation.update');
    Route::post('/organisation/invite', [OrganisationController::class,'invite'])->name('organisation.invite');
    Route::delete('/organisation/{organisation}/user/{user}', [OrganisationController::class,'destroy'])->name('organisation.user.destroy');
    Route::get('/organisation/join/{token}', [OrganisationInvitationController::class, 'acceptExisting'])->name('organisation.invitation.join');
    Route::delete('/organisations/{organisation}/invites/{invite}', [OrganisationInvitationController::class, 'destroy'])->name('organisation.invite.destroy');
});

Route::middleware(['guest'])->group(function () {
    Route::get('/', function () {return inertia('Welcome');})->name('welcome');

    Route::get('/login', [AuthController::class, 'index'])->name('login');
    Route::get('/register', [AuthController::class, 'create'])->name('register');

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'store']);

    Route::post('/organisation/invite/{token}', [OrganisationInvitationController::class, 'register'])->name('organisation.invitation.register');
    Route::get('/organisation/invite/{token}', [OrganisationInvitationController::class, 'accept'])->name('organisation.invitation.accept');
});

