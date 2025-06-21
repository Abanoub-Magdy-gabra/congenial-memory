import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  User,
  Coffee,
  Truck,
  UserCheck,
  X,
  ChevronLeft,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  MoreHorizontal,
  Grid,
  List,
  Filter,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  Info,
  RefreshCw
} from 'lucide-react';
import { useDashboardStats, useNotifications } from '../hooks/useSupabase';
import { signOut } from '../lib/supabase';
import toast from 'react-hot-toast';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { stats } = useDashboardStats();
  const { notifications } = useNotifications();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('تم الاتصال بالإنترنت', { icon: '🌐' });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('انقطع الاتصال بالإنترنت', { icon: '📡' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Battery API
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
  }, []);

  // Touch gestures for sidebar
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = Math.abs(touchEnd.y - touchStart.y);

    // Swipe right to open sidebar (from left edge)
    if (deltaX > 100 && deltaY < 100 && touchStart.x < 50) {
      setShowSidebar(true);
    }
    // Swipe left to close sidebar
    else if (deltaX < -100 && deltaY < 100 && showSidebar) {
      setShowSidebar(false);
    }

    setTouchStart(null);
  };

  const navigation = [
    { 
      name: 'لوحة التحكم', 
      href: '/', 
      icon: Home, 
      badge: null,
      color: 'text-blue-600'
    },
    { 
      name: 'نقاط البيع', 
      href: '/pos', 
      icon: ShoppingCart, 
      badge: null,
      color: 'text-green-600'
    },
    { 
      name: 'الطلبات', 
      href: '/orders', 
      icon: ClipboardList, 
      badge: stats.activeOrders || null,
      color: 'text-orange-600'
    },
    { 
      name: 'قائمة الطعام', 
      href: '/menu', 
      icon: MenuIcon, 
      badge: null,
      color: 'text-purple-600'
    },
    { 
      name: 'المخزون', 
      href: '/inventory', 
      icon: Package, 
      badge: stats.lowStockItems || null,
      color: 'text-red-600'
    },
    { 
      name: 'الطاولات', 
      href: '/tables', 
      icon: Coffee, 
      badge: null,
      color: 'text-yellow-600'
    },
    { 
      name: 'التوصيل', 
      href: '/delivery', 
      icon: Truck, 
      badge: null,
      color: 'text-indigo-600'
    },
    { 
      name: 'العملاء', 
      href: '/customers', 
      icon: Users, 
      badge: null,
      color: 'text-pink-600'
    },
    { 
      name: 'الموظفين', 
      href: '/staff', 
      icon: UserCheck, 
      badge: null,
      color: 'text-teal-600'
    },
    { 
      name: 'التقارير', 
      href: '/reports', 
      icon: BarChart3, 
      badge: null,
      color: 'text-cyan-600'
    },
    { 
      name: 'الإعدادات', 
      href: '/settings', 
      icon: Settings, 
      badge: null,
      color: 'text-gray-600'
    },
  ];

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await signOut();
      if (error) throw error;
      toast.success('تم تسجيل الخروج بنجاح');
      navigate('/login');
    } catch (error) {
      toast.error('خطأ في تسجيل الخروج');
    } finally {
      setIsLoading(false);
    }
  };

  const currentPage = navigation.find(nav => nav.href === location.pathname);

  return (
    <div 
      className="min-h-screen bg-gray-50 relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Status Bar */}
      <div className="bg-black text-white px-4 py-1 flex items-center justify-between text-xs font-medium">
        <div className="flex items-center space-x-2 space-x-reverse">
          <span>{currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="flex items-center">
            <Signal className="h-3 w-3 mr-1" />
            <span>4G</span>
          </div>
          {isOnline ? (
            <Wifi className="h-3 w-3 text-green-400" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-400" />
          )}
          <div className="flex items-center">
            <Battery className={`h-3 w-3 mr-1 ${batteryLevel < 20 ? 'text-red-400' : 'text-green-400'}`} />
            <span>{batteryLevel}%</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 touch-manipulation"
              aria-label="فتح القائمة"
            >
              <MenuIcon className="h-6 w-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {currentPage?.name || 'نظام المطعم'}
              </h1>
              {!isOnline && (
                <p className="text-xs text-red-600 flex items-center">
                  <WifiOff className="h-3 w-3 mr-1" />
                  وضع عدم الاتصال
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 touch-manipulation"
              aria-label="الإشعارات"
            >
              <Bell className="h-5 w-5 text-gray-700" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">أ</span>
            </div>
          </div>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 max-h-64 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">الإشعارات</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.unread 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <div className="flex-shrink-0 mt-1">
                          {notification.type === 'order' && <ShoppingCart className="h-4 w-4 text-blue-500" />}
                          {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                          {notification.type === 'success' && <Check className="h-4 w-4 text-green-500" />}
                          {notification.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد إشعارات جديدة</p>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">نظام المطعم</h2>
                <p className="text-sm text-gray-500">إدارة متكاملة</p>
              </div>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 touch-manipulation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setShowSidebar(false)}
                  className={`flex items-center px-4 py-4 rounded-xl transition-all duration-200 touch-manipulation ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <span className="font-medium text-base">{item.name}</span>
                  </div>
                  
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">إحصائيات اليوم</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{stats.todaySales.toLocaleString()}</div>
                <div className="text-xs text-gray-600">ج.م</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{stats.activeOrders}</div>
                <div className="text-xs text-gray-600">طلب نشط</div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-xl transition-all duration-200 touch-manipulation disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin ml-2" />
              ) : (
                <LogOut className="h-5 w-5 ml-2" />
              )}
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 touch-manipulation relative ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium truncate max-w-full">
                  {item.name.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-700">جاري المعالجة...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLayout;