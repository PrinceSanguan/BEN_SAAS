<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PageContent;

class HomeController extends Controller
{
    public function index()
    {
        $pageContent = PageContent::all()->groupBy('section')->map(function ($items) {
            return $items->pluck('value', 'field');
        });

        return Inertia::render('Welcome', [
            'pageContent' => $pageContent
        ]);
    }
}
