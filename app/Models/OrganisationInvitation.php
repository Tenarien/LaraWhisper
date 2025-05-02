<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class OrganisationInvitation extends Model
{
    protected $fillable = [
        'organisation_id',
        'email',
        'token',
        'expires_at',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($invite) {
            if (empty($invite->token)) {
                $invite->token = Str::random(32);
            }
            if (empty($invite->expires_at)) {
                $invite->expires_at = now()->addDays(7);
            }
        });
    }

    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }
}
