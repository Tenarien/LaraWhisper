<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Conversation extends Model
{
    protected $fillable = [
        'user_id1',
        'user_id2',
        'last_message_id'
    ];

    public function user1() : BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id1');
    }

    public function user2() : BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id2');
    }

    public static function getConversations(User $user)
    {
        $users = User::getUsersExceptUser($user);
        $groups = Group::getGroupsExceptUser($user);

        return $users->map(function (User $user) {
            return $user->toConversationArray();
        })->concat($groups->map(function (Group $group) {
            return $group->toConversationArray();
        }));
    }
}
