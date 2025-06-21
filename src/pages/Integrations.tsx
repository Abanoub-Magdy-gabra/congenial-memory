import React, { useState, useEffect } from 'react';
import {
  Settings,
  Plug,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  TestTube,
  Zap,
  CreditCard,
  Truck,
  Package,
  BarChart3,
  Webhook,
  Globe,
  Smartphone,
  DollarSign,
  Users,
  ShoppingCart,
  Database,
  Cloud,
  Lock,
  Wifi,
  RefreshCw
} from 'lucide-react';
import { integrationManager, IntegrationConfig } from '../lib/integrations';
import { StripeIntegration, PayPalIntegration, FawryIntegration } from '../lib/integrations/payment';
import { TalabatIntegration, UberEatsIntegration, LocalDeliveryIntegration } from '../lib/integrations/delivery';
import { QuickBooksIntegration, ZohoInventoryIntegration, LocalInventoryIntegration } from '../lib/integrations/inventory';
import { GoogleAnalyticsIntegration, FacebookPixelIntegration, CustomAnalyticsIntegration } from '../lib/integrations/analytics';
import { WebhookManager } from '../lib/integrations/webhooks';
import MobileButton from '../components/MobileButton';
import MobileCard from '../components/MobileCard';
import MobileModal from '../components/MobileModal';
import MobileInput from '../components/MobileInput';
import toast from 'react-hot-toast';

