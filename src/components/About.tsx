import { Store, Heart, UserCheck, BookOpen } from 'lucide-react';

const features = [
  {
    icon: <Store size={24} />,
    title: 'Trusted Since 1990',
    description: 'Over 35 years of serving the community with dedication and integrity'
  },
  {
    icon: <Heart size={24} />,
    title: 'Quality Products',
    description: 'We stock only genuine, high-quality stationery, books, and sports equipment'
  },
  {
    icon: <UserCheck size={24} />,
    title: 'Customer First',
    description: 'Personalized service and expert guidance for all your educational needs'
  },
  {
    icon: <BookOpen size={24} />,
    title: 'Wide Selection',
    description: 'Comprehensive range from basic stationery to specialized competitive exam books'
  }
];

const About = () => {
  return (
    <section id="about" className="section bg-light">
      <div className="container">
        {/* Mission Statement */}
        <div className="mission-container text-center mb-16">
          <h2 className="section-title">Our Mission</h2>
          <p className="mission-text">
            To empower students and sports enthusiasts by providing easy access to quality educational
            materials and sports equipment at affordable prices. We believe in nurturing talent, supporting
            dreams, and building a stronger, more educated community.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="why-choose-us">
          <h2 className="section-title text-center mb-12">Why Choose Us</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .bg-light {
          background-color: var(--secondary-color);
        }

        .mission-container {
          max-width: 800px;
          margin: 0 auto 5rem;
        }

        .mission-text {
          font-size: 1.1rem;
          color: #555;
          margin-top: 1.5rem;
        }

        .mb-12 { margin-bottom: 3rem; }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: #fff;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          transition: transform 0.3s ease;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: var(--primary-color);
        }

        .feature-card h3 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .feature-card p {
          font-size: 0.9rem;
          color: #666;
        }
      `}</style>
    </section>
  );
};

export default About;
