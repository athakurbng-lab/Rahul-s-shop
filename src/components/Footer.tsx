import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer sections">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>Saraswati Store</h3>
                        <p>Serving the community of Pachrukhi, Siwan, Bihar with quality stationery, books, and sports equipment since 1990.</p>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#products">Products</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>Contact Us</h4>
                        <p>070917 91893</p>
                        <p>099734 03351</p>
                        <p>5C58+V4X, Pachrukhi</p>
                        <p>Siwan, Bihar - 841241</p>
                    </div>

                    <div className="footer-social">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                            <a href="#" className="social-icon"><Facebook size={20} /></a>
                            <a href="#" className="social-icon"><Instagram size={20} /></a>
                            <a href="#" className="social-icon"><Twitter size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Saraswati Store and Sports Bhandar. All rights reserved.</p>
                </div>
            </div>

            <style>{`
                .footer {
                    background-color: #111;
                    color: #fff;
                    padding: 4rem 0 2rem;
                }

                .footer-content {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 3rem;
                    margin-bottom: 3rem;
                }

                .footer-brand h3 {
                    color: #fff;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                }

                .footer-brand p {
                    color: #aaa;
                    font-size: 0.9rem;
                    line-height: 1.6;
                }

                .footer h4 {
                    color: #fff;
                    font-size: 1.1rem;
                    margin-bottom: 1.25rem;
                    font-family: var(--font-body); /* Override heading font for footer headers */
                    font-weight: 600;
                }

                .footer-links ul li {
                    margin-bottom: 0.75rem;
                }

                .footer-links a {
                    color: #aaa;
                    font-size: 0.9rem;
                }

                .footer-links a:hover {
                    color: #fff;
                }

                .footer-contact p {
                    color: #aaa;
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }

                .social-icons {
                    display: flex;
                    gap: 1rem;
                }

                .social-icon {
                    width: 36px;
                    height: 36px;
                    background: #333;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.3s ease;
                }

                .social-icon:hover {
                    background: var(--primary-color);
                    color: #fff; /* Ensure icon is white on hover if primary is dark or light depending */
                    background: #555; /* Just lighten it up a bit */
                }

                .footer-bottom {
                    border-top: 1px solid #333;
                    padding-top: 2rem;
                    text-align: center;
                    color: #666;
                    font-size: 0.85rem;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
