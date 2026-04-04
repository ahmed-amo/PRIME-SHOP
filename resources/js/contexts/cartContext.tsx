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

const LS_USER_PREFIX = 'prime-sh-cart-';
/** Guest cart: tab session only — cleared when the tab/window is closed (not persisted in localStorage). */
const SS_GUEST = 'prime-sh-cart-session';
const LEGACY_GUEST_LS = 'prime-sh-cart-guest';
/** Notifies other tabs to drop in-memory cart (logout / explicit clear). */
const LS_TAB_CLEAR = 'prime-sh-clear-cart';

function safeParseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    return Array.isArray(data) ? (data as CartItem[]) : [];
  } catch {
    return [];
  }
}

function readCartForUser(userId: number | null): CartItem[] {
  if (userId !== null) {
    return safeParseCart(localStorage.getItem(`${LS_USER_PREFIX}${userId}`));
  }
  return safeParseCart(sessionStorage.getItem(SS_GUEST));
}

function tabBroadcastClear(): void {
  try {
    localStorage.setItem(LS_TAB_CLEAR, String(Date.now()));
  } catch {
    /* private / blocked storage */
  }
}

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
  const uid = userId ?? null;

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      localStorage.removeItem(LEGACY_GUEST_LS);
    } catch {
      /* ignore */
    }
    return readCartForUser(uid);
  });

  const [lastAdded, setLastAdded] = useState<Omit<CartItem, 'quantity'> | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevUserIdRef = useRef<number | null | undefined>(undefined);

  // Auth user id changed: logout, login, or account switch (Inertia SPA — provider often stays mounted).
  useEffect(() => {
    const next = uid;
    const prev = prevUserIdRef.current;

    if (prev === undefined) {
      prevUserIdRef.current = next;
      return;
    }

    if (prev === next) {
      return;
    }

    prevUserIdRef.current = next;

    if (prev !== null && next === null) {
      try {
        localStorage.removeItem(`${LS_USER_PREFIX}${prev}`);
        sessionStorage.removeItem(SS_GUEST);
        localStorage.removeItem(LEGACY_GUEST_LS);
      } catch {
        /* ignore */
      }
      setCartItems([]);
      setLastAdded(null);
      tabBroadcastClear();
      return;
    }

    if (prev !== null && next !== null && prev !== next) {
      setCartItems(readCartForUser(next));
      setLastAdded(null);
      return;
    }

    if (prev === null && next !== null) {
      try {
        sessionStorage.removeItem(SS_GUEST);
        localStorage.removeItem(LEGACY_GUEST_LS);
      } catch {
        /* ignore */
      }
      setCartItems(readCartForUser(next));
      setLastAdded(null);
    }
  }, [uid]);

  // Other tab: logout or clearCart → keep UI consistent.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== LS_TAB_CLEAR || e.newValue == null) return;
      setCartItems([]);
      setLastAdded(null);
      try {
        sessionStorage.removeItem(SS_GUEST);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // bfcache: resync from storage after back/forward restore.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setCartItems(readCartForUser(uid));
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [uid]);

  useEffect(() => {
    if (!userId) {
      try {
        if (cartItems.length === 0) {
          sessionStorage.removeItem(SS_GUEST);
        } else {
          sessionStorage.setItem(SS_GUEST, JSON.stringify(cartItems));
        }
      } catch {
        /* ignore */
      }
      return;
    }
    try {
      localStorage.setItem(`${LS_USER_PREFIX}${userId}`, JSON.stringify(cartItems));
    } catch {
      /* ignore */
    }
  }, [cartItems, userId]);

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === product.id);
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
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: increment ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (userId) {
      try {
        localStorage.removeItem(`${LS_USER_PREFIX}${userId}`);
      } catch {
        /* ignore */
      }
    }
    try {
      sessionStorage.removeItem(SS_GUEST);
      localStorage.removeItem(LEGACY_GUEST_LS);
    } catch {
      /* ignore */
    }
    setCartItems([]);
    setLastAdded(null);
    tabBroadcastClear();
  };

  const getCartTotal = () => cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const getItemsCount = () => cartItems.reduce((c, i) => c + i.quantity, 0);
  const isInCart = (productId: number) => cartItems.some((i) => i.id === productId);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        getCartTotal,
        getItemsCount,
        isInCart,
        lastAdded,
        toastVisible,
        setToastVisible,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
