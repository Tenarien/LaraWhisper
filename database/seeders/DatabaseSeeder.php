<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\Organisation;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create an admin user
        $admin = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'admin@admin.com',
            'password' => bcrypt('admin'),
            'is_admin' => true,
        ]);

        $org = Organisation::factory()->create(['owner_id' => null]);

        $admin->organisation_id = $org->id;
        $admin->save();

        $org->owner_id = $admin->id;
        $org->save();

        User::factory()->create([
            'name'     => 'Jane Doe',
            'organisation_id' => $org->id,
            'email'    => 'jane@doe.com',
            'password' => bcrypt('admin'),
            'is_admin' => false,
        ]);

        $moreUsers = User::factory(10)->create([
            'organisation_id' => $org->id,
        ]);

        $allUserIds = User::where('organisation_id', $org->id)
            ->pluck('id')
            ->toArray();

        for ($i = 0; $i < 5; $i++) {
            $group = Group::factory()->create([
                'owner_id' => $admin->id,
                'organisation_id' => $org->id,
            ]);

            $otherUserIds = collect($allUserIds)
                ->reject(fn($id) => $id === $admin->id)
                ->shuffle()
                ->take(rand(2, 5))
                ->toArray();

            $group->users()->attach(
                array_merge([$admin->id], $otherUserIds)
            );
        }

        Message::factory(500)->create([
            'organisation_id' => $org->id,
        ]);

        $messages = Message::whereNull('group_id')
            ->where('organisation_id', $org->id)
            ->orderBy('created_at')
            ->get();

        $conversations = $messages
            ->groupBy(fn($msg) => collect([$msg->sender_id, $msg->receiver_id])
                ->sort()
                ->implode('_'))
            ->map(fn($msgs, $key) => [
                'organisation_id' => $org->id,
                'user_id1' => $msgs->first()->sender_id,
                'user_id2' => $msgs->first()->receiver_id,
                'last_message_id' => $msgs->last()->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ])
            ->values()
            ->toArray();

        Conversation::insertOrIgnore($conversations);
    }
}
