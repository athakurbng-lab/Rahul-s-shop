import React from 'react';

const categories = [
    {
        id: 1,
        title: 'Stationery',
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=1000',
        description: 'Pens, notebooks, files, and more'
    },
    {
        id: 2,
        title: 'Books',
        image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&q=80&w=1000',
        description: 'Educational, competitive, and reading books'
    },
    {
        id: 3,
        title: 'Sports',
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000',
        description: 'Cricket, football, badminton, and more'
    }
];

const Products = () => {
    return (
        <section id="products" className="section products-section">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="section-title">Shop by Category</h2>
                    <p className="section-subtitle">Discover our wide range of products across three main categories</p>
                </div>

                <div className="category-grid">
                    {categories.map((cat) => (
                        <div key={cat.id} className="category-card">
                            <div className="card-image" style={{ backgroundImage: `url(${cat.image})` }}>
                                <div className="card-content">
                                    <h3>{cat.title}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .mb-16 { margin-bottom: 4rem; }
        
        .section-title {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          color: #666;
          font-size: 1.1rem;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .category-card {
          height: 400px;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-5px);
        }

        .card-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          position: relative;
        }

        .card-image::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        }

        .card-content {
          position: relative;
          z-index: 1;
          padding: 2rem;
          width: 100%;
        }

        .card-content h3 {
          color: #fff;
          font-size: 2rem;
          font-weight: 500;
        }
      `}</style>
        </section>
    );
};

export default Products;
