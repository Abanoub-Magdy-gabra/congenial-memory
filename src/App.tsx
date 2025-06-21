import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import MobileLayout from './components/MobileLayout';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import MobilePOS from './pages/MobilePOS';
import Orders from './pages/Orders';
import Menu from './pages/Menu';
import Inventory from './pages/Inventory';
import Tables from './pages/Tables';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Staff from './pages/Staff';
import DeliveryManagement from './pages/DeliveryManagement';
import Integrations from './pages/Integrations';
import { useIntegrations } from './components/IntegrationProvider';

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const { isInitialized } = useIntegrations();

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const LayoutComponent = isMobile ? MobileLayout : Layout;
  const POSComponent = isMobile ? MobilePOS : POS;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <LayoutComponent>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POSComponent />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/delivery" element={<DeliveryManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/integrations" element={<Integrations />} />
          </Routes>
        </LayoutComponent>
        <Toaster 
          position={isMobile ? "top-center" : "top-right"}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              fontFamily: 'Cairo, sans-serif',
              borderRadius: isMobile ? '16px' : '8px',
              fontSize: isMobile ? '14px' : '16px',
              padding: isMobile ? '12px 16px' : '16px',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;