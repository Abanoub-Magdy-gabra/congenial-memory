import React, { useState } from 'react';
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface SMSTemplate {
  id: string;
  name: string;
  message: string;
  variables: string[];
}

interface SMSNotification {
  id: string;
  phone: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: Date;
  orderId: string;
}

interface SMSNotificationManagerProps {
  onSendSMS: (phone: string, message: string, orderId: string) => void;
}

const SMSNotificationManager: React.FC<SMSNotificationManagerProps> = ({ onSendSMS }) => {
  const [templates] = useState<SMSTemplate[]>([
    {
      id: '1',
      name: 'تأكيد الطلب',
      message: 'تم تأكيد طلبكم رقم {orderNumber}. وقت التحضير المتوقع: {estimatedTime} دقيقة. شكراً لثقتكم.',
      variables: ['orderNumber', 'estimatedTime']
    },
    {
      id: '2',
      name: 'الطلب جاهز',
      message: 'طلبكم رقم {orderNumber} جاهز للاستلام. يرجى الحضور لاستلام طلبكم.',
      variables: ['orderNumber']
    },
    {
      id: '3',
      name: 'خرج للتوصيل',
      message: 'طلبكم رقم {orderNumber} خرج للتوصيل. السائق: {driverName} - {driverPhone}',
      variables: ['orderNumber', 'driverName', 'driverPhone']
    },
    {
      id: '4',
      name: 'تم التوصيل',
      message: 'تم تسليم طلبكم رقم {orderNumber} بنجاح. شكراً لاختياركم مطعمنا.',
      variables: ['orderNumber']
    }
  ]);

  const [notifications, setNotifications] = useState<SMSNotification[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<SMSTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  const sendSMS = (templateId: string, variables: Record<string, string>, phone: string, orderId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    let message = template.message;
    template.variables.forEach(variable => {
      message = message.replace(`{${variable}}`, variables[variable] || '');
    });

    const notification: SMSNotification = {
      id: Date.now().toString(),
      phone,
      message,
      status: 'pending',
      orderId
    };

    setNotifications(prev => [...prev, notification]);

    // Simulate SMS sending
    setTimeout(() => {
      setNotifications(prev => prev.map(n => 
        n.id === notification.id 
          ? { ...n, status: 'sent', sentAt: new Date() }
          : n
      ));
      toast.success('تم إرسال الرسالة بنجاح');
    }, 1000);

    onSendSMS(phone, message, orderId);
  };

  const sendCustomSMS = () => {
    if (!recipientPhone || !customMessage) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    const notification: SMSNotification = {
      id: Date.now().toString(),
      phone: recipientPhone,
      message: customMessage,
      status: 'pending',
      orderId: 'custom'
    };

    setNotifications(prev => [...prev, notification]);

    setTimeout(() => {
      setNotifications(prev => prev.map(n => 
        n.id === notification.id 
          ? { ...n, status: 'sent', sentAt: new Date() }
          : n
      ));
      toast.success('تم إرسال الرسالة بنجاح');
    }, 1000);

    setRecipientPhone('');
    setCustomMessage('');
    onSendSMS(recipientPhone, customMessage, 'custom');
  };

  const getStatusIcon = (status: SMSNotification['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">إدارة الرسائل النصية</h3>

      {/* SMS Templates */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">قوالب الرسائل</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">{template.name}</h5>
              <p className="text-sm text-gray-600 mb-3">{template.message}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {template.variables.map((variable) => (
                  <span key={variable} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {variable}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedTemplate(template)}
                className="btn-primary text-sm"
              >
                استخدام القالب
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom SMS */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">رسالة مخصصة</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
            <input
              type="tel"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className="input-field"
              placeholder="01xxxxxxxxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نص الرسالة</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="input-field"
              rows={3}
              placeholder="اكتب رسالتك هنا..."
              maxLength={160}
            />
            <div className="text-xs text-gray-500 mt-1">
              {customMessage.length}/160 حرف
            </div>
          </div>
          <button
            onClick={sendCustomSMS}
            className="btn-primary"
          >
            <Send className="h-4 w-4 ml-2" />
            إرسال الرسالة
          </button>
        </div>
      </div>

      {/* SMS History */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">سجل الرسائل</h4>
        <div className="space-y-3">
          {notifications.slice(-10).reverse().map((notification) => (
            <div key={notification.id} className="flex items-start space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(notification.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{notification.phone}</span>
                  {notification.sentAt && (
                    <span className="text-xs text-gray-500">
                      {notification.sentAt.toLocaleTimeString('ar-EG')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
                {notification.orderId !== 'custom' && (
                  <span className="text-xs text-gray-500">طلب #{notification.orderId}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Usage Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              استخدام قالب: {selectedTemplate.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="01xxxxxxxxx"
                />
              </div>
              
              {selectedTemplate.variables.map((variable) => (
                <div key={variable}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {variable}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={`أدخل ${variable}`}
                  />
                </div>
              ))}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">معاينة الرسالة</label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  {selectedTemplate.message}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="flex-1 btn-secondary"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  // Handle template usage
                  setSelectedTemplate(null);
                  toast.success('تم إرسال الرسالة');
                }}
                className="flex-1 btn-primary"
              >
                إرسال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SMSNotificationManager;