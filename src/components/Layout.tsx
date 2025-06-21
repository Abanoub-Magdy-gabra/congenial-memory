import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ShoppingCart,
  ClipboardList,
  Menu as MenuIcon,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronLeft,
  UserCheck,
  Coffee,
  Truck,
  Sun,
  Moon,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [notifications] = useState(3);
  const location = useLocation();

  const navigation = [
    { name: 'لوحة التحكم', href: '/', icon: Home, badge: null },
    { name: 'نقاط البيع', href: '/pos', icon: ShoppingCart, badge: null },
    { name: 'الطلبات', href: '/orders', icon: ClipboardList, badge: 5 },
    { name: 'قائمة الطعام', href: '/menu', icon: MenuIcon, badge: null },
    { name: 'المخزون', href: '/inventory', icon: Package, badge: 2 },
    { name: 'الطاولات', href: '/tables', icon: Coffee, badge: null },
    { name: 'التوصيل', href: '/delivery', icon: Truck, badge: 3 },
    { name: 'العملاء', href: '/customers', icon: Users, badge: null },
    { name: 'الموظفين', href: '/staff', icon: UserCheck, badge: null },
    { name: 'التقارير', href: '/reports', icon: BarChart3, badge: null },
    { name: 'الإعدادات', href: '/settings', icon: Settings, badge: null },
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} glass-effect transition-all duration-300 ease-in-out border-r border-white/20`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className={`${sidebarOpen ? 'block' : 'hidden'} flex items-center space-x-3 space-x-reverse`}>
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <Coffee className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">نظام المطعم</h1>
              <p className="text-xs text-gray-500">إدارة متكاملة</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? 'nav-item-active'
                      : 'nav-item-inactive'
                  } relative overflow-hidden`}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={`${
                        isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                      } ml-3 h-5 w-5 transition-all duration-300 group-hover:scale-110`}
                    />
                    <span className={`${sidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
                      {item.name}
                    </span>
                    {item.badge && sidebarOpen && (
                      <span className="mr-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-transparent rounded-xl -z-10" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <button className="nav-item-inactive w-full group">
            <LogOut className="ml-3 h-5 w-5 group-hover:text-red-500 transition-colors duration-300" />
            <span className={`${sidebarOpen ? 'block' : 'hidden'} group-hover:text-red-500 transition-colors duration-300`}>
              تسجيل الخروج
            </span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="glass-effect border-b border-white/10 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="البحث السريع..."
                  className="pl-4 pr-10 py-2 w-80 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-white/10 rounded-xl transition-all duration-300 group"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <Moon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                )}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-white/10 rounded-xl transition-all duration-300 group"
              >
                {fullscreen ? (
                  <Minimize2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <Maximize2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                )}
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-white/10 rounded-xl transition-all duration-300 group">
                <Bell className="h-5 w-5 group-hover:animate-bounce" />
                {notifications > 0 && (
                  <span className="notification-badge">
                    {notifications}
                  </span>
                )}
              </button>
              
              {/* User Profile */}
              <div className="flex items-center space-x-3 space-x-reverse bg-white/10 rounded-xl p-2 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-300">أحمد محمد</p>
                  <p className="text-xs text-gray-500">مدير المطعم</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-sm font-medium text-white">أ</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50/50 to-white/50">
          <div className="fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;