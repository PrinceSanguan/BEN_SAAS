<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
          // Register XP Service as a singleton
    $this->app->singleton(\App\Services\XpService::class, function ($app) {
        return new \App\Services\XpService();
    });

    // Register UserStat Service as a singleton
    $this->app->singleton(\App\Services\UserStatService::class, function ($app) {
        return new \App\Services\UserStatService($app->make(\App\Services\XpService::class));
    });

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
