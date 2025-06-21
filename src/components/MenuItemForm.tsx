import React, { useState, useEffect } from 'react';
import { Upload, X, Save, AlertCircle, Check, Star, Flame, Heart, Clock, DollarSign, Package } from 'lucide-react';
import MobileButton from './MobileButton';
import MobileInput from './MobileInput';
import MobileCard from './MobileCard';
import toast from 'react-hot-toast';

interface MenuItemFormProps {
  item?: any;
  categories: any[];
  onSave: (itemData: any) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  item,
  categories,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    description: '',
    price: '',
    cost_price: '',
    category_id: '',
    preparation_time: '10',
    calories: '',
    is_available: true,
    is_popular: false,
    is_vegetarian: false,
    is_spicy: false,
    allergens: [] as string[],
    ingredients: [] as string[],
    sort_order: '0'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [newAllergen, setNewAllergen] = useState('');
  const [newIngredient, setNewIngredient] = useState('');

  // Common allergens list
  const commonAllergens = [
    'جلوتين', 'ألبان', 'بيض', 'مكسرات', 'فول سوداني', 
    'سمسم', 'صويا', 'أسماك', 'قشريات', 'كبريتيت'
  ];

  // Initialize form with item data if editing
  useEffect(() => {
    if (item && isEditing) {
      setFormData({
        name: item.name || '',
        name_en: item.name_en || '',
        description: item.description || '',
        price: item.price?.toString() || '',
        cost_price: item.cost_price?.toString() || '',
        category_id: item.category_id || '',
        preparation_time: item.preparation_time?.toString() || '10',
        calories: item.calories?.toString() || '',
        is_available: item.is_available ?? true,
        is_popular: item.is_popular ?? false,
        is_vegetarian: item.is_vegetarian ?? false,
        is_spicy: item.is_spicy ?? false,
        allergens: item.allergens || [],
        ingredients: item.ingredients || [],
        sort_order: item.sort_order?.toString() || '0'
      });
    }
  }, [item, isEditing]);

