import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          name_en: string | null;
          description: string | null;
          icon: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_en?: string | null;
          description?: string | null;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_en?: string | null;
          description?: string | null;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          name_en: string | null;
          description: string | null;
          price: number;
          cost_price: number;
          preparation_time: number;
          calories: number | null;
          image_url: string | null;
          is_available: boolean;
          is_popular: boolean;
          is_vegetarian: boolean;
          is_spicy: boolean;
          allergens: string[] | null;
          ingredients: string[] | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          name_en?: string | null;
          description?: string | null;
          price: number;
          cost_price?: number;
          preparation_time?: number;
          calories?: number | null;
          image_url?: string | null;
          is_available?: boolean;
          is_popular?: boolean;
          is_vegetarian?: boolean;
          is_spicy?: boolean;
          allergens?: string[] | null;
          ingredients?: string[] | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          name_en?: string | null;
          description?: string | null;
          price?: number;
          cost_price?: number;
          preparation_time?: number;
          calories?: number | null;
          image_url?: string | null;
          is_available?: boolean;
          is_popular?: boolean;
          is_vegetarian?: boolean;
          is_spicy?: boolean;
          allergens?: string[] | null;
          ingredients?: string[] | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          birth_date: string | null;
          loyalty_points: number;
          total_orders: number;
          total_spent: number;
          last_visit: string | null;
          notes: string | null;
          status: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          birth_date?: string | null;
          loyalty_points?: number;
          total_orders?: number;
          total_spent?: number;
          last_visit?: string | null;
          notes?: string | null;
          status?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          birth_date?: string | null;
          loyalty_points?: number;
          total_orders?: number;
          total_spent?: number;
          last_visit?: string | null;
          notes?: string | null;
          status?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      customer_addresses: {
        Row: {
          id: string;
          customer_id: string;
          label: string;
          type: string;
          street: string;
          area: string;
          building: string | null;
          floor: string | null;
          apartment: string | null;
          landmark: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          label: string;
          type?: string;
          street: string;
          area: string;
          building?: string | null;
          floor?: string | null;
          apartment?: string | null;
          landmark?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          label?: string;
          type?: string;
          street?: string;
          area?: string;
          building?: string | null;
          floor?: string | null;
          apartment?: string | null;
          landmark?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      delivery_zones: {
        Row: {
          id: string;
          name: string;
          areas: string[];
          delivery_fee: number;
          estimated_time: number;
          min_order_amount: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          areas: string[];
          delivery_fee: number;
          estimated_time: number;
          min_order_amount?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          areas?: string[];
          delivery_fee?: number;
          estimated_time?: number;
          min_order_amount?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tables: {
        Row: {
          id: string;
          number: number;
          capacity: number;
          location: string;
          status: string;
          current_order_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: number;
          capacity: number;
          location?: string;
          status?: string;
          current_order_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: number;
          capacity?: number;
          location?: string;
          status?: string;
          current_order_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          table_id: string | null;
          driver_id: string | null;
          delivery_zone_id: string | null;
          address_id: string | null;
          order_type: string;
          status: string;
          subtotal: number;
          discount_amount: number;
          discount_type: string;
          delivery_fee: number;
          tax_amount: number;
          total_amount: number;
          payment_method: string;
          payment_status: string;
          estimated_time: number;
          pickup_time: string | null;
          delivery_instructions: string | null;
          notes: string | null;
          split_bill: boolean;
          split_count: number;
          loyalty_points_used: number;
          loyalty_points_earned: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          table_id?: string | null;
          driver_id?: string | null;
          delivery_zone_id?: string | null;
          address_id?: string | null;
          order_type: string;
          status?: string;
          subtotal: number;
          discount_amount?: number;
          discount_type?: string;
          delivery_fee?: number;
          tax_amount?: number;
          total_amount: number;
          payment_method?: string;
          payment_status?: string;
          estimated_time?: number;
          pickup_time?: string | null;
          delivery_instructions?: string | null;
          notes?: string | null;
          split_bill?: boolean;
          split_count?: number;
          loyalty_points_used?: number;
          loyalty_points_earned?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          table_id?: string | null;
          driver_id?: string | null;
          delivery_zone_id?: string | null;
          address_id?: string | null;
          order_type?: string;
          status?: string;
          subtotal?: number;
          discount_amount?: number;
          discount_type?: string;
          delivery_fee?: number;
          tax_amount?: number;
          total_amount?: number;
          payment_method?: string;
          payment_status?: string;
          estimated_time?: number;
          pickup_time?: string | null;
          delivery_instructions?: string | null;
          notes?: string | null;
          split_bill?: boolean;
          split_count?: number;
          loyalty_points_used?: number;
          loyalty_points_earned?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          notes: string | null;
          customizations: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          notes?: string | null;
          customizations?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          notes?: string | null;
          customizations?: any | null;
          created_at?: string;
        };
      };
      inventory: {
        Row: {
          id: string;
          name: string;
          category: string;
          current_stock: number;
          minimum_stock: number;
          unit: string;
          cost_price: number;
          supplier_id: string | null;
          status: string;
          last_updated: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          current_stock: number;
          minimum_stock: number;
          unit?: string;
          cost_price?: number;
          supplier_id?: string | null;
          status?: string;
          last_updated?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          current_stock?: number;
          minimum_stock?: number;
          unit?: string;
          cost_price?: number;
          supplier_id?: string | null;
          status?: string;
          last_updated?: string;
          created_at?: string;
        };
      };
      staff: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string;
          position: string;
          department: string;
          salary: number;
          hire_date: string;
          status: string;
          permissions: string[] | null;
          work_schedule: any | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone: string;
          position: string;
          department: string;
          salary?: number;
          hire_date?: string;
          status?: string;
          permissions?: string[] | null;
          work_schedule?: any | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string;
          position?: string;
          department?: string;
          salary?: number;
          hire_date?: string;
          status?: string;
          permissions?: string[] | null;
          work_schedule?: any | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      drivers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          license_number: string | null;
          vehicle_type: string | null;
          vehicle_plate: string | null;
          status: string;
          current_orders: number;
          total_deliveries: number;
          rating: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          license_number?: string | null;
          vehicle_type?: string | null;
          vehicle_plate?: string | null;
          status?: string;
          current_orders?: number;
          total_deliveries?: number;
          rating?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          license_number?: string | null;
          vehicle_type?: string | null;
          vehicle_plate?: string | null;
          status?: string;
          current_orders?: number;
          total_deliveries?: number;
          rating?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          contact_person: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact_person?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact_person?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      sms_notifications: {
        Row: {
          id: string;
          phone: string;
          message: string;
          status: string;
          order_id: string | null;
          template_name: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          message: string;
          status?: string;
          order_id?: string | null;
          template_name?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          message?: string;
          status?: string;
          order_id?: string | null;
          template_name?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
      };
      loyalty_transactions: {
        Row: {
          id: string;
          customer_id: string;
          order_id: string | null;
          points: number;
          type: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          order_id?: string | null;
          points: number;
          type: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          order_id?: string | null;
          points?: number;
          type?: string;
          description?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];