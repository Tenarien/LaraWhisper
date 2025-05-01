<?php

namespace App\Http\Controllers;

use App\Jobs\GroupDeleteJob;
use App\Models\Group;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;

class GroupController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        $data = $request->validated();
        $user_ids = $data['user_ids'] ?? [];
        $group = Group::create($data);

        $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group)
    {
        $data = $request->validated();
        $user_ids = $data['user_ids'] ?? [];
        $group->update($data);

        $group->users()->sync(array_unique([$request->user()->id, ...$user_ids]));

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        if ($group->owner_id !== auth()->id()) {
            abort(403);
        }

        $group->users()->detach();

        GroupDeleteJob::dispatch($group)->delay(now()->addSeconds(5));

        return response()->json([
            'message'      => 'Group '. $group->name . " Deleted",
            'redirect_url' => route('home'),
        ]);
    }
}
