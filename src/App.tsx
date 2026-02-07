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



const MainLayout = () => {
  // Analytics Tracker
  useEffect(() => {
    const trackVisitor = async () => {
      const hasVisited = localStorage.getItem('has_visited_site');

      // We only want to track this once per session/load ideally, 
      // but for simplicity we do it on layout mount.
      // Check if we already tracked this session to avoid double counting on re-renders
      if (sessionStorage.getItem('session_tracked')) return;

      try {
        // Get current stats (we assume row 1 exists as per setup)
        const { data: currentStats } = await supabase.from('site_stats').select('*').single();

        if (currentStats) {
          if (hasVisited) {
            // Recurring Visitor
            await supabase.from('site_stats').update({
              recurring_visitors: (currentStats.recurring_visitors || 0) + 1
            }).eq('id', 1);
          } else {
            // New Visitor
            await supabase.from('site_stats').update({
              total_visitors: (currentStats.total_visitors || 0) + 1
            }).eq('id', 1);
            localStorage.setItem('has_visited_site', 'true');
          }
          sessionStorage.setItem('session_tracked', 'true');
        }
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    trackVisitor();
  }, []);

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
