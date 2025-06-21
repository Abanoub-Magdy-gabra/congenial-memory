import { BaseIntegration, IntegrationConfig, IntegrationResponse } from './index';

export interface WebhookEvent {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: string;
  source: string;
}

export interface WebhookEndpoint {
  url: string;
  events: string[];
  secret?: string;
  headers?: Record<string, string>;
}

export class WebhookManager extends BaseIntegration {
  private endpoints: Map<string, WebhookEndpoint> = new Map();

  async initialize(): Promise<IntegrationResponse> {
    // Load webhook endpoints from configuration
    if (this.config.config.endpoints) {
      this.config.config.endpoints.forEach((endpoint: WebhookEndpoint, index: number) => {
        this.endpoints.set(`endpoint_${index}`, endpoint);
      });
    }

    return { success: true, data: { message: 'Webhook manager initialized' } };
  }

  async test(): Promise<IntegrationResponse> {
    // Test all configured endpoints
    const testPromises = Array.from(this.endpoints.entries()).map(async ([id, endpoint]) => {
      try {
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Test': 'true',
            ...endpoint.headers,
          },
          body: JSON.stringify({
            type: 'test',
            data: { message: 'Webhook test from POS system' },
            timestamp: new Date().toISOString(),
          }),
        });

        return {
          id,
          success: response.ok,
          status: response.status,
        };
      } catch (error) {
        return {
          id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    const results = await Promise.all(testPromises);
    const failed = results.filter(r => !r.success);

    if (failed.length > 0) {
      return {
        success: false,
        error: `${failed.length} webhook endpoints failed`,
        data: { results },
      };
    }

    return {
      success: true,
      data: { message: 'All webhook endpoints tested successfully', results },
    };
  }

  async disconnect(): Promise<IntegrationResponse> {
    this.endpoints.clear();
    return { success: true };
  }

  async sendWebhook(event: WebhookEvent): Promise<IntegrationResponse> {
    const relevantEndpoints = Array.from(this.endpoints.entries()).filter(([_, endpoint]) =>
      endpoint.events.includes(event.type) || endpoint.events.includes('*')
    );

    if (relevantEndpoints.length === 0) {
      return { success: true, data: { message: 'No endpoints configured for this event type' } };
    }

    const webhookPromises = relevantEndpoints.map(async ([id, endpoint]) => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Webhook-Event': event.type,
          'X-Webhook-ID': event.id,
          'X-Webhook-Timestamp': event.timestamp,
          ...endpoint.headers,
        };

        // Add signature if secret is provided
        if (endpoint.secret) {
          const signature = await this.generateSignature(JSON.stringify(event), endpoint.secret);
          headers['X-Webhook-Signature'] = signature;
        }

        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(event),
        });

        return {
          id,
          success: response.ok,
          status: response.status,
          url: endpoint.url,
        };
      } catch (error) {
        return {
          id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          url: endpoint.url,
        };
      }
    });

    const results = await Promise.all(webhookPromises);
    const failed = results.filter(r => !r.success);

    return {
      success: failed.length === 0,
      data: {
        sent: results.length,
        failed: failed.length,
        results,
      },
    };
  }

  private async generateSignature(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  addEndpoint(endpoint: WebhookEndpoint): string {
    const id = `endpoint_${Date.now()}`;
    this.endpoints.set(id, endpoint);
    return id;
  }

  removeEndpoint(id: string): boolean {
    return this.endpoints.delete(id);
  }

  getEndpoints(): Array<{ id: string; endpoint: WebhookEndpoint }> {
    return Array.from(this.endpoints.entries()).map(([id, endpoint]) => ({ id, endpoint }));
  }
}

// Webhook event helpers
export const createWebhookEvent = (type: string, data: any, source: string = 'pos-system'): WebhookEvent => ({
  id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  type,
  data,
  timestamp: new Date().toISOString(),
  source,
});

// Common webhook events
export const WebhookEvents = {
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_COMPLETED: 'order.completed',
  ORDER_CANCELLED: 'order.cancelled',
  PAYMENT_RECEIVED: 'payment.received',
  PAYMENT_FAILED: 'payment.failed',
  INVENTORY_LOW: 'inventory.low',
  INVENTORY_OUT: 'inventory.out',
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
} as const;