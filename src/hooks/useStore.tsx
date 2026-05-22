import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, UserAccount, Address, OrderStatus } from '../types';
import { PRODUCTS } from '../data';

interface StoreContextType {
  // Navigation & Page State
  currentPage: 'home' | 'shop' | 'archive' | 'about' | 'product' | 'wishlist' | 'account' | 'checkout' | 'login';
  navigateTo: (page: 'home' | 'shop' | 'archive' | 'about' | 'product' | 'wishlist' | 'account' | 'checkout' | 'login') => void;
  selectedProductId: string | null;
  selectProduct: (id: string) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedVibe: string;
  setSelectedVibe: (vibe: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemsCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // User
  user: UserAccount;
  updateUserAddress: (address: Address) => void;
  addUserAddress: (address: Omit<Address, 'id'>) => void;
  deleteUserAddress: (id: string) => void;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => boolean;
  logout: () => void;
  register: (name: string, email: string) => void;
  updateProfile: (name: string, phone: string, address?: Omit<Address, 'id'>) => void;

  // Orders & UPI Checkout
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'trackingNumber'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;

  // UI Drawer states
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Initial loading screen state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Recently Viewed Products
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_USER: UserAccount = {
  id: 'usr-789',
  name: 'AARAV AGARWAL',
  email: 'aarav.agarwal@gmail.com',
  phone: '+91 98765 43210',
  wishlist: [],
  addresses: [
    {
      id: 'addr-1',
      street: 'Flat No. 402, Elite Heights, Phase 3, Hitech City',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500081',
      country: 'India',
      isDefault: true
    }
  ]
};

// Initial retro orders to populate user's purchase history and admin queue
const INITIAL_ORDERS = (products: Product[]): Order[] => [
  {
    id: 'BS-87291',
    items: [
      {
        product: products[0], // Ghost Sound Tee
        size: 'L',
        quantity: 1,
        priceAtPurchase: products[0].price
      },
      {
        product: products[29], // Faded Arch Cap
        size: 'O/S',
        quantity: 1,
        priceAtPurchase: products[29].price
      }
    ],
    subtotal: products[0].price + products[29].price,
    deliveryFee: 0,
    total: products[0].price + products[29].price,
    status: 'Delivered',
    upiTxnId: 'TXN87291982736',
    name: 'AARAV AGARWAL',
    email: 'aarav.agarwal@gmail.com',
    phone: '+91 98765 43210',
    address: {
      street: 'Flat No. 402, Elite Heights, Phase 3, Hitech City',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500081',
      country: 'India'
    },
    trackingNumber: 'BS-DHL-9182746',
    createdAt: '2026-05-10T14:22:00Z'
  },
  {
    id: 'BS-87355',
    items: [
      {
        product: products[19], // Parachute Ripstop Pants
        size: 'M',
        quantity: 1,
        priceAtPurchase: products[19].price
      }
    ],
    subtotal: products[19].price,
    deliveryFee: 0,
    total: products[19].price,
    status: 'Approved',
    upiTxnId: 'TXN88273516242',
    name: 'AARAV AGARWAL',
    email: 'aarav.agarwal@gmail.com',
    phone: '+91 98765 43210',
    address: {
      street: 'Flat No. 402, Elite Heights, Phase 3, Hitech City',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500081',
      country: 'India'
    },
    trackingNumber: 'BS-DHL-9214772',
    createdAt: '2026-05-20T09:15:00Z'
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'archive' | 'about' | 'product' | 'wishlist' | 'account' | 'checkout' | 'login'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVibe, setSelectedVibe] = useState('All');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<UserAccount>(DEFAULT_USER);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Customer Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const cached = localStorage.getItem('bs_is_logged_in');
    return cached !== null ? cached === 'true' : true;
  });

  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    const cached = localStorage.getItem('bs_registered_users');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return [DEFAULT_USER];
  });

  // Drawers & States
  const [isCartOpenState, setCartOpenState] = useState(false);
  
  const setCartOpen = (open: boolean) => {
    if (open && !isLoggedIn) {
      navigateTo('login');
      return;
    }
    setCartOpenState(open);
  };

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);

  // Load state on mount
  useEffect(() => {
    // Check local storage
    const cachedCart = localStorage.getItem('bs_cart');
    if (cachedCart) {
      try {
        setCart(JSON.parse(cachedCart));
      } catch (e) {
        console.error(e);
      }
    }

    const cachedWishlist = localStorage.getItem('bs_wishlist');
    if (cachedWishlist) {
      try {
        setWishlist(JSON.parse(cachedWishlist));
      } catch (e) {
        console.error(e);
      }
    }

    const cachedUser = localStorage.getItem('bs_user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        console.error(e);
      }
    }

    const cachedOrders = localStorage.getItem('bs_orders');
    if (cachedOrders) {
      try {
        setOrders(JSON.parse(cachedOrders));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultOrders = INITIAL_ORDERS(PRODUCTS);
      setOrders(defaultOrders);
      localStorage.setItem('bs_orders', JSON.stringify(defaultOrders));
    }

    const cachedViews = localStorage.getItem('bs_recent');
    if (cachedViews) {
      try {
        setRecentlyViewed(JSON.parse(cachedViews));
      } catch (e) {
        console.error(e);
      }
    }

    // Trigger loader timeout
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800); // Luxury slow reveal (2.8s)

    return () => clearTimeout(timer);
  }, []);

  // Save Cart state updates
  useEffect(() => {
    localStorage.setItem('bs_cart', JSON.stringify(cart));
  }, [cart]);

  // Save Wishlist state updates
  useEffect(() => {
    localStorage.setItem('bs_wishlist', JSON.stringify(wishlist));
    // Synced to user object
    setUser((prev) => {
      const updated = { ...prev, wishlist };
      localStorage.setItem('bs_user', JSON.stringify(updated));
      return updated;
    });
  }, [wishlist]);

  // Navigate utility
  const navigateTo = (page: 'home' | 'shop' | 'archive' | 'about' | 'product' | 'wishlist' | 'account' | 'checkout' | 'login') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  // Auth Functions
  const login = (email: string, name?: string): boolean => {
    const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      setIsLoggedIn(true);
      localStorage.setItem('bs_is_logged_in', 'true');
      localStorage.setItem('bs_user', JSON.stringify(found));
      return true;
    } else if (name) {
      // Auto-register
      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        name: name.toUpperCase(),
        email: email.toLowerCase(),
        wishlist: [],
        addresses: []
      };
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('bs_registered_users', JSON.stringify(updatedUsers));
      setUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem('bs_is_logged_in', 'true');
      localStorage.setItem('bs_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('bs_is_logged_in', 'false');
    const guestUser: UserAccount = {
      id: 'guest',
      name: 'GUEST COLLECTOR',
      email: '',
      wishlist: [],
      addresses: []
    };
    setUser(guestUser);
    localStorage.setItem('bs_user', JSON.stringify(guestUser));
    navigateTo('login');
  };

  const register = (name: string, email: string) => {
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name.toUpperCase(),
      email: email.toLowerCase(),
      wishlist: [],
      addresses: []
    };
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('bs_registered_users', JSON.stringify(updatedUsers));
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('bs_is_logged_in', 'true');
    localStorage.setItem('bs_user', JSON.stringify(newUser));
    navigateTo('account');
  };

  const updateProfile = (name: string, phone: string, address?: Omit<Address, 'id'>) => {
    setUser((prev) => {
      let updatedAddrs = prev.addresses;
      if (address) {
        const hasAddresses = prev.addresses.length > 0;
        const newAddress: Address = {
          ...address,
          id: hasAddresses ? prev.addresses[0].id : `addr-${Date.now()}`,
          isDefault: true
        };
        updatedAddrs = [prev.addresses[0] ? { ...prev.addresses[0], ...address } : newAddress];
      }
      const updated: UserAccount = {
        ...prev,
        name: name.toUpperCase(),
        phone,
        addresses: updatedAddrs
      };
      
      setRegisteredUsers((prevUsers) => {
        const idx = prevUsers.findIndex(u => u.email.toLowerCase() === prev.email.toLowerCase());
        const newUsers = [...prevUsers];
        if (idx > -1) {
          newUsers[idx] = updated;
        } else {
          newUsers.push(updated);
        }
        localStorage.setItem('bs_registered_users', JSON.stringify(newUsers));
        return newUsers;
      });

      localStorage.setItem('bs_user', JSON.stringify(updated));
      return updated;
    });
  };

  const selectProduct = (id: string) => {
    setSelectedProductId(id);
    addRecentlyViewed(id);
    navigateTo('product');
  };

  // Add to Cart
  const addToCart = (product: Product, size: string, quantity = 1) => {
    if (!isLoggedIn) {
      navigateTo('login');
      return;
    }
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const updated = [...prevCart];
        updated[existingItemIndex].quantity += quantity;
        return updated;
      }

      return [...prevCart, { product, size, quantity }];
    });
    setCartOpen(true);
  };

  // Remove elements
  const removeFromCart = (productId: string, size: string) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.product.id === productId && item.size === size)));
  };

  // Update Quantity
  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Handling
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Address Managers
  const updateUserAddress = (address: Address) => {
    setUser((prev) => {
      const updatedAddrs = prev.addresses.map((a) => (a.id === address.id ? address : a));
      const updated = { ...prev, addresses: updatedAddrs };
      localStorage.setItem('bs_user', JSON.stringify(updated));
      return updated;
    });
  };

  const addUserAddress = (address: Omit<Address, 'id'>) => {
    setUser((prev) => {
      const newAddress: Address = {
        ...address,
        id: `addr-${Date.now()}`,
        isDefault: prev.addresses.length === 0 ? true : address.isDefault
      };

      const updatedAddrs = address.isDefault
        ? prev.addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddress)
        : prev.addresses.concat(newAddress);

      const updated = { ...prev, addresses: updatedAddrs };
      localStorage.setItem('bs_user', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteUserAddress = (id: string) => {
    setUser((prev) => {
      const updatedAddrs = prev.addresses.filter((a) => a.id !== id);
      const updated = { ...prev, addresses: updatedAddrs };
      localStorage.setItem('bs_user', JSON.stringify(updated));
      return updated;
    });
  };

  // Orders Management
  const placeOrder = (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'trackingNumber'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `BS-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Manual Review', // Automatically starts manual review for proof upload
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('bs_orders', JSON.stringify(updated));
      return updated;
    });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId) {
          const res: Order = { ...ord, status };
          if (trackingNumber !== undefined) {
            res.trackingNumber = trackingNumber;
          } else if (status === 'Shipped' && !ord.trackingNumber) {
            res.trackingNumber = `BS-DHL-${Math.floor(9000000 + Math.random() * 1000000)}`;
          }
          return res;
        }
        return ord;
      });
      localStorage.setItem('bs_orders', JSON.stringify(updated));
      return updated;
    });
  };

  // Recently Viewed Products Array
  const addRecentlyViewed = (id: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((pId) => pId !== id);
      const updated = [id, ...filtered].slice(0, 8); // Keep last 8 products
      localStorage.setItem('bs_recent', JSON.stringify(updated));
      return updated;
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedProductId,
        selectProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedVibe,
        setSelectedVibe,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemsCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        user,
        updateUserAddress,
        addUserAddress,
        deleteUserAddress,
        orders,
        placeOrder,
        updateOrderStatus,
        isCartOpen: isCartOpenState,
        setCartOpen,
        isMobileMenuOpen,
        setMobileMenuOpen,
        isSearchOpen,
        setSearchOpen,
        isLoading,
        setLoading,
        recentlyViewed,
        addRecentlyViewed,
        isLoggedIn,
        login,
        logout,
        register,
        updateProfile
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
