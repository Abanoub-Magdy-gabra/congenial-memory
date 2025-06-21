import { BaseIntegration, IntegrationConfig, IntegrationResponse } from './index';

export interface DeliveryRequest {
  orderId: string;
  pickupAddress: {
    street: string;
    area: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  deliveryAddress: {
    street: string;
    area: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  customerInfo: {
    name: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  notes?: string;
}

export interface DeliveryResponse {
  deliveryId: string;
  estimatedTime: number;
  cost: number;
  driverInfo?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  trackingUrl?: string;
}

// Talabat Integration
export class TalabatIntegration extends BaseIntegration {
  async initialize(): Promise<IntegrationResponse> {
    return { success: true, data: { message: 'Talabat integration initialized' } };
  }

  async test(): Promise<IntegrationResponse> {
    try {
      const response = await this.makeRequest(`${this.config.config.apiUrl}/restaurants/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      return response;
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Talabat test failed' 
      };
    }
  }

  async disconnect(): Promise<IntegrationResponse> {
    return { success: true };
  }

  async createDelivery(request: DeliveryRequest): Promise<IntegrationResponse<DeliveryResponse>> {
    try {
      const response = await this.makeRequest(`${this.config.config.apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          external_order_id: request.orderId,
          pickup_location: {
            address: `${request.pickupAddress.street}, ${request.pickupAddress.area}`,
            coordinates: request.pickupAddress.coordinates,
          },
          delivery_location: {
            address: `${request.deliveryAddress.street}, ${request.deliveryAddress.area}`,
            coordinates: request.deliveryAddress.coordinates,
          },
          customer: {
            name: request.customerInfo.name,
            phone: request.customerInfo.phone,
          },
          items: request.items,
          total_amount: request.totalAmount,
          notes: request.notes,
        }),
      });

      if (response.success) {
        return {
          success: true,
          data: {
            deliveryId: response.data.order_id,
            estimatedTime: response.data.estimated_delivery_time,
            cost: response.data.delivery_fee,
            trackingUrl: response.data.tracking_url,
          },
        };
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Talabat delivery creation failed',
      };
    }
  }

  async trackDelivery(deliveryId: string): Promise<IntegrationResponse> {
    try {
      const response = await this.makeRequest(`${this.config.config.apiUrl}/orders/${deliveryId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delivery tracking failed',
      };
    }
  }
}

// Uber Eats Integration
export class UberEatsIntegration extends BaseIntegration {
  async initialize(): Promise<IntegrationResponse> {
    return { success: true, data: { message: 'Uber Eats integration initialized' } };
  }

  async test(): Promise<IntegrationResponse> {
    try {
      const response = await this.makeRequest(`${this.config.config.apiUrl}/v1/eats/stores`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      return response;
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Uber Eats test failed' 
      };
    }
  }

  async disconnect(): Promise<IntegrationResponse> {
    return { success: true };
  }

  async createDelivery(request: DeliveryRequest): Promise<IntegrationResponse<DeliveryResponse>> {
    try {
      const response = await this.makeRequest(`${this.config.config.apiUrl}/v1/eats/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          external_reference_id: request.orderId,
          pickup_address: request.pickupAddress,
          dropoff_address: request.deliveryAddress,
          customer: request.customerInfo,
          items: request.items,
          order_value: request.totalAmount,
          special_instructions: request.notes,
        }),
      });

      if (response.success) {
        return {
          success: true,
          data: {
            deliveryId: response.data.id,
            estimatedTime: response.data.estimated_pickup_time,
            cost: response.data.fee,
            driverInfo: response.data.driver,
          },
        };
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Uber Eats delivery creation failed',
      };
    }
  }
}

// Local Delivery Service
export class LocalDeliveryIntegration extends BaseIntegration {
  async initialize(): Promise<IntegrationResponse> {
    return { success: true, data: { message: 'Local delivery service initialized' } };
  }

  async test(): Promise<IntegrationResponse> {
    return { success: true, data: { message: 'Local delivery service is ready' } };
  }

  async disconnect(): Promise<IntegrationResponse> {
    return { success: true };
  }

  async createDelivery(request: DeliveryRequest): Promise<IntegrationResponse<DeliveryResponse>> {
    // Simulate local delivery creation
    const deliveryId = `LOCAL_${Date.now()}`;
    const estimatedTime = this.calculateEstimatedTime(request.pickupAddress, request.deliveryAddress);
    const cost = this.calculateDeliveryCost(request.totalAmount);

    return {
      success: true,
      data: {
        deliveryId,
        estimatedTime,
        cost,
        driverInfo: {
          name: 'سائق محلي',
          phone: '01234567890',
          vehicle: 'دراجة نارية',
        },
      },
    };
  }

  private calculateEstimatedTime(pickup: any, delivery: any): number {
    // Simple distance-based calculation
    // In real implementation, use Google Maps API or similar
    return Math.floor(Math.random() * 30) + 15; // 15-45 minutes
  }

  private calculateDeliveryCost(orderAmount: number): number {
    // Simple cost calculation based on order amount
    if (orderAmount >= 100) return 10; // Free delivery threshold
    return 15;
  }
}