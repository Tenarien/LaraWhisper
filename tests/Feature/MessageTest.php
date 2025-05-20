<?php

use App\Events\MessageDeleted;
use App\Models\Conversation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Event;
use App\Models\User;
use App\Models\Organisation;
use App\Models\Message;
use App\Events\MessageSent;
use function Pest\Laravel\{actingAs, postJson, deleteJson};

beforeEach(function () {
    Storage::fake('public');
    Event::fake();

    $this->org = Organisation::factory()->create();
    $this->sender = User::factory()->create(['organisation_id' => $this->org->id]);
    $this->receiver = User::factory()->create(['organisation_id' => $this->org->id]);

    actingAs($this->sender);
});

it('can send a message without attachments', function () {
    $payload = [
        'message' => 'Hello, World!',
        'receiver_id' => $this->receiver->id,
    ];

    $response = postJson(route('message.store'), $payload);

    $response->assertStatus(201);

    $this->assertDatabaseHas('messages', [
        'message' => 'Hello, World!',
        'sender_id' => $this->sender->id,
        'receiver_id' => $this->receiver->id,
        'organisation_id' => $this->org->id,
    ]);

    Event::assertDispatched(MessageSent::class, function ($e) {
        return $e->message->message === 'Hello, World!';
    });
});

it('can send a message with attachments', function () {
    $files = [
        UploadedFile::fake()->create('doc.pdf', 123, 'application/pdf'),
        UploadedFile::fake()->create('avatar.png', 123, 'image/png'),
    ];

    $payload = [
        'message' => 'See attachments',
        'receiver_id' => $this->receiver->id,
        'attachments' => $files,
    ];

    $response = postJson(route('message.store'), $payload);

    $response->assertStatus(201);

    $msg = Message::firstOrFail();
    $this->assertDatabaseCount('message_attachments', 2);

    // attachment files exist
    collect($response->json('data.attachments'))->each(function ($att) use ($msg) {
        $this->assertDatabaseHas('message_attachments', [
            'id' => $att['id'],
            'message_id' => $msg->id,
            'name' => $att['name'],
            'mime' => $att['mime'],
            'size' => $att['size'],
        ]);

        Storage::disk('public')->assertExists($att['path']);
    });

    Event::assertDispatched(MessageSent::class);
});

it('cannot send a message to a user outside of your organisation', function () {
    $otherOrg = Organisation::factory()->create();
    $outsideUser = User::factory()->create(['organisation_id' => $otherOrg->id]);

    $payload = [
        'message' => 'Hello, Outsider!',
        'receiver_id' => $outsideUser->id,
    ];

    $response = postJson(route('message.store'), $payload);

    $response->assertStatus(403);

    $this->assertDatabaseCount('messages', 0);
});

it('cannot send an empty message', function () {
    $payload = [
        'message' => '',
        'receiver_id' => $this->receiver->id,
    ];

    $response = postJson(route('message.store'), $payload);

    $response->assertStatus(422);

    $this->assertDatabaseCount('messages', 0);
});

it('can delete your own direct message and update the conversation', function () {
    $conversation = Conversation::factory()->create([
        'user_id1' => $this->sender->id,
        'user_id2' => $this->receiver->id,
        'organisation_id' => $this->org->id,
    ]);

    $older = Message::factory()->create([
        'sender_id' => $this->receiver->id,
        'receiver_id' => $this->sender->id,
        'organisation_id' => $this->org->id,
        'created_at' => now()->subMinute(),
    ]);

    $toDelete = Message::factory()->create([
        'sender_id' => $this->sender->id,
        'receiver_id' => $this->receiver->id,
        'organisation_id' => $this->org->id,
        'created_at' => now(),
    ]);

    $conversation->update(['last_message_id' => $toDelete->id]);

    $response = deleteJson(route('message.destroy', $toDelete));

    $this->assertModelMissing($toDelete);
    Event::assertDispatched(MessageDeleted::class);
});
