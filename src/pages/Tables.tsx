import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Coffee,
  Utensils,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrder?: {
    id: string;
    customerName?: string;
    startTime: Date;
    items: number;
    total: number;
  };
  location: 'indoor' | 'outdoor' | 'vip';
}

const Tables = () => {
  const [tables, setTables] = useState<Table[]>([
    {
      id: '1',
      number: 1,
      capacity: 4,
      status: 'occupied',
      currentOrder: {
        id: 'ORD-001',
        customerName: 'أحمد محمد',
        startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        items: 3,
        total: 245
      },
      location: 'indoor'
    },
    {
      id: '2',
      number: 2,
      capacity: 2,
      status: 'available',
      location: 'indoor'
    },
    {
      id: '3',
      number: 3,
      capacity: 6,
      status: 'reserved',
      location: 'indoor'
    },
    {
      id: '4',
      number: 4,
      capacity: 4,
      status: 'cleaning',
      location: 'indoor'
    },
    {
      id: '5',
      number: 5,
      capacity: 8,
      status: 'available',
      location: 'vip'
    },
    {
      id: '6',
      number: 6,
      capacity: 4,
      status: 'occupied',
      currentOrder: {
        id: 'ORD-002',
        startTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        items: 2,
        total: 180
      },
      location: 'outdoor'
    },
    {
      id: '7',
      number: 7,
      capacity: 2,
      status: 'available',
      location: 'outdoor'
    },
    {
      id: '8',
      number: 8,
      capacity: 4,
      status: 'available',
      location: 'outdoor'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied': return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cleaning': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Table['status']) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'occupied': return <Users className="h-4 w-4" />;
      case 'reserved': return <Clock className="h-4 w-4" />;
      case 'cleaning': return <XCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'متاحة';
      case 'occupied': return 'مشغولة';
      case 'reserved': return 'محجوزة';
      case 'cleaning': return 'تنظيف';
      default: return 'غير معروف';
    }
  };

  const getLocationIcon = (location: Table['location']) => {
    switch (location) {
      case 'indoor': return <Coffee className="h-4 w-4" />;
      case 'outdoor': return <MapPin className="h-4 w-4" />;
      case 'vip': return <Utensils className="h-4 w-4" />;
      default: return <Coffee className="h-4 w-4" />;
    }
  };

  const getLocationText = (location: Table['location']) => {
    switch (location) {
      case 'indoor': return 'داخلي';
      case 'outdoor': return 'خارجي';
      case 'vip': return 'VIP';
      default: return 'داخلي';
    }
  };

  const filteredTables = tables.filter(table => 
    selectedLocation === 'all' || table.location === selectedLocation
  );

  const updateTableStatus = (tableId: string, newStatus: Table['status']) => {
    setTables(tables.map(table => 
      table.id === tableId 
        ? { ...table, status: newStatus, currentOrder: newStatus === 'available' ? undefined : table.currentOrder }
        : table
    ));
    toast.success('تم تحديث حالة الطاولة');
  };

  const formatDuration = (startTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}س ${minutes % 60}د`;
    }
    return `${minutes}د`;
  };

  const stats = {
    total: tables.length,
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    cleaning: tables.filter(t => t.status === 'cleaning').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطاولات</h1>
          <p className="text-gray-600">متابعة وإدارة طاولات المطعم</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة طاولة جديدة
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">إجمالي الطاولات</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          <div className="text-sm text-gray-600">متاحة</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{stats.occupied}</div>
          <div className="text-sm text-gray-600">مشغولة</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.reserved}</div>
          <div className="text-sm text-gray-600">محجوزة</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.cleaning}</div>
          <div className="text-sm text-gray-600">تنظيف</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-sm font-medium text-gray-700">تصفية حسب المنطقة:</span>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">جميع المناطق</option>
            <option value="indoor">داخلي</option>
            <option value="outdoor">خارجي</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTables.map((table) => (
          <div
            key={table.id}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all hover:shadow-md ${getStatusColor(table.status)}`}
          >
            {/* Table Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center ml-3">
                  <span className="text-lg font-bold text-primary-600">
                    {table.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">طاولة {table.number}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    {getLocationIcon(table.location)}
                    <span className="mr-1">{getLocationText(table.location)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Table Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">السعة:</span>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 ml-1" />
                  <span className="text-sm font-medium">{table.capacity} أشخاص</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الحالة:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
                  {getStatusIcon(table.status)}
                  <span className="mr-1">{getStatusText(table.status)}</span>
                </span>
              </div>

              {/* Current Order Info */}
              {table.currentOrder && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">الطلب الحالي</span>
                    <span className="text-xs text-gray-500">
                      {formatDuration(table.currentOrder.startTime)}
                    </span>
                  </div>
                  {table.currentOrder.customerName && (
                    <p className="text-sm text-gray-600 mb-1">
                      العميل: {table.currentOrder.customerName}
                    </p>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{table.currentOrder.items} أصناف</span>
                    <span className="font-medium text-gray-900">
                      {table.currentOrder.total} ج.م
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              {table.status === 'available' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateTableStatus(table.id, 'occupied')}
                    className="btn-primary text-sm py-2"
                  >
                    احجز
                  </button>
                  <button
                    onClick={() => updateTableStatus(table.id, 'cleaning')}
                    className="btn-secondary text-sm py-2"
                  >
                    تنظيف
                  </button>
                </div>
              )}
              
              {table.status === 'occupied' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateTableStatus(table.id, 'available')}
                    className="btn-success text-sm py-2"
                  >
                    تحرير
                  </button>
                  <button className="btn-secondary text-sm py-2">
                    عرض الطلب
                  </button>
                </div>
              )}
              
              {table.status === 'reserved' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateTableStatus(table.id, 'occupied')}
                    className="btn-primary text-sm py-2"
                  >
                    وصل العميل
                  </button>
                  <button
                    onClick={() => updateTableStatus(table.id, 'available')}
                    className="btn-secondary text-sm py-2"
                  >
                    إلغاء الحجز
                  </button>
                </div>
              )}
              
              {table.status === 'cleaning' && (
                <button
                  onClick={() => updateTableStatus(table.id, 'available')}
                  className="w-full btn-success text-sm py-2"
                >
                  انتهى التنظيف
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">إضافة طاولة جديدة</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الطاولة
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="رقم الطاولة"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السعة (عدد الأشخاص)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="عدد الأشخاص"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المنطقة
                </label>
                <select className="input-field">
                  <option value="indoor">داخلي</option>
                  <option value="outdoor">خارجي</option>
                  <option value="vip">VIP</option>
                </select>
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
                  // Add table logic here
                  setShowAddModal(false);
                  toast.success('تم إضافة الطاولة بنجاح');
                }}
                className="flex-1 btn-primary"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;