<?php

namespace App\Http\Controllers;

use App\Jobs\GroupDeleteJob;
use App\Models\Group;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Models\Organisation;
use Illuminate\Auth\Access\Gate;

class GroupController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        $data = $request->validated();
        $data['organisation_id']      = $request->user()->organisation_id;
        $org = Organisation::find($data['organisation_id']);
        $user_ids = $data['user_ids'] ?? [];

        if ($request->user()->organisation_id !== $org->id) {
            abort(403);
        }

        $group = Group::create($data);
        $group->users()->attach(
            array_unique([$request->user()->id, ...$user_ids, $org->owner_id])
        );

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group)
    {
        if ($group->owner_id !== $request->user()->id && $group->organisation->owner_id !== $request->user()->id) {
            abort(403);
        }
        $data = $request->validated();
        $data['organisation_id'] = $request->user()->organisation_id;
        $org = Organisation::find($data['organisation_id']);
        $user_ids = $data['user_ids'] ?? [];

        $group->update($data);
        $group->users()->sync(
            array_unique([$request->user()->id, ...$user_ids, $org->owner_id])
        );

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        $user = auth()->user();
        if ($group->owner_id !== $user->id && $group->organisation->owner_id !== $user->id) {
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
