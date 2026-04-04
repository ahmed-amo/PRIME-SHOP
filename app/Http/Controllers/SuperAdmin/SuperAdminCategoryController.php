<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = Category::query()
            ->withCount('products')
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        $categories->getCollection()->transform(function (Category $category) {
            if ($category->image) {
                $category->image_url = Str::startsWith($category->image, 'catpics/')
                    ? asset($category->image)
                    : asset('storage/'.$category->image);
            } else {
                $category->image_url = null;
            }

            return $category;
        });

        return Inertia::render('SuperAdmin/Categories', [
            'categories' => $categories,
            'success' => $request->session()->get('success'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'boolean'],
            'image' => ['nullable', 'image', 'max:20488'],
        ]);

        $baseSlug = Str::slug($validated['slug'] ?? $validated['name']);
        if ($baseSlug === '') {
            $baseSlug = 'category';
        }
        $slug = $baseSlug;
        $n = 0;
        while (Category::query()->where('slug', $slug)->exists()) {
            $n++;
            $slug = $baseSlug.'-'.$n;
        }
        $validated['slug'] = $slug;

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        if (! array_key_exists('status', $validated)) {
            $validated['status'] = true;
        }

        Category::query()->create($validated);

        return redirect()->route('super_admin.categories.index')
            ->with('success', 'Category created.');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'boolean'],
            'image' => ['nullable', 'image', 'max:20488'],
        ]);

        $baseSlug = Str::slug($validated['slug'] ?? $validated['name']);
        if ($baseSlug === '') {
            $baseSlug = 'category';
        }
        $slug = $baseSlug;
        $n = 0;
        while (Category::query()->where('slug', $slug)->whereKeyNot($category->id)->exists()) {
            $n++;
            $slug = $baseSlug.'-'.$n;
        }
        $validated['slug'] = $slug;

        if ($request->hasFile('image')) {
            $this->deleteCategoryImage($category->image);
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($validated);

        return redirect()->route('super_admin.categories.index')
            ->with('success', 'Category updated.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->products()->exists()) {
            return back()->with('success', 'Cannot delete a category that still has products.');
        }

        $this->deleteCategoryImage($category->image);
        $category->delete();

        return redirect()->route('super_admin.categories.index')
            ->with('success', 'Category deleted.');
    }

    private function deleteCategoryImage(?string $path): void
    {
        if ($path === null || $path === '') {
            return;
        }
        if (Str::startsWith($path, ['catpics/', 'producss/'])) {
            return;
        }
        Storage::disk('public')->delete($path);
    }
}
