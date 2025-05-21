<?php

use App\Models\Group;
use Illuminate\Support\Facades\Event;
use App\Models\User;
use App\Models\Organisation;

use function Pest\Laravel\{actingAs, postJson, putJson, deleteJson};

beforeEach(function () {
    Event::fake();

    $this->org = Organisation::factory()->create();
    $this->user = User::factory()->create(['organisation_id' => $this->org->id]);

    actingAs($this->user);
});

it('can create a group with valid name/description', function () {
    $payload = [
        'name' => 'Group 1',
        'description' => 'Description 1',
    ];

    $response = postJson(route('group.store'), $payload);

    $this->assertDatabaseCount('groups', 1);
});

it('cannot create a group with invalid name/description', function () {
    $payload = [
        'name' => '',
        'description' => '',
    ];

    $response = postJson(route('group.store'), $payload);

    $response->assertStatus(422);

    $this->assertDatabaseCount('groups', 0);
});

it('can update a group with valid name/description', function () {
    $group = Group::factory()->create([
        'owner_id' => $this->user->id,
        'organisation_id' => $this->org->id,
    ]);

    $payload = [
        'name' => 'Group 1',
        'description' => 'Description 1',
    ];

    $response = putJson(route('group.update', $group), $payload);

    $this->assertDatabaseHas('groups', [
        'name' => 'Group 1',
        'description' => 'Description 1',
    ]);
});

it('can delete a group', function () {
    $group = Group::factory()->create(['owner_id' => $this->user->id, 'organisation_id' => $this->org->id]);

    $response = deleteJson(route('group.destroy', $group));

    $this->assertDatabaseCount('groups', 0);
});
