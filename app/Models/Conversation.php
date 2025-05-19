<?php

namespace App\Models;

use App\Models\Scopes\OrganisationScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Conversation extends Model
{
    protected $fillable = [
        'organisation_id',
        'user_id1',
        'user_id2',
        'last_message_id'
    ];

    protected static function booted()
    {
        static::addGlobalScope(new OrganisationScope);
    }

    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    public function user1() : BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id1');
    }

    public function user2() : BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id2');
    }

    public function lastMessage() : BelongsTo
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    public function getLastMessage(): ?Message
    {
        return Message::where(function ($q) {
            $q->where('sender_id',   $this->user_id1)
                ->where('receiver_id', $this->user_id2);
        })
            ->orWhere(function ($q) {
                $q->where('sender_id',   $this->user_id2)
                    ->where('receiver_id', $this->user_id1);
            })
            ->orderBy('created_at', 'desc')
            ->first();
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

    public static function updateConversationWithMessage($userId1, $userId2, $message, $organisationId)
    {
        $conversation = Conversation::where(function ($query) use ($userId1, $userId2) {
            $query->where('user_id1', $userId1)
                ->where('user_id2', $userId2);

        })->orWhere(function ($query) use ($userId1, $userId2) {
            $query->where('user_id1', $userId2)
                ->where('user_id2', $userId1);
        })->first();

        if ($conversation) {
            $conversation->update(['last_message_id' => $message->id]);
        } else {
            Conversation::create([
                'user_id1' => $userId1,
                'user_id2' => $userId2,
                'last_message_id' => $message->id,
                'organisation_id' => $organisationId
            ]);
        }
    }
}
