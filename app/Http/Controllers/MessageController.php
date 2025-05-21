<?php

namespace App\Http\Controllers;

use App\Events\MessageDeleted;
use App\Events\MessageSent;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $me = auth()->user();
        $orgId = $user->organisation_id;


        if ($orgId !== $me->organisation_id) {
            abort(403, 'Forbidden');
        } elseif ($me->id === $user->id) {
            abort(403, 'Forbidden');
        }

        $messages = Message::where('organisation_id', $orgId)
            ->where(function($q) use ($user, $me) {
                $q->where('sender_id',   $me->id)
                    ->where('receiver_id', $user->id)
                    ->orWhere('sender_id',   $user->id)
                    ->where('receiver_id', $me->id);
            })
            ->latest()
            ->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function byGroup(Group $group)
    {
        $me    = auth()->user();
        $orgId = $me->organisation_id;

        if ($group->organisation_id !== $orgId) {
            abort(403, 'Forbidden');
        }

        $messages = Message::where('organisation_id', $orgId)
            ->where('group_id', $group->id)
            ->latest()
            ->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function loadOlder(Message $message)
    {
        $me    = auth()->user();
        $orgId = $me->organisation_id;

        if ($message->organisation_id !== $orgId) {
            abort(403, 'Forbidden');
        }

        $base = Message::where('organisation_id', $orgId)
            ->where('created_at', '<', $message->created_at)
            ->latest()
            ->paginate(10);

        if ($message->group_id) {
            $messages = $base->where('group_id', $message->group_id);
        } else {
            $messages = $base->where(function ($q) use ($message) {
                $q->where('sender_id',   $message->sender_id)
                    ->where('receiver_id', $message->receiver_id)
                    ->orWhere('sender_id',   $message->receiver_id)
                    ->where('receiver_id', $message->sender_id);
            });
        }

        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $data['sender_id'] = auth()->id();
        $data['organisation_id'] = auth()->user()->organisation_id;

        $receiver = User::findOrFail($data['receiver_id']);

        if($receiver->organisation_id !== $data['organisation_id']){
            abort(403, 'Forbidden');
        }

        if (empty($data['attachments']) && empty($data['message'])) {
            abort(422, 'Empty message');
        }

        $message = Message::create($data);

        // handle attachments
        if (!empty($data['attachments'])) {
            $attachments = [];
            foreach ($data['attachments'] as $file) {
                $dir = 'attachments/' . Str::random(32);
                Storage::makeDirectory($dir);

                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($dir,'public'),];

                $attachments[] = MessageAttachment::create($model);
            }
            $message->attachments = $attachments;
        }

        // update conversation or group
        if ($data['receiver_id'] ?? false) {
            Conversation::updateConversationWithMessage(
                $data['receiver_id'], auth()->id(), $message, $organisationId = auth()->user()->organisation_id,
            );
        }
        if ($data['group_id'] ?? false) {
            Group::updateGroupWithMessage($data['group_id'], $message);
        }

        MessageSent::dispatch($message);
        return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
        if ($message->sender_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $conversation = null;
        $group = null;
        $oldMessage = clone $message;

        if ($message->group_id) {
            $group = Group::find($message->group_id);
            if (!$group) {
                return response()->json(['message' => 'Group not found'], 404);
            }
        } else {
            $userId1 = $message->sender_id;
            $userId2 = $message->receiver_id;
            $conversation = Conversation::where(function ($query) use ($userId1, $userId2) {
                $query->where('user_id1', $userId1)->where('user_id2', $userId2);
            })->orWhere(function ($query) use ($userId1, $userId2) {
                $query->where('user_id1', $userId2)->where('user_id2', $userId1);
            })->first();

            if (!$conversation) {
                return response()->json(['message' => 'Conversation not found'], 404);
            }
        }

        $newLastMessage = null;

        try {
            DB::beginTransaction();

            if ($conversation) {
                $newLastMessage = Message::where(function ($query) use ($userId1, $userId2) {
                    $query->where('sender_id',   $userId1)
                        ->where('receiver_id', $userId2);
                })->orWhere(function ($query) use ($userId1, $userId2) {
                    $query->where('sender_id',   $userId2)
                        ->where('receiver_id', $userId1);
                })->where('id', '<>', $oldMessage->id)
                    ->orderBy('created_at', 'desc')
                    ->first();

                $conversation->last_message_id = $newLastMessage?->id;
                $conversation->save();
            } elseif ($group) {
                $newLastMessage = Message::where('group_id', $group->id)
                    ->where('id', '<>', $oldMessage->id)
                    ->orderBy('created_at', 'desc')
                    ->first();

                $group->last_message_id = $newLastMessage?->id;
                $group->save();
            }

            $message->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => 'Failed to delete message', $e], 500);
        }

        MessageDeleted::dispatch($oldMessage, $newLastMessage ?? null);

        return response()->json([$newLastMessage ? new MessageResource($newLastMessage) : null]);
    }
}
