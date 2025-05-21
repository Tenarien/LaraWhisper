<?php

namespace App\Models;

use App\Models\Scopes\OrganisationScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'organisation_id',
        'message',
        'sender_id',
        'group_id',
        'receiver_id'
    ];

    protected static function booted()
    {
        static::addGlobalScope(new OrganisationScope);
    }

    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    public function group() : BelongsTo
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    public function sender() : BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver() : BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function attachments() : HasMany
    {
        return $this->hasMany(MessageAttachment::class);
    }
}
