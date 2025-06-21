// Global type definitions for integrations

declare global {
  interface Window {
    Stripe: any;
    paypal: any;
    fbq: any;
    dataLayer: any[];
  }
}

export interface IntegrationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaymentIntegration {
  processPayment(paymentData: any): Promise<IntegrationResult>;
  getPaymentMethods(): Promise<IntegrationResult<string[]>>;
  refundPayment(transactionId: string, amount?: number): Promise<IntegrationResult>;
}

export interface DeliveryIntegration {
  createDelivery(deliveryData: any): Promise<IntegrationResult>;
  trackDelivery(deliveryId: string): Promise<IntegrationResult>;
  cancelDelivery(deliveryId: string): Promise<IntegrationResult>;
}

export interface AnalyticsIntegration {
  trackEvent(eventData: any): Promise<IntegrationResult>;
  trackPurchase(purchaseData: any): Promise<IntegrationResult>;
  generateReport(reportType: string, dateRange: { start: string; end: string }): Promise<IntegrationResult>;
}

export interface InventoryIntegration {
  syncInventory(): Promise<IntegrationResult>;
  updateInventory(updates: any[]): Promise<IntegrationResult>;
  getInventoryAlerts(): Promise<IntegrationResult>;
}

export interface WebhookIntegration {
  sendWebhook(event: any): Promise<IntegrationResult>;
  registerEndpoint(endpoint: any): Promise<IntegrationResult>;
  removeEndpoint(id: string): Promise<IntegrationResult>;
}

export interface IntegrationEvent {
  type: string;
  data: any;
  timestamp: string;
  source: string;
}