  // Validation functions
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم الصنف مطلوب';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'وصف الصنف مطلوب';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'السعر يجب أن يكون أكبر من صفر';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'يرجى اختيار فئة الصنف';
    }

    if (!formData.preparation_time || parseInt(formData.preparation_time) <= 0) {
      newErrors.preparation_time = 'وقت التحضير يجب أن يكون أكبر من صفر';
    }

    if (formData.cost_price && parseFloat(formData.cost_price) < 0) {
      newErrors.cost_price = 'سعر التكلفة لا يمكن أن يكون سالباً';
    }

    if (formData.calories && parseInt(formData.calories) < 0) {
      newErrors.calories = 'السعرات الحرارية لا يمكن أن تكون سالبة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    setLoading(true);
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : 0,
        preparation_time: parseInt(formData.preparation_time),
        calories: formData.calories ? parseInt(formData.calories) : null,
        sort_order: parseInt(formData.sort_order)
      };

      await onSave(itemData);
      toast.success(isEditing ? 'تم تحديث الصنف بنجاح' : 'تم إضافة الصنف بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ الصنف');
    } finally {
      setLoading(false);
    }
  };

  const addAllergen = () => {
    if (newAllergen.trim() && !formData.allergens.includes(newAllergen.trim())) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, newAllergen.trim()]
      }));
      setNewAllergen('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter(a => a !== allergen)
    }));
  };

  const addIngredient = () => {
    if (newIngredient.trim() && !formData.ingredients.includes(newIngredient.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()]
      }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(i => i !== ingredient)
    }));
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Basic Information */}
      <MobileCard title="المعلومات الأساسية" icon={Package}>
        <div className="space-y-4">
          <MobileInput
            label="اسم الصنف"
            placeholder="مثل: شاورما دجاج"
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            error={errors.name}
            required
            maxLength={100}
            showCharCount
          />

          <MobileInput
            label="الاسم بالإنجليزية"
            placeholder="Chicken Shawarma"
            value={formData.name_en}
            onChange={(value) => setFormData(prev => ({ ...prev, name_en: value }))}
            maxLength={100}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف الصنف *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="وصف مفصل للصنف..."
              rows={3}
              maxLength={500}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">{formData.description.length}/500</span>
              {errors.description && (
                <span className="text-xs text-red-600">{errors.description}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الفئة *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors.category_id ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">اختر الفئة</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-xs text-red-600 mt-1">{errors.category_id}</p>
            )}
          </div>
        </div>
      </MobileCard>

      {/* Pricing & Time */}
      <MobileCard title="السعر والوقت" icon={DollarSign}>
        <div className="grid grid-cols-2 gap-4">
          <MobileInput
            label="السعر"
            placeholder="0.00"
            value={formData.price}
            onChange={(value) => setFormData(prev => ({ ...prev, price: value }))}
            type="number"
            inputMode="decimal"
            error={errors.price}
            required
          />

          <MobileInput
            label="سعر التكلفة"
            placeholder="0.00"
            value={formData.cost_price}
            onChange={(value) => setFormData(prev => ({ ...prev, cost_price: value }))}
            type="number"
            inputMode="decimal"
            error={errors.cost_price}
          />

          <MobileInput
            label="وقت التحضير (دقيقة)"
            placeholder="10"
            value={formData.preparation_time}
            onChange={(value) => setFormData(prev => ({ ...prev, preparation_time: value }))}
            type="number"
            inputMode="numeric"
            error={errors.preparation_time}
            required
          />

          <MobileInput
            label="السعرات الحرارية"
            placeholder="450"
            value={formData.calories}
            onChange={(value) => setFormData(prev => ({ ...prev, calories: value }))}
            type="number"
            inputMode="numeric"
            error={errors.calories}
          />
        </div>
      </MobileCard>

      {/* Properties */}
      <MobileCard title="خصائص الصنف" icon={Star}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 ml-2" />
                <span className="text-sm font-medium">متاح</span>
              </div>
            </label>

            <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.is_popular}
                onChange={(e) => setFormData(prev => ({ ...prev, is_popular: e.target.checked }))}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex items-center">
                <Flame className="h-4 w-4 text-red-500 ml-2" />
                <span className="text-sm font-medium">الأكثر طلباً</span>
              </div>
            </label>

            <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.is_vegetarian}
                onChange={(e) => setFormData(prev => ({ ...prev, is_vegetarian: e.target.checked }))}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex items-center">
                <Heart className="h-4 w-4 text-green-500 ml-2" />
                <span className="text-sm font-medium">نباتي</span>
              </div>
            </label>

            <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.is_spicy}
                onChange={(e) => setFormData(prev => ({ ...prev, is_spicy: e.target.checked }))}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex items-center">
                <Flame className="h-4 w-4 text-red-500 ml-2" />
                <span className="text-sm font-medium">حار</span>
              </div>
            </label>
          </div>

          <MobileInput
            label="ترتيب العرض"
            placeholder="0"
            value={formData.sort_order}
            onChange={(value) => setFormData(prev => ({ ...prev, sort_order: value }))}
            type="number"
            inputMode="numeric"
          />
        </div>
      </MobileCard>

      {/* Allergens */}
      <MobileCard title="مسببات الحساسية" icon={AlertCircle}>
        <div className="space-y-4">
          <div className="flex space-x-2 space-x-reverse">
            <MobileInput
              placeholder="إضافة مسبب حساسية..."
              value={newAllergen}
              onChange={setNewAllergen}
              className="flex-1"
            />
            <MobileButton
              variant="primary"
              size="md"
              onClick={addAllergen}
              disabled={!newAllergen.trim()}
            >
              إضافة
            </MobileButton>
          </div>

          {/* Common allergens */}
          <div>
            <p className="text-sm text-gray-600 mb-2">مسببات حساسية شائعة:</p>
            <div className="flex flex-wrap gap-2">
              {commonAllergens.map((allergen) => (
                <button
                  key={allergen}
                  onClick={() => {
                    if (!formData.allergens.includes(allergen)) {
                      setFormData(prev => ({
                        ...prev,
                        allergens: [...prev.allergens, allergen]
                      }));
                    }
                  }}
                  disabled={formData.allergens.includes(allergen)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    formData.allergens.includes(allergen)
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {allergen}
                </button>
              ))}
            </div>
          </div>

          {/* Selected allergens */}
          {formData.allergens.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">مسببات الحساسية المحددة:</p>
              <div className="flex flex-wrap gap-2">
                {formData.allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className="inline-flex items-center px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full"
                  >
                    {allergen}
                    <button
                      onClick={() => removeAllergen(allergen)}
                      className="mr-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </MobileCard>

      {/* Ingredients */}
      <MobileCard title="المكونات" icon={Package}>
        <div className="space-y-4">
          <div className="flex space-x-2 space-x-reverse">
            <MobileInput
              placeholder="إضافة مكون..."
              value={newIngredient}
              onChange={setNewIngredient}
              className="flex-1"
            />
            <MobileButton
              variant="primary"
              size="md"
              onClick={addIngredient}
              disabled={!newIngredient.trim()}
            >
              إضافة
            </MobileButton>
          </div>

          {/* Selected ingredients */}
          {formData.ingredients.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">المكونات:</p>
              <div className="flex flex-wrap gap-2">
                {formData.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="inline-flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {ingredient}
                    <button
                      onClick={() => removeIngredient(ingredient)}
                      className="mr-1 hover:text-blue-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </MobileCard>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <MobileButton
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          fullWidth
        >
          إلغاء
        </MobileButton>
        <MobileButton
          variant="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
          icon={Save}
          fullWidth
        >
          {isEditing ? 'تحديث الصنف' : 'إضافة الصنف'}
        </MobileButton>
      </div>
    </div>
  );
};

export default MenuItemForm;