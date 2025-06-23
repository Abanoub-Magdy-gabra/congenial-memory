import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Receipt, User, Percent, Calculator, ShoppingCart, Clock, Star, Filter, Grid, List, Smartphone, Wifi, Save, Edit, X, Check, AlertCircle, Coffee, Utensils, Package, MapPin, Truck, Home, MessageSquare, Zap, Heart, Siren as Fire, Volume2, VolumeX, Sparkles, TrendingUp, Award, Target } from 'lucide-react';
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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  
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
  const { tables, loading: tablesLoading } = useTables();
  const { data: deliveryZones } = useDeliveryZones();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Sound effects
  const playSound = (type: 'add' | 'remove' | 'success' | 'error') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'add':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
        break;
      case 'remove':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1);
        break;
      case 'success':
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        break;
      case 'error':
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        break;
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

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
    
    playSound('add');
    toast.success(`تم إضافة ${item.name} إلى الطلب`, {
      icon: '🛒',
      style: {
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
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
    playSound('remove');
    toast.success('تم حذف الصنف من الطلب', {
      icon: '🗑️',
      style: {
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
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
    playSound('remove');
    toast.success('تم مسح الطلب', {
      icon: '🧹',
      style: {
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #6b7280, #4b5563)',
        color: '#fff',
      },
    });
  };

  const processOrder = async () => {
    if (!validateOrder()) return;

    setProcessing(true);
    try {
      const loyaltyPointsEarned = Math.floor(total / 10);
      
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

      await createOrder(orderData);
      clearCart();
      playSound('success');
      toast.success('تم تأكيد الطلب بنجاح! 🎉', {
        style: {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#fff',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        },
      });
    } catch (error) {
      playSound('error');
      console.error('Error creating order:', error);
    } finally {
      setProcessing(false);
    }
  };

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

  const handleSearchCustomer = async (phone: string) => {
    if (!phone) return;
    
    const customer = await searchCustomer(phone);
    if (customer) {
      setCustomerInfo(customer);
      toast.success(`مرحباً ${customer.name}! لديك ${customer.loyalty_points} نقطة ولاء`, {
        icon: '👋',
        style: {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
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
  const tax = (subtotal - discountAmount + deliveryFee) * 0.14;
  const total = subtotal - discountAmount + deliveryFee + tax;

  const totalPreparationTime = Math.max(...cart.map(item => item.preparation_time));
  const estimatedDeliveryTime = orderType === 'delivery' && selectedDeliveryZone 
    ? totalPreparationTime + selectedDeliveryZone.estimated_time 
    : totalPreparationTime;

  if (menuLoading || tablesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="relative">
            <div className="loading-spinner mx-auto mb-4"></div>
            <div className="absolute inset-0 loading-spinner mx-auto mb-4 animate-ping opacity-20"></div>
          </div>
          <p className="text-gray-600 text-lg">جاري تحميل البيانات...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
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

  return (
    <div className="flex h-full gap-6 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Menu Section */}
      <div className="flex-1 space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between fade-in">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="glass-effect rounded-3xl p-6 text-right relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-purple-600/10"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-primary-600 ml-2" />
                  <span className="text-sm text-gray-500">الوقت الحالي</span>
                </div>
                <div className="text-3xl font-bold gradient-text mb-1">
                  {currentTime.toLocaleTimeString('ar-EG', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-sm text-gray-600">
                  {currentTime.toLocaleDateString('ar-EG')}
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-effect rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-primary-600">{cart.length}</div>
                <div className="text-xs text-gray-500">أصناف</div>
              </div>
              <div className="glass-effect rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{total.toFixed(0)}</div>
                <div className="text-xs text-gray-500">ج.م</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                soundEnabled 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
            
            {/* View Mode Toggle */}
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-3 glass-effect rounded-2xl hover:shadow-lg transition-all duration-300 group"
            >
              {viewMode === 'grid' ? 
                <List className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" /> : 
                <Grid className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              }
            </button>
            
            {/* Order Type Selector */}
            <div className="flex items-center space-x-2 space-x-reverse glass-effect rounded-3xl p-2">
              <button
                onClick={() => setOrderType('dine-in')}
                className={`flex items-center px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  orderType === 'dine-in' 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Coffee className="h-4 w-4 ml-1" />
                داخل المطعم
              </button>
              <button
                onClick={() => setOrderType('takeaway')}
                className={`flex items-center px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  orderType === 'takeaway' 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Package className="h-4 w-4 ml-1" />
                تيك أواي
              </button>
              <button
                onClick={() => setOrderType('delivery')}
                className={`flex items-center px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  orderType === 'delivery' 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Truck className="h-4 w-4 ml-1" />
                ديليفري
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Categories */}
        <div className="space-y-6 slide-in-left">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <input
              type="text"
              placeholder="البحث عن صنف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-4 glass-effect rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg font-medium placeholder-gray-400 transition-all duration-300 hover:shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('الكل')}
              className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden ${
                selectedCategory === 'الكل'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105'
                  : 'glass-effect text-gray-700 hover:shadow-lg hover:scale-105'
              }`}
            >
              <Grid className="h-5 w-5 ml-2" />
              الكل
              <span className="mr-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                {menuItems.length}
              </span>
              {selectedCategory === 'الكل' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
              )}
            </button>
            {categories.map((category) => {
              const categoryCount = menuItems.filter(item => item.category?.name === category.name).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden ${
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
                  <span className="mr-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                    {categoryCount}
                  </span>
                  {selectedCategory === category.name && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Enhanced Menu Items */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="menu-item-card group relative"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Special badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-1 z-10">
                  {item.is_popular && (
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-lg">
                      <Fire className="h-3 w-3 ml-1" />
                      الأكثر طلباً
                    </div>
                  )}
                  {item.is_vegetarian && (
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-lg">
                      <Heart className="h-3 w-3 ml-1" />
                      نباتي
                    </div>
                  )}
                </div>
                
                {/* Image placeholder with enhanced design */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 rounded-3xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:shadow-inner transition-all duration-300">
                  <span className="text-gray-400 text-sm">صورة</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Quick add button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="absolute bottom-3 right-3 w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                  
                  {/* Dietary indicators */}
                  <div className="absolute bottom-2 left-2 flex space-x-1 space-x-reverse">
                    {item.is_spicy && (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg" title="حار">
                        <Fire className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-primary-600 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-bold text-lg">{item.price} ج.م</span>
                    <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-xl">
                      <Clock className="h-3 w-3 ml-1" />
                      {item.preparation_time}د
                    </div>
                  </div>

                  {/* Rating stars (placeholder) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-xs text-gray-500 mr-1">(4.8)</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                      +12%
                    </div>
                  </div>
                </div>

                {/* Hover effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-3xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="glass-effect rounded-3xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 flex items-center group relative overflow-hidden"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center ml-6 group-hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <span className="text-gray-400 text-xs">صورة</span>
                  {item.is_popular && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-bold text-gray-900 ml-3 group-hover:text-primary-600 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      {item.is_popular && <Fire className="h-4 w-4 text-red-500" />}
                      {item.is_vegetarian && <Heart className="h-4 w-4 text-green-500" />}
                      {item.is_spicy && <Fire className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-bold text-lg">{item.price} ج.م</span>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-xl">
                        <Clock className="h-3 w-3 ml-1" />
                        {item.preparation_time} دقيقة
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-110"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
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

      {/* Enhanced Cart Section */}
      <div className="w-96 glass-effect rounded-3xl p-6 space-y-6 flex flex-col h-full slide-in-right relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-purple-600/5 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="h-6 w-6 ml-2 text-primary-600" />
              الطلب الحالي
              {cart.length > 0 && (
                <span className="bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center mr-2 animate-bounce">
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
                onClick={clearCart}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
                title="مسح الطلب"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Order Type Specific Fields */}
          <div className="space-y-4 mt-4">
            {orderType === 'dine-in' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الطاولة</label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full input-field"
                >
                  <option value="">اختر الطاولة</option>
                  {tables && tables.filter(table => table.status === 'available').map((table) => (
                    <option key={table.id} value={table.id}>طاولة {table.number}</option>
                  ))}
                </select>
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
                    <button className="mt-2 text-sm bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center">
                      <Zap className="h-4 w-4 ml-1" />
                      استخدام نقاط الولاء
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Cart Items */}
          <div className="flex-1 space-y-3 overflow-y-auto max-h-64 custom-scrollbar mt-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">لا يوجد أصناف في الطلب</p>
                <p className="text-gray-400 text-sm mt-2">ابدأ بإضافة الأصناف من القائمة</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
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

          {/* Enhanced Order Summary */}
          <div className="space-y-4 pt-4 border-t border-gray-200 mt-4">
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
            <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200">
              <span>الإجمالي:</span>
              <span className="text-primary-600">
                {total.toFixed(2)} ج.م
              </span>
            </div>
            
            {cart.length > 0 && (
              <div className="flex items-center justify-center text-sm text-gray-600 pt-2 bg-gray-50 rounded-xl p-3">
                <Clock className="h-4 w-4 ml-1" />
                <span>
                  وقت التحضير المتوقع: {estimatedDeliveryTime} دقيقة
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Payment Method */}
          <div className="space-y-3 mt-4">
            <label className="block text-sm font-semibold text-gray-700">طريقة الدفع</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                  paymentMethod === 'cash'
                    ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-lg scale-105'
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
                    ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-lg scale-105'
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
                    ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-lg scale-105'
                    : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                }`}
              >
                <Smartphone className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">محفظة</span>
              </button>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="space-y-3 mt-4">
            <button
              onClick={processOrder}
              disabled={cart.length === 0 || processing}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg py-4 shadow-xl hover:shadow-2xl relative overflow-hidden"
            >
              {processing ? (
                <>
                  <div className="loading-spinner h-5 w-5 ml-2"></div>
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 ml-2" />
                  تأكيد الطلب
                  <Sparkles className="h-4 w-4 mr-2" />
                </>
              )}
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={cart.length === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Receipt className="h-4 w-4 ml-1" />
                طباعة
              </button>
              <button
                disabled={cart.length === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Save className="h-4 w-4 ml-1" />
                حفظ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">إضافة ملاحظات</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ملاحظات للصنف
                </label>
                <textarea
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  className="input-field"
                  rows={4}
                  placeholder="مثال: بدون بصل، حار إضافي، إلخ..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => setShowNotesModal(false)}
                className="flex-1 btn-secondary"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  setCart(cart.map(item => 
                    item.id === selectedItemForNotes
                      ? { ...item, notes: itemNotes }
                      : item
                  ));
                  setShowNotesModal(false);
                  toast.success('تم حفظ الملاحظات');
                }}
                className="flex-1 btn-primary"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {showSMSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">إرسال رسالة نصية</h2>
              <button
                onClick={() => setShowSMSModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <SMSNotificationManager onSendSMS={() => {
              setShowSMSModal(false);
              toast.success('تم إرسال الرسالة بنجاح');
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;