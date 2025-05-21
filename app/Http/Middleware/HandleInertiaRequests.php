<?php

namespace App\Http\Middleware;

use App\Models\Conversation;
use App\Models\Organisation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = Auth::user();
        $isOrganisationOwner = null;
        $org = null;
        if ($user) {
            $isOrganisationOwner = $user->organisation && $user->id === $user->organisation->owner_id;
        }


        if($isOrganisationOwner) {
            $org = Organisation::where('owner_id', $user->organisation->owner_id)->first();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'is_organisation_owner' => $isOrganisationOwner,
                'organisation' => $org
            ],
            'conversations' => $user instanceof \App\Models\User
                ? Conversation::getConversations($user)
                : [],
        ];
    }
}
