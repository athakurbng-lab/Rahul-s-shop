import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Clock, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Backdoor Logic
        const normalizedName = formData.name.toLowerCase().replace(/\s/g, '');
        const normalizedPhone = formData.phone.replace(/\s/g, '');

        if (normalizedName === 'rahulraaj' && normalizedPhone === '7091791893' && formData.message.trim() === '') {
            navigate('/admin-login');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase
                .from('messages')
                .insert([
                    {
                        name: formData.name,
                        phone: formData.phone,
                        message: formData.message
                    }
                ]);

            if (error) throw error;

            alert('Thank you for your message! We will get back to you soon.');
            setFormData({ name: '', phone: '', message: '' });
        } catch (error) {
            console.error('Error submitting message:', error);
            alert('Something went wrong. Please try again or call us directly.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="section">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="section-title">Get in Touch</h2>
                    <p className="section-subtitle">Visit our store or reach out to us for any queries</p>
                </div>

                <div className="contact-grid">
                    {/* Contact Info */}
                    <div className="contact-info">
                        <h3>Contact Information</h3>

                        <div className="info-item">
                            <div className="icon"><Phone size={20} /></div>
                            <div>
                                <h4>Phone Numbers</h4>
                                <p>070917 91893</p>
                                <p>099734 03351</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon"><MapPin size={20} /></div>
                            <div>
                                <h4>Address</h4>
                                <p>Sarswati Pustak and Sports Bhandar</p>
                                <p>Pachrukhi, Siwan, Bihar 841241</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon"><Clock size={20} /></div>
                            <div>
                                <h4>Opening Hours</h4>
                                <p>Monday - Saturday: 08:30 AM - 08:30 PM</p>
                                <p>Sunday: 09:00 AM - 08:30 PM</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-container">
                        <h3>Send Us a Message</h3>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    placeholder="Tell us what you're looking for..."
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    disabled={loading}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Map */}
                <div className="map-container mt-16">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1796.657597148529!2d84.4153603!3d26.1597426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3992fae7ba108d4b%3A0x22a32f8839b5b0db!2sSarswati%20Pustak%20and%20Sports%20Bhandar!5e0!3m2!1sen!2sin!4v1707328000000!5m2!1sen!2sin"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

            <style>{`
                .contact-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }

                .contact-info, .contact-form-container {
                    background: #fff;
                    padding: 2.5rem;
                    border-radius: 16px;
                    border: 1px solid #eee;
                }

                .contact-info h3, .contact-form-container h3 {
                    font-family: var(--font-heading);
                    font-size: 1.5rem;
                    margin-bottom: 2rem;
                }

                .info-item {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .info-item:last-child {
                    margin-bottom: 0;
                }

                .icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: #f5f5f5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary-color);
                }

                .info-item h4 {
                    font-size: 1rem;
                    margin-bottom: 0.25rem;
                }

                .info-item p {
                    color: #666;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-family: inherit;
                    transition: border-color 0.3s ease;
                }

                .form-group input:focus, .form-group textarea:focus {
                    outline: none;
                    border-color: var(--primary-color);
                }

                .mt-16 { margin-top: 4rem; }

                .map-container {
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
            `}</style>
        </section>
    );
};

export default Contact;
