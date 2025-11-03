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
        Schema::create('progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->integer('stars')->default(0); // 0-3 stars
            $table->integer('time_spent_sec')->default(0);
            $table->decimal('accuracy', 5, 2)->default(0); // 0-100%
            $table->integer('level')->default(1);
            $table->integer('errors_count')->default(0);
            $table->json('meta')->nullable(); // additional session data
            $table->timestamps();

            $table->index(['profile_id', 'module_id', 'date']);
            $table->index(['profile_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('progress');
    }
};
