/**
 * Integration Framework for Restaurant POS System
 * Provides unified interface for all external integrations
 */

export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'payment' | 'delivery' | 'inventory' | 'accounting' | 'marketing' | 'analytics';
  enabled: boolean;
  config: Record<string, any>;
  webhookUrl?: string;
  apiKey?: string;
  secretKey?: string;
}

export interface IntegrationResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export abstract class BaseIntegration {
  protected config: IntegrationConfig;

  constructor(config: IntegrationConfig) {
    this.config = config;
  }

  abstract initialize(): Promise<IntegrationResponse>;
  abstract test(): Promise<IntegrationResponse>;
  abstract disconnect(): Promise<IntegrationResponse>;

  protected async makeRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<IntegrationResponse> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.message || 'Request failed',
        code: response.status.toString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Integration Manager
export class IntegrationManager {
  private integrations: Map<string, BaseIntegration> = new Map();
  private configs: IntegrationConfig[] = [];

  async loadConfigurations(): Promise<void> {
    // Load from Supabase or local storage
    const stored = localStorage.getItem('pos_integrations');
    if (stored) {
      this.configs = JSON.parse(stored);
    }
  }

  async saveConfigurations(): Promise<void> {
    localStorage.setItem('pos_integrations', JSON.stringify(this.configs));
  }

  registerIntegration(integration: BaseIntegration, config: IntegrationConfig): void {
    this.integrations.set(config.id, integration);
    const existingIndex = this.configs.findIndex(c => c.id === config.id);
    if (existingIndex >= 0) {
      this.configs[existingIndex] = config;
    } else {
      this.configs.push(config);
    }
    this.saveConfigurations();
  }

  getIntegration(id: string): BaseIntegration | undefined {
    return this.integrations.get(id);
  }

  getEnabledIntegrations(type?: string): BaseIntegration[] {
    return this.configs
      .filter(config => config.enabled && (!type || config.type === type))
      .map(config => this.integrations.get(config.id))
      .filter(Boolean) as BaseIntegration[];
  }

  async testIntegration(id: string): Promise<IntegrationResponse> {
    const integration = this.getIntegration(id);
    if (!integration) {
      return { success: false, error: 'Integration not found' };
    }
    return integration.test();
  }

  async enableIntegration(id: string): Promise<IntegrationResponse> {
    const config = this.configs.find(c => c.id === id);
    if (!config) {
      return { success: false, error: 'Configuration not found' };
    }

    const integration = this.getIntegration(id);
    if (!integration) {
      return { success: false, error: 'Integration not registered' };
    }

    const result = await integration.initialize();
    if (result.success) {
      config.enabled = true;
      await this.saveConfigurations();
    }

    return result;
  }

  async disableIntegration(id: string): Promise<IntegrationResponse> {
    const config = this.configs.find(c => c.id === id);
    if (!config) {
      return { success: false, error: 'Configuration not found' };
    }

    const integration = this.getIntegration(id);
    if (integration) {
      await integration.disconnect();
    }

    config.enabled = false;
    await this.saveConfigurations();

    return { success: true };
  }
}

// Global integration manager instance
export const integrationManager = new IntegrationManager();

export { BaseIntegration }