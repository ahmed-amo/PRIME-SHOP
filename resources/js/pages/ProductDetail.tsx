"use client";

import React, { useState } from "react";
import {
  Star,
  Share2,
  ChevronRight,
} from "lucide-react";
import ShopFrontLayout from "@/layouts/shop-layout";
import { Product } from "@/types/products";
import { Category } from "@/types/categories";
import { Link } from "@inertiajs/react";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";

interface Props {
  product: Product;
  category: Category;
}

const placeholder = "https://via.placeholder.com/800?text=No+Image";

export default function ProductDetail({ product, category }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = product.images && product.images.length > 0
    ? product.images.filter(Boolean)
    : [product.image_url || placeholder];

  return (
    <ShopFrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 bg-white">
        {/* Breadcrumb - FIXED */}
        <nav className="flex mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400 self-center" />

          {/* Fixed: Use category.slug and category.name */}
          <Link
            href={`/category/${category.slug}`}
            className="text-gray-500 hover:text-gray-700"
          >
            {category.name}
          </Link>

          <ChevronRight className="h-4 w-4 mx-2 text-gray-400 self-center" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
              />
            </div>

            {images.length > 1 && (
              <div className="flex space-x-4 overflow-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg ${
                      selectedImage === i ? "ring-2 ring-indigo-600" : "ring-1 ring-gray-200"
                    }`}
                  >
                    <img src={img} alt="" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : i < product.rating
                          ? "text-yellow-400 fill-yellow-400 opacity-50"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-500">
                  {product.rating} ({product.reviews_count} reviews)
                </p>
              </div>
            </div>

            <div className="border-t border-b py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      product.in_stock ? "bg-green-500" : "bg-red-500"
                    } mr-2`}
                  />
                  <p className={`text-sm ${product.in_stock ? "text-green-700" : "text-red-700"}`}>
                    {product.in_stock ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
              <div className="mt-2 flex items-center border border-gray-200 rounded-md w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700"
                >
                  -
                </button>
                <span className="flex-1 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image_url || product.image || "",
                    description: product.description || "",
                    category: product.category || "",
                  }}
                  disabled={!product.in_stock}
                />
              </div>
              <FavoriteButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image_url || product.image || "",
                  description: product.description || "",
                  category: product.category || "",
                  slug: product.slug,
                }}
                variant="outline"
                size="default"
              />
              <button className="rounded-md border border-gray-300 p-3 hover:bg-gray-50">
                <Share2 className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900">Details</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li><strong>SKU:</strong> {product.id}</li>
                <li><strong>Category:</strong> {category.name}</li>
                <li><strong>Stock:</strong> {product.stock} units</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
          <p className="text-gray-500 mt-2">Coming soon...</p>
        </div>
      </div>
    </ShopFrontLayout>
  );
}
