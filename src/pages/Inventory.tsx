import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  TrendingDown,
  TrendingUp,
  Eye,
  RefreshCw
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  costPrice: number;
  supplier: string;
  lastUpdated: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = ['all', 'خضروات', 'لحوم', 'دواجن', 'منتجات ألبان', 'توابل', 'مشروبات', 'أخرى'];
  
  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'in-stock', label: 'متوفر' },
    { value: 'low-stock', label: 'مخزون منخفض' },
    { value: 'out-of-stock', label: 'نفد المخزون' }
  ];

  // Sample inventory data
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'دجاج مشوي',
      category: 'دواجن',
      currentStock: 5,
      minimumStock: 10,
      unit: 'كيلو',
      costPrice: 45,
      supplier: 'مزرعة الأمل',
      lastUpdated: new Date('2024-12-15T08:00:00'),
      status: 'low-stock'
    },
    {
      id: '2',
      name: 'جبن موتزاريلا',
      category: 'منتجات ألبان',
      currentStock: 2,
      minimumStock: 8,
      unit: 'كيلو',
      costPrice: 85,
      supplier: 'شركة الألبان المصرية',
      lastUpdated: new Date('2024-12-15T09:30:00'),
      status: 'low-stock'
    },
    {
      id: '3',
      name: 'طماطم',
      category: 'خضروات',
      currentStock: 3,
      minimumStock: 15,
      unit: 'كيلو',
      costPrice: 8,
      supplier: 'سوق الخضار',
      lastUpdated: new Date('2024-12-15T07:15:00'),
      status: 'low-stock'
    },
    {
      id: '4',
      name: 'خس',
      category: 'خضروات',
      currentStock: 0,
      minimumStock: 5,
      unit: 'كيلو',
      costPrice: 6,
      supplier: 'سوق الخضار',
      lastUpdated: new Date('2024-12-14T18:00:00'),
      status: 'out-of-stock'
    },
    {
      id: '5',
      name: 'لحم بقري',
      category: 'لحوم',
      currentStock: 25,
      minimumStock: 10,
      unit: 'كيلو',
      costPrice: 180,
      supplier: 'الجزارة الحديثة',
      lastUpdated: new Date('2024-12-15T10:00:00'),
      status: 'in-stock'
    },
    {
      id: '6',
      name: 'أرز أبيض',
      category: 'أخرى',
      currentStock: 50,
      minimumStock: 20,
      unit: 'كيلو',
      costPrice: 12,
      supplier: 'مطاحن مصر',
      lastUpdated: new Date('2024-12-15T11:00:00'),
      status: 'in-stock'
    },
    {
      id: '7',
      name: 'كوكاكولا',
      category: 'مشروبات',
      currentStock: 48,
      minimumStock: 24,
      unit: 'علبة',
      costPrice: 3,
      supplier: 'شركة المشروبات',
      lastUpdated: new Date('2024-12-15T12:00:00'),
      status: 'in-stock'
    },
    {
      id: '8',
      name: 'ملح',
      category: 'توابل',
      currentStock: 8,
      minimumStock: 5,
      unit: 'كيلو',
      costPrice: 4,
      supplier: 'شركة الملح المصرية',
      lastUpdated: new Date('2024-12-15T09:00:00'),
      status: 'in-stock'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-success-100 text-success-800';
      case 'low-stock': return 'bg-warning-100 text-warning-800';
      case 'out-of-stock': return 'bg-danger-100 text-danger-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock': return <TrendingUp className="h-4 w-4" />;
      case 'low-stock': return <AlertTriangle className="h-4 w-4" />;
      case 'out-of-stock': return <TrendingDown className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lowStockCount = inventoryItems.filter(item => item.status === 'low-stock').length;
  const outOfStockCount = inventoryItems.filter(item => item.status === 'out-of-stock').length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المخزون</h1>
          <p className="text-gray-600">متابعة وإدارة مخزون المطعم</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button className="btn-secondary">
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4 ml-2" />
            إضافة صنف
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mr-4 flex-1">
              <p className="text-sm font-medium text-gray-600">إجمالي الأصناف</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryItems.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-warning-100">
                <AlertTriangle className="h-6 w-6 text-warning-600" />
              </div>
            </div>
            <div className="mr-4 flex-1">
              <p className="text-sm font-medium text-gray-600">مخزون منخفض</p>
              <p className="text-2xl font-bold text-warning-600">{lowStockCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-danger-100">
                <TrendingDown className="h-6 w-6 text-danger-600" />
              </div>
            </div>
            <div className="mr-4 flex-1">
              <p className="text-sm font-medium text-gray-600">نفد المخزون</p>
              <p className="text-2xl font-bold text-danger-600">{outOfStockCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-success-100">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
            </div>
            <div className="mr-4 flex-1">
              <p className="text-sm font-medium text-gray-600">قيمة المخزون</p>
              <p className="text-2xl font-bold text-gray-900">{totalValue.toLocaleString()} ج.م</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="البحث في المخزون..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">جميع الفئات</option>
            {categories.filter(cat => cat !== 'all').map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <button className="btn-secondary">
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الصنف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفئة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المخزون الحالي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحد الأدنى
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  سعر التكلفة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المورد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آخر تحديث
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">الوحدة: {item.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.currentStock} {item.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.minimumStock} {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.costPrice} ج.م
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="mr-1">
                        {item.status === 'in-stock' ? 'متوفر' :
                         item.status === 'low-stock' ? 'مخزون منخفض' :
                         'نفد المخزون'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.lastUpdated.toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button className="text-primary-600 hover:text-primary-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أصناف</h3>
            <p className="text-gray-500">لا توجد أصناف تطابق المعايير المحددة</p>
          </div>
        )}
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className="card border-warning-200 bg-warning-50">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-warning-500 ml-2" />
            <h3 className="text-lg font-semibold text-warning-800">تنبيه: أصناف تحتاج إعادة تموين</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventoryItems
              .filter(item => item.status === 'low-stock' || item.status === 'out-of-stock')
              .map(item => (
                <div key={item.id} className="bg-white p-4 rounded-lg border border-warning-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                      {item.status === 'low-stock' ? 'منخفض' : 'نفد'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    متبقي: {item.currentStock} {item.unit}
                  </p>
                  <p className="text-sm text-gray-600">
                    الحد الأدنى: {item.minimumStock} {item.unit}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;