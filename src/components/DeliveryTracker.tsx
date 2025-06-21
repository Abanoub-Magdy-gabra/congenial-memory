import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, User, Navigation, CheckCircle } from 'lucide-react';

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
}

interface DeliveryTrackerProps {
  orders: DeliveryOrder[];
  onStatusUpdate: (orderId: string, status: DeliveryOrder['status']) => void;
}

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({ orders, onStatusUpdate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'preparing': return 'جاري التحضير';
      case 'ready': return 'جاهز للتوصيل';
      case 'out-for-delivery': return 'في الطريق';
      case 'delivered': return 'تم التوصيل';
      default: return 'غير معروف';
    }
  };

  const getElapsedTime = (orderTime: Date) => {
    const diff = currentTime.getTime() - orderTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}س ${minutes % 60}د`;
    }
    return `${minutes}د`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">متابعة طلبات التوصيل</h3>
      
      <div className="space-y-4">
        {orders.filter(order => order.status !== 'delivered').map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">طلب #{order.id}</h4>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Clock className="h-4 w-4 ml-1" />
                  <span>منذ {getElapsedTime(order.orderTime)}</span>
                </div>
              </div>
              
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 text-gray-400 ml-2" />
                <span className="font-medium">{order.customerName}</span>
                <Phone className="h-4 w-4 text-gray-400 mr-3 ml-1" />
                <span>{order.customerPhone}</span>
              </div>
              
              <div className="flex items-start text-sm">
                <MapPin className="h-4 w-4 text-gray-400 ml-2 mt-0.5" />
                <span className="text-gray-600">{order.address}</span>
              </div>

              {order.driverName && (
                <div className="flex items-center text-sm">
                  <Navigation className="h-4 w-4 text-gray-400 ml-2" />
                  <span>السائق: {order.driverName}</span>
                  {order.driverPhone && (
                    <>
                      <Phone className="h-4 w-4 text-gray-400 mr-3 ml-1" />
                      <span>{order.driverPhone}</span>
                    </>
                  )}
                </div>
              )}

              <div className="text-sm font-medium text-gray-900">
                المبلغ: {order.total} ج.م
              </div>
            </div>

            <div className="flex space-x-2 space-x-reverse">
              {order.status === 'preparing' && (
                <button
                  onClick={() => onStatusUpdate(order.id, 'ready')}
                  className="btn-primary text-sm py-2 px-4"
                >
                  جاهز للتوصيل
                </button>
              )}
              
              {order.status === 'ready' && (
                <button
                  onClick={() => onStatusUpdate(order.id, 'out-for-delivery')}
                  className="btn-primary text-sm py-2 px-4"
                >
                  خرج للتوصيل
                </button>
              )}
              
              {order.status === 'out-for-delivery' && (
                <button
                  onClick={() => onStatusUpdate(order.id, 'delivered')}
                  className="btn-success text-sm py-2 px-4"
                >
                  <CheckCircle className="h-4 w-4 ml-1" />
                  تم التوصيل
                </button>
              )}

              <button className="btn-secondary text-sm py-2 px-4">
                <Phone className="h-4 w-4 ml-1" />
                اتصال
              </button>
            </div>
          </div>
        ))}
      </div>

      {orders.filter(order => order.status !== 'delivered').length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات توصيل</h3>
          <p className="text-gray-500">جميع طلبات التوصيل تم تسليمها</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracker;