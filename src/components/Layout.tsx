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
  Sparkles
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
  const location = useLocation();

  const navigation = [
    { 
      name: 'لوحة التحكم', 
      href: '/', 
      icon: Home, 
      badge: null, 
      color: 'from-blue-500 to-blue-600',
      description: 'نظرة عامة على الأداء',
      isNew: false
    },
    { 
      name: 'نقاط البيع', 
      href: '/pos', 
      icon: ShoppingCart, 
      badge: null, 
      color: 'from-green-500 to-green-600',
      description: 'إنشاء طلبات جديدة',
      isNew: false
    },
    { 
      name: 'الطلبات', 
      href: '/orders', 
      icon: ClipboardList, 
      badge: 5, 
      color: 'from-orange-500 to-orange-600',
      description: 'متابعة الطلبات النشطة',
      isNew: false
    },
    { 
      name: 'قائمة الطعام', 
      href: '/menu', 
      icon: MenuIcon, 
      badge: null, 
      color: 'from-purple-500 to-purple-600',
      description: 'إدارة الأصناف والأسعار',
      isNew: false
    },
    { 
      name: 'المخزون', 
      href: '/inventory', 
      icon: Package, 
      badge: 2, 
      color: 'from-red-500 to-red-600',
      description: 'متابعة المواد والمخزون',
      isNew: false
    },
    { 
      name: 'الطاولات', 
      href: '/tables', 
      icon: Coffee, 
      badge: null, 
      color: 'from-yellow-500 to-yellow-600',
      description: 'إدارة طاولات المطعم',
      isNew: false
    },
    { 
      name: 'التوصيل', 
      href: '/delivery', 
      icon: Truck, 
      badge: 3, 
      color: 'from-indigo-500 to-indigo-600',
      description: 'متابعة طلبات التوصيل',
      isNew: true
    },
    { 
      name: 'العملاء', 
      href: '/customers', 
      icon: Users, 
      badge: null, 
      color: 'from-pink-500 to-pink-600',
      description: 'قاعدة بيانات العملاء',
      isNew: false
    },
    { 
      name: 'الموظفين', 
      href: '/staff', 
      icon: UserCheck, 
      badge: null, 
      color: 'from-teal-500 to-teal-600',
      description: 'إدارة فريق العمل',
      isNew: false
    },
    { 
      name: 'التقارير', 
      href: '/reports', 
      icon: BarChart3, 
      badge: null, 
      color: 'from-cyan-500 to-cyan-600',
      description: 'تحليلات وإحصائيات',
      isNew: false
    },
    { 
      name: 'الإعدادات', 
      href: '/settings', 
      icon: Settings, 
      badge: null, 
      color: 'from-gray-500 to-gray-600',
      description: 'إعدادات النظام',
      isNew: false
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

  return (
    <div className={`flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 ${darkMode ? 'dark' : ''}`}>
      {/* Enhanced Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-20'} glass-effect transition-all duration-500 ease-in-out border-r border-white/20 relative overflow-hidden flex flex-col`}>
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-purple-600/5 opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className={`${sidebarOpen ? 'block' : 'hidden'} flex items-center space-x-3 space-x-reverse`}>
              <div className="relative group">
                <div className="w-14 h-14 bg-gradient-to-r from-primary-600 via-primary-700 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-3">
                  <Coffee className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-3xl"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">نظام المطعم</h1>
                <div className="flex items-center space-x-2 space-x-reverse mt-1">
                  <div className="flex items-center">
                    <Sparkles className="h-3 w-3 text-yellow-500 ml-1" />
                    <span className="text-xs text-gray-500">إدارة متكاملة</span>
                  </div>
                  <div className="flex items-center">
                    {isOnline ? (
                      <Wifi className="h-3 w-3 text-green-500" />
                    ) : (
                      <WifiOff className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 rounded-2xl hover:bg-white/10 transition-all duration-300 group relative overflow-hidden"
            >
              <ChevronLeft className={`h-5 w-5 transition-all duration-500 group-hover:scale-110 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>

          {/* Quick Actions (when collapsed) */}
          {!sidebarOpen && (
            <div className="px-2 py-4 space-y-2">
              <button className="w-full p-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <ShoppingCart className="h-5 w-5 mx-auto" />
              </button>
              <button className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <ClipboardList className="h-5 w-5 mx-auto" />
              </button>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 block ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-lg scale-105 border border-primary-200'
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900 hover:shadow-md hover:scale-102'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center px-4 py-4">
                    <div className={`relative p-3 rounded-xl mr-3 transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-md'
                    }`}>
                      <item.icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse rounded-xl"></div>
                      )}
                    </div>
                    
                    <div className={`${sidebarOpen ? 'block' : 'hidden'} transition-all duration-300 flex-1`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{item.name}</span>
                            {item.isNew && (
                              <span className="mr-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                جديد
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                        </div>
                        {item.badge && (
                          <div className="flex items-center">
                            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-bounce shadow-lg">
                              {item.badge}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-700 rounded-l-full shadow-lg"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats */}
          {sidebarOpen && (
            <div className="mt-6 mx-4 p-4 bg-gradient-to-r from-primary-50 via-white to-purple-50 rounded-3xl border border-primary-100 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                  <TrendingUp className="h-4 w-4 ml-1 text-green-500" />
                  إحصائيات سريعة
                </h3>
                <button className="p-1 rounded-lg hover:bg-white/50 transition-colors duration-200">
                  <Target className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-3">
                {quickStats.map((stat, index) => (
                  <div key={stat.label} className="flex justify-between items-center p-2 rounded-xl hover:bg-white/50 transition-all duration-200 group">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-white/70 mr-2 group-hover:scale-110 transition-transform duration-200">
                        <stat.icon className={`h-3 w-3 ${stat.color}`} />
                      </div>
                      <span className="text-xs text-gray-600">{stat.label}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                      <div className="text-xs text-green-600">{stat.change}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                  <span>الهدف اليومي</span>
                  <span>٧٥%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* System Status */}
          {sidebarOpen && (
            <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-xs text-gray-600">{isOnline ? 'متصل' : 'غير متصل'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    {soundEnabled ? (
                      <Volume2 className="h-3 w-3 text-gray-400" />
                    ) : (
                      <VolumeX className="h-3 w-3 text-gray-400" />
                    )}
                  </button>
                  <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <HelpCircle className="h-3 w-3 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t border-white/10 mt-auto">
            <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 group relative overflow-hidden">
              <LogOut className="h-5 w-5 ml-3 group-hover:scale-110 transition-transform duration-300" />
              <span className={`${sidebarOpen ? 'block' : 'hidden'} font-medium`}>
                تسجيل الخروج
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <header className="glass-effect border-b border-white/10 shadow-sm relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
          
          <div className="relative z-10 flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="البحث السريع..."
                  className="pl-4 pr-12 py-3 w-96 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">⌘K</kbd>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-white/20 rounded-2xl transition-all duration-300 group relative overflow-hidden"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <Moon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-white/20 rounded-2xl transition-all duration-300 group relative overflow-hidden"
              >
                {fullscreen ? (
                  <Minimize2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <Maximize2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>

              {/* Notifications */}
              <button className="relative p-3 text-gray-400 hover:text-gray-600 hover:bg-white/20 rounded-2xl transition-all duration-300 group">
                <Bell className="h-5 w-5 group-hover:animate-bounce" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                    {notifications}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
              
              {/* User Profile */}
              <div className="flex items-center space-x-3 space-x-reverse bg-white/20 backdrop-blur-sm rounded-2xl p-3 hover:bg-white/30 transition-all duration-300 cursor-pointer group relative overflow-hidden">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-300">أحمد محمد</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Star className="h-3 w-3 ml-1 text-yellow-500" />
                    مدير المطعم
                  </p>
                </div>
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <span className="text-sm font-medium text-white">أ</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50/50 via-white/30 to-blue-50/30 custom-scrollbar">
          <div className="fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;