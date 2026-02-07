import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, cartTotal } = useCart();

    if (!isCartOpen) return null;

    return (
        <>
            <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
            <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h3>
                        <ShoppingBag size={20} /> Your Cart ({cartItems.length})
                    </h3>
                    <button className="close-btn" onClick={() => setIsCartOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <ShoppingBag size={48} color="#ddd" />
                            <p>Your cart is empty</p>
                            <button className="btn btn-outline" onClick={() => setIsCartOpen(false)}>
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <ul>
                            {cartItems.map(item => {
                                const effectivePrice = item.discount > 0
                                    ? Math.round(item.price - (item.price * item.discount / 100))
                                    : item.price;

                                return (
                                    <li key={item.id} className="cart-item">
                                        <img src={item.image_url} alt={item.name} className="cart-item-img" />
                                        <div className="cart-item-info">
                                            <h4>{item.name}</h4>
                                            <p className="item-price">₹{effectivePrice}</p>
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.id)}
                                            title="Remove from cart"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total:</span>
                            <span className="total-amount">₹{cartTotal}</span>
                        </div>
                        <button className="btn btn-primary checkout-btn" onClick={() => alert('Checkout functionality coming soon!')}>
                            Checkout
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1001;
          backdrop-filter: blur(2px);
        }

        .cart-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 400px;
          height: 100vh;
          background: white;
          z-index: 1002;
          display: flex;
          flex-direction: column;
          box-shadow: -5px 0 15px rgba(0,0,0,0.1);
          animation: slideInRight 0.3s ease-out;
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .cart-header {
          padding: 1.5rem;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-header h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          font-size: 1.25rem;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: black;
        }

        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .empty-cart {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #999;
          gap: 1rem;
        }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid #f5f5f5;
        }

        .cart-item-img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
        }

        .cart-item-info {
          flex: 1;
        }

        .cart-item-info h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          color: #333;
        }

        .item-price {
          margin: 0;
          font-weight: 600;
          color: var(--primary-color);
        }

        .remove-btn {
          background: none;
          border: none;
          color: #ff4757;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .remove-btn:hover {
          background: #ffeaea;
        }

        .cart-footer {
          padding: 1.5rem;
          border-top: 1px solid #eee;
          background: #f9f9f9;
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .total-amount {
          color: var(--primary-color);
        }

        .checkout-btn {
          width: 100%;
          padding: 12px;
          font-size: 1.1rem;
        }
      `}</style>
        </>
    );
};

export default CartSidebar;
