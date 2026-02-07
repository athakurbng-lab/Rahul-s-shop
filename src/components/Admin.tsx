import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2 } from 'lucide-react';

interface Message {
    id: number;
    created_at: string;
    name: string;
    phone: string;
    message: string;
}

const Admin = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setMessages(data as Message[]);
        } catch (error) {
            console.error('Error fetching messages:', error);
            alert('Error fetching messages');
        } finally {
            setLoading(false);
        }
    };

    const deleteMessage = async (id: number) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Remove from local state
            setMessages(messages.filter(msg => msg.id !== id));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    if (loading) {
        return (
            <div className="admin-container loading">
                <p>Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="container">
                    <h1>Admin Dashboard - Messages</h1>
                </div>
            </div>

            <div className="container mt-8">
                {messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No messages found.</p>
                    </div>
                ) : (
                    <div className="messages-list">
                        {messages.map((msg) => (
                            <div key={msg.id} className="message-card">
                                <div className="message-header">
                                    <div className="sender-info">
                                        <h3>{msg.name}</h3>
                                        <span className="message-date">
                                            {new Date(msg.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteMessage(msg.id)}
                                        title="Delete Message"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="message-body">
                                    <div className="info-row">
                                        <strong>Phone:</strong>
                                        <a href={`tel:${msg.phone}`}>{msg.phone}</a>
                                    </div>
                                    <div className="message-text">
                                        <p>{msg.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .admin-page {
                    min-height: 100vh;
                    background-color: #f5f5f5;
                    padding-bottom: 4rem;
                }

                .admin-header {
                    background-color: var(--primary-color);
                    color: white;
                    padding: 2rem 0;
                    margin-bottom: 2rem;
                }

                .mt-8 { margin-top: 2rem; }

                .messages-list {
                    display: grid;
                    gap: 1.5rem;
                }

                .message-card {
                    background: white;
                    border-radius: 8px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    border-left: 4px solid var(--primary-color);
                }

                .message-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #eee;
                }

                .sender-info h3 {
                    margin: 0;
                    font-size: 1.25rem;
                }

                .message-date {
                    font-size: 0.85rem;
                    color: #888;
                }

                .delete-btn {
                    color: #dc3545;
                    padding: 8px;
                    border-radius: 50%;
                    transition: background 0.2s;
                }

                .delete-btn:hover {
                    background-color: #ffeaea;
                }

                .info-row {
                    margin-bottom: 1rem;
                    font-size: 0.95rem;
                }

                .info-row a {
                    color: var(--primary-color);
                    margin-left: 0.5rem;
                }

                .message-text {
                    background-color: #f9f9f9;
                    padding: 1rem;
                    border-radius: 6px;
                    font-size: 1rem;
                    line-height: 1.5;
                }

                .no-messages {
                    text-align: center;
                    padding: 3rem;
                    background: white;
                    border-radius: 8px;
                    color: #666;
                }
            `}</style>
        </div>
    );
};

export default Admin;
