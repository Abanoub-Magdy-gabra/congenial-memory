import { integrationManager } from './index';
import { createWebhookEvent, WebhookEvents } from './webhooks';

// API Integration Helpers
export const trackOrderCreated = async (order: any) => {
  try {
    // Get webhook manager
    const webhookManager = integrationManager.getIntegration('webhooks');
    if (webhookManager && 'sendWebhook' in webhookManager) {
      const event = createWebhookEvent(WebhookEvents.ORDER_CREATED, {
        orderId: order.id,
        orderNumber: order.order_number,
        orderType: order.order_type,
        totalAmount: order.total_amount,
        items: order.items,
        customer: order.customer_id ? {
          id: order.customer_id,
          name: order.customers?.name,
          phone: order.customers?.phone,
        } : null,
      });
      
      await (webhookManager as any).sendWebhook(event);
    }

    // Track in analytics
    const analyticsIntegrations = integrationManager.getEnabledIntegrations('analytics');
    for (const integration of analyticsIntegrations) {
      if ('trackEvent' in integration) {
        await (integration as any).trackEvent({
          event: 'order_created',
          properties: {
            orderId: order.id,
            orderNumber: order.order_number,
            orderType: order.order_type,
            totalAmount: order.total_amount,
            itemCount: order.items?.length || 0,
          },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to track order created:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error tracking order' 
    };
  }
};

export const trackOrderCompleted = async (order: any) => {
  try {
    // Get webhook manager
    const webhookManager = integrationManager.getIntegration('webhooks');
    if (webhookManager && 'sendWebhook' in webhookManager) {
      const event = createWebhookEvent(WebhookEvents.ORDER_COMPLETED, {
        orderId: order.id,
        orderNumber: order.order_number,
        orderType: order.order_type,
        totalAmount: order.total_amount,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
      });
      
      await (webhookManager as any).sendWebhook(event);
    }

    // Track purchase in analytics
    const analyticsIntegrations = integrationManager.getEnabledIntegrations('analytics');
    for (const integration of analyticsIntegrations) {
      if ('trackPurchase' in integration) {
        await (integration as any).trackPurchase(
          order.id,
          order.total_amount,
          order.items?.map((item: any) => ({
            id: item.menu_item_id,
            name: item.menu_items?.name || 'Unknown Item',
            category: item.menu_items?.category?.name || 'Unknown Category',
            quantity: item.quantity,
            price: item.unit_price,
          })) || []
        );
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to track order completed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error tracking order completion' 
    };
  }
};

export const trackInventoryUpdate = async (item: any, newQuantity: number, oldQuantity: number) => {
  try {
    // Check if inventory is low or out
    const isLow = newQuantity <= item.minimum_stock && newQuantity > 0;
    const isOut = newQuantity <= 0;
    
    if (isLow || isOut) {
      // Get webhook manager
      const webhookManager = integrationManager.getIntegration('webhooks');
      if (webhookManager && 'sendWebhook' in webhookManager) {
        const event = createWebhookEvent(
          isOut ? WebhookEvents.INVENTORY_OUT : WebhookEvents.INVENTORY_LOW,
          {
            itemId: item.id,
            name: item.name,
            currentStock: newQuantity,
            minimumStock: item.minimum_stock,
            unit: item.unit,
            category: item.category,
          }
        );
        
        await (webhookManager as any).sendWebhook(event);
      }

      // Track in analytics
      const analyticsIntegrations = integrationManager.getEnabledIntegrations('analytics');
      for (const integration of analyticsIntegrations) {
        if ('trackEvent' in integration) {
          await (integration as any).trackEvent({
            event: isOut ? 'inventory_out' : 'inventory_low',
            properties: {
              itemId: item.id,
              name: item.name,
              currentStock: newQuantity,
              minimumStock: item.minimum_stock,
            },
          });
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to track inventory update:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error tracking inventory' 
    };
  }
};

export const trackCustomerCreated = async (customer: any) => {
  try {
    // Get webhook manager
    const webhookManager = integrationManager.getIntegration('webhooks');
    if (webhookManager && 'sendWebhook' in webhookManager) {
      const event = createWebhookEvent(WebhookEvents.CUSTOMER_CREATED, {
        customerId: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        category: customer.category,
      });
      
      await (webhookManager as any).sendWebhook(event);
    }

    // Track in analytics
    const analyticsIntegrations = integrationManager.getEnabledIntegrations('analytics');
    for (const integration of analyticsIntegrations) {
      if ('trackEvent' in integration) {
        await (integration as any).trackEvent({
          event: 'customer_created',
          properties: {
            customerId: customer.id,
            name: customer.name,
          },
          userId: customer.id,
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to track customer created:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error tracking customer' 
    };
  }
};