const Integrations = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<IntegrationConfig | null>(null);
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Available integrations
  const availableIntegrations = [
    // Payment Integrations
    {
      id: 'stripe',
      name: 'Stripe',
      type: 'payment',
      description: 'قبول المدفوعات عبر البطاقات الائتمانية والمحافظ الرقمية',
      icon: CreditCard,
      color: 'from-purple-500 to-purple-600',
      fields: [
        { key: 'publishableKey', label: 'Publishable Key', type: 'text', required: true },
        { key: 'secretKey', label: 'Secret Key', type: 'password', required: true },
      ],
      class: StripeIntegration,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'payment',
      description: 'قبول المدفوعات عبر PayPal',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      fields: [
        { key: 'clientId', label: 'Client ID', type: 'text', required: true },
        { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
        { key: 'environment', label: 'Environment', type: 'select', options: ['sandbox', 'production'], required: true },
      ],
      class: PayPalIntegration,
    },
    {
      id: 'fawry',
      name: 'Fawry',
      type: 'payment',
      description: 'قبول المدفوعات عبر فوري (مصر)',
      icon: Smartphone,
      color: 'from-orange-500 to-orange-600',
      fields: [
        { key: 'merchantCode', label: 'Merchant Code', type: 'text', required: true },
        { key: 'securityKey', label: 'Security Key', type: 'password', required: true },
      ],
      class: FawryIntegration,
    },

    // Delivery Integrations
    {
      id: 'talabat',
      name: 'Talabat',
      type: 'delivery',
      description: 'تكامل مع منصة طلبات للتوصيل',
      icon: Truck,
      color: 'from-red-500 to-red-600',
      fields: [
        { key: 'apiUrl', label: 'API URL', type: 'text', required: true },
        { key: 'apiKey', label: 'API Key', type: 'password', required: true },
        { key: 'restaurantId', label: 'Restaurant ID', type: 'text', required: true },
      ],
      class: TalabatIntegration,
    },
    {
      id: 'uber-eats',
      name: 'Uber Eats',
      type: 'delivery',
      description: 'تكامل مع Uber Eats للتوصيل',
      icon: Truck,
      color: 'from-black to-gray-800',
      fields: [
        { key: 'apiUrl', label: 'API URL', type: 'text', required: true },
        { key: 'apiKey', label: 'API Key', type: 'password', required: true },
        { key: 'storeId', label: 'Store ID', type: 'text', required: true },
      ],
      class: UberEatsIntegration,
    },
    {
      id: 'local-delivery',
      name: 'خدمة التوصيل المحلية',
      type: 'delivery',
      description: 'إدارة التوصيل بالسائقين المحليين',
      icon: Users,
      color: 'from-green-500 to-green-600',
      fields: [
        { key: 'baseDeliveryFee', label: 'رسوم التوصيل الأساسية', type: 'number', required: true },
        { key: 'freeDeliveryThreshold', label: 'حد التوصيل المجاني', type: 'number', required: true },
      ],
      class: LocalDeliveryIntegration,
    },

    // Inventory Integrations
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      type: 'inventory',
      description: 'مزامنة المخزون مع QuickBooks',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      fields: [
        { key: 'apiUrl', label: 'API URL', type: 'text', required: true },
        { key: 'apiKey', label: 'API Key', type: 'password', required: true },
        { key: 'companyId', label: 'Company ID', type: 'text', required: true },
      ],
      class: QuickBooksIntegration,
    },
    {
      id: 'zoho-inventory',
      name: 'Zoho Inventory',
      type: 'inventory',
      description: 'مزامنة المخزون مع Zoho Inventory',
      icon: Database,
      color: 'from-red-500 to-red-600',
      fields: [
        { key: 'apiUrl', label: 'API URL', type: 'text', required: true },
        { key: 'apiKey', label: 'API Key', type: 'password', required: true },
        { key: 'organizationId', label: 'Organization ID', type: 'text', required: true },
      ],
      class: ZohoInventoryIntegration,
    },

    // Analytics Integrations
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      type: 'analytics',
      description: 'تتبع الأداء والتحليلات مع Google Analytics',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      fields: [
        { key: 'measurementId', label: 'Measurement ID', type: 'text', required: true },
      ],
      class: GoogleAnalyticsIntegration,
    },
    {
      id: 'facebook-pixel',
      name: 'Facebook Pixel',
      type: 'analytics',
      description: 'تتبع التحويلات مع Facebook Pixel',
      icon: Globe,
      color: 'from-blue-600 to-blue-700',
      fields: [
        { key: 'pixelId', label: 'Pixel ID', type: 'text', required: true },
      ],
      class: FacebookPixelIntegration,
    },

    // Webhook Integration
    {
      id: 'webhooks',
      name: 'Webhooks',
      type: 'webhook',
      description: 'إرسال إشعارات للأنظمة الخارجية',
      icon: Webhook,
      color: 'from-purple-500 to-purple-600',
      fields: [
        { key: 'endpoints', label: 'Webhook Endpoints', type: 'array', required: false },
      ],
      class: WebhookManager,
    },
  ];

  const categories = [
    { id: 'all', name: 'الكل', icon: Settings },
    { id: 'payment', name: 'المدفوعات', icon: CreditCard },
    { id: 'delivery', name: 'التوصيل', icon: Truck },
    { id: 'inventory', name: 'المخزون', icon: Package },
    { id: 'analytics', name: 'التحليلات', icon: BarChart3 },
    { id: 'webhook', name: 'Webhooks', icon: Webhook },
  ];

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      await integrationManager.loadConfigurations();
      // Get configurations from integration manager
      const configs = integrationManager['configs'] || [];
      setIntegrations(configs);
    } catch (error) {
      toast.error('خطأ في تحميل التكاملات');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIntegration = (integrationTemplate: any) => {
    const newConfig: IntegrationConfig = {
      id: `${integrationTemplate.id}_${Date.now()}`,
      name: integrationTemplate.name,
      type: integrationTemplate.type,
      enabled: false,
      config: {},
    };

    setEditingIntegration(newConfig);
    setShowAddModal(true);
  };

  const handleSaveIntegration = async (config: IntegrationConfig) => {
    try {
      const template = availableIntegrations.find(t => t.id === config.name.toLowerCase().replace(/\s+/g, '-'));
      if (template) {
        const integration = new template.class(config);
        integrationManager.registerIntegration(integration, config);
      }

      await loadIntegrations();
      setShowAddModal(false);
      setEditingIntegration(null);
      toast.success('تم حفظ التكامل بنجاح');
    } catch (error) {
      toast.error('خطأ في حفظ التكامل');
    }
  };

  const handleTestIntegration = async (id: string) => {
    setTestingIntegration(id);
    try {
      const result = await integrationManager.testIntegration(id);
      if (result.success) {
        toast.success('تم اختبار التكامل بنجاح');
      } else {
        toast.error(`فشل اختبار التكامل: ${result.error}`);
      }
    } catch (error) {
      toast.error('خطأ في اختبار التكامل');
    } finally {
      setTestingIntegration(null);
    }
  };

  const handleToggleIntegration = async (id: string, enabled: boolean) => {
    try {
      if (enabled) {
        const result = await integrationManager.enableIntegration(id);
        if (result.success) {
          toast.success('تم تفعيل التكامل');
        } else {
          toast.error(`فشل تفعيل التكامل: ${result.error}`);
        }
      } else {
        await integrationManager.disableIntegration(id);
        toast.success('تم إيقاف التكامل');
      }
      await loadIntegrations();
    } catch (error) {
      toast.error('خطأ في تغيير حالة التكامل');
    }
  };

  const handleDeleteIntegration = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التكامل؟')) return;

    try {
      await integrationManager.disableIntegration(id);
      // Remove from configurations
      const configs = integrationManager['configs'].filter((c: IntegrationConfig) => c.id !== id);
      integrationManager['configs'] = configs;
      await integrationManager.saveConfigurations();
      
      await loadIntegrations();
      toast.success('تم حذف التكامل');
    } catch (error) {
      toast.error('خطأ في حذف التكامل');
    }
  };

  const filteredIntegrations = integrations.filter(integration => 
    selectedCategory === 'all' || integration.type === selectedCategory
  );

  const getIntegrationTemplate = (integration: IntegrationConfig) => {
    return availableIntegrations.find(t => 
      t.id === integration.name.toLowerCase().replace(/\s+/g, '-') ||
      t.name === integration.name
    );
  };

  const getStatusIcon = (integration: IntegrationConfig) => {
    if (integration.enabled) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل التكاملات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التكاملات</h1>
          <p className="text-gray-600">ربط النظام مع الخدمات الخارجية</p>
        </div>
        <MobileButton
          variant="primary"
          onClick={() => setShowAddModal(true)}
          icon={Plus}
        >
          إضافة تكامل
        </MobileButton>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-2">
        {categories.map((category) => (
          <MobileButton
            key={category.id}
            variant={selectedCategory === category.id ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            icon={category.icon}
            className="whitespace-nowrap"
          >
            {category.name}
          </MobileButton>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => {
          const template = getIntegrationTemplate(integration);
          return (
            <MobileCard key={integration.id} className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {template && (
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${template.color} flex items-center justify-center`}>
                      <template.icon className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{integration.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  {getStatusIcon(integration)}
                  <div className="relative">
                    <MobileButton
                      variant="ghost"
                      size="sm"
                      icon={Settings}
                      className="p-2"
                    />
                  </div>
                </div>
              </div>

              {template && (
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              )}

              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-medium ${
                  integration.enabled ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {integration.enabled ? 'مفعل' : 'غير مفعل'}
                </span>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={integration.enabled}
                    onChange={(e) => handleToggleIntegration(integration.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <MobileButton
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditingIntegration(integration);
                    setShowAddModal(true);
                  }}
                  icon={Edit}
                >
                  تعديل
                </MobileButton>
                
                <MobileButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleTestIntegration(integration.id)}
                  loading={testingIntegration === integration.id}
                  icon={TestTube}
                >
                  اختبار
                </MobileButton>
                
                <MobileButton
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteIntegration(integration.id)}
                  icon={Trash2}
                >
                  حذف
                </MobileButton>
              </div>
            </MobileCard>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <Plug className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تكاملات</h3>
          <p className="text-gray-500 mb-4">ابدأ بإضافة تكامل جديد لربط النظام مع الخدمات الخارجية</p>
          <MobileButton
            variant="primary"
            onClick={() => setShowAddModal(true)}
            icon={Plus}
          >
            إضافة أول تكامل
          </MobileButton>
        </div>
      )}

      {/* Available Integrations Modal */}
      <MobileModal
        isOpen={showAddModal && !editingIntegration}
        onClose={() => setShowAddModal(false)}
        title="إضافة تكامل جديد"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">اختر نوع التكامل الذي تريد إضافته:</p>
          
          <div className="grid grid-cols-1 gap-4">
            {availableIntegrations.map((template) => (
              <div
                key={template.id}
                onClick={() => handleAddIntegration(template)}
                className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center`}>
                    <template.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                    {template.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MobileModal>

      {/* Integration Configuration Modal */}
      {editingIntegration && (
        <IntegrationConfigModal
          integration={editingIntegration}
          template={getIntegrationTemplate(editingIntegration)}
          onSave={handleSaveIntegration}
          onCancel={() => {
            setEditingIntegration(null);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

// Integration Configuration Modal Component
interface IntegrationConfigModalProps {
  integration: IntegrationConfig;
  template: any;
  onSave: (config: IntegrationConfig) => void;
  onCancel: () => void;
}

const IntegrationConfigModal: React.FC<IntegrationConfigModalProps> = ({
  integration,
  template,
  onSave,
  onCancel,
}) => {
  const [config, setConfig] = useState(integration);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (template?.fields) {
      template.fields.forEach((field: any) => {
        if (field.required && !config.config[field.key]) {
          newErrors[field.key] = `${field.label} مطلوب`;
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    onSave(config);
  };

  return (
    <MobileModal
      isOpen={true}
      onClose={onCancel}
      title={`إعداد ${integration.name}`}
      size="lg"
    >
      <div className="space-y-6">
        {template && (
          <div className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-xl">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${template.color} flex items-center justify-center`}>
              <template.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <MobileInput
            label="اسم التكامل"
            value={config.name}
            onChange={(value) => setConfig(prev => ({ ...prev, name: value }))}
            required
          />

          {template?.fields?.map((field: any) => (
            <div key={field.key}>
              {field.type === 'select' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label} {field.required && '*'}
                  </label>
                  <select
                    value={config.config[field.key] || ''}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      config: { ...prev.config, [field.key]: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر {field.label}</option>
                    {field.options?.map((option: string) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors[field.key] && (
                    <p className="text-sm text-red-600 mt-1">{errors[field.key]}</p>
                  )}
                </div>
              ) : (
                <MobileInput
                  label={field.label}
                  type={field.type}
                  value={config.config[field.key] || ''}
                  onChange={(value) => setConfig(prev => ({
                    ...prev,
                    config: { ...prev.config, [field.key]: value }
                  }))}
                  required={field.required}
                  error={errors[field.key]}
                />
              )}
            </div>
          ))}

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="enableIntegration"
              checked={config.enabled}
              onChange={(e) => setConfig(prev => ({ ...prev, enabled: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
            />
            <label htmlFor="enableIntegration" className="text-sm text-gray-700">
              تفعيل التكامل بعد الحفظ
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <MobileButton
            variant="secondary"
            onClick={onCancel}
            fullWidth
          >
            إلغاء
          </MobileButton>
          <MobileButton
            variant="primary"
            onClick={handleSave}
            fullWidth
          >
            حفظ
          </MobileButton>
        </div>
      </div>
    </MobileModal>
  );
};

export default Integrations;