import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/wishlistContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  slug?: string;
}

interface FavoriteButtonProps {
  product: Product;
  variant?: 'default' | 'icon' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showLabel?: boolean;
}

export default function FavoriteButton({
  product,
  variant = 'icon',
  size = 'icon',
  className = '',
  showLabel = false,
}: FavoriteButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      slug: product.slug,
    });
  };

  if (variant === 'outline') {
    return (
      <Button
        onClick={handleToggle}
        variant="outline"
        size={size}
        className={`${className} ${
          inWishlist
            ? 'border-red-500 text-red-500 hover:bg-red-50'
            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Heart
          className={`h-4 w-4 ${inWishlist ? 'fill-red-500' : ''}`}
        />
        {showLabel && (
          <span className="ml-2">{inWishlist ? 'Saved' : 'Save'}</span>
        )}
      </Button>
    );
  }

  if (variant === 'icon') {
    return (
      <Button
        onClick={handleToggle}
        variant="ghost"
        size={size}
        className={`${className} ${
          inWishlist ? 'text-red-500 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Heart
          className={`h-4 w-4 ${inWishlist ? 'fill-red-500' : ''}`}
        />
      </Button>
    );
  }

  // Default variant
  return (
    <Button
      onClick={handleToggle}
      variant={inWishlist ? 'default' : 'outline'}
      size={size}
      className={`${className} ${
        inWishlist
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Heart
        className={`h-4 w-4 ${inWishlist ? 'fill-white' : ''}`}
      />
      {showLabel && (
        <span className="ml-2">{inWishlist ? 'Saved' : 'Add to Wishlist'}</span>
      )}
    </Button>
  );
}

