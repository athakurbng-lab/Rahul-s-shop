import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Edit2, LogOut, Package, MessageSquare, Users, Settings as SettingsIcon, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Types
interface Message { id: number; created_at: string; name: string; phone: string; message: string; }
interface Request { id: number; created_at: string; product_name: string; contact_info: string; }
interface Category { id: number; name: string; image_url: string; }
interface Product { id: number; name: string; category_id: number; image_url: string; price: number; discount: number; in_stock: boolean; }
interface Stats { total_visitors: number; recurring_visitors: number; }

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'requests' | 'inventory' | 'settings'>('overview');
    const [loading, setLoading] = useState(true);

    // Data States
    const [messages, setMessages] = useState<Message[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [stats, setStats] = useState<Stats>({ total_visitors: 0, recurring_visitors: 0 });

    // Inventory Form States
    const [newItemType, setNewItemType] = useState<'category' | 'product'>('product');
    const [newItemData, setNewItemData] = useState<any>({});

    // Settings State
    const [settingsData, setSettingsData] = useState({ username: '', oldPassword: '', newPassword: '' });

    useEffect(() => {
        const checkAuth = () => {
            if (!localStorage.getItem('admin_session')) {
                navigate('/admin-login');
            } else {
                fetchInitialData();
            }
        };
        checkAuth();
    }, [navigate]);

    const fetchInitialData = async () => {
        setLoading(true);
        await Promise.all([
            fetchMessages(),
            fetchRequests(),
            fetchInventory(),
            fetchStats()
        ]);
        setLoading(false);
    };

    const fetchMessages = async () => {
        const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (data) setMessages(data);
    };

    const fetchRequests = async () => {
        const { data } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
        if (data) setRequests(data);
    };

    const fetchInventory = async () => {
        const { data: cat } = await supabase.from('categories').select('*').order('id');
        if (cat) setCategories(cat);
        const { data: prod } = await supabase.from('products').select('*').order('id');
        if (prod) setProducts(prod);
    };

    const fetchStats = async () => {
        const { data } = await supabase.from('site_stats').select('*').single();
        if (data) setStats(data);
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_session');
        navigate('/admin-login');
    };

    // --- Actions ---



    // ... (previous code)

    // UI States
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [modal, setModal] = useState<{ isOpen: boolean; message: string; onConfirm: () => void } | null>(null);

    // Helpers
    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const confirmAction = (message: string, action: () => void) => {
        setModal({ isOpen: true, message, onConfirm: action });
    };

    const closeModal = () => {
        setModal(null);
    };

    // --- Actions ---

    const deleteMessage = async (id: number) => {
        confirmAction('Are you sure you want to delete this message?', async () => {
            await supabase.from('messages').delete().eq('id', id);
            fetchMessages();
            showToast('Message deleted successfully');
            closeModal();
        });
    };

    const deleteRequest = async (id: number) => {
        confirmAction('Are you sure you want to delete this request?', async () => {
            await supabase.from('requests').delete().eq('id', id);
            fetchRequests();
            showToast('Request deleted successfully');
            closeModal();
        });
    };

    const deleteProduct = async (id: number) => {
        confirmAction('Are you sure you want to delete this product?', async () => {
            await supabase.from('products').delete().eq('id', id);
            fetchInventory();
            showToast('Product deleted successfully');
            closeModal();
        });
    };

    const deleteCategory = async (id: number) => {
        confirmAction('Delete category? WARNING: This might delete associated products.', async () => {
            await supabase.from('categories').delete().eq('id', id);
            fetchInventory();
            showToast('Category deleted successfully');
            closeModal();
        });
    };

    const toggleStock = async (id: number, currentStatus: boolean) => {
        await supabase.from('products').update({ in_stock: !currentStatus }).eq('id', id);
        fetchInventory();
        showToast(`Product marked as ${!currentStatus ? 'In Stock' : 'Out of Stock'}`);
    };

    // Image Upload State
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get Public URL
            const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);

            setNewItemData({ ...newItemData, image_url: data.publicUrl });
            showToast('Image uploaded successfully');
        } catch (error) {
            showToast('Error uploading image!', 'error');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (newItemType === 'category') {
                await supabase.from('categories').insert([{ name: newItemData.name, image_url: newItemData.image_url }]);
            } else {
                await supabase.from('products').insert([{
                    name: newItemData.name,
                    category_id: newItemData.category_id,
                    image_url: newItemData.image_url,
                    price: newItemData.price,
                    discount: newItemData.discount || 0,
                    in_stock: true
                }]);
            }
            showToast('Item added successfully!');
            setNewItemData({});
            fetchInventory();
        } catch (error) {
            console.error(error);
            showToast('Error adding item', 'error');
        }
    };

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Verify old password
            const { data: admin } = await supabase.from('admin_settings').select('*').single();
            if (admin && admin.password === settingsData.oldPassword) {
                await supabase.from('admin_settings').update({
                    username: settingsData.username || admin.username,
                    password: settingsData.newPassword || admin.password
                }).eq('id', 1);
                showToast('Settings updated successfully!');
                setSettingsData({ username: '', oldPassword: '', newPassword: '' });
            } else {
                showToast('Incorrect old password', 'error');
            }
        } catch (error) {
            showToast('Error updating settings', 'error');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Admin Dashboard...</div>;

    return (
        <div className="admin-page">
            {/* Sidebar */}
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <h3>Admin Panel</h3>
                </div>
                <nav className="sidebar-nav">
                    <button onClick={() => setActiveTab('overview')} className={activeTab === 'overview' ? 'active' : ''}>
                        <LayoutGrid size={20} /> Overview
                    </button>
                    <button onClick={() => setActiveTab('messages')} className={activeTab === 'messages' ? 'active' : ''}>
                        <MessageSquare size={20} /> Messages <span className="badge">{messages.length}</span>
                    </button>
                    <button onClick={() => setActiveTab('requests')} className={activeTab === 'requests' ? 'active' : ''}>
                        <Users size={20} /> Requests <span className="badge">{requests.length}</span>
                    </button>
                    <button onClick={() => setActiveTab('inventory')} className={activeTab === 'inventory' ? 'active' : ''}>
                        <Package size={20} /> Inventory
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'active' : ''}>
                        <SettingsIcon size={20} /> Settings
                    </button>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={20} /> Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="admin-content">
                {activeTab === 'overview' && (
                    <div className="overview-section">
                        <h1>Dashboard Overview</h1>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Visitors</h3>
                                <p className="stat-number">{stats.total_visitors}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Returning Visitors</h3>
                                <p className="stat-number">{stats.recurring_visitors}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Products</h3>
                                <p className="stat-number">{products.length}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Pending Requests</h3>
                                <p className="stat-number">{requests.length}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="messages-section">
                        <h1>Messages</h1>
                        <div className="list-grid">
                            {messages.map(msg => (
                                <div key={msg.id} className="list-card">
                                    <div className="card-header">
                                        <h4>{msg.name}</h4>
                                        <span className="date">{new Date(msg.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="subtitle">{msg.phone}</p>
                                    <p className="body-text">{msg.message}</p>
                                    <button className="delete-btn" onClick={() => deleteMessage(msg.id)}>
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="requests-section">
                        <h1>Product Requests</h1>
                        <div className="list-grid">
                            {requests.map(req => (
                                <div key={req.id} className="list-card request-card">
                                    <div className="card-header">
                                        <h4>{req.product_name}</h4>
                                        <span className="date">{new Date(req.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="body-text"><strong>Contact:</strong> {req.contact_info}</p>
                                    <button className="delete-btn" onClick={() => deleteRequest(req.id)}>
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <div className="inventory-section">
                        <h1>Inventory Management</h1>

                        {/* Add Item Form */}
                        <div className="add-item-form">
                            <h3>Add New Item</h3>
                            <div className="form-type-toggle">
                                <button className={newItemType === 'product' ? 'active' : ''} onClick={() => setNewItemType('product')}>Product</button>
                                <button className={newItemType === 'category' ? 'active' : ''} onClick={() => setNewItemType('category')}>Category</button>
                            </div>
                            <form onSubmit={handleAddItem}>
                                <div className="form-row">
                                    <input placeholder="Name" value={newItemData.name || ''} onChange={e => setNewItemData({ ...newItemData, name: e.target.value })} required />
                                    {/* Image Upload Input */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <input
                                            type="text"
                                            placeholder="Image URL (or upload below)"
                                            value={newItemData.image_url || ''}
                                            onChange={e => setNewItemData({ ...newItemData, image_url: e.target.value })}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            style={{ padding: '5px', fontSize: '0.8rem' }}
                                        />
                                        {uploading && <span style={{ fontSize: '0.8rem', color: 'blue' }}>Uploading...</span>}
                                    </div>
                                </div>
                                {newItemType === 'product' && (
                                    <div className="form-row">
                                        <select onChange={e => setNewItemData({ ...newItemData, category_id: e.target.value })} required>
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <input type="number" placeholder="Price (₹)" value={newItemData.price || ''} onChange={e => setNewItemData({ ...newItemData, price: e.target.value })} required />
                                        <input type="number" placeholder="Discount (%)" value={newItemData.discount || ''} onChange={e => setNewItemData({ ...newItemData, discount: e.target.value })} />
                                    </div>
                                )}
                                <button type="submit" className="btn btn-primary">Add {newItemType}</button>
                            </form>
                        </div>

                        {/* Lists */}
                        <div className="inventory-lists">
                            <div className="categories-list">
                                <h3>Categories</h3>
                                <ul>
                                    {categories.map(c => (
                                        <li key={c.id}>
                                            <span>{c.name}</span>
                                            <button onClick={() => deleteCategory(c.id)}><Trash2 size={14} /></button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="products-list-admin">
                                <h3>Products</h3>
                                <ul>
                                    {products.map(p => (
                                        <li key={p.id}>
                                            <div className="prod-info">
                                                <img src={p.image_url} alt="" className="tiny-thumb" />
                                                <div>
                                                    <span style={{ display: 'block', fontWeight: 500 }}>{p.name}</span>
                                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                                        ₹{p.price} {p.discount > 0 ? `(-${p.discount}%)` : ''}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="prod-actions">
                                                <span className={`status ${p.in_stock ? 'in' : 'out'}`}>{p.in_stock ? 'In Stock' : 'Out Stock'}</span>
                                                <button onClick={() => toggleStock(p.id, p.in_stock)} title="Toggle Stock"><Edit2 size={14} /></button>
                                                <button onClick={() => deleteProduct(p.id)}><Trash2 size={14} /></button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="settings-section">
                        <h1>Admin Settings</h1>
                        <form className="settings-form" onSubmit={handleUpdateSettings}>
                            <div className="form-group">
                                <label>New Username (Optional)</label>
                                <input type="text" value={settingsData.username} onChange={e => setSettingsData({ ...settingsData, username: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>New Password (Optional)</label>
                                <input type="password" value={settingsData.newPassword} onChange={e => setSettingsData({ ...settingsData, newPassword: e.target.value })} />
                            </div>
                            <hr />
                            <div className="form-group">
                                <label>Old Password (Required)</label>
                                <input type="password" value={settingsData.oldPassword} onChange={e => setSettingsData({ ...settingsData, oldPassword: e.target.value })} required />
                            </div>
                            <button type="submit" className="btn btn-primary">Update Settings</button>
                        </form>
                    </div>
                )}
            </div>

            {/* Notification Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}

            {/* Confirmation Modal */}
            {modal && modal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Action</h3>
                        <p>{modal.message}</p>
                        <div className="modal-actions">
                            <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
                            <button className="btn btn-primary" onClick={modal.onConfirm}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .admin-page {
                    display: flex;
                    min-height: 100vh;
                    background: #f4f6f8;
                }
                .admin-sidebar {
                    width: 250px;
                    background: #1a1a1a;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    height: 100vh;
                    z-index: 100;
                }
                .sidebar-header { padding: 2rem; border-bottom: 1px solid #333; }
                .sidebar-nav { flex: 1; padding: 1rem; }
                .sidebar-nav button {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px;
                    color: #aaa;
                    background: transparent;
                    border: none;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-radius: 8px;
                }
                .sidebar-nav button:hover, .sidebar-nav button.active {
                    background: var(--primary-color);
                    color: white;
                }
                .badge {
                    background: #ff4757;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 0.8rem;
                    margin-left: auto;
                }
                .logout-btn {
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #ff6b6b;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    border-top: 1px solid #333;
                }
                .admin-content {
                    margin-left: 250px;
                    flex: 1;
                    padding: 2rem;
                }
                /* Overview */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                    margin-top: 2rem;
                }
                .stat-card {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                .stat-number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--primary-color);
                    margin-top: 1rem;
                }
                /* Messages & Requests */
                .list-grid {
                    display: grid;
                    gap: 1rem;
                    margin-top: 2rem;
                }
                .list-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    border-left: 4px solid var(--primary-color);
                    position: relative;
                }
                .card-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
                .date { font-size: 0.85rem; color: #888; }
                .delete-btn {
                    position: absolute;
                    bottom: 1rem;
                    right: 1rem;
                    color: #ff4757;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.9rem;
                }
                /* Inventory */
                .add-item-form {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    margin-top: 2rem;
                }
                .form-type-toggle { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
                .form-type-toggle button {
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                }
                .form-type-toggle button.active {
                    background: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                }
                .form-row { display: flex; gap: 1rem; margin-bottom: 1.0rem; }
                .form-row input, .form-row select {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                }
                .inventory-lists {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 2rem;
                    margin-top: 2rem;
                }
                .inventory-lists h3 { margin-bottom: 1rem; }
                .inventory-lists ul {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .inventory-lists li {
                    padding: 1rem;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .tiny-thumb { width: 30px; height: 30px; border-radius: 4px; object-fit: cover; margin-right: 10px; }
                .prod-actions { display: flex; align-items: center; gap: 10px; }
                .status { font-size: 0.8rem; padding: 2px 8px; border-radius: 4px; }
                .status.in { background: #e6fffa; color: #00b894; }
                .status.out { background: #ffeaea; color: #ff4757; }

                /* Settings */
                .settings-form {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    max-width: 500px;
                    margin-top: 2rem;
                }

                /* Toast Notification */
                .toast {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    animation: slideIn 0.3s ease-out;
                    z-index: 1000;
                }
                .toast-success { background-color: #00b894; }
                .toast-error { background-color: #ff4757; }
                .toast-info { background-color: #0984e3; }

                @keyframes slideIn {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                /* Confirmation Modal */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(2px);
                }
                .modal-content {
                    background: white;
                    padding: 2.5rem;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    text-align: center;
                    animation: scaleIn 0.2s ease-out;
                }
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .modal-content h3 { margin-bottom: 1rem; color: #1a1a1a; }
                .modal-content p { color: #666; margin-bottom: 2rem; }
                .modal-actions { display: flex; gap: 1rem; justify-content: center; }
                .modal-actions button { padding: 8px 24px; }
            `}</style>
        </div>
    );
};

export default Admin;
