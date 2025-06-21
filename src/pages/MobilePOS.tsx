import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, Check, X, Filter, Grid, List, Star, Clock, Siren as Fire, Heart, Calculator, CreditCard, Banknote, Smartphone, User, MapPin, Truck, Home, Package } from 'lucide-react';
import { useMenuItems, useCustomers, useOrders, useTables, useDeliveryZones } from '../hooks/useSupabase';
import MobileButton from '../components/MobileButton';
import MobileInput from '../components/MobileInput';
import MobileCard from '../components/MobileCard';
import MobileModal from '../components/MobileModal';
import MobileSwipeableCard from '../components/MobileSwipeableCard';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  notes?: string;
  preparation_time: number;
}

const MobilePOS = () => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [selectedTable, setSelectedTable] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');
  const [processing, setProcessing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Hooks
  const { menuItems, categories, loading: menuLoading } = useMenuItems();
  const { searchCustomer } = useCustomers();
  const { createOrder } = useOrders();
  const { tables } = useTables();

  // Validation functions
  const validatePhone = (phone: string): string | null => {
    if (!phone) return null;
    if (!/^01[0-9]{9}$/.test(phone)) {
      return 'رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقم';
    }
    return null;
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
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    toast.success(`تم إضافة ${item.name}`, {
      icon: '🛒',
      duration: 2000,
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
    toast.success('تم حذف الصنف', { icon: '🗑️', duration: 2000 });
  };

  const clearCart = () => {
    setCart([]);
    setShowCart(false);
    toast.success('تم مسح الطلب', { icon: '🧹', duration: 2000 });
  };

  const handleSearchCustomer = async () => {
    if (!customerPhone) return;
    
    try {
      const customer = await searchCustomer(customerPhone);
      if (customer) {
        setCustomerInfo(customer);
        toast.success(`مرحباً ${customer.name}!`, { icon: '👋' });
      } else {
        setCustomerInfo(null);
        toast.error('العميل غير موجود');
      }
    } catch (error) {
      toast.error('خطأ في البحث عن العميل');
    }
  };

  const processOrder = async () => {
    if (!validateOrder()) return;

    setProcessing(true);
    try {
      const orderData = {
        customer_id: customerInfo?.id || null,
        table_id: orderType === 'dine-in' ? selectedTable : null,
        order_type: orderType,
        subtotal,
        total_amount: total,
        payment_method: paymentMethod,
        estimated_time: estimatedTime,
        items: cart
      };

      await createOrder(orderData);
      
      // Reset form
      setCart([]);
      setShowCheckout(false);
      setCustomerPhone('');
      setCustomerInfo(null);
      setSelectedTable('');
      
      toast.success('تم تأكيد الطلب بنجاح! 🎉', {
        duration: 3000,
      });
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      
    } catch (error) {
      toast.error('خطأ في إنشاء الطلب');
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

    if ((orderType === 'delivery' || orderType === 'takeaway') && !customerInfo) {
      toast.error('يرجى إدخال بيانات العميل');
      return false;
    }

    return true;
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.14;
  const total = subtotal + tax;
  const estimatedTime = Math.max(...cart.map(item => item.preparation_time), 0);

  if (menuLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل القائمة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Order Type Selector */}
      <MobileCard>
        <div className="grid grid-cols-3 gap-2">
          <MobileButton
            variant={orderType === 'dine-in' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setOrderType('dine-in')}
            icon={Coffee}
            fullWidth
          >
            داخل المطعم
          </MobileButton>
          <MobileButton
            variant={orderType === 'takeaway' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setOrderType('takeaway')}
            icon={Package}
            fullWidth
          >
            تيك أواي
          </MobileButton>
          <MobileButton
            variant={orderType === 'delivery' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setOrderType('delivery')}
            icon={Truck}
            fullWidth
          >
            ديليفري
          </MobileButton>
        </div>
      </MobileCard>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex space-x-2 space-x-reverse">
          <div className="flex-1">
            <MobileInput
              placeholder="البحث في القائمة..."
              value={searchTerm}
              onChange={setSearchTerm}
              icon={Search}
              clearable
            />
          </div>
          <MobileButton
            variant="secondary"
            size="md"
            onClick={() => setShowFilters(true)}
            icon={Filter}
          />
          <MobileButton
            variant="secondary"
            size="md"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            icon={viewMode === 'grid' ? List : Grid}
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-2">
          <MobileButton
            variant={selectedCategory === 'الكل' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('الكل')}
            className="whitespace-nowrap"
          >
            الكل ({menuItems.length})
          </MobileButton>
          {categories.map((category) => (
            <MobileButton
              key={category.id}
              variant={selectedCategory === category.name ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(category.name)}
              className="whitespace-nowrap"
            >
              {category.name} ({menuItems.filter(item => item.category?.name === category.name).length})
            </MobileButton>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <MobileCard
              key={item.id}
              className="relative overflow-hidden"
              interactive
              onClick={() => addToCart(item)}
            >
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
                {item.is_popular && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Fire className="h-3 w-3 mr-1" />
                    الأكثر طلباً
                  </span>
                )}
                {item.is_vegetarian && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    نباتي
                  </span>
                )}
              </div>

              {/* Image placeholder */}
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative">
                <span className="text-gray-400 text-sm">صورة</span>
                <MobileButton
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e?.stopPropagation();
                    addToCart(item);
                  }}
                  icon={Plus}
                  className="absolute bottom-2 right-2 w-8 h-8 p-0"
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary-600 font-bold text-lg">
                    {item.price} ج.م
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.preparation_time}د
                  </div>
                </div>
              </div>
            </MobileCard>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <MobileSwipeableCard
              key={item.id}
              rightActions={[
                {
                  id: 'add',
                  label: 'إضافة',
                  icon: Plus,
                  color: 'green',
                  onClick: () => addToCart(item)
                }
              ]}
            >
              <div className="p-4 flex items-center space-x-3 space-x-reverse">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 text-xs">صورة</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 space-x-reverse mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    {item.is_popular && <Fire className="h-4 w-4 text-red-500 flex-shrink-0" />}
                    {item.is_vegetarian && <Heart className="h-4 w-4 text-green-500 flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-bold text-lg">
                      {item.price} ج.م
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {item.preparation_time} دقيقة
                    </div>
                  </div>
                </div>
                
                <MobileButton
                  variant="primary"
                  size="sm"
                  onClick={() => addToCart(item)}
                  icon={Plus}
                  className="w-10 h-10 p-0 flex-shrink-0"
                />
              </div>
            </MobileSwipeableCard>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أصناف</h3>
          <p className="text-gray-500">لا توجد أصناف تطابق البحث المحدد</p>
        </div>
      )}

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-40">
          <MobileButton
            variant="primary"
            size="lg"
            onClick={() => setShowCart(true)}
            fullWidth
            className="shadow-2xl"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 ml-2" />
                <span>عرض الطلب ({cart.length})</span>
              </div>
              <span className="font-bold">{total.toFixed(0)} ج.م</span>
            </div>
          </MobileButton>
        </div>
      )}

      {/* Cart Modal */}
      <MobileModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        title="الطلب الحالي"
        size="full"
      >
        <div className="space-y-4">
          {cart.map((item) => (
            <MobileSwipeableCard
              key={item.id}
              rightActions={[
                {
                  id: 'delete',
                  label: 'حذف',
                  icon: Trash2,
                  color: 'red',
                  onClick: () => removeFromCart(item.id)
                }
              ]}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <span className="text-lg font-bold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} ج.م
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <MobileButton
                      variant="secondary"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      icon={Minus}
                      className="w-8 h-8 p-0"
                    />
                    <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                    <MobileButton
                      variant="primary"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      icon={Plus}
                      className="w-8 h-8 p-0"
                    />
                  </div>
                  
                  <span className="text-sm text-gray-600">{item.price} ج.م للقطعة</span>
                </div>
              </div>
            </MobileSwipeableCard>
          ))}

          {/* Order Summary */}
          <MobileCard>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span>{subtotal.toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>ضريبة القيمة المضافة (14%):</span>
                <span>{tax.toFixed(2)} ج.م</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>الإجمالي:</span>
                  <span className="text-primary-600">{total.toFixed(2)} ج.م</span>
                </div>
              </div>
              {estimatedTime > 0 && (
                <div className="flex items-center justify-center text-sm text-gray-600 pt-2">
                  <Clock className="h-4 w-4 ml-1" />
                  <span>وقت التحضير المتوقع: {estimatedTime} دقيقة</span>
                </div>
              )}
            </div>
          </MobileCard>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <MobileButton
              variant="secondary"
              onClick={clearCart}
              icon={Trash2}
              fullWidth
            >
              مسح الطلب
            </MobileButton>
            <MobileButton
              variant="primary"
              onClick={() => {
                setShowCart(false);
                setShowCheckout(true);
              }}
              icon={Check}
              fullWidth
            >
              متابعة الدفع
            </MobileButton>
          </div>
        </div>
      </MobileModal>

      {/* Checkout Modal */}
      <MobileModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="إتمام الطلب"
        size="full"
      >
        <div className="space-y-6">
          {/* Order Type Specific Fields */}
          {orderType === 'dine-in' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">الطاولة *</label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">اختر الطاولة</option>
                {tables.filter(t => t.status === 'available').map((table) => (
                  <option key={table.id} value={table.id}>
                    طاولة {table.number} ({table.capacity} أشخاص)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Customer Info */}
          {(orderType === 'delivery' || orderType === 'takeaway') && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم هاتف العميل *
                </label>
                <div className="flex space-x-2 space-x-reverse">
                  <MobileInput
                    placeholder="01xxxxxxxxx"
                    value={customerPhone}
                    onChange={setCustomerPhone}
                    type="tel"
                    validation={validatePhone}
                    className="flex-1"
                    inputMode="tel"
                  />
                  <MobileButton
                    variant="primary"
                    onClick={handleSearchCustomer}
                    icon={Search}
                    disabled={!customerPhone}
                  />
                </div>
              </div>
              
              {customerInfo && (
                <MobileCard variant="filled">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{customerInfo.name}</h4>
                      <p className="text-sm text-gray-600">{customerInfo.total_orders} طلب سابق</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 ml-1" />
                        <span className="text-sm font-medium">{customerInfo.loyalty_points} نقطة</span>
                      </div>
                    </div>
                  </div>
                </MobileCard>
              )}
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">طريقة الدفع</label>
            <div className="grid grid-cols-3 gap-3">
              <MobileButton
                variant={paymentMethod === 'cash' ? 'primary' : 'secondary'}
                onClick={() => setPaymentMethod('cash')}
                icon={Banknote}
                size="lg"
                className="flex-col h-20"
              >
                نقدي
              </MobileButton>
              <MobileButton
                variant={paymentMethod === 'card' ? 'primary' : 'secondary'}
                onClick={() => setPaymentMethod('card')}
                icon={CreditCard}
                size="lg"
                className="flex-col h-20"
              >
                بطاقة
              </MobileButton>
              <MobileButton
                variant={paymentMethod === 'digital' ? 'primary' : 'secondary'}
                onClick={() => setPaymentMethod('digital')}
                icon={Smartphone}
                size="lg"
                className="flex-col h-20"
              >
                محفظة
              </MobileButton>
            </div>
          </div>

          {/* Order Summary */}
          <MobileCard variant="elevated">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">ملخص الطلب</h3>
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span>{subtotal.toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>ضريبة القيمة المضافة (14%):</span>
                <span>{tax.toFixed(2)} ج.م</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>الإجمالي:</span>
                  <span className="text-primary-600">{total.toFixed(2)} ج.م</span>
                </div>
              </div>
            </div>
          </MobileCard>

          {/* Submit Button */}
          <MobileButton
            variant="primary"
            size="lg"
            onClick={processOrder}
            loading={processing}
            disabled={processing}
            fullWidth
            icon={Check}
          >
            {processing ? 'جاري المعالجة...' : 'تأكيد الطلب'}
          </MobileButton>
        </div>
      </MobileModal>

      {/* Filters Modal */}
      <MobileModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="تصفية القائمة"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">الفئات</h4>
            <div className="space-y-2">
              {['الكل', ...categories.map(c => c.name)].map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mr-3"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3 space-x-reverse">
            <MobileButton
              variant="secondary"
              onClick={() => setShowFilters(false)}
              fullWidth
            >
              إلغاء
            </MobileButton>
            <MobileButton
              variant="primary"
              onClick={() => setShowFilters(false)}
              fullWidth
            >
              تطبيق
            </MobileButton>
          </div>
        </div>
      </MobileModal>
    </div>
  );
};

export default MobilePOS;