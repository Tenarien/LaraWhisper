<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organisation_id' => $this->organisation_id,
            'name' => $this->name,
            'description' => $this->description,
            'owner' => new UserResource($this->owner),
            'users' => UserResource::collection($this->users),
            'last_message_id' => $this->last_message_id,
        ];
    }
}
