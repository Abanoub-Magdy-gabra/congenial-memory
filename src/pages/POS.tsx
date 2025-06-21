import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Receipt, User, Percent, Calculator, ShoppingCart, Clock, Star, Filter, Grid, List, Smartphone, Wifi, Save, Edit, X, Check, AlertCircle, Coffee, Utensils, Package, MapPin, Truck, Home, MessageSquare, Zap, Heart, Siren as Fire } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMenuItems, useCustomers, useOrders, useTables, useDeliveryZones } from '../hooks/useSupabase';
import DeliveryZoneManager from '../components/DeliveryZoneManager';
import CustomerAddressManager from '../components/CustomerAddressManager';
import SMSNotificationManager from '../components/SMSNotificationManager';

interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  notes?: string;
  customizations?: Array<{
    name: string;
    price: number;
  }>;
  preparation_time: number;
}

const POS = () => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedItemForNotes, setSelectedItemForNotes] = useState<string | null>(null);
  const [itemNotes, setItemNotes] = useState('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [splitBill, setSplitBill] = useState(false);
  const [splitCount, setSplitCount] = useState(2);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Delivery & Takeaway specific states
  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  // Hooks
  const { menuItems, categories, loading: menuLoading, error: menuError } = useMenuItems();
  const { searchCustomer } = useCustomers();
  const { createOrder } = useOrders();
  const { tables } = useTables();
  const { data: deliveryZones } = useDeliveryZones();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('POS Component - Menu Items:', menuItems);
    console.log('POS Component - Categories:', categories);
    console.log('POS Component - Loading:', menuLoading);
    console.log('POS Component - Error:', menuError);
  }, [menuItems, categories, menuLoading, menuError]);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'الكل' || item.category?.name === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.is_available;
  });

  const addToCart = (item: any) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { 
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category?.name || '',
        quantity: 1,
        preparation_time: item.preparation_time
      }]);
    }
    toast.success(`تم إضافة ${item.name} إلى الطلب`, {
      icon: '🛒',
      style: {
        borderRadius: '12px',
        background: '#10b981',
        color: '#fff',
      },
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    toast.success('تم حذف الصنف من الطلب', {
      icon: '🗑️',
      style: {
        borderRadius: '12px',
        background: '#ef4444',
        color: '#fff',
      },
    });
  };

  const clearCart = () => {
    setCart([]);
    setSelectedTable('');
    setCustomerInfo(null);
    setCustomerPhone('');
    setDiscount(0);
    setSplitBill(false);
    setSelectedDeliveryZone(null);
    setSelectedAddress(null);
    setDeliveryInstructions('');
    setPickupTime('');
    toast.success('تم مسح الطلب', {
      icon: '🧹',
      style: {
        borderRadius: '12px',
        background: '#6b7280',
        color: '#fff',
      },
    });
  };

  const addItemNotes = (itemId: string, notes: string) => {
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, notes } : item
    ));
    setShowNotesModal(false);
    setSelectedItemForNotes(null);
    setItemNotes('');
    toast.success('تم إضافة الملاحظات');
  };

  const handleSearchCustomer = async (phone: string) => {
    if (!phone) return;
    
    const customer = await searchCustomer(phone);
    if (customer) {
      setCustomerInfo(customer);
      toast.success(`مرحباً ${customer.name}! لديك ${customer.loyalty_points} نقطة ولاء`, {
        icon: '👋',
        style: {
          borderRadius: '12px',
          background: '#3b82f6',
          color: '#fff',
        },
      });
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const customizationsTotal = item.customizations?.reduce((cSum, c) => cSum + c.price, 0) || 0;
    return sum + itemTotal + (customizationsTotal * item.quantity);
  }, 0);

  const discountAmount = discountType === 'percentage' 
    ? (subtotal * discount) / 100 
    : Math.min(discount, subtotal);

  const deliveryFee = orderType === 'delivery' && selectedDeliveryZone ? selectedDeliveryZone.delivery_fee : 0;
  const tax = (subtotal - discountAmount + deliveryFee) * 0.14; // 14% VAT in Egypt
  const total = subtotal - discountAmount + deliveryFee + tax;

  const totalPreparationTime = Math.max(...cart.map(item => item.preparation_time));
  const estimatedDeliveryTime = orderType === 'delivery' && selectedDeliveryZone 
    ? totalPreparationTime + selectedDeliveryZone.estimated_time 
    : totalPreparationTime;

  const validateOrder = () => {
    if (cart.length === 0) {
      toast.error('لا يوجد أصناف في الطلب');
      return false;
    }

    if (orderType === 'dine-in' && !selectedTable) {
      toast.error('يرجى اختيار الطاولة');
      return false;
    }

    if (orderType === 'delivery') {
      if (!selectedDeliveryZone) {
        toast.error('يرجى اختيار منطقة التوصيل');
        return false;
      }
      
      if (!selectedAddress) {
        toast.error('يرجى اختيار عنوان التوصيل');
        return false;
      }

      if (subtotal < selectedDeliveryZone.min_order_amount) {
        toast.error(`الحد الأدنى للطلب في هذه المنطقة ${selectedDeliveryZone.min_order_amount} ج.م`);
        return false;
      }

      if (!customerInfo) {
        toast.error('يرجى إدخال بيانات العميل للتوصيل');
        return false;
      }
    }

    if (orderType === 'takeaway' && !customerInfo) {
      toast.error('يرجى إدخال بيانات العميل للتيك أواي');
      return false;
    }

    return true;
  };

  const processOrder = async () => {
    if (!validateOrder()) return;

    try {
      const loyaltyPointsEarned = Math.floor(total / 10); // 1 point per 10 EGP
      
      const orderData = {
        customer_id: customerInfo?.id || null,
        table_id: orderType === 'dine-in' ? selectedTable : null,
        delivery_zone_id: selectedDeliveryZone?.id || null,
        address_id: selectedAddress?.id || null,
        order_type: orderType,
        subtotal,
        discount_amount: discountAmount,
        discount_type: discountType,
        delivery_fee: deliveryFee,
        tax_amount: tax,
        total_amount: splitBill ? total / splitCount : total,
        payment_method: paymentMethod,
        estimated_time: estimatedDeliveryTime,
        pickup_time: pickupTime || null,
        delivery_instructions: deliveryInstructions || null,
        notes: null,
        split_bill: splitBill,
        split_count: splitBill ? splitCount : 1,
        loyalty_points_used: 0,
        loyalty_points_earned: loyaltyPointsEarned,
        items: cart
      };

      const order = await createOrder(orderData);
      clearCart();
      toast.success('تم تأكيد الطلب بنجاح! 🎉', {
        style: {
          borderRadius: '12px',
          background: '#10b981',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const saveOrder = () => {
    if (cart.length === 0) {
      toast.error('لا يوجد أصناف في الطلب');
      return;
    }
    
    toast.success('تم حفظ الطلب كمسودة');
  };

  const printReceipt = () => {
    if (cart.length === 0) {
      toast.error('لا يوجد أصناف للطباعة');
      return;
    }
    window.print();
  };

  const applyLoyaltyDiscount = () => {
    if (customerInfo && customerInfo.loyalty_points >= 100) {
      const loyaltyDiscount = Math.floor(customerInfo.loyalty_points / 100) * 5; // 5 EGP per 100 points
      setDiscount(loyaltyDiscount);
      setDiscountType('fixed');
      toast.success(`تم تطبيق خصم الولاء: ${loyaltyDiscount} ج.م`);
    } else {
      toast.error('نقاط الولاء غير كافية للخصم');
    }
  };

  const handleSendSMS = (phone: string, message: string, orderId: string) => {
    console.log('Sending SMS:', { phone, message, orderId });
  };

  if (menuLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل قائمة الطعام...</p>
        </div>
      </div>
    );
  }

  if (menuError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">خطأ في تحميل البيانات</h3>
          <p className="text-gray-500 mb-4">{menuError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      </div>
    );
  }

  if (!menuItems.length && !categories.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد أصناف في القائمة</h3>
          <p className="text-gray-500">يرجى إضافة أصناف إلى قائمة الطعام أولاً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6">
      {/* Menu Section */}
      <div className="flex-1 space-y-6">
        {/* Header with Time and Quick Actions */}
        <div className="flex items-center justify-between fade-in">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="glass-effect rounded-2xl p-4 text-right">
              <div className="text-2xl font-bold gradient-text">
                {currentTime.toLocaleTimeString('ar-EG', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('ar-EG')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-3 glass-effect rounded-xl hover:shadow-lg transition-all duration-300 group"
            >
              {viewMode === 'grid' ? 
                <List className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" /> : 
                <Grid className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              }
            </button>
            
            <div className="flex items-center space-x-2 space-x-reverse glass-effect rounded-2xl p-2">
              <button
                onClick={() => setOrderType('dine-in')}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  orderType === 'dine-in' 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Coffee className="h-4 w-4 ml-1" />
                داخل المطعم
              </button>
              <button
                onClick={() => setOrderType('takeaway')}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  orderType === 'takeaway' 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Package className="h-4 w-4 ml-1" />
                تيك أواي
              </button>
              <button
                onClick={() => setOrderType('delivery')}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  orderType === 'delivery' 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Truck className="h-4 w-4 ml-1" />
                ديليفري
              </button>
            </div>
          </div>
        </div>

        {/* Search and Categories */}
        <div className="space-y-4 slide-in-left">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <input
              type="text"
              placeholder="البحث عن صنف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-4 glass-effect rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg font-medium placeholder-gray-400 transition-all duration-300"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('الكل')}
              className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                selectedCategory === 'الكل'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105'
                  : 'glass-effect text-gray-700 hover:shadow-lg hover:scale-105'
              }`}
            >
              <Grid className="h-5 w-5 ml-2" />
              الكل
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105'
                    : 'glass-effect text-gray-700 hover:shadow-lg hover:scale-105'
                }`}
              >
                {category.name === 'الوجبات الرئيسية' && <Utensils className="h-5 w-5 ml-2" />}
                {category.name === 'المشروبات' && <Coffee className="h-5 w-5 ml-2" />}
                {category.name === 'الحلويات' && <Star className="h-5 w-5 ml-2" />}
                {category.name === 'المقبلات' && <Package className="h-5 w-5 ml-2" />}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="menu-item-card group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {item.is_popular && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-lg">
                    <Fire className="h-3 w-3 ml-1" />
                    الأكثر طلباً
                  </div>
                )}
                
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:shadow-inner transition-all duration-300">
                  <span className="text-gray-400 text-sm">صورة</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-2 right-2 flex space-x-1 space-x-reverse">
                    {item.is_vegetarian && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg" title="نباتي">
                        <Heart className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {item.is_spicy && (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg" title="حار">
                        <Fire className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2 text-base group-hover:text-primary-600 transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-primary-600 font-bold text-lg">{item.price} ج.م</span>
                  <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                    <Clock className="h-3 w-3 ml-1" />
                    {item.preparation_time}د
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="glass-effect rounded-2xl p-4 cursor-pointer hover:shadow-xl transition-all duration-300 flex items-center group"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center ml-4 group-hover:shadow-lg transition-all duration-300">
                  <span className="text-gray-400 text-xs">صورة</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-bold text-gray-900 ml-3 group-hover:text-primary-600 transition-colors duration-300">
                      {item.name}
                    </h3>
                    {item.is_popular && <Fire className="h-4 w-4 text-red-500" />}
                    {item.is_vegetarian && <Heart className="h-4 w-4 text-green-500 mr-1" />}
                    {item.is_spicy && <Fire className="h-4 w-4 text-red-500 mr-1" />}
                  </div>
                  <p className="text-sm text-gray-500 mb-3 leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-bold text-lg">{item.price} ج.م</span>
                    <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                      <Clock className="h-3 w-3 ml-1" />
                      {item.preparation_time} دقيقة
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد أصناف</h3>
            <p className="text-gray-500">لا توجد أصناف تطابق البحث المحدد</p>
          </div>
        )}
      </div>

      {/* Cart Section */}
      <div className="w-96 glass-effect rounded-2xl p-6 space-y-6 flex flex-col h-full slide-in-right">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-6 w-6 ml-2 text-primary-600" />
            الطلب الحالي
            {cart.length > 0 && (
              <span className="bg-primary-600 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center mr-2">
                {cart.length}
              </span>
            )}
          </h2>
          <div className="flex items-center space-x-2 space-x-reverse">
            {orderType === 'delivery' && (
              <button
                onClick={() => setShowSMSModal(true)}
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-xl hover:bg-blue-50"
                title="إرسال رسالة نصية"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={saveOrder}
              className="p-2 text-gray-400 hover:text-green-500 transition-colors rounded-xl hover:bg-green-50"
              title="حفظ الطلب"
            >
              <Save className="h-5 w-5" />
            </button>
            <button
              onClick={clearCart}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
              title="مسح الطلب"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Order Type Specific Fields */}
        <div className="space-y-4">
          {orderType === 'dine-in' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">الطاولة</label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full input-field"
              >
                <option value="">اختر الطاولة</option>
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>طاولة {table.number}</option>
                ))}
              </select>
            </div>
          )}

          {orderType === 'delivery' && (
            <div className="space-y-4">
              <button
                onClick={() => setShowDeliveryModal(true)}
                className={`w-full p-4 border-2 rounded-2xl text-right transition-all duration-300 ${
                  selectedDeliveryZone 
                    ? 'border-primary-600 bg-primary-50 shadow-lg' 
                    : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {selectedDeliveryZone ? selectedDeliveryZone.name : 'اختر منطقة التوصيل'}
                    </div>
                    {selectedDeliveryZone && (
                      <div className="text-sm text-gray-600 mt-1">
                        رسوم التوصيل: {selectedDeliveryZone.delivery_fee} ج.م
                      </div>
                    )}
                  </div>
                  <MapPin className="h-6 w-6 text-gray-400" />
                </div>
              </button>

              {customerInfo && (
                <button
                  onClick={() => setShowAddressModal(true)}
                  className={`w-full p-4 border-2 rounded-2xl text-right transition-all duration-300 ${
                    selectedAddress 
                      ? 'border-primary-600 bg-primary-50 shadow-lg' 
                      : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {selectedAddress ? selectedAddress.label : 'اختر عنوان التوصيل'}
                      </div>
                      {selectedAddress && (
                        <div className="text-sm text-gray-600 mt-1">
                          {selectedAddress.street}, {selectedAddress.area}
                        </div>
                      )}
                    </div>
                    <Home className="h-6 w-6 text-gray-400" />
                  </div>
                </button>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  تعليمات التوصيل (اختياري)
                </label>
                <textarea
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  className="w-full input-field"
                  rows={2}
                  placeholder="تعليمات خاصة للسائق..."
                />
              </div>
            </div>
          )}

          {orderType === 'takeaway' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                وقت الاستلام المفضل (اختياري)
              </label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full input-field"
              />
            </div>
          )}

          {/* Customer Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              رقم هاتف العميل {orderType !== 'dine-in' && '*'}
            </label>
            <div className="flex space-x-2 space-x-reverse">
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                className="flex-1 input-field"
              />
              <button
                onClick={() => handleSearchCustomer(customerPhone)}
                className="px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
            
            {customerInfo && (
              <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-green-800">{customerInfo.name}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 ml-1" />
                    <span className="text-sm text-green-600">{customerInfo.loyalty_points} نقطة</span>
                  </div>
                </div>
                <p className="text-sm text-green-600">
                  {customerInfo.total_orders} طلب سابق
                </p>
                {customerInfo.loyalty_points >= 100 && (
                  <button
                    onClick={applyLoyaltyDiscount}
                    className="mt-2 text-sm bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center"
                  >
                    <Zap className="h-4 w-4 ml-1" />
                    استخدام نقاط الولاء
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 space-y-3 overflow-y-auto max-h-64">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لا يوجد أصناف في الطلب</p>
              <p className="text-gray-400 text-sm mt-2">ابدأ بإضافة الأصناف من القائمة</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.price} ج.م</p>
                    {item.notes && (
                      <p className="text-xs text-blue-600 mt-1 bg-blue-50 px-2 py-1 rounded-lg">
                        ملاحظة: {item.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedItemForNotes(item.id);
                      setItemNotes(item.notes || '');
                      setShowNotesModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-all duration-300 hover:scale-110"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 text-white flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-lg">
                      {(item.price * item.quantity).toFixed(2)} ج.م
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Discount Section */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">الخصم</label>
              <div className="flex space-x-2 space-x-reverse">
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                  className="flex-1 input-field"
                  placeholder="0"
                />
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                  className="w-20 input-field"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">ج.م</option>
                </select>
              </div>
            </div>
          </div>

          {/* Split Bill */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={splitBill}
                onChange={(e) => setSplitBill(e.target.checked)}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ml-2"
              />
              <span className="text-sm font-semibold text-gray-700">تقسيم الفاتورة</span>
            </label>
            
            {splitBill && (
              <select
                value={splitCount}
                onChange={(e) => setSplitCount(Number(e.target.value))}
                className="w-20 input-field text-sm"
              >
                {[2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">المجموع الفرعي:</span>
            <span className="font-semibold">{subtotal.toFixed(2)} ج.م</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-red-600">
              <span>الخصم:</span>
              <span>-{discountAmount.toFixed(2)} ج.م</span>
            </div>
          )}
          {deliveryFee > 0 && (
            <div className="flex justify-between text-sm text-blue-600">
              <span>رسوم التوصيل:</span>
              <span>{deliveryFee.toFixed(2)} ج.م</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">ضريبة القيمة المضافة (14%):</span>
            <span className="font-semibold">{tax.toFixed(2)} ج.م</span>
          </div>
          {splitBill && (
            <div className="flex justify-between text-sm text-blue-600">
              <span>مقسم على {splitCount}:</span>
              <span className="font-semibold">{(total / splitCount).toFixed(2)} ج.م لكل شخص</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200">
            <span>الإجمالي:</span>
            <span className="text-primary-600">
              {splitBill ? (total / splitCount).toFixed(2) : total.toFixed(2)} ج.م
            </span>
          </div>
          
          {cart.length > 0 && (
            <div className="flex items-center justify-center text-sm text-gray-600 pt-2 bg-gray-50 rounded-xl p-3">
              <Clock className="h-4 w-4 ml-1" />
              <span>
                وقت {orderType === 'delivery' ? 'التوصيل' : orderType === 'takeaway' ? 'الاستلام' : 'التحضير'} المتوقع: {estimatedDeliveryTime} دقيقة
              </span>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">طريقة الدفع</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                paymentMethod === 'cash'
                  ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-lg'
                  : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
              }`}
            >
              <Banknote className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">نقدي</span>
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                paymentMethod === 'card'
                  ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-lg'
                  : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
              }`}
            >
              <CreditCard className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">بطاقة</span>
            </button>
            <button
              onClick={() => setPaymentMethod('digital')}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                paymentMethod === 'digital'
                  ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-lg'
                  : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
              }`}
            >
              <Smartphone className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">محفظة</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={processOrder}
            disabled={cart.length === 0}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg py-4 shadow-xl hover:shadow-2xl"
          >
            <Check className="h-5 w-5 ml-2" />
            تأكيد الطلب
            {splitBill && ` (${(total / splitCount).toFixed(2)} ج.م)`}
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={printReceipt}
              disabled={cart.length === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Receipt className="h-4 w-4 ml-1" />
              طباعة
            </button>
            <button
              onClick={saveOrder}
              disabled={cart.length === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Save className="h-4 w-4 ml-1" />
              حفظ
            </button>
          </div>
        </div>
      </div>

      {/* Modals remain the same but with enhanced styling */}
      {/* Delivery Zone Modal */}
      {showDeliveryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">اختيار منطقة التوصيل</h3>
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <DeliveryZoneManager
              onZoneSelect={(zone) => {
                setSelectedDeliveryZone(zone);
                setShowDeliveryModal(false);
              }}
              selectedZone={selectedDeliveryZone}
            />
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && customerInfo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">اختيار عنوان التوصيل</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <CustomerAddressManager
              customerId={customerInfo.id}
              onAddressSelect={(address) => {
                setSelectedAddress(address);
                setShowAddressModal(false);
              }}
              selectedAddress={selectedAddress}
            />
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {showSMSModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">إرسال رسالة نصية</h3>
              <button
                onClick={() => setShowSMSModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <SMSNotificationManager onSendSMS={handleSendSMS} />
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">إضافة ملاحظات</h3>
            <textarea
              value={itemNotes}
              onChange={(e) => setItemNotes(e.target.value)}
              placeholder="أضف ملاحظات خاصة للصنف..."
              className="w-full input-field"
              rows={4}
            />
            <div className="flex space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => {
                  setShowNotesModal(false);
                  setSelectedItemForNotes(null);
                  setItemNotes('');
                }}
                className="flex-1 btn-secondary"
              >
                إلغاء
              </button>
              <button
                onClick={() => selectedItemForNotes && addItemNotes(selectedItemForNotes, itemNotes)}
                className="flex-1 btn-primary"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Receipt for Printing */}
      <div className="hidden print:block print-only">
        <div className="receipt">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold">مطعم الذوق الرفيع</h2>
            <p className="text-sm">123 شارع النيل، القاهرة</p>
            <p className="text-sm">تليفون: 01234567890</p>
            <hr className="my-2" />
          </div>
          
          <div className="mb-4">
            <p><strong>نوع الطلب:</strong> {
              orderType === 'dine-in' ? 'داخل المطعم' :
              orderType === 'takeaway' ? 'تيك أواي' : 'ديليفري'
            }</p>
            {selectedTable && <p><strong>الطاولة:</strong> {selectedTable}</p>}
            {customerInfo && <p><strong>العميل:</strong> {customerInfo.name}</p>}
            {selectedAddress && orderType === 'delivery' && (
              <div>
                <p><strong>عنوان التوصيل:</strong></p>
                <p className="text-sm">{selectedAddress.street}, {selectedAddress.area}</p>
                {selectedAddress.building && (
                  <p className="text-sm">مبنى {selectedAddress.building}
                    {selectedAddress.floor && `, الطابق ${selectedAddress.floor}`}
                    {selectedAddress.apartment && `, شقة ${selectedAddress.apartment}`}
                  </p>
                )}
              </div>
            )}
            {deliveryInstructions && (
              <p><strong>تعليمات التوصيل:</strong> {deliveryInstructions}</p>
            )}
            {pickupTime && (
              <p><strong>وقت الاستلام:</strong> {pickupTime}</p>
            )}
            <p><strong>التاريخ:</strong> {new Date().toLocaleDateString('ar-EG')}</p>
            <p><strong>الوقت:</strong> {new Date().toLocaleTimeString('ar-EG')}</p>
            <p><strong>طريقة الدفع:</strong> {
              paymentMethod === 'cash' ? 'نقدي' :
              paymentMethod === 'card' ? 'بطاقة' : 'محفظة إلكترونية'
            }</p>
          </div>

          <table className="w-full mb-4">
            <thead>
              <tr className="border-b">
                <th className="text-right">الصنف</th>
                <th className="text-center">الكمية</th>
                <th className="text-left">السعر</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.name}
                    {item.notes && <div className="text-xs text-gray-600">ملاحظة: {item.notes}</div>}
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-left">{(item.price * item.quantity).toFixed(2)} ج.م</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span>{subtotal.toFixed(2)} ج.م</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between">
                <span>الخصم:</span>
                <span>-{discountAmount.toFixed(2)} ج.م</span>
              </div>
            )}
            {deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>رسوم التوصيل:</span>
                <span>{deliveryFee.toFixed(2)} ج.م</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>ضريبة القيمة المضافة:</span>
              <span>{tax.toFixed(2)} ج.م</span>
            </div>
            {splitBill && (
              <div className="flex justify-between">
                <span>مقسم على {splitCount}:</span>
                <span>{(total / splitCount).toFixed(2)} ج.م</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t pt-1">
              <span>الإجمالي:</span>
              <span>{splitBill ? (total / splitCount).toFixed(2) : total.toFixed(2)} ج.م</span>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm">
              وقت {orderType === 'delivery' ? 'التوصيل' : orderType === 'takeaway' ? 'الاستلام' : 'التحضير'} المتوقع: {estimatedDeliveryTime} دقيقة
            </p>
            <p className="text-sm">شكراً لزيارتكم</p>
            <p className="text-sm">نتطلع لخدمتكم مرة أخرى</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;