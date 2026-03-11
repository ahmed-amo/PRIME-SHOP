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
  stock?: number;       // ← optional, if passed we use it
  in_stock?: boolean;   // ← optional, if passed we use it
}

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: 'default' | 'icon' | 'outline';
  className?: string;
  disabled?: boolean;
   // ← manual override still works
}

export default function AddToCartButton({
  product,
  variant = 'default',
  className = '',
  disabled = false,
}: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Determine unavailability from any source:
  // 1. Manual disabled prop
  // 2. in_stock boolean (from backend)
  // 3. stock number (0 = unavailable)
  const isUnavailable =
    disabled ||
    product.in_stock === false ||
    (product.stock !== undefined && product.stock <= 0);

  const handleAddToCart = () => {
    if (isUnavailable) return;

    setIsAdding(true);
    addToCart(product);

    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }, 300);
  };

  const inCart = isInCart(product.id);

  // ── Unavailable state — shown everywhere automatically ──────
  const unavailableUI = (
    <Button
      disabled
      className={`w-full bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 ${className}`}
    >
      Unavailable
    </Button>
  );

  // ── Icon variant ────────────────────────────────────────────
  if (variant === 'icon') {
    if (isUnavailable) {
      return (
        <Button
          disabled
          size="icon"
          className={`bg-gray-100 text-gray-400 cursor-not-allowed ${className}`}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      );
    }

    return (
      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        size="icon"
        className={`${className} ${justAdded ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
      >
        {justAdded ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
      </Button>
    );
  }

  // ── Outline variant ─────────────────────────────────────────
  if (variant === 'outline') {
    if (isUnavailable) {
      return (
        <Button
          disabled
          variant="outline"
          className={`border-gray-200 text-gray-400 cursor-not-allowed ${className}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Unavailable
        </Button>
      );
    }

    return (
      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        variant="outline"
        className={`${className} ${justAdded ? 'border-green-500 text-green-500' : 'border-orange-500 text-orange-500 hover:bg-orange-50'}`}
      >
        {isAdding ? (
          <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2" />Adding...</>
        ) : justAdded ? (
          <><Check className="h-4 w-4 mr-2" />Added!</>
        ) : (
          <><ShoppingCart className="h-4 w-4 mr-2" />{inCart ? 'Add More' : 'Add to Cart'}</>
        )}
      </Button>
    );
  }

  // ── Default variant ─────────────────────────────────────────
  if (isUnavailable) {
    return <div className={className}>{unavailableUI}</div>;
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`w-full ${justAdded ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
      >
        {isAdding ? (
          <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Adding...</>
        ) : justAdded ? (
          <><Check className="h-4 w-4 mr-2" />Added to Cart!</>
        ) : inCart ? (
          <><ShoppingCart className="h-4 w-4 mr-2" />Add More</>
        ) : (
          <><ShoppingCart className="h-4 w-4 mr-2" />Add to Cart</>
        )}
      </Button>
    </div>
  );
}
