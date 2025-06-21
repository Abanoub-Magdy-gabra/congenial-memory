import { BaseIntegration, IntegrationConfig, IntegrationResponse } from './index';

export interface InventoryItem {
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  supplier?: string;
  category?: string;
}

export interface InventoryUpdate {
  sku: string;
  quantity: number;
  operation: 'add' | 'subtract' | 'set';
  reason?: string;
}

// QuickBooks Integration
export class QuickBooksIntegration extends BaseIntegration {
  async initialize(): Promise<IntegrationResponse> {
    return { success: true, data: { message: 'QuickBooks integration initialized' } };
  }

  async test(): Promise<IntegrationResponse> {
    try {
      const response = await this.makeRequest(`${this.config.config.apiUrl}/v3/companyinfo`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/json',
        },
      });

      return response;
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'QuickBooks test failed' 
      };
    }
  }

  async disconnect(): Promise<IntegrationResponse> {
    return { success: true };
  }

  async syncInventory(): Promise<IntegrationResponse<InventoryItem[]>> {
    try {
      const response = await this.makeRequest(`${this.config.config.apiUrl}/v3/items`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/json',
        },
      });

      if (response.success) {
        const items = response.data.QueryResponse.Item.map((item: any) => ({
          sku: item.Name,
          name: item.Description || item.Name,
          quantity: item.QtyOnHand || 0,
          unit: item.UnitRef?.name || 'piece',
          cost: item.UnitPrice || 0,
          category: item.Type,
        }));

        return {
          success: true,
          data: items,
        };
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Inventory sync failed',
      };
    }
  }

  async updateInventory(updates: InventoryUpdate[]): Promise<IntegrationResponse> {
    try {
      const promises = updates.map(update => 
        this.makeRequest(`${this.config.config.apiUrl}/v3/items/${update.sku}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            QtyOnHand: update.quantity,
            // Add other QuickBooks specific fields
          }),
        })
      );

      const results = await Promise.all(promises);
      const failed = results.filter(r => !r.success);

      if (failed.length > 0) {
        return {
          success: false,
          error: `${failed.length} inventory updates failed`,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Inventory update failed',
      };
    }
  }
}

// Zoho Inventory Integration
export class ZohoInventoryIntegration extends BaseIntegration {
  async initialize(): Promise<IntegrationResponse> {
    return { success: true, data: { message: 'Zoho Inventory integration initialized' } };
  }

  async test(): Promise<IntegrationResponse> {
    try {
      const response = await this.makeRequest(`${this.config.config.apiUrl}/inventory/v1/organizations`, {
        method: 'GET',
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.config.apiKey}`,
        },
      });

      return response;
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Zoho Inventory test failed' 
      };
    }
  }

  async disconnect(): Promise<IntegrationResponse> {
    return { success: true };
  }

  async syncInventory(): Promise<IntegrationResponse<InventoryItem[]>> {
    try {
      const response = await this.makeRequest(`${this.config.config.apiUrl}/inventory/v1/items`, {
        method: 'GET',
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.config.apiKey}`,
        },
      });

      if (response.success) {
        const items = response.data.items.map((item: any) => ({
          sku: item.sku,
          name: item.name,
          quantity: item.stock_on_hand,
          unit: item.unit,
          cost: item.rate,
          supplier: item.vendor_name,
          category: item.category_name,
        }));

        return {
          success: true,
          data: items,
        };
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Inventory sync failed',
      };
    }
  }
}

// Local Inventory Management
export class LocalInventoryIntegration extends BaseIntegration {
  async initialize(): Promise<IntegrationResponse> {
    return { success: true, data: { message: 'Local inventory management initialized' } };
  }

  async test(): Promise<IntegrationResponse> {
    return { success: true, data: { message: 'Local inventory is ready' } };
  }

  async disconnect(): Promise<IntegrationResponse> {
    return { success: true };
  }

  async exportInventory(): Promise<IntegrationResponse<InventoryItem[]>> {
    // Export current inventory from Supabase
    try {
      const { supabase } = await import('../supabase');
      
      const { data, error } = await supabase
        .from('inventory')
        .select('*');

      if (error) throw error;

      const items = data.map((item: any) => ({
        sku: item.id,
        name: item.name,
        quantity: item.current_stock,
        unit: item.unit,
        cost: item.cost_price,
        supplier: item.suppliers?.name,
        category: item.category,
      }));

      return {
        success: true,
        data: items,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Local inventory export failed',
      };
    }
  }

  async importInventory(items: InventoryItem[]): Promise<IntegrationResponse> {
    try {
      const { supabase } = await import('../supabase');
      
      const inventoryData = items.map(item => ({
        name: item.name,
        current_stock: item.quantity,
        unit: item.unit,
        cost_price: item.cost,
        category: item.category || 'imported',
        status: item.quantity > 0 ? 'in-stock' : 'out-of-stock',
      }));

      const { error } = await supabase
        .from('inventory')
        .upsert(inventoryData);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Local inventory import failed',
      };
    }
  }
}