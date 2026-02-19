import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  slug?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: WishlistItem) => void;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

// ✅ Accept userId as prop instead of using usePage
export const WishlistProvider = ({
  children,
  userId
}: {
  children: ReactNode;
  userId?: number | null;
}) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const wishlistKey = userId ? `prime-sh-wishlist-${userId}` : 'prime-sh-wishlist-guest';
    const savedWishlist = localStorage.getItem(wishlistKey);
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist:', error);
        setWishlistItems([]);
      }
    } else {
      setWishlistItems([]);
    }
  }, [userId]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    const wishlistKey = userId ? `prime-sh-wishlist-${userId}` : 'prime-sh-wishlist-guest';
    localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
  }, [wishlistItems, userId]);

  const addToWishlist = (product: WishlistItem) => {
    // ✅ Check if user is logged in
    if (!userId) {
      alert('Please log in to add items to wishlist');
      return;
    }

    setWishlistItems(prevItems => {
      const exists = prevItems.some(item => item.id === product.id);
      if (exists) {
        return prevItems;
      }
      return [...prevItems, product];
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const toggleWishlist = (product: WishlistItem) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);

    // CRITICAL: Also remove from localStorage!
    const wishlistKey = userId ? `prime-sh-wishlist-${userId}` : 'prime-sh-wishlist-guest';
    localStorage.removeItem(wishlistKey);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    getWishlistCount,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
