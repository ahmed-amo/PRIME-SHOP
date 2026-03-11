import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  category?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (id: number, increment: boolean) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemsCount: () => number;
  isInCart: (productId: number) => boolean;
  lastAdded: Omit<CartItem, 'quantity'> | null;
  toastVisible: boolean;
  setToastVisible: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({
  children,
  userId,
}: {
  children: ReactNode;
  userId?: number | null;
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<Omit<CartItem, 'quantity'> | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Runs once on mount — Inertia full reloads on login/logout
  // so this is always a "fresh start" — no need to track changes
  useEffect(() => {
    // Always wipe guest cart — guests never get persistence
    localStorage.removeItem('prime-sh-cart-guest');

    if (userId) {
      // Logged in — load this user's saved cart
      const saved = localStorage.getItem(`prime-sh-cart-${userId}`);
      if (saved) {
        try { setCartItems(JSON.parse(saved)); }
        catch { setCartItems([]); }
      } else {
        setCartItems([]);
      }
    } else {
      // Not logged in — always empty, no exceptions
      setCartItems([]);
    }
  }, []); // empty deps — only runs on mount, which is always a fresh page load

  // Only persist cart for logged-in users
  useEffect(() => {
    if (!userId) return; // guests never save
    localStorage.setItem(`prime-sh-cart-${userId}`, JSON.stringify(cartItems));
  }, [cartItems, userId]);

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prevItems, { ...product, quantity }];
    });

    setLastAdded(product);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3500);
  };

  const updateQuantity = (id: number, increment: boolean) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: increment ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    if (userId) localStorage.removeItem(`prime-sh-cart-${userId}`);
    localStorage.removeItem('prime-sh-cart-guest');
    setCartItems([]);
  };

  const getCartTotal = () => cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const getItemsCount = () => cartItems.reduce((c, i) => c + i.quantity, 0);
  const isInCart = (productId: number) => cartItems.some(i => i.id === productId);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, updateQuantity, removeItem, clearCart,
      getCartTotal, getItemsCount, isInCart,
      lastAdded, toastVisible, setToastVisible,
    }}>
      {children}
    </CartContext.Provider>
  );
};
