import { BaseIntegration, IntegrationConfig, IntegrationResponse } from './index';

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerInfo?: {
    name: string;
    email?: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  paymentMethod: string;
  timestamp: string;
}

// Stripe Integration
export class StripeIntegration extends BaseIntegration {
  private stripe: any;

  async initialize(): Promise<IntegrationResponse> {
    try {
      // Load Stripe.js
      if (!window.Stripe) {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      this.stripe = window.Stripe(this.config.config.publishableKey);
      return { success: true, data: { message: 'Stripe initialized successfully' } };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to initialize Stripe' 
      };
    }
  }

  async test(): Promise<IntegrationResponse> {
    if (!this.stripe) {
      return { success: false, error: 'Stripe not initialized' };
    }

    try {
      // Test with a minimal payment intent creation
      const response = await this.makeRequest('/api/stripe/test', {
        method: 'POST',
        body: JSON.stringify({ 
          apiKey: this.config.config.secretKey 
        }),
      });

      return response;
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Stripe test failed' 
      };
    }
  }

  async disconnect(): Promise<IntegrationResponse> {
    this.stripe = null;
    return { success: true };
  }

  async processPayment(request: PaymentRequest): Promise<IntegrationResponse<PaymentResponse>> {
    if (!this.stripe) {
      return { success: false, error: 'Stripe not initialized' };
    }

    try {
      // Create payment intent
      const response = await this.makeRequest('/api/stripe/payment-intent', {
        method: 'POST',
        body: JSON.stringify({
          amount: Math.round(request.amount * 100), // Convert to cents
          currency: request.currency.toLowerCase(),
          metadata: {
            orderId: request.orderId,
            ...request.metadata,
          },
        }),
      });

      if (!response.success) {
        return response;
      }

      const { client_secret } = response.data;

      // Confirm payment
      const result = await this.stripe.confirmCardPayment(client_secret);

      if (result.error) {
        return {
          success: false,
          error: result.error.message,
        };
      }

      return {
        success: true,
        data: {
          transactionId: result.paymentIntent.id,
          status: result.paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
          amount: result.paymentIntent.amount / 100,
          currency: result.paymentIntent.currency.toUpperCase(),
          paymentMethod: 'card',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
      };
    }
  }
}

// PayPal Integration
export class PayPalIntegration extends BaseIntegration {
  private paypal: any;

  async initialize(): Promise<IntegrationResponse> {
    try {
      // Load PayPal SDK
      if (!window.paypal) {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${this.config.config.clientId}&currency=USD`;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      this.paypal = window.paypal;
      return { success: true, data: { message: 'PayPal initialized successfully' } };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to initialize PayPal' 
      };
    }
  }

  async test(): Promise<IntegrationResponse> {
    if (!this.paypal) {
      return { success: false, error: 'PayPal not initialized' };
    }

    return { success: true, data: { message: 'PayPal connection test successful' } };
  }

  async disconnect(): Promise<IntegrationResponse> {
    this.paypal = null;
    return { success: true };
  }

  async processPayment(request: PaymentRequest): Promise<IntegrationResponse<PaymentResponse>> {
    if (!this.paypal) {
      return { success: false, error: 'PayPal not initialized' };
    }

    try {
      return new Promise((resolve) => {
        this.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: request.amount.toFixed(2),
                  currency_code: request.currency,
                },
                custom_id: request.orderId,
              }],
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            resolve({
              success: true,
              data: {
                transactionId: order.id,
                status: 'completed',
                amount: parseFloat(order.purchase_units[0].amount.value),
                currency: order.purchase_units[0].amount.currency_code,
                paymentMethod: 'paypal',
                timestamp: new Date().toISOString(),
              },
            });
          },
          onError: (err: any) => {
            resolve({
              success: false,
              error: err.message || 'PayPal payment failed',
            });
          },
        }).render('#paypal-button-container');
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PayPal processing failed',
      };
    }
  }
}

// Local Payment Gateway (for Egyptian market)
export class FawryIntegration extends BaseIntegration {
  async initialize(): Promise<IntegrationResponse> {
    return { success: true, data: { message: 'Fawry initialized successfully' } };
  }

  async test(): Promise<IntegrationResponse> {
    try {
      const response = await this.makeRequest('https://atfawry.fawrystaging.com/ECommerceWeb/Fawry/payments/status', {
        method: 'POST',
        body: JSON.stringify({
          merchantCode: this.config.config.merchantCode,
          merchantRefNum: 'TEST_' + Date.now(),
        }),
      });

      return response;
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Fawry test failed' 
      };
    }
  }

  async disconnect(): Promise<IntegrationResponse> {
    return { success: true };
  }

  async processPayment(request: PaymentRequest): Promise<IntegrationResponse<PaymentResponse>> {
    try {
      const response = await this.makeRequest('https://atfawry.fawrystaging.com/ECommerceWeb/Fawry/payments/charge', {
        method: 'POST',
        body: JSON.stringify({
          merchantCode: this.config.config.merchantCode,
          merchantRefNum: request.orderId,
          customerMobile: request.customerInfo?.phone,
          customerEmail: request.customerInfo?.email,
          amount: request.amount,
          currencyCode: request.currency,
          description: `Order ${request.orderId}`,
        }),
      });

      if (response.success) {
        return {
          success: true,
          data: {
            transactionId: response.data.fawryRefNumber,
            status: 'pending',
            amount: request.amount,
            currency: request.currency,
            paymentMethod: 'fawry',
            timestamp: new Date().toISOString(),
          },
        };
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Fawry payment failed',
      };
    }
  }
}