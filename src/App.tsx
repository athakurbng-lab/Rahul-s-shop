import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';
import { supabase } from './lib/supabase';
import { CartProvider } from './context/CartContext';
import CartSidebar from './components/CartSidebar';

// ... (imports)

const MainLayout = () => {
  // ... (analytics effect)

  return (
    <CartProvider>
      <div className="app">
        <Navbar />
        <Hero />
        <Products />
        <About />
        <Contact />
        <Footer />
        <CartSidebar />
      </div>
    </CartProvider>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
