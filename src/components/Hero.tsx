import React from 'react';
import { Phone, MessageCircle, MapPin } from 'lucide-react';

// Using a placeholder image that matches the "library/store" vibe
const HERO_IMAGE = "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=2070";

const Hero = () => {
    return (
        <section id="home" className="hero">
            <div className="hero-background">
                <div className="overlay"></div>
            </div>

            <div className="container hero-content">
                <div className="badge">TRUSTED SINCE 1990</div>
                <h1 className="hero-title">
                    Fueling Education <br />
                    <span className="serif-italic">& Sports Since 1990</span>
                </h1>
                <p className="hero-subtitle">
                    Your trusted local destination for complete stationery, educational
                    books, and sports equipment in Pachrukhi, Siwan, Bihar.
                </p>

                <div className="hero-actions">
                    <a href="tel:07091791893" className="btn btn-primary">
                        <Phone size={18} style={{ marginRight: '8px' }} />
                        Call Now
                    </a>
                    <a href="https://wa.me/919973403351" className="btn btn-light">
                        <MessageCircle size={18} style={{ marginRight: '8px' }} />
                        WhatsApp Chat
                    </a>
                    <a href="#contact" className="btn btn-outline-dark">
                        <MapPin size={18} style={{ marginRight: '8px' }} />
                        Visit Store
                    </a>
                </div>
            </div>

            <style>{`
        .hero {
          position: relative;
          height: 100vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          padding-top: 80px; /* Accounts for fixed navbar */
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('${HERO_IMAGE}');
          background-size: cover;
          background-position: center;
          z-index: -1;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.85); /* Light overlay mainly */
          background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .badge {
          background-color: #e0e0e0;
          color: #333;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--primary-color);
          line-height: 1.1;
        }

        .serif-italic {
          font-family: var(--font-heading);
          font-style: italic;
          font-weight: 400;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: #555;
          margin-bottom: 2.5rem;
          max-width: 600px;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-light {
          background-color: #f5f5f5;
          color: var(--primary-color);
        }
        
        .btn-light:hover {
          background-color: #e0e0e0;
        }

        .btn-outline-dark {
          border: 1px solid var(--primary-color);
          color: var(--primary-color);
        }

        .btn-outline-dark:hover {
          background-color: var(--primary-color);
          color: #fff;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-actions {
            flex-direction: column;
            width: 100%;
            padding: 0 20px;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>
        </section>
    );
};

export default Hero;
