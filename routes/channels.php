<?php

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('online', function ($user) {
    return $user ? new UserResource($user) : null;
});

Broadcast::channel('message.user.{userA}-{userB}', function (User $user, $userA, $userB) {
    $ids = [
        (int) $userA,
        (int) $userB,
    ];

    return in_array($user->id, $ids, true)
        ? $user
        : null;
});

Broadcast::channel('message.group.{groupId}', function ($user, $groupId) {
    return $user->groups->contains('id', $groupId) ? $user : null;
});

Broadcast::channel('group.deleted.{groupId}', function ($user, $groupId) {
    return $user->groups->contains('id', $groupId) ? $user : null;
});
