import React, { createContext, useContext, useEffect, useState } from 'react';
import { integrationManager, IntegrationConfig } from '../lib/integrations';
import { createWebhookEvent, WebhookEvents } from '../lib/integrations/webhooks';
import toast from 'react-hot-toast';

interface IntegrationContextType {
  isInitialized: boolean;
  integrations: IntegrationConfig[];
  refreshIntegrations: () => Promise<void>;
  trackEvent: (eventType: string, data: any) => Promise<void>;
  processPayment: (paymentData: any) => Promise<any>;
  createDelivery: (deliveryData: any) => Promise<any>;
  syncInventory: () => Promise<any>;
}

const IntegrationContext = createContext<IntegrationContextType>({
  isInitialized: false,
  integrations: [],
  refreshIntegrations: async () => {},
  trackEvent: async () => {},
  processPayment: async () => ({}),
  createDelivery: async () => ({}),
  syncInventory: async () => ({}),
});

export const useIntegrations = () => useContext(IntegrationContext);

interface IntegrationProviderProps {
  children: React.ReactNode;
}

export const IntegrationProvider: React.FC<IntegrationProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);

  useEffect(() => {
    initializeIntegrations();
  }, []);

  const initializeIntegrations = async () => {
    try {
      await integrationManager.loadConfigurations();
      
      // Get configurations from integration manager
      const configs = integrationManager['configs'] || [];
      setIntegrations(configs);
      
      // Initialize enabled integrations
      const enabledConfigs = configs.filter(config => config.enabled);
      
      for (const config of enabledConfigs) {
        try {
          await integrationManager.enableIntegration(config.id);
        } catch (error) {
          console.error(`Failed to initialize integration ${config.name}:`, error);
        }
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize integrations:', error);
      toast.error('فشل في تهيئة التكاملات');
    }
  };

  const refreshIntegrations = async () => {
    try {
      await integrationManager.loadConfigurations();
      const configs = integrationManager['configs'] || [];
      setIntegrations(configs);
    } catch (error) {
      console.error('Failed to refresh integrations:', error);
      toast.error('فشل في تحديث التكاملات');
    }
  };

  const trackEvent = async (eventType: string, data: any) => {
    try {
      // Get all analytics integrations
      const analyticsIntegrations = integrationManager.getEnabledIntegrations('analytics');
      
      // Track event in all enabled analytics integrations
      for (const integration of analyticsIntegrations) {
        if ('trackEvent' in integration) {
          await (integration as any).trackEvent({
            event: eventType,
            properties: data,
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Send webhook if applicable
      const webhookManager = integrationManager.getIntegration('webhooks');
      if (webhookManager && 'sendWebhook' in webhookManager) {
        const webhookEvent = createWebhookEvent(eventType, data);
        await (webhookManager as any).sendWebhook(webhookEvent);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  const processPayment = async (paymentData: any) => {
    try {
      // Get enabled payment integrations
      const paymentIntegrations = integrationManager.getEnabledIntegrations('payment');
      
      if (paymentIntegrations.length === 0) {
        return { success: false, error: 'No payment integration enabled' };
      }
      
      // Use the first enabled payment integration
      const paymentIntegration = paymentIntegrations[0];
      
      if ('processPayment' in paymentIntegration) {
        const result = await (paymentIntegration as any).processPayment(paymentData);
        
        // Track payment event
        if (result.success) {
          await trackEvent(WebhookEvents.PAYMENT_RECEIVED, {
            orderId: paymentData.orderId,
            amount: paymentData.amount,
            paymentMethod: paymentData.paymentMethod,
          });
        } else {
          await trackEvent(WebhookEvents.PAYMENT_FAILED, {
            orderId: paymentData.orderId,
            amount: paymentData.amount,
            error: result.error,
          });
        }
        
        return result;
      }
      
      return { success: false, error: 'Payment integration does not support processPayment' };
    } catch (error) {
      console.error('Failed to process payment:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown payment error' 
      };
    }
  };

  const createDelivery = async (deliveryData: any) => {
    try {
      // Get enabled delivery integrations
      const deliveryIntegrations = integrationManager.getEnabledIntegrations('delivery');
      
      if (deliveryIntegrations.length === 0) {
        return { success: false, error: 'No delivery integration enabled' };
      }
      
      // Use the first enabled delivery integration
      const deliveryIntegration = deliveryIntegrations[0];
      
      if ('createDelivery' in deliveryIntegration) {
        const result = await (deliveryIntegration as any).createDelivery(deliveryData);
        
        // Track delivery event
        if (result.success) {
          await trackEvent('delivery.created', {
            orderId: deliveryData.orderId,
            deliveryId: result.data.deliveryId,
            estimatedTime: result.data.estimatedTime,
          });
        }
        
        return result;
      }
      
      return { success: false, error: 'Delivery integration does not support createDelivery' };
    } catch (error) {
      console.error('Failed to create delivery:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown delivery error' 
      };
    }
  };

  const syncInventory = async () => {
    try {
      // Get enabled inventory integrations
      const inventoryIntegrations = integrationManager.getEnabledIntegrations('inventory');
      
      if (inventoryIntegrations.length === 0) {
        return { success: false, error: 'No inventory integration enabled' };
      }
      
      // Use the first enabled inventory integration
      const inventoryIntegration = inventoryIntegrations[0];
      
      if ('syncInventory' in inventoryIntegration) {
        const result = await (inventoryIntegration as any).syncInventory();
        
        // Track inventory sync event
        if (result.success) {
          await trackEvent('inventory.synced', {
            timestamp: new Date().toISOString(),
            itemCount: result.data?.length || 0,
          });
        }
        
        return result;
      }
      
      return { success: false, error: 'Inventory integration does not support syncInventory' };
    } catch (error) {
      console.error('Failed to sync inventory:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown inventory error' 
      };
    }
  };

  return (
    <IntegrationContext.Provider
      value={{
        isInitialized,
        integrations,
        refreshIntegrations,
        trackEvent,
        processPayment,
        createDelivery,
        syncInventory,
      }}
    >
      {children}
    </IntegrationContext.Provider>
  );
};