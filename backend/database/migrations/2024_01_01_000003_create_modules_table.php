<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('title'); // {"pt-BR": "ABC", "en": "ABC", "es": "ABC"}
            $table->json('description');
            $table->integer('age_min')->default(1);
            $table->integer('age_max')->default(6);
            $table->json('tags')->nullable(); // ["letters", "tracing", "phonics"]
            $table->boolean('premium')->default(false);
            $table->string('icon')->nullable();
            $table->string('category'); // abc, numbers, colors, puzzles, drawing, stories
            $table->integer('order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->index(['slug', 'active']);
            $table->index(['category', 'active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
