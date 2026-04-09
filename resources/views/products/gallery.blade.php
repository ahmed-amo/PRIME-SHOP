{{-- Product gallery: images are on Cloudflare R2 (S3 disk). URLs persist across deploys. --}}
@php
    /** @var \App\Models\Product $product */
    /** @var array<int, string> $galleryUrls */
@endphp

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $product->name }} — Gallery</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 960px; margin: 2rem auto; padding: 0 1rem; }
        h1 { font-size: 1.5rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
        .grid img { width: 100%; height: 160px; object-fit: cover; border-radius: 8px; background: #f3f4f6; }
        .hint { color: #6b7280; font-size: 0.875rem; margin-top: 1rem; }
    </style>
</head>
<body>
    <h1>{{ $product->name }}</h1>
    <p class="hint">Stored URLs ({{ count($galleryUrls) }}): use these in email/API; they point at your R2 public domain.</p>

    <div class="grid">
        @forelse ($galleryUrls as $url)
            <figure>
                <img src="{{ $url }}" alt="" loading="lazy" width="320" height="320">
            </figure>
        @empty
            <p>No gallery images.</p>
        @endforelse
    </div>

    <p class="hint">
        Same as <code>Storage::disk('s3')->url(...)</code> via Spatie:
        @foreach ($product->getMedia('gallery') as $media)
            <br><code>{{ $media->getUrl() }}</code>
        @endforeach
    </p>
</body>
</html>
