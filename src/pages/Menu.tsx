import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  Upload,
  Download,
  Star,
  Flame,
  Heart,
  Clock,
  DollarSign,
  Package,
  Grid,
  List,
  MoreVertical,
  Copy,
  Archive
} from 'lucide-react';
import { useMenuItems } from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';
import MenuItemForm from '../components/MenuItemForm';
import MobileButton from '../components/MobileButton';
import MobileInput from '../components/MobileInput';
import MobileCard from '../components/MobileCard';
import MobileModal from '../components/MobileModal';
import MobileSwipeableCard from '../components/MobileSwipeableCard';
import toast from 'react-hot-toast';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  const { menuItems, categories, loading, error, refetch } = useMenuItems();

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'الكل' || item.category?.name === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = showUnavailable || item.is_available;
    
    return matchesCategory && matchesSearch && matchesAvailability;
  });

  const handleSaveItem = async (itemData: any) => {
    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('تم تحديث الصنف بنجاح');
      } else {
        // Create new item
        const { error } = await supabase
          .from('menu_items')
          .insert(itemData);

        if (error) throw error;
        toast.success('تم إضافة الصنف بنجاح');
      }

      setShowAddModal(false);
      setEditingItem(null);
      refetch();
    } catch (error) {
      console.error('Error saving menu item:', error);
      throw error;
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(currentStatus ? 'تم إخفاء الصنف' : 'تم إظهار الصنف');
      refetch();
    } catch (error) {
      toast.error('خطأ في تحديث حالة الصنف');
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصنف؟')) return;

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('تم حذف الصنف بنجاح');
      refetch();
    } catch (error) {
      toast.error('خطأ في حذف الصنف');
    }
  };

  const duplicateItem = async (item: any) => {
    try {
      const { id, created_at, updated_at, ...itemData } = item;
      const duplicatedItem = {
        ...itemData,
        name: `${item.name} (نسخة)`,
        name_en: item.name_en ? `${item.name_en} (Copy)` : null
      };

      const { error } = await supabase
        .from('menu_items')
        .insert(duplicatedItem);

      if (error) throw error;
      
      toast.success('تم نسخ الصنف بنجاح');
      refetch();
    } catch (error) {
      toast.error('خطأ في نسخ الصنف');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedItems.length === 0) return;

    try {
      switch (bulkAction) {
        case 'delete':
          if (!confirm(`هل أنت متأكد من حذف ${selectedItems.length} صنف؟`)) return;
          
          const { error: deleteError } = await supabase
            .from('menu_items')
            .delete()
            .in('id', selectedItems);

          if (deleteError) throw deleteError;
          toast.success(`تم حذف ${selectedItems.length} صنف`);
          break;

        case 'hide':
          const { error: hideError } = await supabase
            .from('menu_items')
            .update({ is_available: false })
            .in('id', selectedItems);

          if (hideError) throw hideError;
          toast.success(`تم إخفاء ${selectedItems.length} صنف`);
          break;

        case 'show':
          const { error: showError } = await supabase
            .from('menu_items')
            .update({ is_available: true })
            .in('id', selectedItems);

          if (showError) throw showError;
          toast.success(`تم إظهار ${selectedItems.length} صنف`);
          break;
      }

      setSelectedItems([]);
      setBulkAction('');
      refetch();
    } catch (error) {
      toast.error('خطأ في تنفيذ العملية');
    }
  };

  const exportMenu = async () => {
    try {
      const csvContent = [
        ['الاسم', 'الوصف', 'السعر', 'الفئة', 'متاح', 'وقت التحضير'].join(','),
        ...filteredItems.map(item => [
          item.name,
          item.description,
          item.price,
          item.category?.name || '',
          item.is_available ? 'نعم' : 'لا',
          item.preparation_time
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'menu_items.csv';
      link.click();
      
      toast.success('تم تصدير القائمة بنجاح');
    } catch (error) {
      toast.error('خطأ في تصدير القائمة');
    }
  };

  const stats = {
    total: menuItems.length,
    available: menuItems.filter(item => item.is_available).length,
    unavailable: menuItems.filter(item => !item.is_available).length,
    popular: menuItems.filter(item => item.is_popular).length,
    vegetarian: menuItems.filter(item => item.is_vegetarian).length,
    categories: categories.length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل القائمة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">خطأ في تحميل القائمة</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <MobileButton onClick={refetch} variant="primary">
          إعادة المحاولة
        </MobileButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة قائمة الطعام</h1>
          <p className="text-gray-600">إدارة أصناف الطعام والمشروبات</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <MobileButton
            variant="secondary"
            onClick={exportMenu}
            icon={Download}
          >
            تصدير
          </MobileButton>
          <MobileButton
            variant="primary"
            onClick={() => setShowAddModal(true)}
            icon={Plus}
          >
            إضافة صنف
          </MobileButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <MobileCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">إجمالي الأصناف</div>
          </div>
        </MobileCard>

        <MobileCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-gray-600">متاح</div>
          </div>
        </MobileCard>

        <MobileCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.unavailable}</div>
            <div className="text-sm text-gray-600">غير متاح</div>
          </div>
        </MobileCard>

        <MobileCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.popular}</div>
            <div className="text-sm text-gray-600">الأكثر طلباً</div>
          </div>
        </MobileCard>

        <MobileCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.vegetarian}</div>
            <div className="text-sm text-gray-600">نباتي</div>
          </div>
        </MobileCard>

        <MobileCard>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.categories}</div>
            <div className="text-sm text-gray-600">فئة</div>
          </div>
        </MobileCard>
      </div>

      {/* Filters and Search */}
      <MobileCard>
        <div className="space-y-4">
          <div className="flex space-x-2 space-x-reverse">
            <div className="flex-1">
              <MobileInput
                placeholder="البحث في الأصناف..."
                value={searchTerm}
                onChange={setSearchTerm}
                icon={Search}
                clearable
              />
            </div>
            <MobileButton
              variant="secondary"
              onClick={() => setShowFilters(true)}
              icon={Filter}
            />
            <MobileButton
              variant="secondary"
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
            {categories.map((category) => {
              const categoryCount = menuItems.filter(item => item.category?.name === category.name).length;
              return (
                <MobileButton
                  key={category.id}
                  variant={selectedCategory === category.name ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className="whitespace-nowrap"
                >
                  {category.name} ({categoryCount})
                </MobileButton>
              );
            })}
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-3 space-x-reverse p-3 bg-blue-50 rounded-xl">
              <span className="text-sm font-medium text-blue-900">
                تم تحديد {selectedItems.length} صنف
              </span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="text-sm border border-blue-200 rounded-lg px-2 py-1"
              >
                <option value="">اختر إجراء</option>
                <option value="show">إظهار</option>
                <option value="hide">إخفاء</option>
                <option value="delete">حذف</option>
              </select>
              <MobileButton
                variant="primary"
                size="sm"
                onClick={handleBulkAction}
                disabled={!bulkAction}
              >
                تطبيق
              </MobileButton>
              <MobileButton
                variant="secondary"
                size="sm"
                onClick={() => setSelectedItems([])}
              >
                إلغاء
              </MobileButton>
            </div>
          )}
        </div>
      </MobileCard>

      {/* Menu Items */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MobileCard key={item.id} className="relative">
              {/* Selection checkbox */}
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems(prev => [...prev, item.id]);
                    } else {
                      setSelectedItems(prev => prev.filter(id => id !== item.id));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              {/* Badges */}
              <div className="absolute top-3 right-3 flex flex-col space-y-1 z-10">
                {item.is_popular && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Flame className="h-3 w-3 mr-1" />
                    الأكثر طلباً
                  </span>
                )}
                {item.is_vegetarian && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    نباتي
                  </span>
                )}
                {!item.is_available && (
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                    غير متاح
                  </span>
                )}
              </div>

              {/* Image placeholder */}
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400">صورة</span>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                  {item.name_en && (
                    <p className="text-sm text-gray-500">{item.name_en}</p>
                  )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-primary-600 font-bold text-xl">{item.price} ج.م</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {item.preparation_time}د
                  </div>
                </div>

                {item.calories && (
                  <p className="text-xs text-gray-500">{item.calories} سعرة حرارية</p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{item.category?.name}</span>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    {item.is_spicy && <Flame className="h-4 w-4 text-red-500" />}
                    {item.allergens && item.allergens.length > 0 && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        حساسية
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <MobileButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingItem(item)}
                    icon={Edit}
                  >
                    تعديل
                  </MobileButton>
                  <MobileButton
                    variant={item.is_available ? 'warning' : 'success'}
                    size="sm"
                    onClick={() => toggleAvailability(item.id, item.is_available)}
                    icon={item.is_available ? EyeOff : Eye}
                  >
                    {item.is_available ? 'إخفاء' : 'إظهار'}
                  </MobileButton>
                  <MobileButton
                    variant="danger"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                    icon={Trash2}
                  >
                    حذف
                  </MobileButton>
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
              leftActions={[
                {
                  id: 'edit',
                  label: 'تعديل',
                  icon: Edit,
                  color: 'blue',
                  onClick: () => setEditingItem(item)
                },
                {
                  id: 'duplicate',
                  label: 'نسخ',
                  icon: Copy,
                  color: 'green',
                  onClick: () => duplicateItem(item)
                }
              ]}
              rightActions={[
                {
                  id: 'toggle',
                  label: item.is_available ? 'إخفاء' : 'إظهار',
                  icon: item.is_available ? EyeOff : Eye,
                  color: item.is_available ? 'yellow' : 'green',
                  onClick: () => toggleAvailability(item.id, item.is_available)
                },
                {
                  id: 'delete',
                  label: 'حذف',
                  icon: Trash2,
                  color: 'red',
                  onClick: () => deleteItem(item.id)
                }
              ]}
            >
              <div className="p-4 flex items-center space-x-4 space-x-reverse">
                {/* Selection checkbox */}
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems(prev => [...prev, item.id]);
                    } else {
                      setSelectedItems(prev => prev.filter(id => id !== item.id));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                {/* Image */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 text-xs">صورة</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 space-x-reverse mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    {item.is_popular && <Flame className="h-4 w-4 text-red-500 flex-shrink-0" />}
                    {item.is_vegetarian && <Heart className="h-4 w-4 text-green-500 flex-shrink-0" />}
                    {item.is_spicy && <Flame className="h-4 w-4 text-red-500 flex-shrink-0" />}
                    {!item.is_available && (
                      <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
                        غير متاح
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-1 mb-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-bold text-lg">{item.price} ج.م</span>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.preparation_time}د
                      </div>
                      <span>{item.category?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </MobileSwipeableCard>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أصناف</h3>
          <p className="text-gray-500 mb-4">لا توجد أصناف تطابق معايير البحث المحددة</p>
          <MobileButton
            variant="primary"
            onClick={() => setShowAddModal(true)}
            icon={Plus}
          >
            إضافة أول صنف
          </MobileButton>
        </div>
      )}

      {/* Add/Edit Modal */}
      <MobileModal
        isOpen={showAddModal || !!editingItem}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'تعديل الصنف' : 'إضافة صنف جديد'}
        size="full"
      >
        <MenuItemForm
          item={editingItem}
          categories={categories}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          isEditing={!!editingItem}
        />
      </MobileModal>

      {/* Filters Modal */}
      <MobileModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="تصفية القائمة"
      >
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showUnavailable}
                onChange={(e) => setShowUnavailable(e.target.checked)}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span>عرض الأصناف غير المتاحة</span>
            </label>
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

export default Menu;