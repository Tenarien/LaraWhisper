<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Randomly set $senderId as either 0 or 1
        $senderId = $this->faker->numberBetween(0, 1);

        // If $senderId is 0, set a random user as the sender (excluding user with id 1)
        if ($senderId === 0) {
            $senderId = $this->faker->randomElement(User::where('id', '!=', $senderId)->pluck('id')->toArray());

            // Make user with id 1 the receiver (admin)
            $receiverId = 1;
        } else {
            // If $senderId is not 0, set a random user as the receiver
            $receiverId = $this->faker->randomElement(User::pluck('id')->toArray());
        }

        $groupId = null;

        // 50% chance that the message is a part of the group
        if ($this->faker->boolean(50)) {
            // Select random group from all groups
            $groupId = $this->faker->randomElement(Group::pluck('id')->toArray());

            $group = Group::find($groupId);

            // Choose a random user from the group as the sender
            $senderId = $this->faker->randomElement($group->users->pluck('id')->toArray());

            $receiverId = null;
        }

        return [
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'group_id' => $groupId,
            'message' => $this->faker->realText(200),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
