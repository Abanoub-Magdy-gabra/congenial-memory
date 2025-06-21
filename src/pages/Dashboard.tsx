import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock,
  AlertTriangle,
  Eye,
  Calendar,
  Target,
  Award,
  Zap,
  BarChart3,
  Settings,
  Star,
  Coffee,
  Utensils,
  Truck,
  Heart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useDashboardStats, useOrders, useInventory, useTables } from '../hooks/useSupabase';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Supabase hooks
  const { stats } = useDashboardStats();
  const { orders } = useOrders();
  const { inventory } = useInventory();
  const { tables } = useTables();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Process real data for charts
  const salesData = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        name: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        sales: 0,
        orders: 0,
        profit: 0
      };
    });

    orders.forEach(order => {
      const orderDate = new Date(order.created_at).toISOString().split('T')[0];
      const dayData = last7Days.find(day => day.date === orderDate);
      if (dayData && order.status === 'delivered') {
        dayData.sales += order.total_amount;
        dayData.orders += 1;
        dayData.profit += order.total_amount * 0.3; // Assume 30% profit margin
      }
    });

    return last7Days;
  }, [orders]);

  const hourlyData = React.useMemo(() => {
    const hours = Array.from({ length: 14 }, (_, i) => ({
      hour: `${i + 9}:00`,
      sales: 0,
      customers: 0
    }));

    const today = new Date().toISOString().split('T')[0];
    orders.forEach(order => {
      const orderDate = new Date(order.created_at).toISOString().split('T')[0];
      if (orderDate === today && order.status === 'delivered') {
        const hour = new Date(order.created_at).getHours();
        if (hour >= 9 && hour <= 22) {
          const hourData = hours[hour - 9];
          hourData.sales += order.total_amount;
          hourData.customers += 1;
        }
      }
    });

    return hours;
  }, [orders]);

  const categoryData = React.useMemo(() => {
    const categories = [
      { name: 'الوجبات الرئيسية', value: 0, color: '#0ea5e9', amount: 0 },
      { name: 'المشروبات', value: 0, color: '#22c55e', amount: 0 },
      { name: 'الحلويات', value: 0, color: '#f59e0b', amount: 0 },
      { name: 'المقبلات', value: 0, color: '#ef4444', amount: 0 }
    ];

    let totalAmount = 0;
    orders.forEach(order => {
      if (order.status === 'delivered' && order.order_items) {
        order.order_items.forEach((item: any) => {
          if (item.menu_items?.category?.name) {
            const category = categories.find(cat => cat.name === item.menu_items.category.name);
            if (category) {
              category.amount += item.total_price;
              totalAmount += item.total_price;
            }
          }
        });
      }
    });

    categories.forEach(category => {
      category.value = totalAmount > 0 ? Math.round((category.amount / totalAmount) * 100) : 0;
    });

    return categories.filter(cat => cat.value > 0);
  }, [orders]);

  const lowStockItems = React.useMemo(() => {
    return inventory.filter(item => 
      item.status === 'low-stock' || item.status === 'out-of-stock'
    ).slice(0, 4);
  }, [inventory]);

  const recentOrders = React.useMemo(() => {
    return orders
      .filter(order => order.status !== 'delivered' && order.status !== 'cancelled')
      .slice(0, 4)
      .map(order => ({
        id: order.order_number,
        table: order.order_type === 'dine-in' ? `طاولة ${order.tables?.number}` : 
               order.order_type === 'delivery' ? 'ديليفري' : 'تيك أواي',
        items: order.order_items?.length || 0,
        total: order.total_amount,
        status: order.status,
        time: new Date(order.created_at).toLocaleTimeString('ar-EG', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        priority: order.order_type === 'delivery' ? 'high' : 'normal'
      }));
  }, [orders]);

  const dashboardStats = [
    {
      name: 'إجمالي المبيعات اليوم',
      value: `${stats.todaySales.toLocaleString()} ج.م`,
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      target: '4000 ج.م',
      progress: Math.min((stats.todaySales / 4000) * 100, 100),
      description: 'مقارنة بالأمس'
    },
    {
      name: 'عدد الطلبات',
      value: stats.todayOrders.toString(),
      change: '+8.2%',
      changeType: 'increase',
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      target: '25',
      progress: Math.min((stats.todayOrders / 25) * 100, 100),
      description: 'طلب جديد'
    },
    {
      name: 'العملاء الجدد',
      value: stats.newCustomers.toString(),
      change: '-2.1%',
      changeType: 'decrease',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      target: '10',
      progress: Math.min((stats.newCustomers / 10) * 100, 100),
      description: 'عميل مسجل'
    },
    {
      name: 'متوسط قيمة الطلب',
      value: `${stats.todayOrders > 0 ? Math.round(stats.todaySales / stats.todayOrders) : 0} ج.م`,
      change: '+5.4%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      target: '200 ج.م',
      progress: stats.todayOrders > 0 ? Math.min(((stats.todaySales / stats.todayOrders) / 200) * 100, 100) : 0,
      description: 'للطلب الواحد'
    },
  ];

  const quickActions = [
    { name: 'طلب جديد', icon: ShoppingCart, color: 'from-green-500 to-green-600', href: '/pos', count: `${stats.activeOrders} نشط` },
    { name: 'تقرير سريع', icon: BarChart3, color: 'from-blue-500 to-blue-600', href: '/reports', count: 'جديد' },
    { name: 'إضافة عميل', icon: Users, color: 'from-purple-500 to-purple-600', href: '/customers', count: 'جديد' },
    { name: 'إدارة المخزون', icon: Package, color: 'from-orange-500 to-orange-600', href: '/inventory', count: `${stats.lowStockItems} تنبيه` },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between fade-in">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">لوحة التحكم</h1>
          <p className="text-gray-600 text-lg flex items-center">
            <Activity className="h-5 w-5 ml-2 text-green-500" />
            مرحباً بك في نظام إدارة المطعم المتطور
          </p>
        </div>
        <div className="text-right slide-in-right">
          <div className="bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-primary-600 ml-2" />
              <p className="text-sm text-gray-500">الوقت الحالي</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {currentTime.toLocaleTimeString('ar-EG', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            <p className="text-sm text-gray-600">
              {currentTime.toLocaleDateString('ar-EG', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bounce-in">
        {quickActions.map((action, index) => (
          <div
            key={action.name}
            className={`card-interactive bg-gradient-to-r ${action.color} text-white p-6 group relative overflow-hidden`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <action.icon className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{action.count}</span>
              </div>
              <h3 className="font-semibold text-lg">{action.name}</h3>
            </div>
            
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            {/* Floating particles */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div key={stat.name} className="card-elevated group hover:shadow-2xl relative overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight className="h-4 w-4 text-success-500 ml-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-danger-500 ml-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>الهدف: {stat.target}</span>
                    <span>{Math.round(stat.progress)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend */}
        <div className="card-elevated relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="h-6 w-6 ml-2 text-primary-600" />
                اتجاه المبيعات
              </h3>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input-field w-auto text-sm bg-white/70 backdrop-blur-sm"
              >
                <option value="today">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  formatter={(value, name) => [
                    `${value} ${name === 'sales' ? 'ج.م' : name === 'orders' ? 'طلب' : 'ج.م'}`,
                    name === 'sales' ? 'المبيعات' : name === 'orders' ? 'الطلبات' : 'الربح'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  fill="url(#salesGradient)"
                />
                <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Performance */}
        <div className="card-elevated relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -translate-y-16 -translate-x-16"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Clock className="h-6 w-6 ml-2 text-primary-600" />
                الأداء بالساعة
              </h3>
              <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary-500 rounded-full ml-2"></div>
                  <span>المبيعات</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full ml-2"></div>
                  <span>العملاء</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  formatter={(value, name) => [
                    `${value} ${name === 'sales' ? 'ج.م' : 'عميل'}`,
                    name === 'sales' ? 'المبيعات' : 'العملاء'
                  ]}
                />
                <Bar dataKey="sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="customers" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Distribution */}
        <div className="card-elevated relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full"></div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="h-6 w-6 ml-2 text-primary-600" />
              توزيع المبيعات
            </h3>
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value}% (${props.payload.amount} ج.م)`,
                        props.payload.name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {categoryData.map((item) => (
                    <div key={item.name} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group">
                      <div 
                        className="w-4 h-4 rounded-full ml-2 shadow-sm group-hover:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        <p className="text-xs text-gray-500">{item.amount} ج.م</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد بيانات مبيعات</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card-elevated border-l-4 border-l-warning-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-transparent rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-warning-500 ml-2 animate-pulse" />
              <h3 className="text-lg font-bold text-gray-900">تنبيهات المخزون</h3>
            </div>
            {lowStockItems.length > 0 ? (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 hover:shadow-md ${
                    item.status === 'out-of-stock' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-orange-50 border-orange-200 text-orange-800'
                  }`}>
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs opacity-75">متبقي: {item.current_stock} | الحد الأدنى: {item.minimum_stock}</p>
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 ml-1" />
                      <span className="text-xs font-bold">
                        {item.status === 'out-of-stock' ? 'نفد' : 'منخفض'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">جميع المواد متوفرة</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card-elevated relative overflow-hidden">
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 ml-2 text-primary-600" />
                الطلبات الأخيرة
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center group">
                <Eye className="h-4 w-4 ml-1 group-hover:scale-110 transition-transform duration-300" />
                عرض الكل
              </button>
            </div>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className={`flex items-center justify-between p-3 rounded-xl border-l-4 transition-all duration-300 hover:shadow-md ${
                    order.priority === 'high' ? 'border-l-orange-500 bg-orange-50' : 'border-l-blue-500 bg-blue-50'
                  }`}>
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="text-sm font-bold text-gray-900 ml-2">{order.id}</span>
                        <span className="text-xs text-gray-500">{order.table}</span>
                      </div>
                      <p className="text-xs text-gray-600">{order.items} أصناف • {order.total} ج.م</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        order.status === 'delivered' ? 'bg-success-100 text-success-800' :
                        order.status === 'ready' ? 'bg-primary-100 text-primary-800' :
                        order.status === 'preparing' ? 'bg-warning-100 text-warning-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'pending' ? 'جديد' :
                         order.status === 'preparing' ? 'جاري التحضير' :
                         order.status === 'ready' ? 'جاهز' :
                         order.status === 'served' ? 'تم التقديم' :
                         order.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{order.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد طلبات نشطة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;