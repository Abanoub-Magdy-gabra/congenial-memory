import React, { useState, useEffect } from 'react';
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
  Minimize2,
  Zap,
  Star,
  TrendingUp,
  Activity,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  HelpCircle,
  MessageSquare,
  Calendar,
  Clock,
  Target,
  Award,
  Sparkles,
  ChevronDown,
  User,
  CreditCard,
  Shield,
  Globe,
  Palette,
  Database,
  RefreshCw,
  Download,
  Upload,
  Filter,
  MoreHorizontal,
  Command,
  Keyboard,
  Bookmark,
  History,
  Layers,
  Monitor,
  Smartphone,
  Tablet,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [notifications] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setShowProfileMenu(false);
        setShowNotifications(false);
        setShowQuickActions(false);
        setSearchFocused(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigation = [
    { 
      name: 'لوحة التحكم', 
      href: '/', 
      icon: Home, 
      badge: null, 
      color: 'from-blue-500 to-blue-600',
      description: 'نظرة عامة على الأداء'
    },
    { 
      name: 'نقاط البيع', 
      href: '/pos', 
      icon: ShoppingCart, 
      badge: null, 
      color: 'from-green-500 to-green-600',
      description: 'إنشاء طلبات جديدة'
    },
    { 
      name: 'الطلبات', 
      href: '/orders', 
      icon: ClipboardList, 
      badge: 5, 
      color: 'from-orange-500 to-orange-600',
      description: 'متابعة الطلبات النشطة'
    },
    { 
      name: 'قائمة الطعام', 
      href: '/menu', 
      icon: MenuIcon, 
      badge: null, 
      color: 'from-purple-500 to-purple-600',
      description: 'إدارة الأصناف والأسعار'
    },
    { 
      name: 'المخزون', 
      href: '/inventory', 
      icon: Package, 
      badge: 2, 
      color: 'from-red-500 to-red-600',
      description: 'متابعة المواد والمخزون'
    },
    { 
      name: 'الطاولات', 
      href: '/tables', 
      icon: Coffee, 
      badge: null, 
      color: 'from-yellow-500 to-yellow-600',
      description: 'إدارة طاولات المطعم'
    },
    { 
      name: 'التوصيل', 
      href: '/delivery', 
      icon: Truck, 
      badge: 3, 
      color: 'from-indigo-500 to-indigo-600',
      description: 'متابعة طلبات التوصيل'
    },
    { 
      name: 'العملاء', 
      href: '/customers', 
      icon: Users, 
      badge: null, 
      color: 'from-pink-500 to-pink-600',
      description: 'قاعدة بيانات العملاء'
    },
    { 
      name: 'الموظفين', 
      href: '/staff', 
      icon: UserCheck, 
      badge: null, 
      color: 'from-teal-500 to-teal-600',
      description: 'إدارة فريق العمل'
    },
    { 
      name: 'التقارير', 
      href: '/reports', 
      icon: BarChart3, 
      badge: null, 
      color: 'from-cyan-500 to-cyan-600',
      description: 'تحليلات وإحصائيات'
    },
    { 
      name: 'الإعدادات', 
      href: '/settings', 
      icon: Settings, 
      badge: null, 
      color: 'from-gray-500 to-gray-600',
      description: 'إعدادات النظام'
    },
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

  const quickStats = [
    { label: 'مبيعات اليوم', value: '٣,٤٩٠ ج.م', change: '+12%', color: 'text-green-600', icon: TrendingUp },
    { label: 'طلبات نشطة', value: '٨', change: '+2', color: 'text-blue-600', icon: Activity },
    { label: 'عملاء جدد', value: '٥', change: '+1', color: 'text-purple-600', icon: Users },
  ];

  const quickActions = [
    { name: 'طلب جديد', icon: ShoppingCart, href: '/pos', color: 'from-green-500 to-green-600', count: '5 نشط' },
    { name: 'إدارة الطاولات', icon: Coffee, href: '/tables', color: 'from-green-500 to-green-600', count: '12 متاح' },
    { name: 'التقارير', icon: BarChart3, href: '/reports', color: 'from-purple-500 to-purple-600', count: 'جديد' },
    { name: 'الإعدادات', icon: Settings, href: '/settings', color: 'from-gray-500 to-gray-600', count: '3 تحديث' }
  ];

  const notificationsList = [
    { id: 1, title: 'طلب جديد #1234', message: 'طلب جديد من طاولة 5', time: '2 دقيقة', type: 'order', unread: true },
    { id: 2, title: 'مخزون منخفض', message: 'دجاج مشوي - متبقي 5 كيلو', time: '5 دقائق', type: 'warning', unread: true },
    { id: 3, title: 'تم تسليم الطلب', message: 'طلب #1230 تم تسليمه بنجاح', time: '10 دقائق', type: 'success', unread: false },
    { id: 4, title: 'عميل جديد', message: 'تم تسجيل عميل جديد: سارة أحمد', time: '15 دقيقة', type: 'info', unread: false },
  ];

  const recentSearches = ['شاورما دجاج', 'طاولة 5', 'أحمد محمد', 'تقرير المبيعات'];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <User className="h-4 w-4 text-purple-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={`flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 ${darkMode ? 'dark' : ''}`}>
      {/* Clean, Modern Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50 shadow-lg flex flex-col`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className={`${sidebarOpen ? 'block' : 'hidden'} flex items-center space-x-3 space-x-reverse`}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Coffee className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">نظام المطعم</h1>
              <p className="text-xs text-gray-500">إدارة متكاملة</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
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
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`group relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>
                
                {/* Text Content */}
                <div className={`${sidebarOpen ? 'block' : 'hidden'} ml-4 flex-1 min-w-0`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{item.name}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-l-full"></div>
                )}

                {/* Tooltip for collapsed state */}
                {!sidebarOpen && hoveredItem === item.name && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                    {item.name}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        {sidebarOpen && (
          <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">إحصائيات سريعة</h3>
              <Target className="h-4 w-4 text-blue-500" />
            </div>
            
            <div className="space-y-3">
              {quickStats.map((stat) => (
                <div key={stat.label} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <stat.icon className={`h-4 w-4 mr-2 ${stat.color}`} />
                    <span className="text-xs text-gray-600">{stat.label}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                    <div className="text-xs text-green-600">{stat.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
            <LogOut className="h-5 w-5 ml-3" />
            <span className={`${sidebarOpen ? 'block' : 'hidden'} font-medium text-sm`}>
              تسجيل الخروج
            </span>
          </button>
        </div>
      </div>

      {/* Main content with proper margin */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {/* Enhanced Header/Navbar */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Section - Search & Breadcrumbs */}
            <div className="flex items-center space-x-6 space-x-reverse flex-1">
              {/* Enhanced Search */}
              <div className="relative group">
                <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="البحث السريع في النظام..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    className="pl-4 pr-12 py-3 w-96 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300"
                  />
                </div>
              </div>

              {/* Breadcrumbs */}
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                <Home className="h-4 w-4" />
                <ChevronLeft className="h-3 w-3 rotate-180" />
                <span className="text-gray-700 font-medium">
                  {navigation.find(nav => nav.href === location.pathname)?.name || 'الصفحة الحالية'}
                </span>
              </div>
            </div>

            {/* Center Section - Time & Status */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Live Time */}
              <div className="text-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
                <div className="text-lg font-bold text-gray-900">
                  {currentTime.toLocaleTimeString('ar-EG', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-xs text-gray-500">
                  {currentTime.toLocaleDateString('ar-EG', { weekday: 'short' })}
                </div>
              </div>

              {/* System Status */}
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="flex items-center space-x-1 space-x-reverse bg-green-50 rounded-xl px-3 py-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">متصل</span>
                </div>
              </div>
            </div>

            {/* Right Section - Actions & Profile */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>
              
              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 space-x-reverse bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">أحمد محمد</p>
                    <p className="text-xs text-gray-500">مدير المطعم</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">أ</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;