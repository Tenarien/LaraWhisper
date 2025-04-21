<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('/', function () {return inertia('Home');})->name('home');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

//    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('user/{user}', [MessageController::class, 'byUser'])->name('chat.user');
    Route::get('group/{group}', [MessageController::class, 'byGroup'])->name('chat.group');

    Route::post('/message', [MessageController::class, 'store'])->name('message.store');
    Route::delete('message/{message}', [MessageController::class, 'destroy'])->name('message.destroy');
    Route::get('/message/older/{message}', [MessageController::class, 'loadOlder'])->name('message.loadOlder');
});

Route::middleware(['guest'])->group(function () {
    Route::get('/login', [AuthController::class, 'index'])->name('login');
    Route::get('/register', [AuthController::class, 'create'])->name('register');

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'store']);
});

