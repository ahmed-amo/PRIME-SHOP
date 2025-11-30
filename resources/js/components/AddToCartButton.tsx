// resources/js/Components/AddToCartButton.tsx
import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../contexts/cartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: 'default' | 'icon' | 'outline';
  showQuantitySelector?: boolean;
  className?: string;
}

export default function AddToCartButton({
  product,
  variant = 'default',
  className = ''
}: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);

    // Add to cart
    addToCart(product);

    // Show success feedback
    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);

      // Reset success state after 2 seconds
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
    }, 300);
  };

  const inCart = isInCart(product.id);

  // Icon variant
  if (variant === 'icon') {
    return (
      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        size="icon"
        className={`${className} ${justAdded ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
      >
        {justAdded ? (
          <Check className="h-4 w-4" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </Button>
    );
  }

  // Outline variant
  if (variant === 'outline') {
    return (
      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        variant="outline"
        className={`${className} ${justAdded ? 'border-green-500 text-green-500' : 'border-orange-500 text-orange-500 hover:bg-orange-50'}`}
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2" />
            Adding...
          </>
        ) : justAdded ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Added!
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {inCart ? 'Add More' : 'Add to Cart'}
          </>
        )}
      </Button>
    );
  }

  // Default variant with optional quantity selector
  return (
    <div className={`flex flex-col gap-2 ${className}`}>


      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`w-full ${justAdded ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Adding...
          </>
        ) : justAdded ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Added to Cart!
          </>
        ) : inCart ? (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add More
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  );
}
