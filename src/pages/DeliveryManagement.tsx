import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  User,
  Navigation,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  MessageSquare
} from 'lucide-react';
import DeliveryTracker from '../components/DeliveryTracker';
import SMSNotificationManager from '../components/SMSNotificationManager';
import toast from 'react-hot-toast';

interface DeliveryOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  status: 'preparing' | 'ready' | 'out-for-delivery' | 'delivered';
  estimatedTime: number;
  driverName?: string;
  driverPhone?: string;
  orderTime: Date;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  deliveryZone: string;
  deliveryFee: number;
  notes?: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  currentOrders: number;
  totalDeliveries: number;
  rating: number;
}

const DeliveryManagement = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'drivers' | 'zones' | 'sms'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample delivery orders
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([
    {
      id: 'DEL-001',
      customerName: 'أحمد محمد',
      customerPhone: '01234567890',
      address: 'شارع النيل، المعادي، مبنى 15، شقة 301',
      status: 'preparing',
      estimatedTime: 30,
      orderTime: new Date(Date.now() - 10 * 60 * 1000),
      total: 245,
      items: [
        { name: 'شاورما دجاج', quantity: 2, price: 15 },
        { name: 'عصير برتقال', quantity: 1, price: 8 }
      ],
      deliveryZone: 'المنطقة الأولى',
      deliveryFee: 15,
      notes: 'بجوار مسجد النور'
    },
    {
      id: 'DEL-002',
      customerName: 'فاطمة علي',
      customerPhone: '01098765432',
      address: 'شارع التحرير، الدقي، برج النيل، الطابق 10',
      status: 'out-for-delivery',
      estimatedTime: 20,
      driverName: 'محمد أحمد',
      driverPhone: '01555123456',
      orderTime: new Date(Date.now() - 45 * 60 * 1000),
      total: 180,
      items: [
        { name: 'بيتزا مارجريتا', quantity: 1, price: 35 },
        { name: 'كوكاكولا', quantity: 2, price: 5 }
      ],
      deliveryZone: 'المنطقة الثانية',
      deliveryFee: 20
    },
    {
      id: 'DEL-003',
      customerName: 'سارة حسن',
      customerPhone: '01777888999',
      address: 'شارع الجمهورية، مدينة نصر، مبنى 25',
      status: 'ready',
      estimatedTime: 45,
      orderTime: new Date(Date.now() - 25 * 60 * 1000),
      total: 320,
      items: [
        { name: 'برجر لحم', quantity: 2, price: 25 },
        { name: 'بطاطس مقلية', quantity: 2, price: 10 }
      ],
      deliveryZone: 'المنطقة الثالثة',
      deliveryFee: 25
    }
  ]);

  // Sample drivers
  const [drivers] = useState<Driver[]>([
    {
      id: '1',
      name: 'محمد أحمد',
      phone: '01555123456',
      status: 'busy',
      currentOrders: 2,
      totalDeliveries: 156,
      rating: 4.8
    },
    {
      id: '2',
      name: 'أحمد علي',
      phone: '01666789012',
      status: 'available',
      currentOrders: 0,
      totalDeliveries: 89,
      rating: 4.6
    },
    {
      id: '3',
      name: 'خالد محمود',
      phone: '01777456789',
      status: 'available',
      currentOrders: 1,
      totalDeliveries: 203,
      rating: 4.9
    },
    {
      id: '4',
      name: 'عمر حسن',
      phone: '01888321654',
      status: 'offline',
      currentOrders: 0,
      totalDeliveries: 45,
      rating: 4.3
    }
  ]);

  const updateOrderStatus = (orderId: string, newStatus: DeliveryOrder['status']) => {
    setDeliveryOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success('تم تحديث حالة الطلب');
  };

  const assignDriver = (orderId: string, driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      setDeliveryOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, driverName: driver.name, driverPhone: driver.phone }
          : order
      ));
      toast.success(`تم تعيين السائق ${driver.name}`);
    }
  };

  const getStatusColor = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDriverStatusColor = (status: Driver['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = deliveryOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendSMS = (phone: string, message: string, orderId: string) => {
    console.log('Sending SMS:', { phone, message, orderId });
    toast.success('تم إرسال الرسالة النصية');
  };

  const stats = {
    total: deliveryOrders.length,
    preparing: deliveryOrders.filter(o => o.status === 'preparing').length,
    ready: deliveryOrders.filter(o => o.status === 'ready').length,
    outForDelivery: deliveryOrders.filter(o => o.status === 'out-for-delivery').length,
    delivered: deliveryOrders.filter(o => o.status === 'delivered').length,
    availableDrivers: drivers.filter(d => d.status === 'available').length,
    busyDrivers: drivers.filter(d => d.status === 'busy').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة التوصيل</h1>
          <p className="text-gray-600">متابعة وإدارة طلبات التوصيل والسائقين</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button className="btn-secondary">
            <Plus className="h-4 w-4 ml-2" />
            إضافة سائق
          </button>
          <button className="btn-primary">
            <Truck className="h-4 w-4 ml-2" />
            طلب توصيل جديد
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">إجمالي الطلبات</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.preparing}</div>
          <div className="text-sm text-gray-600">جاري التحضير</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.ready}</div>
          <div className="text-sm text-gray-600">جاهز</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.outForDelivery}</div>
          <div className="text-sm text-gray-600">في الطريق</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          <div className="text-sm text-gray-600">تم التوصيل</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.availableDrivers}</div>
          <div className="text-sm text-gray-600">سائقين متاحين</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.busyDrivers}</div>
          <div className="text-sm text-gray-600">سائقين مشغولين</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 space-x-reverse">
          {[
            { id: 'orders', name: 'طلبات التوصيل', icon: Truck },
            { id: 'drivers', name: 'السائقين', icon: User },
            { id: 'zones', name: 'مناطق التوصيل', icon: MapPin },
            { id: 'sms', name: 'الرسائل النصية', icon: MessageSquare }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 ml-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="البحث في الطلبات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="preparing">جاري التحضير</option>
                <option value="ready">جاهز</option>
                <option value="out-for-delivery">في الطريق</option>
                <option value="delivered">تم التوصيل</option>
              </select>

              <button className="btn-secondary">
                <Filter className="h-4 w-4 ml-2" />
                فلتر متقدم
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">طلب {order.id}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Clock className="h-4 w-4 ml-1" />
                      <span>منذ {Math.floor((Date.now() - order.orderTime.getTime()) / (1000 * 60))} دقيقة</span>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status === 'preparing' && 'جاري التحضير'}
                    {order.status === 'ready' && 'جاهز للتوصيل'}
                    {order.status === 'out-for-delivery' && 'في الطريق'}
                    {order.status === 'delivered' && 'تم التوصيل'}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">معلومات العميل</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 ml-2" />
                        <span>{order.customerName}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 ml-2" />
                        <span>{order.customerPhone}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 ml-2 mt-0.5" />
                        <span className="text-gray-600">{order.address}</span>
                      </div>
                      {order.notes && (
                        <div className="text-gray-500">
                          <strong>ملاحظات:</strong> {order.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">تفاصيل الطلب</h4>
                    <div className="space-y-1 text-sm">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span>{(item.quantity * item.price).toFixed(2)} ج.م</span>
                        </div>
                      ))}
                      <div className="border-t pt-1 mt-2">
                        <div className="flex justify-between">
                          <span>رسوم التوصيل:</span>
                          <span>{order.deliveryFee} ج.م</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>الإجمالي:</span>
                          <span>{order.total} ج.م</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver & Actions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">السائق والإجراءات</h4>
                    {order.driverName ? (
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center">
                          <Navigation className="h-4 w-4 text-gray-400 ml-2" />
                          <span>{order.driverName}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 ml-2" />
                          <span>{order.driverPhone}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <select className="w-full input-field text-sm">
                          <option value="">اختر سائق</option>
                          {drivers.filter(d => d.status === 'available').map(driver => (
                            <option key={driver.id} value={driver.id}>
                              {driver.name} - {driver.currentOrders} طلب
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="space-y-2">
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="w-full btn-primary text-sm py-2"
                        >
                          جاهز للتوصيل
                        </button>
                      )}
                      
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'out-for-delivery')}
                          className="w-full btn-primary text-sm py-2"
                        >
                          خرج للتوصيل
                        </button>
                      )}
                      
                      {order.status === 'out-for-delivery' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="w-full btn-success text-sm py-2"
                        >
                          <CheckCircle className="h-4 w-4 ml-1" />
                          تم التوصيل
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <button className="btn-secondary text-sm py-2">
                          <Phone className="h-4 w-4 ml-1" />
                          اتصال
                        </button>
                        <button className="btn-secondary text-sm py-2">
                          <MessageSquare className="h-4 w-4 ml-1" />
                          رسالة
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات توصيل</h3>
              <p className="text-gray-500">لا توجد طلبات تطابق المعايير المحددة</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'drivers' && (
        <div className="space-y-6">
          {/* Drivers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver) => (
              <div key={driver.id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center ml-3">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{driver.name}</h3>
                      <p className="text-sm text-gray-600">{driver.phone}</p>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDriverStatusColor(driver.status)}`}>
                    {driver.status === 'available' && 'متاح'}
                    {driver.status === 'busy' && 'مشغول'}
                    {driver.status === 'offline' && 'غير متصل'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">الطلبات الحالية:</span>
                    <span className="font-medium">{driver.currentOrders}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">إجمالي التوصيلات:</span>
                    <span className="font-medium">{driver.totalDeliveries}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">التقييم:</span>
                    <div className="flex items-center">
                      <span className="font-medium ml-1">{driver.rating}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${
                              star <= driver.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 space-x-reverse mt-4">
                  <button className="flex-1 btn-secondary text-sm py-2">
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </button>
                  <button className="flex-1 btn-secondary text-sm py-2">
                    <Phone className="h-4 w-4 ml-1" />
                    اتصال
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'zones' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">مناطق التوصيل</h3>
            <p className="text-gray-600">إدارة مناطق التوصيل ورسوم كل منطقة</p>
            {/* Zone management content would go here */}
          </div>
        </div>
      )}

      {activeTab === 'sms' && (
        <div className="space-y-6">
          <SMSNotificationManager onSendSMS={handleSendSMS} />
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement;