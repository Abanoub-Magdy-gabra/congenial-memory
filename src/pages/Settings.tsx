import React, { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Printer,
  Database,
  Wifi,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Camera,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);

  // Sample settings state
  const [settings, setSettings] = useState({
    general: {
      restaurantName: 'مطعم الذوق الرفيع',
      address: '123 شارع النيل، القاهرة',
      phone: '01234567890',
      email: 'info@restaurant.com',
      currency: 'EGP',
      timezone: 'Africa/Cairo',
      language: 'ar'
    },
    notifications: {
      orderNotifications: true,
      lowStockAlerts: true,
      emailNotifications: false,
      smsNotifications: true,
      soundAlerts: true
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorAuth: false,
      sessionTimeout: 30
    },
    appearance: {
      theme: 'light',
      primaryColor: '#0ea5e9',
      fontSize: 'medium',
      compactMode: false
    },
    printer: {
      receiptPrinter: 'HP LaserJet',
      kitchenPrinter: 'Epson TM-T88V',
      autoprint: true,
      paperSize: '80mm'
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      lastBackup: new Date('2024-12-15T02:00:00')
    }
  });

  const tabs = [
    { id: 'general', name: 'عام', icon: User },
    { id: 'notifications', name: 'الإشعارات', icon: Bell },
    { id: 'security', name: 'الأمان', icon: Shield },
    { id: 'appearance', name: 'المظهر', icon: Palette },
    { id: 'printer', name: 'الطابعات', icon: Printer },
    { id: 'backup', name: 'النسخ الاحتياطي', icon: Database }
  ];

  const handleSave = () => {
    // Save settings logic here
    toast.success('تم حفظ الإعدادات بنجاح');
  };

  const handleBackup = () => {
    // Backup logic here
    toast.success('تم إنشاء نسخة احتياطية بنجاح');
  };

  const handleRestore = () => {
    // Restore logic here
    toast.success('تم استعادة النسخة الاحتياطية بنجاح');
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
          <p className="text-gray-600">إدارة إعدادات النظام والمطعم</p>
        </div>
        <button
          onClick={handleSave}
          className="btn-primary"
        >
          <Save className="h-4 w-4 ml-2" />
          حفظ التغييرات
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4 ml-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">الإعدادات العامة</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم المطعم
                    </label>
                    <input
                      type="text"
                      value={settings.general.restaurantName}
                      onChange={(e) => updateSetting('general', 'restaurantName', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={settings.general.phone}
                      onChange={(e) => updateSetting('general', 'phone', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان
                    </label>
                    <textarea
                      value={settings.general.address}
                      onChange={(e) => updateSetting('general', 'address', e.target.value)}
                      rows={3}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={settings.general.email}
                      onChange={(e) => updateSetting('general', 'email', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العملة
                    </label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                      className="input-field"
                    >
                      <option value="EGP">جنيه مصري (EGP)</option>
                      <option value="USD">دولار أمريكي (USD)</option>
                      <option value="EUR">يورو (EUR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المنطقة الزمنية
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                      className="input-field"
                    >
                      <option value="Africa/Cairo">القاهرة</option>
                      <option value="Asia/Dubai">دبي</option>
                      <option value="Asia/Riyadh">الرياض</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اللغة
                    </label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => updateSetting('general', 'language', e.target.value)}
                      className="input-field"
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الإشعارات</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">إشعارات الطلبات</h3>
                      <p className="text-sm text-gray-600">تلقي إشعارات عند وصول طلبات جديدة</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.orderNotifications}
                      onChange={(e) => updateSetting('notifications', 'orderNotifications', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">تنبيهات المخزون المنخفض</h3>
                      <p className="text-sm text-gray-600">تلقي تنبيهات عند انخفاض المخزون</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.lowStockAlerts}
                      onChange={(e) => updateSetting('notifications', 'lowStockAlerts', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">إشعارات البريد الإلكتروني</h3>
                      <p className="text-sm text-gray-600">إرسال إشعارات عبر البريد الإلكتروني</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">إشعارات الرسائل النصية</h3>
                      <p className="text-sm text-gray-600">إرسال إشعارات عبر الرسائل النصية</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">التنبيهات الصوتية</h3>
                      <p className="text-sm text-gray-600">تشغيل أصوات التنبيه</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.soundAlerts}
                      onChange={(e) => updateSetting('notifications', 'soundAlerts', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الأمان</h2>
                
                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">تغيير كلمة المرور</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          كلمة المرور الحالية
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={settings.security.currentPassword}
                            onChange={(e) => updateSetting('security', 'currentPassword', e.target.value)}
                            className="input-field pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          كلمة المرور الجديدة
                        </label>
                        <input
                          type="password"
                          value={settings.security.newPassword}
                          onChange={(e) => updateSetting('security', 'newPassword', e.target.value)}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          تأكيد كلمة المرور الجديدة
                        </label>
                        <input
                          type="password"
                          value={settings.security.confirmPassword}
                          onChange={(e) => updateSetting('security', 'confirmPassword', e.target.value)}
                          className="input-field"
                        />
                      </div>

                      <button className="btn-primary">
                        تحديث كلمة المرور
                      </button>
                    </div>
                  </div>

                  {/* Two Factor Authentication */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">المصادقة الثنائية</h3>
                      <p className="text-sm text-gray-600">تفعيل المصادقة الثنائية لحماية إضافية</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  {/* Session Timeout */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">انتهاء صلاحية الجلسة</h3>
                    <p className="text-sm text-gray-600 mb-4">تحديد مدة انتهاء صلاحية الجلسة بالدقائق</p>
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', Number(e.target.value))}
                      className="input-field w-auto"
                    >
                      <option value={15}>15 دقيقة</option>
                      <option value={30}>30 دقيقة</option>
                      <option value={60}>60 دقيقة</option>
                      <option value={120}>120 دقيقة</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">إعدادات المظهر</h2>
                
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">المظهر العام</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => updateSetting('appearance', 'theme', 'light')}
                        className={`p-4 border-2 rounded-lg transition-colors ${
                          settings.appearance.theme === 'light'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="w-full h-20 bg-white border border-gray-200 rounded mb-2"></div>
                        <span className="text-sm font-medium">فاتح</span>
                      </button>
                      <button
                        onClick={() => updateSetting('appearance', 'theme', 'dark')}
                        className={`p-4 border-2 rounded-lg transition-colors ${
                          settings.appearance.theme === 'dark'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="w-full h-20 bg-gray-800 border border-gray-600 rounded mb-2"></div>
                        <span className="text-sm font-medium">داكن</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">اللون الأساسي</h3>
                    <div className="grid grid-cols-6 gap-3">
                      {['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'].map((color) => (
                        <button
                          key={color}
                          onClick={() => updateSetting('appearance', 'primaryColor', color)}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            settings.appearance.primaryColor === color
                              ? 'border-gray-800 scale-110'
                              : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">حجم الخط</h3>
                    <select
                      value={settings.appearance.fontSize}
                      onChange={(e) => updateSetting('appearance', 'fontSize', e.target.value)}
                      className="input-field w-auto"
                    >
                      <option value="small">صغير</option>
                      <option value="medium">متوسط</option>
                      <option value="large">كبير</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">الوضع المضغوط</h3>
                      <p className="text-sm text-gray-600">عرض المزيد من المحتوى في مساحة أقل</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.appearance.compactMode}
                      onChange={(e) => updateSetting('appearance', 'compactMode', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Printer Settings */}
          {activeTab === 'printer' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الطابعات</h2>
                
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">طابعة الفواتير</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          اسم الطابعة
                        </label>
                        <select
                          value={settings.printer.receiptPrinter}
                          onChange={(e) => updateSetting('printer', 'receiptPrinter', e.target.value)}
                          className="input-field"
                        >
                          <option value="HP LaserJet">HP LaserJet</option>
                          <option value="Canon PIXMA">Canon PIXMA</option>
                          <option value="Epson L3150">Epson L3150</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">طابعة المطبخ</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          اسم الطابعة
                        </label>
                        <select
                          value={settings.printer.kitchenPrinter}
                          onChange={(e) => updateSetting('printer', 'kitchenPrinter', e.target.value)}
                          className="input-field"
                        >
                          <option value="Epson TM-T88V">Epson TM-T88V</option>
                          <option value="Star TSP143">Star TSP143</option>
                          <option value="Citizen CT-S310">Citizen CT-S310</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">الطباعة التلقائية</h3>
                      <p className="text-sm text-gray-600">طباعة الطلبات تلقائياً عند التأكيد</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.printer.autoprint}
                      onChange={(e) => updateSetting('printer', 'autoprint', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">حجم الورق</h3>
                    <select
                      value={settings.printer.paperSize}
                      onChange={(e) => updateSetting('printer', 'paperSize', e.target.value)}
                      className="input-field w-auto"
                    >
                      <option value="80mm">80mm</option>
                      <option value="58mm">58mm</option>
                      <option value="A4">A4</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backup Settings */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">النسخ الاحتياطي</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">النسخ الاحتياطي التلقائي</h3>
                      <p className="text-sm text-gray-600">إنشاء نسخ احتياطية تلقائياً</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.backup.autoBackup}
                      onChange={(e) => updateSetting('backup', 'autoBackup', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">تكرار النسخ الاحتياطي</h3>
                    <select
                      value={settings.backup.backupFrequency}
                      onChange={(e) => updateSetting('backup', 'backupFrequency', e.target.value)}
                      className="input-field w-auto"
                      disabled={!settings.backup.autoBackup}
                    >
                      <option value="daily">يومياً</option>
                      <option value="weekly">أسبوعياً</option>
                      <option value="monthly">شهرياً</option>
                    </select>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">آخر نسخة احتياطية</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {settings.backup.lastBackup.toLocaleDateString('ar-EG')} في {settings.backup.lastBackup.toLocaleTimeString('ar-EG')}
                    </p>
                    <div className="flex space-x-3 space-x-reverse">
                      <button
                        onClick={handleBackup}
                        className="btn-primary"
                      >
                        <Database className="h-4 w-4 ml-2" />
                        إنشاء نسخة احتياطية الآن
                      </button>
                      <button
                        onClick={handleRestore}
                        className="btn-secondary"
                      >
                        <RefreshCw className="h-4 w-4 ml-2" />
                        استعادة نسخة احتياطية
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Bell className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="mr-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          تنبيه مهم
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            تأكد من إنشاء نسخ احتياطية منتظمة لحماية بياناتك. يُنصح بحفظ النسخ الاحتياطية في مكان آمن خارج الخادم الرئيسي.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;