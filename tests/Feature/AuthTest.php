<?php

use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

it('loads login page', function () {
    get('/login')->assertOk();
});

it('authenticate user with valid credentials', function () {
    $user = User::factory()->create([
        'password' => bcrypt('password')
    ]);

    post('/login', ['email' => $user->email, 'password' => 'password'])->assertRedirect();
});

it('authenticate user with invalid credentials', function () {
    post('/login', ['email' => 'fake@email.com', 'password' => 'wrongpassword'])->assertSessionHasErrors();
});

it('log out authenticated user', function () {
    $user = User::factory()->create();

    actingAs($user)->post('/logout')->assertRedirect('/');
});
