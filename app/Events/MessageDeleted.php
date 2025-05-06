<?php

namespace App\Events;

use App\Http\Resources\MessageResource;
use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The deleted message instance.
     */
    public function __construct(
        public Message $message,
        public Message $lastMessage
    ) {
        //
    }

    /**
     * The data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'message'     => new MessageResource($this->message),
            'lastMessage' => $this->lastMessage
                ? new MessageResource($this->lastMessage)
                : null,
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [];

        if ($this->message->group_id) {
            $channels[] = new PrivateChannel('message.group.' . $this->message->group_id);
        } else {
            $pair = collect([
                $this->message->sender_id,
                $this->message->receiver_id,
            ])->sort()->implode('-');

            $channels[] = new PrivateChannel('message.user.' . $pair);
        }

        return $channels;
    }
}
