<?php

namespace App\Providers;

use App\Models\Message;
use App\Observers\MessageObserver;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (env('APP_ENV') === 'production') {
            URL::forceScheme('https');
        }

        Message::observe(MessageObserver::class);

        Broadcast::routes(['middleware' => ['auth']]);

        Vite::prefetch(concurrency: 3);
    }
}
