<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSameOrganisation
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userOrg = auth()->user()->organisation_id;

        foreach ($request->route()->parameters() as $param) {
            if ($param instanceof Model
                && isset($param->organisation_id)
                && $param->organisation_id !== $userOrg
            ) {
                abort(403, 'Forbidden');
            }
        }

        return $next($request);
    }
}
