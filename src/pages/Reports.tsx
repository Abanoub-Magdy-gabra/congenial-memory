import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Download,
  Filter,
  Eye,
  FileText,
  Clock,
  Package
} from 'lucide-react';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedReport, setSelectedReport] = useState('sales');

  const periods = [
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' },
    { value: 'quarter', label: 'هذا الربع' },
    { value: 'year', label: 'هذا العام' },
    { value: 'custom', label: 'فترة مخصصة' }
  ];

  const reportTypes = [
    { value: 'sales', label: 'تقرير المبيعات', icon: DollarSign },
    { value: 'orders', label: 'تقرير الطلبات', icon: ShoppingCart },
    { value: 'customers', label: 'تقرير العملاء', icon: Users },
    { value: 'inventory', label: 'تقرير المخزون', icon: Package },
    { value: 'financial', label: 'التقرير المالي', icon: FileText }
  ];

  // Sample data for charts
  const salesData = [
    { name: 'السبت', sales: 4000, orders: 24, customers: 18 },
    { name: 'الأحد', sales: 3000, orders: 18, customers: 15 },
    { name: 'الاثنين', sales: 2000, orders: 12, customers: 10 },
    { name: 'الثلاثاء', sales: 2780, orders: 16, customers: 12 },
    { name: 'الأربعاء', sales: 1890, orders: 11, customers: 8 },
    { name: 'الخميس', sales: 2390, orders: 14, customers: 11 },
    { name: 'الجمعة', sales: 3490, orders: 20, customers: 16 }
  ];

  const hourlyData = [
    { hour: '9:00', sales: 120 },
    { hour: '10:00', sales: 180 },
    { hour: '11:00', sales: 250 },
    { hour: '12:00', sales: 420 },
    { hour: '13:00', sales: 380 },
    { hour: '14:00', sales: 290 },
    { hour: '15:00', sales: 220 },
    { hour: '16:00', sales: 180 },
    { hour: '17:00', sales: 240 },
    { hour: '18:00', sales: 350 },
    { hour: '19:00', sales: 480 },
    { hour: '20:00', sales: 520 },
    { hour: '21:00', sales: 380 },
    { hour: '22:00', sales: 280 }
  ];

  const categoryData = [
    { name: 'الوجبات الرئيسية', value: 45, color: '#0ea5e9' },
    { name: 'المشروبات', value: 25, color: '#22c55e' },
    { name: 'الحلويات', value: 20, color: '#f59e0b' },
    { name: 'المقبلات', value: 10, color: '#ef4444' }
  ];

  const topProducts = [
    { name: 'شاورما دجاج', sales: 45, revenue: 675, growth: 12.5 },
    { name: 'برجر لحم', sales: 38, revenue: 950, growth: 8.2 },
    { name: 'بيتزا مارجريتا', sales: 32, revenue: 1120, growth: -2.1 },
    { name: 'عصير برتقال', sales: 52, revenue: 416, growth: 15.3 },
    { name: 'قهوة تركي', sales: 28, revenue: 196, growth: 5.7 }
  ];

  const paymentMethods = [
    { method: 'نقدي', amount: 2450, percentage: 65 },
    { method: 'بطاقة ائتمان', amount: 980, percentage: 26 },
    { method: 'محفظة إلكترونية', amount: 340, percentage: 9 }
  ];

  const stats = [
    {
      title: 'إجمالي المبيعات',
      value: '٣,٤٩٠ ج.م',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'primary'
    },
    {
      title: 'عدد الطلبات',
      value: '٢٠',
      change: '+8.2%',
      changeType: 'increase',
      icon: ShoppingCart,
      color: 'success'
    },
    {
      title: 'متوسط قيمة الطلب',
      value: '١٧٤.٥ ج.م',
      change: '+5.4%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'info'
    },
    {
      title: 'العملاء الجدد',
      value: '٧',
      change: '-2.1%',
      changeType: 'decrease',
      icon: Users,
      color: 'warning'
    }
  ];

  const getStatColor = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary-100 text-primary-600';
      case 'success': return 'bg-success-100 text-success-600';
      case 'info': return 'bg-blue-100 text-blue-600';
      case 'warning': return 'bg-warning-100 text-warning-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const exportReport = () => {
    // Export logic here
    console.log('Exporting report...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقارير والإحصائيات</h1>
          <p className="text-gray-600">تحليل شامل لأداء المطعم والمبيعات</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button
            onClick={exportReport}
            className="btn-secondary"
          >
            <Download className="h-4 w-4 ml-2" />
            تصدير التقرير
          </button>
          <button className="btn-primary">
            <FileText className="h-4 w-4 ml-2" />
            تقرير مخصص
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نوع التقرير
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full input-field"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الفترة الزمنية
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full input-field"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full btn-primary">
              <Filter className="h-4 w-4 ml-2" />
              تطبيق الفلتر
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`flex items-center justify-center h-12 w-12 rounded-lg ${getStatColor(stat.color)}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mr-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-1">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-success-500 ml-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-danger-500 ml-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">اتجاه المبيعات</h3>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-sm text-gray-500">آخر 7 أيام</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} ${name === 'sales' ? 'ج.م' : 'طلب'}`,
                  name === 'sales' ? 'المبيعات' : 'الطلبات'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#0ea5e9" 
                fill="#0ea5e9" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Sales */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">المبيعات بالساعة</h3>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">اليوم</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} ج.م`, 'المبيعات']} />
              <Bar dataKey="sales" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">توزيع المبيعات حسب الفئة</h3>
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
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full ml-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">الأصناف الأكثر مبيعاً</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full text-sm font-medium ml-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} قطعة مباعة</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{product.revenue} ج.م</p>
                  <div className="flex items-center">
                    {product.growth > 0 ? (
                      <TrendingUp className="h-3 w-3 text-success-500 ml-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-danger-500 ml-1" />
                    )}
                    <span className={`text-xs ${
                      product.growth > 0 ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {product.growth > 0 ? '+' : ''}{product.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods & Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">طرق الدفع</h3>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.method} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-primary-600 rounded-full ml-3"></div>
                  <span className="text-sm font-medium text-gray-900">{method.method}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{method.amount} ج.م</p>
                  <p className="text-xs text-gray-500">{method.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">الإجمالي</span>
              <span className="text-lg font-bold text-gray-900">
                {paymentMethods.reduce((sum, method) => sum + method.amount, 0)} ج.م
              </span>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">الملخص المالي</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">إجمالي الإيرادات</span>
              <span className="text-lg font-bold text-green-600">٣,٧٧٠ ج.م</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">تكلفة البضاعة المباعة</span>
              <span className="text-lg font-bold text-red-600">١,٥٠٨ ج.م</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">المصروفات التشغيلية</span>
              <span className="text-lg font-bold text-yellow-600">٨٥٠ ج.م</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">الضرائب (14%)</span>
              <span className="text-lg font-bold text-blue-600">٥٢٨ ج.م</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                <span className="text-lg font-bold text-gray-900">صافي الربح</span>
                <span className="text-xl font-bold text-primary-600">٨٨٤ ج.م</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">آخر المعاملات</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            عرض الكل
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  رقم الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الوقت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  طريقة الدفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الحالة
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #ORD-001
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  10:30 ص
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  أحمد محمد
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  245 ج.م
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  نقدي
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    مكتمل
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #ORD-002
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  10:25 ص
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  فاطمة علي
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  180 ج.م
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  بطاقة
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    مكتمل
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #ORD-003
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  10:20 ص
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  محمد حسن
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  320 ج.م
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  نقدي
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    مكتمل
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;