<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use App\Models\User;
use function Pest\Laravel\{actingAs, post, put, patch, delete, get};

beforeEach(function () {
    Storage::fake('public');

    $this->user = User::factory()->create([
        'password' => bcrypt('password123'),
    ]);
    actingAs($this->user);
});

it('updates user name, email, avatar successfully', function () {
    $avatar = UploadedFile::fake()->create('avatar.png', 123, 'image/png');

    $response = patch(route('profile.update'), [
        'name' => 'New Name',
        'email' => 'newemail@example.com',
        'avatar' => $avatar,
    ]);

    $response->assertStatus(200);
    $this->user->refresh();

    $this->assertDatabaseHas('users', [
        'id' => $this->user->id,
        'name' => 'New Name',
        'email' => 'newemail@example.com',
        'avatar' => $this->user->avatar,
    ]);

    Storage::disk('public')->assertExists(str_replace('/storage/', '', $this->user->avatar));
});

it('updates the password successfully', function () {
    $new = 'newPassword123';

    put(route('password.update'), [
        'current_password' => 'password123',
        'password' => $new,
        'password_confirmation' => $new,
    ])->assertStatus(200)->assertInertia(fn ($page) =>
        $page->has('message')
            ->where('message', 'Password Updated Successfully')
        );

    $this->user->refresh();
    $this->assertTrue(
        Hash::check($new, $this->user->password),
        'Expected the user password to be updated in the database'
    );
});

it('rejects a wrong current password', function () {
    put(route('password.update'), [
        'current_password' => 'wrong-password',
        'password' => 'whatever123',
        'password_confirmation' => 'whatever123',
    ])->assertSessionHasErrors('current_password');

    $this->user->refresh();
    $this->assertTrue(Hash::check('password123', $this->user->password));
});

it('rejects mismatched confirmation', function () {
    put(route('password.update'), [
        'current_password' => 'password123',
        'password' => 'newpass123',
        'password_confirmation' => 'nope123',
    ])->assertSessionHasErrors('password');

    $this->user->refresh();
    $this->assertTrue(Hash::check('password123', $this->user->password));
});
