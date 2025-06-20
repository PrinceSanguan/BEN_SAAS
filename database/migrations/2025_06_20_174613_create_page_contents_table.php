<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('section');
            $table->string('field');
            $table->text('value');
            $table->string('type')->default('text'); // text, image, email
            $table->timestamps();

            $table->unique(['section', 'field']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_contents');
    }
};
