import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Gift,
  Star,
  Eye,
  Download,
  Upload,
  UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  birthDate?: Date;
  joinDate: Date;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastVisit?: Date;
  notes?: string;
  status: 'active' | 'inactive';
  category: 'regular' | 'vip' | 'new';
}

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Sample customers data
  const customers: Customer[] = [
    {
      id: '1',
      name: 'أحمد محمد علي',
      phone: '01234567890',
      email: 'ahmed.mohamed@email.com',
      address: 'شارع النيل، المعادي، القاهرة',
      birthDate: new Date('1985-05-15'),
      joinDate: new Date('2024-01-15'),
      totalOrders: 45,
      totalSpent: 2250,
      loyaltyPoints: 225,
      lastVisit: new Date('2024-12-14'),
      status: 'active',
      category: 'vip',
      notes: 'عميل مميز، يفضل الطلبات الحارة'
    },
    {
      id: '2',
      name: 'فاطمة حسن',
      phone: '01098765432',
      email: 'fatma.hassan@email.com',
      address: 'شارع الجمهورية، وسط البلد، القاهرة',
      joinDate: new Date('2024-03-20'),
      totalOrders: 28,
      totalSpent: 1400,
      loyaltyPoints: 140,
      lastVisit: new Date('2024-12-13'),
      status: 'active',
      category: 'regular'
    },
    {
      id: '3',
      name: 'محمد أحمد',
      phone: '01555123456',
      joinDate: new Date('2024-11-01'),
      totalOrders: 3,
      totalSpent: 150,
      loyaltyPoints: 15,
      lastVisit: new Date('2024-12-10'),
      status: 'active',
      category: 'new'
    },
    {
      id: '4',
      name: 'سارة علي',
      phone: '01777888999',
      email: 'sara.ali@email.com',
      address: 'شارع التحرير، الدقي، الجيزة',
      birthDate: new Date('1992-08-22'),
      joinDate: new Date('2024-02-10'),
      totalOrders: 67,
      totalSpent: 3350,
      loyaltyPoints: 335,
      lastVisit: new Date('2024-12-15'),
      status: 'active',
      category: 'vip'
    },
    {
      id: '5',
      name: 'خالد محمود',
      phone: '01666555444',
      joinDate: new Date('2024-01-05'),
      totalOrders: 12,
      totalSpent: 600,
      loyaltyPoints: 60,
      lastVisit: new Date('2024-11-20'),
      status: 'inactive',
      category: 'regular'
    }
  ];

  const categoryOptions = [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'new', label: 'عملاء جدد' },
    { value: 'regular', label: 'عملاء عاديون' },
    { value: 'vip', label: 'عملاء مميزون' }
  ];

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'active', label: 'نشط' },
    { value: 'inactive', label: 'غير نشط' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'regular': return 'bg-blue-100 text-blue-800';
      case 'new': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'vip': return 'مميز';
      case 'regular': return 'عادي';
      case 'new': return 'جديد';
      default: return 'غير محدد';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || customer.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const deleteCustomer = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      toast.success('تم حذف العميل بنجاح');
    }
  };

  const exportCustomers = () => {
    toast.success('تم تصدير بيانات العملاء بنجاح');
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.category === 'vip').length,
    new: customers.filter(c => c.category === 'new').length,
    totalSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
          <p className="text-gray-600">متابعة وإدارة قاعدة بيانات العملاء</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button
            onClick={exportCustomers}
            className="btn-secondary"
          >
            <Download className="h-4 w-4 ml-2" />
            تصدير البيانات
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة عميل جديد
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">إجمالي العملاء</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">عملاء نشطون</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.vip}</div>
          <div className="text-sm text-gray-600">عملاء مميزون</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          <div className="text-sm text-gray-600">عملاء جدد</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{stats.totalSpent.toLocaleString()}</div>
          <div className="text-sm text-gray-600">إجمالي الإنفاق (ج.م)</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.avgOrderValue.toFixed(0)}</div>
          <div className="text-sm text-gray-600">متوسط قيمة الطلب (ج.م)</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="البحث بالاسم أو الهاتف أو البريد الإلكتروني..."
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
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
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
        </div>
      </div>

      {/* Customers Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  معلومات الاتصال
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفئة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إحصائيات الطلبات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نقاط الولاء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آخر زيارة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {customer.name.split(' ')[0].charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">
                          عضو منذ {customer.joinDate.toLocaleDateString('ar-EG')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Phone className="h-4 w-4 text-gray-400 ml-2" />
                        {customer.phone}
                      </div>
                      {customer.email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 text-gray-400 ml-2" />
                          {customer.email}
                        </div>
                      )}
                      {customer.address && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 text-gray-400 ml-2" />
                          <span className="truncate max-w-xs">{customer.address}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(customer.category)}`}>
                      {customer.category === 'vip' && <Star className="h-3 w-3 ml-1" />}
                      {customer.category === 'new' && <UserPlus className="h-3 w-3 ml-1" />}
                      {getCategoryText(customer.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{customer.totalOrders} طلب</div>
                      <div className="text-gray-500">{customer.totalSpent.toLocaleString()} ج.م</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Gift className="h-4 w-4 text-yellow-500 ml-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {customer.loyaltyPoints} نقطة
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.lastVisit ? customer.lastVisit.toLocaleDateString('ar-EG') : 'لم يزر بعد'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button className="text-primary-600 hover:text-primary-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingCustomer(customer)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عملاء</h3>
            <p className="text-gray-500">لا توجد عملاء تطابق المعايير المحددة</p>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">إضافة عميل جديد</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="الاسم الكامل"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="01xxxxxxxxx"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="example@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ الميلاد
                </label>
                <input
                  type="date"
                  className="input-field"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="العنوان الكامل"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ملاحظات
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="ملاحظات إضافية عن العميل..."
                ></textarea>
              </div>
            </div>
            
            <div className="flex space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 btn-secondary"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  toast.success('تم إضافة العميل بنجاح');
                }}
                className="flex-1 btn-primary"
              >
                إضافة العميل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;