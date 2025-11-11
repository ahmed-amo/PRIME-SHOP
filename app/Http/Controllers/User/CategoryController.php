<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
{
    $categories = Category::withCount('products')
    ->latest()
    ->paginate(10)
    ->withQueryString();


    $categories->getCollection()->transform(function ($category) {
        if ($category->image) {
            $category->image_url = asset('storage/' . $category->image);
        }
        return $category;
    });

    return Inertia::render('Dashboard/Admin/CategoriesDash', [
        'categories' => $categories,
        'flash' => [
            'success' => session('success')
        ]
    ]);
}

    public function create(): Response
    {
        return Inertia::render('Dashboard/Admin/AddCategorie');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required','string','max:255'],
            'slug' => ['required','string','max:255','unique:categories,slug'],
            'description' => ['nullable','string'],
            'color' => ['nullable','string','max:255'],
            'status' => ['nullable'],
            'image' => ['nullable','image','max:20488'],
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $validated['image'] = $path;
        }

        Category::create($validated);

        return redirect()->route('admin.categories')->with('success', 'Category created');
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('Dashboard/Admin/EditCategories', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'color' => $category->color,
                'status' => $category->status,
                'image' => $category->image,
            ],
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:categories,slug,'.$category->id],
            'description' => ['nullable', 'string'],
            'color' => ['nullable','string','max:255'],
            'status' => ['boolean'],
            'image' => ['nullable','image','max:2048'],
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }

            $path = $request->file('image')->store('categories', 'public');
            $validated['image'] = $path;
        }

        $category->update($validated);

        return redirect()->route('admin.categories')->with('success', 'Category updated');
    }

    public function destroy(Category $category): RedirectResponse
    {
        // Delete image if exists
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();
        return back()->with('success', 'Category deleted');
    }
}
