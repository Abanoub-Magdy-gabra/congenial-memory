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
  CheckCircle,
  X,
  Plus
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
    { name: 'إدارة الطاولات', icon: Coffee, href: '/tables', color: 'from-blue-500 to-blue-600', count: '12 متاح' },
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
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
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2 animate-pulse">
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
        {/* Enhanced Modern Navbar */}
        <header className="bg-white border-b border-gray-200 shadow-sm relative z-40">
          <div className="flex items-center justify-between px-6 py-4">
            
            {/* Left Section - Enhanced Search & Breadcrumbs */}
            <div className="flex items-center space-x-6 space-x-reverse flex-1 max-w-2xl">
              {/* Enhanced Search Bar */}
              <div className="relative group flex-1">
                <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-105 shadow-lg' : 'shadow-sm'}`}>
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-300 group-hover:text-blue-500" />
                  <input
                    type="text"
                    placeholder="البحث السريع في النظام..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500"
                  />
                  {searchValue && (
                    <button
                      onClick={() => setSearchValue('')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 space-x-reverse">
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded flex items-center">
                      <Command className="h-3 w-3 mr-1" />
                      K
                    </kbd>
                  </div>
                </div>
                
                {/* Search Dropdown */}
                {searchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                    <div className="space-y-4">
                      {/* Quick Actions */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Zap className="h-4 w-4 ml-1 text-yellow-500" />
                          إجراءات سريعة
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {quickActions.map((action) => (
                            <Link
                              key={action.name}
                              to={action.href}
                              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                            >
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white mr-3 group-hover:scale-110 transition-transform duration-200`}>
                                <action.icon className="h-4 w-4" />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700">{action.name}</span>
                                <p className="text-xs text-gray-500">{action.count}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      {/* Recent Searches */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <History className="h-4 w-4 ml-1 text-gray-500" />
                          عمليات بحث حديثة
                        </h4>
                        <div className="space-y-1">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              className="w-full text-right p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm text-gray-600"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Breadcrumbs */}
              <div className="flex items-center space-x-2 space-x-reverse text-sm bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                <Home className="h-4 w-4 text-gray-400" />
                <ChevronLeft className="h-3 w-3 rotate-180 text-gray-400" />
                <span className="text-gray-700 font-medium">
                  {navigation.find(nav => nav.href === location.pathname)?.name || 'الصفحة الحالية'}
                </span>
              </div>
            </div>

            {/* Center Section - Enhanced Time & Status */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Live Time Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-3 border border-blue-200 shadow-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {currentTime.toLocaleTimeString('ar-EG', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-center">
                    <Calendar className="h-3 w-3 ml-1" />
                    {currentTime.toLocaleDateString('ar-EG', { weekday: 'short' })}
                  </div>
                </div>
              </div>

              {/* System Status Indicators */}
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="flex items-center space-x-1 space-x-reverse bg-green-50 rounded-lg px-3 py-2 border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">متصل</span>
                </div>
                
                <div className="flex items-center space-x-1 space-x-reverse bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                  <Activity className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">نشط</span>
                </div>
              </div>
            </div>

            {/* Right Section - Enhanced Actions & Profile */}
            <div className="flex items-center space-x-3 space-x-reverse">
              {/* Quick Actions Button */}
              <div className="relative">
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 relative"
                >
                  <Layers className="h-5 w-5" />
                </button>

                {/* Quick Actions Dropdown */}
                {showQuickActions && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Zap className="h-4 w-4 ml-1 text-yellow-500" />
                      إجراءات سريعة
                    </h4>
                    <div className="space-y-2">
                      {quickActions.map((action) => (
                        <Link
                          key={action.name}
                          to={action.href}
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                          onClick={() => setShowQuickActions(false)}
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white mr-3 group-hover:scale-110 transition-transform duration-200`}>
                            <action.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">{action.name}</span>
                            <p className="text-xs text-gray-500">{action.count}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>

              {/* Enhanced Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                      {notifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                        <Bell className="h-4 w-4 ml-1 text-blue-500" />
                        الإشعارات
                      </h4>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        تحديد الكل كمقروء
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {notificationsList.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                            notification.unread 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-start space-x-3 space-x-reverse">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                        عرض جميع الإشعارات
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 space-x-reverse bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-all duration-200 border border-gray-200 shadow-sm"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">أحمد محمد</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="h-3 w-3 ml-1 text-yellow-500" />
                      مدير المطعم
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                      <span className="text-sm font-medium text-white">أ</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                    <div className="flex items-center space-x-3 space-x-reverse mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                        <span className="text-sm font-medium text-white">أ</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">أحمد محمد</p>
                        <p className="text-xs text-gray-500">ahmed@restaurant.com</p>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
                          <span className="text-xs text-green-600">متصل الآن</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="h-4 w-4 text-gray-400 ml-3 group-hover:text-blue-500 transition-colors duration-200" />
                        <span className="text-sm text-gray-700">الملف الشخصي</span>
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="h-4 w-4 text-gray-400 ml-3 group-hover:text-blue-500 transition-colors duration-200" />
                        <span className="text-sm text-gray-700">الإعدادات</span>
                      </Link>
                      
                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
                        <Shield className="h-4 w-4 text-gray-400 ml-3 group-hover:text-blue-500 transition-colors duration-200" />
                        <span className="text-sm text-gray-700">الأمان والخصوصية</span>
                      </button>
                      
                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
                        <HelpCircle className="h-4 w-4 text-gray-400 ml-3 group-hover:text-blue-500 transition-colors duration-200" />
                        <span className="text-sm text-gray-700">المساعدة والدعم</span>
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <button className="w-full flex items-center p-3 rounded-lg hover:bg-red-50 transition-colors duration-200 group text-red-600">
                        <LogOut className="h-4 w-4 ml-3 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-sm font-medium">تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                )}
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