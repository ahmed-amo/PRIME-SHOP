import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
  /** Bold gradient pill (e.g. product toolbar); className still merges last. */
  appearance?: 'default' | 'vibrant';
}

export default function FavoriteButton({
  product,
  variant = 'icon',
  size = 'icon',
  className = '',
  showLabel = false,
  appearance = 'default',
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
        className={cn(
          appearance === 'vibrant'
            ? cn(
                'border-0 text-white shadow-inner transition hover:brightness-110 active:brightness-95',
                inWishlist
                  ? 'bg-gradient-to-br from-orange-600 via-orange-700 to-amber-800'
                  : 'bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600',
              )
            : inWishlist
              ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
              : 'border-red-200 text-red-500 hover:border-red-300 hover:bg-red-50',
          className,
        )}
      >
        <Heart
          className={cn(
            'h-4 w-4 shrink-0 text-current',
            inWishlist && 'fill-current',
          )}
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
          inWishlist ? 'text-red-600 hover:bg-red-50' : 'text-red-500 hover:bg-red-50'
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
          : 'border-red-200 text-red-500 hover:bg-red-50'
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

