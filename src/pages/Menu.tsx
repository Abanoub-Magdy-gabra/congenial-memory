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
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

interface MenuItem {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  calories?: number;
  isVegetarian: boolean;
  isSpicy: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const categories = [
    'الكل',
    'الوجبات الرئيسية',
    'المشروبات',
    'الحلويات',
    'المقبلات',
    'السلطات',
    'المشاوي',
    'البيتزا',
    'المعجنات'
  ];

  // Sample menu items
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'شاورما دجاج',
      nameEn: 'Chicken Shawarma',
      description: 'شاورما دجاج طازجة مع الخضار والصوص الخاص',
      price: 15,
      category: 'الوجبات الرئيسية',
      available: true,
      preparationTime: 10,
      ingredients: ['دجاج', 'خبز', 'طماطم', 'خيار', 'صوص الثوم'],
      allergens: ['جلوتين'],
      calories: 450,
      isVegetarian: false,
      isSpicy: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: '2',
      name: 'برجر لحم',
      nameEn: 'Beef Burger',
      description: 'برجر لحم بقري مشوي مع الجبن والخضار الطازجة',
      price: 25,
      category: 'الوجبات الرئيسية',
      available: true,
      preparationTime: 15,
      ingredients: ['لحم بقري', 'خبز برجر', 'جبن', 'خس', 'طماطم', 'بصل'],
      allergens: ['جلوتين', 'ألبان'],
      calories: 650,
      isVegetarian: false,
      isSpicy: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: '3',
      name: 'بيتزا مارجريتا',
      nameEn: 'Margherita Pizza',
      description: 'بيتزا كلاسيكية بالطماطم والجبن والريحان',
      price: 35,
      category: 'البيتزا',
      available: true,
      preparationTime: 20,
      ingredients: ['عجينة بيتزا', 'صوص طماطم', 'جبن موتزاريلا', 'ريحان'],
      allergens: ['جلوتين', 'ألبان'],
      calories: 800,
      isVegetarian: true,
      isSpicy: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: '4',
      name: 'عصير برتقال طازج',
      nameEn: 'Fresh Orange Juice',
      description: 'عصير برتقال طبيعي 100% بدون إضافات',
      price: 8,
      category: 'المشروبات',
      available: true,
      preparationTime: 3,
      ingredients: ['برتقال طازج'],
      allergens: [],
      calories: 120,
      isVegetarian: true,
      isSpicy: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: '5',
      name: 'كنافة بالجبن',
      nameEn: 'Cheese Kunafa',
      description: 'كنافة تقليدية محشوة بالجبن مع القطر',
      price: 12,
      category: 'الحلويات',
      available: false,
      preparationTime: 25,
      ingredients: ['عجينة كنافة', 'جبن', 'قطر', 'فستق'],
      allergens: ['جلوتين', 'ألبان', 'مكسرات'],
      calories: 350,
      isVegetarian: true,
      isSpicy: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-15')
    }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = showUnavailable || item.available;
    
    return matchesCategory && matchesSearch && matchesAvailability;
  });

  const toggleAvailability = (id: string) => {
    // Toggle item availability logic here
    toast.success('تم تحديث حالة الصنف');
  };

  const deleteItem = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الصنف؟')) {
      // Delete item logic here
      toast.success('تم حذف الصنف بنجاح');
    }
  };

  const exportMenu = () => {
    // Export menu logic here
    toast.success('تم تصدير القائمة بنجاح');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة قائمة الطعام</h1>
          <p className="text-gray-600">إدارة أصناف الطعام والمشروبات</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button
            onClick={exportMenu}
            className="btn-secondary"
          >
            <Download className="h-4 w-4 ml-2" />
            تصدير القائمة
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة صنف جديد
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100">
                <Eye className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">إجمالي الأصناف</p>
              <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-success-100">
                <Eye className="h-6 w-6 text-success-600" />
              </div>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">الأصناف المتاحة</p>
              <p className="text-2xl font-bold text-gray-900">
                {menuItems.filter(item => item.available).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-warning-100">
                <EyeOff className="h-6 w-6 text-warning-600" />
              </div>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">الأصناف غير المتاحة</p>
              <p className="text-2xl font-bold text-gray-900">
                {menuItems.filter(item => !item.available).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-info-100">
                <Filter className="h-6 w-6 text-info-600" />
              </div>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">الفئات</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
          </div>
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
              placeholder="البحث في الأصناف..."
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
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Show Unavailable Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showUnavailable"
              checked={showUnavailable}
              onChange={(e) => setShowUnavailable(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="showUnavailable" className="mr-2 text-sm text-gray-700">
              عرض الأصناف غير المتاحة
            </label>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Item Image */}
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">لا توجد صورة</span>
              )}
            </div>

            {/* Item Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  {item.nameEn && (
                    <p className="text-sm text-gray-500 ltr">{item.nameEn}</p>
                  )}
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  {item.isVegetarian && (
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full" title="نباتي"></span>
                  )}
                  {item.isSpicy && (
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full" title="حار"></span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-primary-600">{item.price} ج.م</span>
                <span className="text-sm text-gray-500">{item.preparationTime} دقيقة</span>
              </div>

              {item.calories && (
                <p className="text-xs text-gray-500 mb-2">{item.calories} سعرة حرارية</p>
              )}

              {/* Availability Status */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.available ? 'متاح' : 'غير متاح'}
                </span>
                <span className="text-xs text-gray-500">
                  {item.category}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => setEditingItem(item)}
                  className="flex-1 btn-secondary text-sm py-2"
                >
                  <Edit className="h-4 w-4 ml-1" />
                  تعديل
                </button>
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`flex-1 text-sm py-2 px-3 rounded-lg font-medium transition-colors ${
                    item.available
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {item.available ? (
                    <>
                      <EyeOff className="h-4 w-4 ml-1" />
                      إخفاء
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 ml-1" />
                      إظهار
                    </>
                  )}
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أصناف</h3>
          <p className="text-gray-500">لا توجد أصناف تطابق معايير البحث المحددة</p>
        </div>
      )}
    </div>
  );
};

export default Menu;