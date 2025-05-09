<?php

namespace App\Jobs;

use App\Events\GroupDeleted;
use App\Models\Group;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GroupDeleteJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Group $group)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $oldGroup = clone $this->group;

        $this->group->last_message_id = null;
        $this->group->save();

        $this->group->messages()->delete();

        $this->group->users()->detach();

        $this->group->delete();

        GroupDeleted::dispatch($oldGroup);
    }
}
