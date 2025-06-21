import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables, Inserts, Updates } from '../lib/supabase';
import toast from 'react-hot-toast';

// Generic hook for CRUD operations
export function useSupabaseTable<T extends keyof Tables>(tableName: T) {
  const [data, setData] = useState<Tables[T][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all records
  const fetchData = async (query?: string) => {
    try {
      setLoading(true);
      let queryBuilder = supabase.from(tableName).select('*');
      
      if (query) {
        queryBuilder = queryBuilder.or(query);
      }
      
      const { data: result, error } = await queryBuilder;
      
      if (error) throw error;
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // Insert new record
  const insert = async (record: Inserts[T]) => {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      
      setData(prev => [...prev, result]);
      toast.success('تم إضافة السجل بنجاح');
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطأ في إضافة السجل';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  // Update record
  const update = async (id: string, updates: Updates[T]) => {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setData(prev => prev.map(item => 
        (item as any).id === id ? result : item
      ));
      toast.success('تم تحديث السجل بنجاح');
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطأ في تحديث السجل';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  // Delete record
  const remove = async (id: string) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setData(prev => prev.filter(item => (item as any).id !== id));
      toast.success('تم حذف السجل بنجاح');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطأ في حذف السجل';
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName]);

  return {
    data,
    loading,
    error,
    fetchData,
    insert,
    update,
    remove,
    refetch: fetchData
  };
}

// Function to check and add sample data if needed
const checkAndAddSampleData = async () => {
  try {
    console.log('Checking for existing data...');
    
    // Check if categories exist
    const { data: existingCategories, error: categoriesError } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (categoriesError) {
      console.error('Error checking categories:', categoriesError);
      return;
    }

    // If no categories exist, add sample data
    if (!existingCategories || existingCategories.length === 0) {
      console.log('No categories found, adding sample data...');
      
      // Add categories
      const { data: newCategories, error: insertCategoriesError } = await supabase
        .from('categories')
        .insert([
          {
            name: 'الوجبات الرئيسية',
            name_en: 'Main Dishes',
            description: 'الأطباق الرئيسية والوجبات الكاملة',
            icon: 'utensils',
            sort_order: 1,
            is_active: true
          },
          {
            name: 'المشروبات',
            name_en: 'Beverages',
            description: 'المشروبات الساخنة والباردة',
            icon: 'coffee',
            sort_order: 2,
            is_active: true
          },
          {
            name: 'الحلويات',
            name_en: 'Desserts',
            description: 'الحلويات والمعجنات',
            icon: 'star',
            sort_order: 3,
            is_active: true
          },
          {
            name: 'المقبلات',
            name_en: 'Appetizers',
            description: 'المقبلات والسلطات',
            icon: 'package',
            sort_order: 4,
            is_active: true
          }
        ])
        .select();

      if (insertCategoriesError) {
        console.error('Error inserting categories:', insertCategoriesError);
        return;
      }

      console.log('Categories added successfully:', newCategories?.length);

      // Add menu items
      if (newCategories && newCategories.length > 0) {
        const mainDishesCategory = newCategories.find(cat => cat.name === 'الوجبات الرئيسية');
        const beveragesCategory = newCategories.find(cat => cat.name === 'المشروبات');
        const dessertsCategory = newCategories.find(cat => cat.name === 'الحلويات');
        const appetizersCategory = newCategories.find(cat => cat.name === 'المقبلات');

        const { data: newMenuItems, error: insertMenuItemsError } = await supabase
          .from('menu_items')
          .insert([
            {
              category_id: mainDishesCategory?.id,
              name: 'شاورما دجاج',
              name_en: 'Chicken Shawarma',
              description: 'شاورما دجاج طازجة مع الخضار والصوص الخاص',
              price: 15.00,
              cost_price: 8.00,
              preparation_time: 10,
              calories: 450,
              is_available: true,
              is_popular: true,
              is_vegetarian: false,
              is_spicy: false,
              allergens: ['جلوتين'],
              ingredients: ['دجاج', 'خبز', 'طماطم', 'خيار', 'صوص الثوم'],
              sort_order: 1
            },
            {
              category_id: mainDishesCategory?.id,
              name: 'برجر لحم',
              name_en: 'Beef Burger',
              description: 'برجر لحم بقري مشوي مع الجبن والخضار الطازجة',
              price: 25.00,
              cost_price: 12.00,
              preparation_time: 15,
              calories: 650,
              is_available: true,
              is_popular: true,
              is_vegetarian: false,
              is_spicy: false,
              allergens: ['جلوتين', 'ألبان'],
              ingredients: ['لحم بقري', 'خبز برجر', 'جبن', 'خس', 'طماطم', 'بصل'],
              sort_order: 2
            },
            {
              category_id: mainDishesCategory?.id,
              name: 'بيتزا مارجريتا',
              name_en: 'Margherita Pizza',
              description: 'بيتزا كلاسيكية بالطماطم والجبن والريحان',
              price: 35.00,
              cost_price: 15.00,
              preparation_time: 20,
              calories: 800,
              is_available: true,
              is_popular: false,
              is_vegetarian: true,
              is_spicy: false,
              allergens: ['جلوتين', 'ألبان'],
              ingredients: ['عجينة بيتزا', 'صوص طماطم', 'جبن موتزاريلا', 'ريحان'],
              sort_order: 3
            },
            {
              category_id: beveragesCategory?.id,
              name: 'عصير برتقال طازج',
              name_en: 'Fresh Orange Juice',
              description: 'عصير برتقال طبيعي 100% بدون إضافات',
              price: 8.00,
              cost_price: 3.00,
              preparation_time: 3,
              calories: 120,
              is_available: true,
              is_popular: false,
              is_vegetarian: true,
              is_spicy: false,
              allergens: [],
              ingredients: ['برتقال طازج'],
              sort_order: 1
            },
            {
              category_id: beveragesCategory?.id,
              name: 'شاي مغربي',
              name_en: 'Moroccan Tea',
              description: 'شاي مغربي بالنعناع الطازج',
              price: 5.00,
              cost_price: 1.50,
              preparation_time: 5,
              calories: 25,
              is_available: true,
              is_popular: false,
              is_vegetarian: true,
              is_spicy: false,
              allergens: [],
              ingredients: ['شاي أخضر', 'نعناع', 'سكر'],
              sort_order: 2
            },
            {
              category_id: beveragesCategory?.id,
              name: 'قهوة تركي',
              name_en: 'Turkish Coffee',
              description: 'قهوة تركية أصيلة',
              price: 7.00,
              cost_price: 2.00,
              preparation_time: 8,
              calories: 50,
              is_available: true,
              is_popular: false,
              is_vegetarian: true,
              is_spicy: false,
              allergens: [],
              ingredients: ['قهوة تركية', 'سكر'],
              sort_order: 3
            },
            {
              category_id: dessertsCategory?.id,
              name: 'كنافة بالجبن',
              name_en: 'Cheese Kunafa',
              description: 'كنافة تقليدية محشوة بالجبن مع القطر',
              price: 12.00,
              cost_price: 6.00,
              preparation_time: 15,
              calories: 350,
              is_available: true,
              is_popular: false,
              is_vegetarian: true,
              is_spicy: false,
              allergens: ['جلوتين', 'ألبان', 'مكسرات'],
              ingredients: ['عجينة كنافة', 'جبن', 'قطر', 'فستق'],
              sort_order: 1
            },
            {
              category_id: dessertsCategory?.id,
              name: 'أم علي',
              name_en: 'Om Ali',
              description: 'حلوى مصرية تقليدية بالحليب والمكسرات',
              price: 10.00,
              cost_price: 4.00,
              preparation_time: 12,
              calories: 280,
              is_available: true,
              is_popular: false,
              is_vegetarian: true,
              is_spicy: false,
              allergens: ['ألبان', 'مكسرات'],
              ingredients: ['لبن', 'عجين', 'مكسرات', 'زبيب'],
              sort_order: 2
            },
            {
              category_id: appetizersCategory?.id,
              name: 'سلطة خضراء',
              name_en: 'Green Salad',
              description: 'سلطة خضراء طازجة مع الخضار الموسمية',
              price: 8.00,
              cost_price: 3.00,
              preparation_time: 5,
              calories: 80,
              is_available: true,
              is_popular: false,
              is_vegetarian: true,
              is_spicy: false,
              allergens: [],
              ingredients: ['خس', 'طماطم', 'خيار', 'جزر', 'زيت زيتون'],
              sort_order: 1
            },
            {
              category_id: appetizersCategory?.id,
              name: 'حمص بالطحينة',
              name_en: 'Hummus with Tahini',
              description: 'حمص كريمي بالطحينة وزيت الزيتون',
              price: 6.00,
              cost_price: 2.50,
              preparation_time: 3,
              calories: 150,
              is_available: true,
              is_popular: false,
              is_vegetarian: true,
              is_spicy: true,
              allergens: [],
              ingredients: ['حمص', 'طحينة', 'ثوم', 'ليمون', 'زيت زيتون'],
              sort_order: 2
            }
          ])
          .select();

        if (insertMenuItemsError) {
          console.error('Error inserting menu items:', insertMenuItemsError);
          return;
        }

        console.log('Menu items added successfully:', newMenuItems?.length);
        toast.success('تم إضافة البيانات التجريبية بنجاح!');
      }
    } else {
      console.log('Categories already exist, skipping sample data insertion');
    }
  } catch (error) {
    console.error('Error in checkAndAddSampleData:', error);
  }
};

// Specific hooks for complex operations
export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<Tables['categories'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching menu items and categories...');
      
      // First check and add sample data if needed
      await checkAndAddSampleData();
      
      // Fetch categories first
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (categoriesError) {
        console.error('Categories error:', categoriesError);
        throw new Error(`Categories fetch failed: ${categoriesError.message}`);
      }

      console.log('Categories fetched successfully:', categoriesData?.length || 0, 'items');

      // Fetch menu items with categories using the correct relationship
      const { data: itemsData, error: itemsError } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:categories!menu_items_category_id_fkey (
            id,
            name,
            name_en
          )
        `)
        .eq('is_available', true)
        .order('sort_order');

      if (itemsError) {
        console.error('Menu items error:', itemsError);
        throw new Error(`Menu items fetch failed: ${itemsError.message}`);
      }

      console.log('Menu items fetched successfully:', itemsData?.length || 0, 'items');
      console.log('Sample menu item:', itemsData?.[0]);

      setCategories(categoriesData || []);
      setMenuItems(itemsData || []);
      
      if (!categoriesData?.length) {
        console.warn('No categories found in database');
      }
      
      if (!itemsData?.length) {
        console.warn('No menu items found in database');
      }
      
    } catch (err) {
      console.error('Error fetching menu data:', err);
      const message = err instanceof Error ? err.message : 'خطأ في تحميل قائمة الطعام';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return { 
    menuItems, 
    categories, 
    loading, 
    error,
    refetch: fetchMenuItems 
  };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          customer_addresses (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      toast.error('خطأ في تحميل بيانات العملاء');
    } finally {
      setLoading(false);
    }
  };

  const searchCustomer = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          customer_addresses (*)
        `)
        .eq('phone', phone)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (err) {
      toast.error('العميل غير موجود');
      return null;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, loading, searchCustomer, refetch: fetchCustomers };
}

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (*),
          tables!orders_table_id_fkey (*),
          drivers (*),
          delivery_zones (*),
          customer_addresses (*),
          order_items (
            *,
            menu_items (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      toast.error('خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: orderData.customer_id,
          table_id: orderData.table_id,
          delivery_zone_id: orderData.delivery_zone_id,
          address_id: orderData.address_id,
          order_type: orderData.order_type,
          subtotal: orderData.subtotal,
          discount_amount: orderData.discount_amount,
          discount_type: orderData.discount_type,
          delivery_fee: orderData.delivery_fee,
          tax_amount: orderData.tax_amount,
          total_amount: orderData.total_amount,
          payment_method: orderData.payment_method,
          estimated_time: orderData.estimated_time,
          pickup_time: orderData.pickup_time,
          delivery_instructions: orderData.delivery_instructions,
          notes: orderData.notes,
          split_bill: orderData.split_bill,
          split_count: orderData.split_count,
          loyalty_points_used: orderData.loyalty_points_used,
          loyalty_points_earned: orderData.loyalty_points_earned
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map((item: any) => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        notes: item.notes,
        customizations: item.customizations
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update table status if dine-in
      if (orderData.order_type === 'dine-in' && orderData.table_id) {
        await supabase
          .from('tables')
          .update({ 
            status: 'occupied',
            current_order_id: order.id
          })
          .eq('id', orderData.table_id);
      }

      toast.success(`تم إنشاء الطلب رقم ${order.order_number}`);
      await fetchOrders();
      return order;
    } catch (err) {
      toast.error('خطأ في إنشاء الطلب');
      throw err;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));

      toast.success('تم تحديث حالة الطلب');
    } catch (err) {
      toast.error('خطأ في تحديث حالة الطلب');
    }
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { 
    orders, 
    loading, 
    createOrder, 
    updateOrderStatus, 
    refetch: fetchOrders 
  };
}

export function useInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<Tables['suppliers'][]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      
      const { data: items, error: itemsError } = await supabase
        .from('inventory')
        .select(`
          *,
          suppliers (*)
        `)
        .order('name');

      if (itemsError) throw itemsError;

      const { data: sups, error: supsError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (supsError) throw supsError;

      setInventory(items || []);
      setSuppliers(sups || []);
    } catch (err) {
      toast.error('خطأ في تحميل المخزون');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (itemId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .update({ current_stock: newStock })
        .eq('id', itemId);

      if (error) throw error;

      setInventory(prev => prev.map(item => 
        item.id === itemId ? { ...item, current_stock: newStock } : item
      ));

      toast.success('تم تحديث المخزون');
    } catch (err) {
      toast.error('خطأ في تحديث المخزون');
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return { 
    inventory, 
    suppliers, 
    loading, 
    updateStock, 
    refetch: fetchInventory 
  };
}

export function useTables() {
  const [tables, setTables] = useState<Tables['tables'][]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .order('number');

      if (error) throw error;
      setTables(data || []);
    } catch (err) {
      toast.error('خطأ في تحميل الطاولات');
    } finally {
      setLoading(false);
    }
  };

  const updateTableStatus = async (tableId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('tables')
        .update({ status })
        .eq('id', tableId);

      if (error) throw error;

      setTables(prev => prev.map(table => 
        table.id === tableId ? { ...table, status } : table
      ));

      toast.success('تم تحديث حالة الطاولة');
    } catch (err) {
      toast.error('خطأ في تحديث حالة الطاولة');
    }
  };

  useEffect(() => {
    fetchTables();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('tables')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tables' },
        () => {
          fetchTables();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { 
    tables, 
    loading, 
    updateTableStatus, 
    refetch: fetchTables 
  };
}

export function useStaff() {
  return useSupabaseTable('staff');
}

export function useDrivers() {
  return useSupabaseTable('drivers');
}

export function useDeliveryZones() {
  return useSupabaseTable('delivery_zones');
}