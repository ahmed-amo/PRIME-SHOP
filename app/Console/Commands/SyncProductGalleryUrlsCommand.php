<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;

class SyncProductGalleryUrlsCommand extends Command
{
    protected $signature = 'products:sync-gallery-urls {--chunk=100}';

    protected $description = 'Rebuild products.gallery_urls from Spatie media (after enabling R2/S3).';

    public function handle(): int
    {
        $chunk = max(1, (int) $this->option('chunk'));
        $count = 0;

        Product::query()->with('media')->chunkById($chunk, function ($products) use (&$count) {
            foreach ($products as $product) {
                $product->syncGalleryUrlsFromMedia();
                $count++;
            }
        });

        $this->info("Synced gallery URLs for {$count} products.");

        return self::SUCCESS;
    }
}
