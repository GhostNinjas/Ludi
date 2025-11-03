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
        Schema::create('worksheets', function (Blueprint $table) {
            $table->id();
            $table->json('title');
            $table->enum('age_range', ['1-2', '3-4', '5-6']);
            $table->json('tags')->nullable();
            $table->boolean('premium')->default(false);
            $table->string('file_path'); // path in storage or S3
            $table->string('thumbnail')->nullable();
            $table->string('category'); // tracing, coloring, counting, matching
            $table->integer('downloads_count')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->index(['age_range', 'active']);
            $table->index(['category', 'active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('worksheets');
    }
};
