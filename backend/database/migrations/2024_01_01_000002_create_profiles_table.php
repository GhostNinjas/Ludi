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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->enum('age_range', ['1-2', '3-4', '5-6']);
            $table->json('interests')->nullable(); // ["colors", "numbers", "animals", etc.]
            $table->string('avatar')->default('default');
            $table->json('settings')->nullable(); // voice, difficulty, accessibility options
            $table->integer('streak_days')->default(0);
            $table->date('last_activity_date')->nullable();
            $table->integer('total_stars')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'deleted_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
