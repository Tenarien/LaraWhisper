<?php

namespace App\Models;

use App\Models\Scopes\OrganisationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'organisation_id',
        'name',
        'description',
        'owner_id',
        'last_message_id',
    ];

    protected static function booted()
    {
        static::addGlobalScope(new OrganisationScope);
    }

    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    public function owner() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function users() : BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_users');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'group_id');
    }

    public function lastMessage() : BelongsTo
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    public function getLastMessage(): Model
    {
        return $this->messages()
            ->orderBy('created_at', 'desc')
            ->first();
    }

    public function getLastMessageId(): ?int
    {
        return optional($this->getLastMessage())->id;
    }

    public static function getGroupsExceptUser(User $user)
    {
        $orgId = $user->organisation_id;

        if (is_null($orgId)) {
            return collect();
        }

        return Group::select([
            'groups.*',
            'messages.message as last_message',
            'messages.created_at as last_message_date',
        ])
            ->where('groups.organisation_id', $orgId)
            ->join('group_users', 'group_users.group_id', '=', 'groups.id')
            ->where('group_users.user_id', $user->id)
            ->leftJoin('messages', 'messages.id', '=', 'groups.last_message_id')
            ->orderBy('messages.created_at', 'desc')
            ->orderBy('groups.name')
            ->get();
    }

    public function toConversationArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_group' => true,
            'is_user' => false,
            'owner_id' => $this->owner_id,
            'users' => $this->users,
            'user_ids' => $this->users->pluck('id'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'last_message' => $this->last_message,
            'last_message_date' => $this->last_message_date,
        ];
    }

    public static function updateGroupWithMessage($groupId, $message)
    {
        return self::updateOrCreate(
            ['id' => $groupId],
            ['last_message_id' => $message->id],
        );
    }
}
