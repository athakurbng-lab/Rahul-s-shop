import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product } from '../types';

interface CartContextType {
    cartItems: Product[];
    isCartOpen: boolean;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    toggleCartItem: (product: Product) => void;
    setIsCartOpen: (isOpen: boolean) => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('shopping_cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart data', e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('shopping_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: Product) => {
        setCartItems(prev => {
            if (!prev.find(item => item.id === product.id)) {
                return [...prev, product];
            }
            return prev;
        });
        setIsCartOpen(true); // Open cart when item is added
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const toggleCartItem = (product: Product) => {
        const exists = cartItems.find(item => item.id === product.id);
        if (exists) {
            removeFromCart(product.id);
        } else {
            addToCart(product);
        }
    };

    const cartTotal = cartItems.reduce((total, product) => {
        const price = product.discount > 0
            ? Math.round(product.price - (product.price * product.discount / 100))
            : product.price;
        return total + price;
    }, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            isCartOpen,
            addToCart,
            removeFromCart,
            toggleCartItem,
            setIsCartOpen,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
