import { BaseIntegration, IntegrationConfig, IntegrationResponse } from './index';

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  userId?: string;
  timestamp?: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    averageLifetimeValue: number;
  };
}

// Google Analytics Integration
export class GoogleAnalyticsIntegration extends BaseIntegration {
  private gtag: any;

  async initialize(): Promise<IntegrationResponse> {
    try {
      // Load Google Analytics
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.config.measurementId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      this.gtag = function() {
        window.dataLayer.push(arguments);
      };
      this.gtag('js', new Date());
      this.gtag('config', this.config.config.measurementId);

      return { success: true, data: { message: 'Google Analytics initialized successfully' } };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to initialize Google Analytics' 
      };
    }
  }

  async test(): Promise<IntegrationResponse> {
    if (!this.gtag) {
      return { success: false, error: 'Google Analytics not initialized' };
    }

    try {
      this.gtag('event', 'test_event', {
        event_category: 'integration',
        event_label: 'test',
      });

      return { success: true, data: { message: 'Test event sent successfully' } };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Google Analytics test failed' 
      };
    }
  }

  async disconnect(): Promise<IntegrationResponse> {
    this.gtag = null;
    return { success: true };
  }

  async trackEvent(event: AnalyticsEvent): Promise<IntegrationResponse> {
    if (!this.gtag) {
      return { success: false, error: 'Google Analytics not initialized' };
    }

    try {
      this.gtag('event', event.event, {
        ...event.properties,
        user_id: event.userId,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Event tracking failed',
      };
    }
  }

  async trackPurchase(orderId: string, amount: number, items: any[]): Promise<IntegrationResponse> {
    if (!this.gtag) {
      return { success: false, error: 'Google Analytics not initialized' };
    }

    try {
      this.gtag('event', 'purchase', {
        transaction_id: orderId,
        value: amount,
        currency: 'EGP',
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Purchase tracking failed',
      };
    }
  }
}

// Facebook Pixel Integration
export class FacebookPixelIntegration extends BaseIntegration {
  private fbq: any;

  async initialize(): Promise<IntegrationResponse> {
    try {
      // Load Facebook Pixel
      if (!window.fbq) {
        const script = document.createElement('script');
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
        `;
        document.head.appendChild(script);
      }

      this.fbq = window.fbq;
      this.fbq('init', this.config.config.pixelId);
      this.fbq('track', 'PageView');

      return { success: true, data: { message: 'Facebook Pixel initialized successfully' } };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to initialize Facebook Pixel' 
      };
    }
  }

  async test(): Promise<IntegrationResponse> {
    if (!this.fbq) {
      return { success: false, error: 'Facebook Pixel not initialized' };
    }

    try {
      this.fbq('track', 'Lead', {
        content_name: 'Integration Test',
      });

      return { success: true, data: { message: 'Test event sent successfully' } };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Facebook Pixel test failed' 
      };
    }
  }

  async disconnect(): Promise<IntegrationResponse> {
    this.fbq = null;
    return { success: true };
  }

  async trackEvent(event: AnalyticsEvent): Promise<IntegrationResponse> {
    if (!this.fbq) {
      return { success: false, error: 'Facebook Pixel not initialized' };
    }

    try {
      this.fbq('track', event.event, event.properties);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Event tracking failed',
      };
    }
  }

  async trackPurchase(orderId: string, amount: number, currency: string = 'EGP'): Promise<IntegrationResponse> {
    if (!this.fbq) {
      return { success: false, error: 'Facebook Pixel not initialized' };
    }

    try {
      this.fbq('track', 'Purchase', {
        value: amount,
        currency: currency,
        content_ids: [orderId],
        content_type: 'product',
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Purchase tracking failed',
      };
    }
  }
}

// Custom Analytics Integration
export class CustomAnalyticsIntegration extends BaseIntegration {
  async initialize(): Promise<IntegrationResponse> {
    return { success: true, data: { message: 'Custom analytics initialized' } };
  }

  async test(): Promise<IntegrationResponse> {
    return { success: true, data: { message: 'Custom analytics is ready' } };
  }

  async disconnect(): Promise<IntegrationResponse> {
    return { success: true };
  }

  async generateReport(): Promise<IntegrationResponse<AnalyticsData>> {
    try {
      const { supabase } = await import('../supabase');
      
      // Get sales data
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (name, category_id)
          ),
          customers (*)
        `)
        .eq('status', 'delivered');

      if (!orders) {
        return { success: false, error: 'Failed to fetch orders data' };
      }

      // Calculate metrics
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const orderCount = orders.length;
      const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

      // Top products
      const productSales: Record<string, { sales: number; revenue: number; name: string }> = {};
      
      orders.forEach(order => {
        order.order_items?.forEach((item: any) => {
          const productName = item.menu_items?.name || 'Unknown';
          if (!productSales[productName]) {
            productSales[productName] = { sales: 0, revenue: 0, name: productName };
          }
          productSales[productName].sales += item.quantity;
          productSales[productName].revenue += item.total_price;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Customer metrics
      const uniqueCustomers = new Set(orders.map(order => order.customer_id).filter(Boolean));
      const newCustomers = orders.filter(order => 
        order.customers && new Date(order.customers.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length;

      const analyticsData: AnalyticsData = {
        totalRevenue,
        orderCount,
        averageOrderValue,
        topProducts,
        customerMetrics: {
          newCustomers,
          returningCustomers: uniqueCustomers.size - newCustomers,
          averageLifetimeValue: uniqueCustomers.size > 0 ? totalRevenue / uniqueCustomers.size : 0,
        },
      };

      return {
        success: true,
        data: analyticsData,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Analytics report generation failed',
      };
    }
  }
}