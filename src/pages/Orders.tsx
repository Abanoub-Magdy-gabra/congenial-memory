import React, { useState } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Printer,
  Filter,
  Search,
  Calendar,
  MapPin,
  User,
  Phone
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  table: string;
  customer?: string;
  phone?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    notes?: string;
  }>;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  total: number;
  createdAt: Date;
  estimatedTime?: number;
  paymentMethod: 'cash' | 'card';
  notes?: string;
}

const Orders = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Sample orders data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      table: 'طاولة 5',
      customer: 'أحمد محمد',
      phone: '01234567890',
      items: [
        { name: 'شاورما دجاج', quantity: 2, price: 15 },
        { name: 'عصير برتقال', quantity: 1, price: 8 },
        { name: 'سلطة خضراء', quantity: 1, price: 8 }
      ],
      status: 'preparing',
      orderType: 'dine-in',
      total: 46,
      createdAt: new Date('2024-12-15T10:30:00'),
      estimatedTime: 15,
      paymentMethod: 'cash',
      notes: 'بدون بصل في الشاورما'
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      table: 'تيك أواي',
      customer: 'فاطمة علي',
      phone: '01098765432',
      items: [
        { name: 'بيتزا مارجريتا', quantity: 1, price: 35 },
        { name: 'كوكاكولا', quantity: 2, price: 5 }
      ],
      status: 'ready',
      orderType: 'takeaway',
      total: 45,
      createdAt: new Date('2024-12-15T10:25:00'),
      paymentMethod: 'card'
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      table: 'طاولة 2',
      items: [
        { name: 'برجر لحم', quantity: 1, price: 25 },
        { name: 'بطاطس مقلية', quantity: 1, price: 10 },
        { name: 'شاي', quantity: 1, price: 3 }
      ],
      status: 'served',
      orderType: 'dine-in',
      total: 38,
      createdAt: new Date('2024-12-15T10:20:00'),
      paymentMethod: 'cash'
    },
    {
      id: '4',
      orderNumber: 'ORD-004',
      table: 'ديليفري',
      customer: 'محمد حسن',
      phone: '01555123456',
      items: [
        { name: 'كنافة', quantity: 2, price: 12 },
        { name: 'قهوة تركي', quantity: 2, price: 7 }
      ],
      status: 'pending',
      orderType: 'delivery',
      total: 38,
      createdAt: new Date('2024-12-15T10:35:00'),
      estimatedTime: 30,
      paymentMethod: 'cash',
      notes: 'العنوان: شارع الجمهورية، المعادي'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'جميع الطلبات', color: 'gray' },
    { value: 'pending', label: 'في الانتظار', color: 'yellow' },
    { value: 'preparing', label: 'جاري التحضير', color: 'blue' },
    { value: 'ready', label: 'جاهز', color: 'green' },
    { value: 'served', label: 'تم التقديم', color: 'gray' },
    { value: 'cancelled', label: 'ملغي', color: 'red' }
  ];

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'dine-in', label: 'داخل المطعم' },
    { value: 'takeaway', label: 'تيك أواي' },
    { value: 'delivery', label: 'ديليفري' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'served': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'preparing': return <Clock className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'served': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dine-in': return <MapPin className="h-4 w-4" />;
      case 'takeaway': return <User className="h-4 w-4" />;
      case 'delivery': return <Phone className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesType = selectedType === 'all' || order.orderType === selectedType;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.table.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = order.createdAt.toISOString().split('T')[0] === selectedDate;
    
    return matchesStatus && matchesType && matchesSearch && matchesDate;
  });

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // Update order status logic here
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  const printOrder = (order: Order) => {
    // Print order logic here
    console.log('Printing order:', order);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-gray-600">متابعة وإدارة جميع طلبات المطعم</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <span className="text-sm text-gray-500">إجمالي الطلبات اليوم:</span>
          <span className="text-lg font-bold text-primary-600">{filteredOrders.length}</span>
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
              placeholder="البحث برقم الطلب أو اسم العميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

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

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  {getTypeIcon(order.orderType)}
                  <span className="mr-1">{order.table}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="mr-1">
                    {statusOptions.find(s => s.value === order.status)?.label}
                  </span>
                </span>
                {order.estimatedTime && (
                  <p className="text-xs text-gray-500 mt-1">
                    متبقي: {order.estimatedTime} دقيقة
                  </p>
                )}
              </div>
            </div>

            {/* Customer Info */}
            {order.customer && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 ml-2" />
                    <span className="text-sm font-medium">{order.customer}</span>
                  </div>
                  {order.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 ml-1" />
                      <span className="text-sm text-gray-600">{order.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{(item.quantity * item.price).toFixed(2)} ج.م</span>
                </div>
              ))}
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>ملاحظات:</strong> {order.notes}
                </p>
              </div>
            )}

            {/* Order Footer */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">
                  {order.createdAt.toLocaleTimeString('ar-EG', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {order.total.toFixed(2)} ج.م
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 space-x-reverse">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    بدء التحضير
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    className="flex-1 btn-success text-sm py-2"
                  >
                    جاهز
                  </button>
                )}
                {order.status === 'ready' && order.orderType === 'dine-in' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'served')}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    تم التقديم
                  </button>
                )}
                <button
                  onClick={() => printOrder(order)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
          <p className="text-gray-500">لا توجد طلبات تطابق المعايير المحددة</p>
        </div>
      )}
    </div>
  );
};

export default Orders;