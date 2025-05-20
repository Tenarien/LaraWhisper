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
        $senderId = $this->faker->randomElement(User::pluck('id')->toArray());
        $receiverId = $this->faker->randomElement(
            User::where('id', '!=', $senderId)->pluck('id')->toArray()
        );
        $groupId = null;

        if ($this->faker->boolean(50)) {
            $groupsWithUsers = Group::has('users')->get();
            if ($groupsWithUsers->isNotEmpty()) {
                $group = $this->faker->randomElement($groupsWithUsers->all());
                $groupId = $group->id;
                $senderId = $this->faker->randomElement($group->users->pluck('id')->toArray());
                $receiverId = null;
            }
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
