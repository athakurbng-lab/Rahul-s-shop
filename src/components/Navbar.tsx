import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setIsCartOpen, cartItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#" className="logo">
          <div className="logo-icon">
            <BookOpen size={24} color="#fff" />
          </div>
          <div className="logo-text">
            <span className="brand-name">Sarswati Store</span>
            <span className="brand-tagline">Since 1990</span>
          </div>
        </a>

        {/* Desktop Menu */}
        <ul className="nav-links desktop-menu">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#contact">Contact</a></li>
          <li>
            <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={20} />
              {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
            </button>
          </li>
        </ul>

        <div className="mobile-actions">
          <button className="cart-btn mobile-cart-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={20} />
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </button>
          {/* Mobile Menu Button */}
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
          <ul className="mobile-nav-links">
            <li><a href="#home" onClick={() => setIsOpen(false)}>Home</a></li>
            <li><a href="#about" onClick={() => setIsOpen(false)}>About</a></li>
            <li><a href="#products" onClick={() => setIsOpen(false)}>Products</a></li>
            <li><a href="#contact" onClick={() => setIsOpen(false)}>Contact</a></li>
          </ul>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 1.5rem 0;
          transition: all 0.3s ease;
          background: transparent;
        }

        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .logo-icon {
          background-color: var(--primary-color);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color);
          line-height: 1;
        }

        .brand-tagline {
          font-size: 0.75rem;
          color: #666;
          margin-top: 2px;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-links a {
          font-weight: 500;
          color: var(--text-color);
          position: relative;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: var(--primary-color);
          transition: width 0.3s ease;
        }

        .nav-links a:hover::after {
          width: 100%;
        }
        
        .cart-btn {
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          color: var(--text-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ff4757;
          color: white;
          font-size: 0.7rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .mobile-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mobile-cart-btn {
          display: none;
        }

        .mobile-toggle {
          display: none;
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-menu {
            display: none;
          }

          .mobile-cart-btn {
            display: flex;
          }

          .mobile-toggle {
            display: block;   
            z-index: 1001;
          }

          .mobile-menu {
            display: block;
            position: fixed;
            top: 0;
            right: -100%;
            width: 70%;
            height: 100vh;
            background: #fff;
            padding: 5rem 2rem;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1);
            transition: right 0.3s ease;
          }

          .mobile-menu.open {
            right: 0;
          }

          .mobile-nav-links {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .mobile-nav-links a {
            font-size: 1.25rem;
            color: var(--primary-color);
            font-family: var(--font-heading);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
