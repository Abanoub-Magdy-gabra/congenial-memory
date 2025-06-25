import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Star, Home, Building } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface CustomerAddressManagerProps {
  customerId?: string;
  onAddressSelect: (address: any) => void;
  selectedAddress?: any;
}

const CustomerAddressManager: React.FC<CustomerAddressManagerProps> = ({ 
  customerId, 
  onAddressSelect, 
  selectedAddress 
}) => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState<any>({
    type: 'home',
    is_default: false
  });

  useEffect(() => {
    if (customerId) {
      fetchAddresses();
    }
  }, [customerId]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', customerId)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (err) {
      toast.error('خطأ في تحميل العناوين');
    } finally {
      setLoading(false);
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'work': return <Building className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const addAddress = async () => {
    if (!newAddress.label || !newAddress.street || !newAddress.area) {
      toast.error('يرجى ملء الحقول المطلوبة');
      return;
    }

    try {
      // If this is set as default, update other addresses
      if (newAddress.is_default) {
        await supabase
          .from('customer_addresses')
          .update({ is_default: false })
          .eq('customer_id', customerId);
      }

      const { data, error } = await supabase
        .from('customer_addresses')
        .insert({
          customer_id: customerId,
          label: newAddress.label,
          type: newAddress.type,
          street: newAddress.street,
          area: newAddress.area,
          building: newAddress.building,
          floor: newAddress.floor,
          apartment: newAddress.apartment,
          landmark: newAddress.landmark,
          is_default: newAddress.is_default
        })
        .select()
        .single();

      if (error) throw error;

      setAddresses(prev => [...prev, data]);
      setNewAddress({ type: 'home', is_default: false });
      setShowAddForm(false);
      toast.success('تم إضافة العنوان بنجاح');
    } catch (err) {
      toast.error('خطأ في إضافة العنوان');
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    try {
      // Update all addresses to not default
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('customer_id', customerId);

      // Set the selected address as default
      await supabase
        .from('customer_addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      setAddresses(prev => prev.map(addr => ({
        ...addr,
        is_default: addr.id === addressId
      })));

      toast.success('تم تعيين العنوان الافتراضي');
    } catch (err) {
      toast.error('خطأ في تعيين العنوان الافتراضي');
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      toast.success('تم حذف العنوان');
    } catch (err) {
      toast.error('خطأ في حذف العنوان');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">عناوين العميل</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary text-sm"
        >
          <Plus className="h-4 w-4 ml-1" />
          إضافة عنوان
        </button>
      </div>

      <div className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            onClick={() => onAddressSelect(address)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedAddress?.id === address.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {getAddressIcon(address.type)}
                  <span className="font-medium text-gray-900 mr-2">{address.label}</span>
                  {address.is_default && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{address.street}</p>
                  <p>{address.area}</p>
                  {address.building && (
                    <p>مبنى {address.building}
                      {address.floor && `, الطابق ${address.floor}`}
                      {address.apartment && `, شقة ${address.apartment}`}
                    </p>
                  )}
                  {address.landmark && (
                    <p className="text-gray-500">علامة مميزة: {address.landmark}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                {!address.is_default && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDefaultAddress(address.id);
                    }}
                    className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                    title="تعيين كافتراضي"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAddress(address.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إضافة عنوان جديد</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تسمية العنوان</label>
                <input
                  type="text"
                  value={newAddress.label || ''}
                  onChange={(e) => setNewAddress((prev: any) => ({ ...prev, label: e.target.value }))}
                  className="input-field"
                  placeholder="مثل: المنزل، العمل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع العنوان</label>
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress((prev: any) => ({ ...prev, type: e.target.value }))}
                  className="input-field"
                >
                  <option value="home">منزل</option>
                  <option value="work">عمل</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الشارع *</label>
                <input
                  type="text"
                  value={newAddress.street || ''}
                  onChange={(e) => setNewAddress((prev: any) => ({ ...prev, street: e.target.value }))}
                  className="input-field"
                  placeholder="اسم الشارع والرقم"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المنطقة *</label>
                <input
                  type="text"
                  value={newAddress.area || ''}
                  onChange={(e) => setNewAddress((prev: any) => ({ ...prev, area: e.target.value }))}
                  className="input-field"
                  placeholder="اسم المنطقة"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المبنى</label>
                  <input
                    type="text"
                    value={newAddress.building || ''}
                    onChange={(e) => setNewAddress((prev: any) => ({ ...prev, building: e.target.value }))}
                    className="input-field"
                    placeholder="رقم المبنى"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الطابق</label>
                  <input
                    type="text"
                    value={newAddress.floor || ''}
                    onChange={(e) => setNewAddress((prev: any) => ({ ...prev, floor: e.target.value }))}
                    className="input-field"
                    placeholder="رقم الطابق"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الشقة</label>
                  <input
                    type="text"
                    value={newAddress.apartment || ''}
                    onChange={(e) => setNewAddress((prev: any) => ({ ...prev, apartment: e.target.value }))}
                    className="input-field"
                    placeholder="رقم الشقة"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">علامة مميزة</label>
                <input
                  type="text"
                  value={newAddress.landmark || ''}
                  onChange={(e) => setNewAddress((prev: any) => ({ ...prev, landmark: e.target.value }))}
                  className="input-field"
                  placeholder="مثل: بجوار المسجد، أمام المدرسة"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newAddress.is_default || false}
                  onChange={(e) => setNewAddress((prev: any) => ({ ...prev, is_default: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ml-2"
                />
                <label className="text-sm text-gray-700">تعيين كعنوان افتراضي</label>
              </div>
            </div>

            <div className="flex space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewAddress({ type: 'home', is_default: false });
                }}
                className="flex-1 btn-secondary"
              >
                إلغاء
              </button>
              <button
                onClick={addAddress}
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

export default CustomerAddressManager;