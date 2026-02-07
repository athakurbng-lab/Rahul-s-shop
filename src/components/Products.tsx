import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBag, AlertCircle, Plus, Check } from 'lucide-react';
import type { Category, Product } from '../types';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({ productName: '', contactInfo: '' });
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const { cartItems, toggleCartItem } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: catData } = await supabase.from('categories').select('*').order('id');
      if (catData) setCategories(catData);

      const { data: prodData } = await supabase.from('products').select('*').order('id');
      if (prodData) setProducts(prodData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRequest(true);
    try {
      const { error } = await supabase.from('requests').insert([{
        product_name: requestData.productName,
        contact_info: requestData.contactInfo
      }]);

      if (error) throw error;
      alert('Request submitted successfully!');
      setShowRequestModal(false);
      setRequestData({ productName: '', contactInfo: '' });
    } catch (error) {
      alert('Error submitting request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category_id === activeCategory);

  return (
    <section id="products" className="section products-section">
      <div className="container">
        <div className="products-header text-center mb-16">
          <h2 className="section-title">Our Products</h2>
          <p className="section-subtitle">Browse our wide collection. Can't find what you need?</p>
          <button
            className="btn btn-outline mt-4"
            onClick={() => setShowRequestModal(true)}
          >
            <Plus size={18} style={{ marginRight: '8px' }} />
            Request a Product
          </button>
        </div>

        {/* Categories Tabs */}
        <div className="category-tabs">
          <button
            className={`tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const hasDiscount = product.discount > 0;
            const effectivePrice = hasDiscount
              ? Math.round(product.price - (product.price * product.discount / 100))
              : product.price;

            const isInCart = cartItems.some(item => item.id === product.id);

            return (
              <div key={product.id} className="product-card">
                <div className="product-image" style={{ backgroundImage: `url(${product.image_url})` }}>
                  {!product.in_stock && (
                    <div className="badge out-of-stock-badge">
                      Out of Stock
                    </div>
                  )}
                  {product.in_stock && hasDiscount && (
                    <div className="badge discount-badge">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-meta">
                    <div className="price-container">
                      {hasDiscount && (
                        <span className="original-price">₹{product.price}</span>
                      )}
                      <span className="price">₹{effectivePrice}</span>
                    </div>
                    {product.in_stock && (
                      <button
                        className={`btn-icon ${isInCart ? 'active' : ''}`}
                        title={isInCart ? "Remove from cart" : "Add to cart"}
                        onClick={() => toggleCartItem(product)}
                      >
                        {isInCart ? <Check size={20} /> : <ShoppingBag size={20} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <AlertCircle size={48} color="#ccc" />
            <p>No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Request a Product</h3>
            <p>Tell us what you're looking for and we'll arrange it for you.</p>
            <form onSubmit={handleRequestSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Product Name / Description"
                  value={requestData.productName}
                  onChange={e => setRequestData({ ...requestData, productName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name & Phone Number"
                  value={requestData.contactInfo}
                  onChange={e => setRequestData({ ...requestData, contactInfo: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowRequestModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submittingRequest}>
                  {submittingRequest ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .mt-4 { margin-top: 1rem; }

        .category-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 8px 20px;
          border-radius: 30px;
          border: 1px solid #ddd;
          background: transparent;
          color: #666;
          transition: all 0.3s;
        }

        .tab-btn.active, .tab-btn:hover {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }

        .product-card {
          border-radius: 12px;
          overflow: hidden;
          background: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          transition: transform 0.3s;
        }

        .product-card:hover {
          transform: translateY(-5px);
        }

        .product-image {
          height: 250px;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .badge {
          position: absolute;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
        }

        .out-of-stock-badge {
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.7);
        }

        .discount-badge {
          top: 10px;
          left: 10px;
          background: #e63946; /* Accent color for discount */
        }

        .product-info {
          padding: 1.5rem;
        }

        .product-info h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .product-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-container {
            display: flex;
            align-items: baseline;
            gap: 8px;
        }

        .original-price {
            text-decoration: line-through;
            color: #767676;
            font-size: 0.85rem;
        }

        .price {
            font-size: 1.25rem;
            font-weight: 700;
            color: #B12704; /* Amazon deal price color often red-ish */
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          border: none;
          cursor: pointer;
        }

        .btn-icon:hover {
          background: var(--primary-color);
          color: white;
        }
        
        .btn-icon.active {
          background: var(--primary-color);
          color: white;
        }

        .no-products {
          text-align: center;
          padding: 4rem;
          color: #999;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          width: 90%;
          max-width: 500px;
        }

        .modal-content h3 {
          margin-bottom: 0.5rem;
        }

        .modal-content p {
          color: #666;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .from-group { margin-bottom: 1rem; }
        
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }
      `}</style>
    </section>
  );
};

export default Products;
