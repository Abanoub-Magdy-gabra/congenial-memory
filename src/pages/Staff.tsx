import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Calendar,
  Clock,
  UserCheck,
  UserX,
  Shield,
  User,
  Download,
  Upload,
  Award,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Camera,
  MapPin,
  Briefcase,
  Star,
  MoreVertical,
  FileText,
  CreditCard,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: Date;
  status: 'active' | 'inactive' | 'on-leave' | 'terminated';
  permissions: string[];
  workSchedule: {
    startTime: string;
    endTime: string;
    workDays: string[];
  };
  avatar?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  performance: {
    rating: number;
    lastReview: Date;
    goals: string[];
  };
  attendance: {
    totalDays: number;
    presentDays: number;
    lateDays: number;
    absentDays: number;
  };
  benefits: {
    healthInsurance: boolean;
    paidLeave: number;
    bonus: number;
  };
  documents: {
    id: boolean;
    contract: boolean;
    certificate: boolean;
  };
}

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const departments = ['all', 'المطبخ', 'الخدمة', 'الإدارة', 'المحاسبة', 'الأمن', 'التنظيف', 'التسويق'];
  
  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'active', label: 'نشط' },
    { value: 'inactive', label: 'غير نشط' },
    { value: 'on-leave', label: 'في إجازة' },
    { value: 'terminated', label: 'منتهي الخدمة' }
  ];

  const permissions = [
    'kitchen_management',
    'menu_edit',
    'inventory_view',
    'service_management',
    'orders_view',
    'customer_management',
    'financial_reports',
    'payroll_management',
    'pos_access',
    'admin_panel'
  ];

  // Enhanced sample staff data
  const staffMembers: StaffMember[] = [
    {
      id: '1',
      name: 'أحمد محمد علي',
      email: 'ahmed.mohamed@restaurant.com',
      phone: '01234567890',
      position: 'رئيس الطهاة',
      department: 'المطبخ',
      salary: 8000,
      hireDate: new Date('2023-01-15'),
      status: 'active',
      permissions: ['kitchen_management', 'menu_edit', 'inventory_view'],
      workSchedule: {
        startTime: '08:00',
        endTime: '18:00',
        workDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']
      },
      address: 'شارع النيل، المعادي، القاهرة',
      emergencyContact: {
        name: 'فاطمة علي',
        phone: '01098765432',
        relationship: 'زوجة'
      },
      performance: {
        rating: 4.8,
        lastReview: new Date('2024-11-01'),
        goals: ['تطوير قائمة جديدة', 'تدريب الطهاة الجدد', 'تحسين كفاءة المطبخ']
      },
      attendance: {
        totalDays: 250,
        presentDays: 240,
        lateDays: 5,
        absentDays: 5
      },
      benefits: {
        healthInsurance: true,
        paidLeave: 21,
        bonus: 2000
      },
      documents: {
        id: true,
        contract: true,
        certificate: true
      }
    },
    {
      id: '2',
      name: 'فاطمة حسن',
      email: 'fatma.hassan@restaurant.com',
      phone: '01098765432',
      position: 'مديرة الخدمة',
      department: 'الخدمة',
      salary: 6000,
      hireDate: new Date('2023-03-20'),
      status: 'active',
      permissions: ['service_management', 'orders_view', 'customer_management'],
      workSchedule: {
        startTime: '10:00',
        endTime: '22:00',
        workDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
      },
      address: 'شارع الجمهورية، وسط البلد، القاهرة',
      emergencyContact: {
        name: 'محمد حسن',
        phone: '01555123456',
        relationship: 'أخ'
      },
      performance: {
        rating: 4.5,
        lastReview: new Date('2024-10-15'),
        goals: ['تحسين خدمة العملاء', 'تدريب فريق الخدمة', 'زيادة رضا العملاء']
      },
      attendance: {
        totalDays: 220,
        presentDays: 215,
        lateDays: 3,
        absentDays: 2
      },
      benefits: {
        healthInsurance: true,
        paidLeave: 18,
        bonus: 1500
      },
      documents: {
        id: true,
        contract: true,
        certificate: false
      }
    },
    {
      id: '3',
      name: 'محمد أحمد',
      email: 'mohamed.ahmed@restaurant.com',
      phone: '01555123456',
      position: 'نادل أول',
      department: 'الخدمة',
      salary: 4000,
      hireDate: new Date('2023-06-10'),
      status: 'active',
      permissions: ['orders_create', 'pos_access'],
      workSchedule: {
        startTime: '14:00',
        endTime: '24:00',
        workDays: ['الخميس', 'الجمعة', 'السبت', 'الأحد']
      },
      address: 'شارع التحرير، الدقي، الجيزة',
      emergencyContact: {
        name: 'سارة أحمد',
        phone: '01777888999',
        relationship: 'أخت'
      },
      performance: {
        rating: 4.2,
        lastReview: new Date('2024-09-20'),
        goals: ['تحسين سرعة الخدمة', 'تعلم مهارات جديدة', 'زيادة المبيعات']
      },
      attendance: {
        totalDays: 180,
        presentDays: 175,
        lateDays: 8,
        absentDays: 5
      },
      benefits: {
        healthInsurance: false,
        paidLeave: 14,
        bonus: 800
      },
      documents: {
        id: true,
        contract: true,
        certificate: false
      }
    },
    {
      id: '4',
      name: 'سارة عبدالله',
      email: 'sara.abdullah@restaurant.com',
      phone: '01777888999',
      position: 'محاسبة رئيسية',
      department: 'المحاسبة',
      salary: 7000,
      hireDate: new Date('2023-02-01'),
      status: 'on-leave',
      permissions: ['financial_reports', 'payroll_management', 'inventory_cost'],
      workSchedule: {
        startTime: '09:00',
        endTime: '17:00',
        workDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء']
      },
      address: 'شارع الهرم، الجيزة',
      emergencyContact: {
        name: 'خالد عبدالله',
        phone: '01666555444',
        relationship: 'زوج'
      },
      performance: {
        rating: 4.7,
        lastReview: new Date('2024-08-10'),
        goals: ['تطوير نظام المحاسبة', 'تحسين التقارير المالية', 'تدريب مساعد محاسب']
      },
      attendance: {
        totalDays: 240,
        presentDays: 230,
        lateDays: 2,
        absentDays: 8
      },
      benefits: {
        healthInsurance: true,
        paidLeave: 25,
        bonus: 2500
      },
      documents: {
        id: true,
        contract: true,
        certificate: true
      }
    },
    {
      id: '5',
      name: 'خالد عمر',
      email: 'khaled.omar@restaurant.com',
      phone: '01666555444',
      position: 'طباخ متخصص',
      department: 'المطبخ',
      salary: 4500,
      hireDate: new Date('2023-08-15'),
      status: 'active',
      permissions: ['kitchen_access', 'inventory_view'],
      workSchedule: {
        startTime: '06:00',
        endTime: '16:00',
        workDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']
      },
      address: 'شارع فيصل، الجيزة',
      emergencyContact: {
        name: 'أمينة عمر',
        phone: '01234567890',
        relationship: 'أم'
      },
      performance: {
        rating: 4.0,
        lastReview: new Date('2024-07-25'),
        goals: ['تعلم أطباق جديدة', 'تحسين سرعة التحضير', 'المساعدة في التدريب']
      },
      attendance: {
        totalDays: 120,
        presentDays: 115,
        lateDays: 3,
        absentDays: 2
      },
      benefits: {
        healthInsurance: false,
        paidLeave: 12,
        bonus: 600
      },
      documents: {
        id: true,
        contract: true,
        certificate: false
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-800';
      case 'inactive': return 'bg-danger-100 text-danger-800';
      case 'on-leave': return 'bg-warning-100 text-warning-800';
      case 'terminated': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="h-4 w-4" />;
      case 'inactive': return <UserX className="h-4 w-4" />;
      case 'on-leave': return <Clock className="h-4 w-4" />;
      case 'terminated': return <AlertCircle className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'on-leave': return 'في إجازة';
      case 'terminated': return 'منتهي الخدمة';
      default: return 'غير معروف';
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || staff.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const toggleStaffStatus = (id: string) => {
    toast.success('تم تحديث حالة الموظف');
  };

  const deleteStaff = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      toast.success('تم حذف الموظف بنجاح');
    }
  };

  const calculateWorkingYears = (hireDate: Date) => {
    const now = new Date();
    const years = now.getFullYear() - hireDate.getFullYear();
    const months = now.getMonth() - hireDate.getMonth();
    
    if (years === 0) {
      return `${months} شهر`;
    } else if (months < 0) {
      return `${years - 1} سنة و ${12 + months} شهر`;
    } else {
      return `${years} سنة و ${months} شهر`;
    }
  };

  const calculateAttendanceRate = (attendance: StaffMember['attendance']) => {
    return ((attendance.presentDays / attendance.totalDays) * 100).toFixed(1);
  };

  const exportStaffData = () => {
    toast.success('تم تصدير بيانات الموظفين بنجاح');
  };

  const importStaffData = () => {
    toast.success('تم استيراد بيانات الموظفين بنجاح');
  };

  const stats = {
    total: staffMembers.length,
    active: staffMembers.filter(s => s.status === 'active').length,
    inactive: staffMembers.filter(s => s.status === 'inactive').length,
    onLeave: staffMembers.filter(s => s.status === 'on-leave').length,
    terminated: staffMembers.filter(s => s.status === 'terminated').length,
    totalSalaries: staffMembers.reduce((sum, staff) => sum + staff.salary, 0),
    avgPerformance: (staffMembers.reduce((sum, staff) => sum + staff.performance.rating, 0) / staffMembers.length).toFixed(1),
    avgAttendance: (staffMembers.reduce((sum, staff) => sum + (staff.attendance.presentDays / staff.attendance.totalDays * 100), 0) / staffMembers.length).toFixed(1)
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الموظفين</h1>
          <p className="text-gray-600">إدارة ومتابعة شاملة لموظفي المطعم</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button
            onClick={importStaffData}
            className="btn-secondary"
          >
            <Upload className="h-4 w-4 ml-2" />
            استيراد
          </button>
          <button
            onClick={exportStaffData}
            className="btn-secondary"
          >
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة موظف جديد
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-100">
                <User className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="mr-3 flex-1">
              <p className="text-xs font-medium text-gray-600">إجمالي</p>
              <p className="text-lg font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-success-100">
                <UserCheck className="h-5 w-5 text-success-600" />
              </div>
            </div>
            <div className="mr-3 flex-1">
              <p className="text-xs font-medium text-gray-600">نشط</p>
              <p className="text-lg font-bold text-success-600">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-warning-100">
                <Clock className="h-5 w-5 text-warning-600" />
              </div>
            </div>
            <div className="mr-3 flex-1">
              <p className="text-xs font-medium text-gray-600">إجازة</p>
              <p className="text-lg font-bold text-warning-600">{stats.onLeave}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-danger-100">
                <UserX className="h-5 w-5 text-danger-600" />
              </div>
            </div>
            <div className="mr-3 flex-1">
              <p className="text-xs font-medium text-gray-600">غير نشط</p>
              <p className="text-lg font-bold text-danger-600">{stats.inactive}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mr-3 flex-1">
              <p className="text-xs font-medium text-gray-600">الرواتب</p>
              <p className="text-lg font-bold text-gray-900">{(stats.totalSalaries / 1000).toFixed(0)}ك</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mr-3 flex-1">
              <p className="text-xs font-medium text-gray-600">الأداء</p>
              <p className="text-lg font-bold text-purple-600">{stats.avgPerformance}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mr-3 flex-1">
              <p className="text-xs font-medium text-gray-600">الحضور</p>
              <p className="text-lg font-bold text-green-600">{stats.avgAttendance}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-100">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="mr-3 flex-1">
              <p className="text-xs font-medium text-gray-600">النمو</p>
              <p className="text-lg font-bold text-orange-600">+12%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في الموظفين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">جميع الأقسام</option>
              {departments.filter(dept => dept !== 'all').map(department => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary"
            >
              <Filter className="h-4 w-4 ml-2" />
              فلاتر متقدمة
            </button>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="grid grid-cols-2 gap-1 w-4 h-4">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="space-y-1 w-4 h-4">
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التوظيف</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">جميع التواريخ</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نطاق الراتب</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">جميع النطاقات</option>
                <option value="low">أقل من 4000</option>
                <option value="medium">4000 - 7000</option>
                <option value="high">أكثر من 7000</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تقييم الأداء</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">جميع التقييمات</option>
                <option value="excellent">ممتاز (4.5+)</option>
                <option value="good">جيد (4.0-4.4)</option>
                <option value="average">متوسط (3.5-3.9)</option>
                <option value="poor">ضعيف (أقل من 3.5)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الصلاحيات</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">جميع الصلاحيات</option>
                <option value="admin">إدارية</option>
                <option value="kitchen">مطبخ</option>
                <option value="service">خدمة</option>
                <option value="financial">مالية</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Staff Display */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staff) => (
            <div key={staff.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Staff Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary-600">
                        {staff.name.split(' ')[0].charAt(0)}
                      </span>
                    </div>
                    <div className="mr-3">
                      <h3 className="text-lg font-semibold text-gray-900">{staff.name}</h3>
                      <p className="text-sm text-gray-600">{staff.position}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Status and Department */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                    {getStatusIcon(staff.status)}
                    <span className="mr-1">{getStatusText(staff.status)}</span>
                  </span>
                  <span className="text-sm text-gray-500">{staff.department}</span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-3 w-3 ml-2" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-3 w-3 ml-2" />
                    <span>{staff.phone}</span>
                  </div>
                </div>

                {/* Performance and Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getPerformanceColor(staff.performance.rating)}`}>
                      {staff.performance.rating}
                    </div>
                    <div className="text-xs text-gray-500">الأداء</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {calculateAttendanceRate(staff.attendance)}%
                    </div>
                    <div className="text-xs text-gray-500">الحضور</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {staff.salary.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">الراتب</div>
                  </div>
                </div>

                {/* Working Years */}
                <div className="text-center text-sm text-gray-500 mb-4">
                  {calculateWorkingYears(staff.hireDate)} في الخدمة
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => setEditingStaff(staff)}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    <Eye className="h-3 w-3 ml-1" />
                    عرض
                  </button>
                  <button className="flex-1 btn-secondary text-sm py-2">
                    <Edit className="h-3 w-3 ml-1" />
                    تعديل
                  </button>
                  <button
                    onClick={() => toggleStaffStatus(staff.id)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {staff.status === 'active' ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الموظف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنصب / القسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الراتب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الأداء
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحضور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {staff.name.split(' ')[0].charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staff.position}</div>
                      <div className="text-sm text-gray-500">{staff.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {staff.salary.toLocaleString()} ج.م
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className={`h-4 w-4 ml-1 ${getPerformanceColor(staff.performance.rating)}`} />
                        <span className={`text-sm font-medium ${getPerformanceColor(staff.performance.rating)}`}>
                          {staff.performance.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {calculateAttendanceRate(staff.attendance)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {staff.attendance.presentDays}/{staff.attendance.totalDays}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                        {getStatusIcon(staff.status)}
                        <span className="mr-1">{getStatusText(staff.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => setEditingStaff(staff)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleStaffStatus(staff.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          {staff.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => deleteStaff(staff.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد موظفين</h3>
          <p className="text-gray-500">لا يوجد موظفين يطابقون المعايير المحددة</p>
        </div>
      )}

      {/* Enhanced Staff Details Modal */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center ml-4">
                  <span className="text-lg font-medium text-primary-600">
                    {editingStaff.name.split(' ')[0].charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{editingStaff.name}</h2>
                  <p className="text-gray-600">{editingStaff.position} - {editingStaff.department}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingStaff(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal Information */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 ml-2" />
                      المعلومات الشخصية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                        <p className="text-sm text-gray-900">{editingStaff.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                        <p className="text-sm text-gray-900">{editingStaff.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                        <p className="text-sm text-gray-900">{editingStaff.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                        <p className="text-sm text-gray-900">{editingStaff.address || 'غير محدد'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Work Information */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Briefcase className="h-5 w-5 ml-2" />
                      معلومات العمل
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">المنصب</label>
                        <p className="text-sm text-gray-900">{editingStaff.position}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
                        <p className="text-sm text-gray-900">{editingStaff.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الراتب</label>
                        <p className="text-sm text-gray-900">{editingStaff.salary.toLocaleString()} ج.م</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التوظيف</label>
                        <p className="text-sm text-gray-900">{editingStaff.hireDate.toLocaleDateString('ar-EG')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Work Schedule */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="h-5 w-5 ml-2" />
                      جدول العمل
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">وقت البداية</label>
                        <p className="text-sm text-gray-900">{editingStaff.workSchedule.startTime}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">وقت النهاية</label>
                        <p className="text-sm text-gray-900">{editingStaff.workSchedule.endTime}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">أيام العمل</label>
                      <div className="flex flex-wrap gap-2">
                        {editingStaff.workSchedule.workDays.map((day) => (
                          <span key={day} className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  {editingStaff.emergencyContact && (
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Phone className="h-5 w-5 ml-2" />
                        جهة الاتصال في الطوارئ
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                          <p className="text-sm text-gray-900">{editingStaff.emergencyContact.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                          <p className="text-sm text-gray-900">{editingStaff.emergencyContact.phone}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">صلة القرابة</label>
                          <p className="text-sm text-gray-900">{editingStaff.emergencyContact.relationship}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Stats and Performance */}
                <div className="space-y-6">
                  {/* Performance */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Award className="h-5 w-5 ml-2" />
                      الأداء
                    </h3>
                    <div className="text-center mb-4">
                      <div className={`text-3xl font-bold ${getPerformanceColor(editingStaff.performance.rating)}`}>
                        {editingStaff.performance.rating}
                      </div>
                      <div className="text-sm text-gray-500">من 5.0</div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">آخر مراجعة</label>
                        <p className="text-sm text-gray-900">{editingStaff.performance.lastReview.toLocaleDateString('ar-EG')}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الأهداف</label>
                        <div className="space-y-1">
                          {editingStaff.performance.goals.map((goal, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="h-3 w-3 text-green-500 ml-2" />
                              {goal}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attendance */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Activity className="h-5 w-5 ml-2" />
                      الحضور والانصراف
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">معدل الحضور</span>
                        <span className="text-sm font-medium text-green-600">
                          {calculateAttendanceRate(editingStaff.attendance)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">أيام الحضور</span>
                        <span className="text-sm font-medium">{editingStaff.attendance.presentDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">أيام التأخير</span>
                        <span className="text-sm font-medium text-yellow-600">{editingStaff.attendance.lateDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">أيام الغياب</span>
                        <span className="text-sm font-medium text-red-600">{editingStaff.attendance.absentDays}</span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 ml-2" />
                      المزايا والحوافز
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">التأمين الصحي</span>
                        <span className={`text-sm font-medium ${editingStaff.benefits.healthInsurance ? 'text-green-600' : 'text-red-600'}`}>
                          {editingStaff.benefits.healthInsurance ? 'مفعل' : 'غير مفعل'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">الإجازة المدفوعة</span>
                        <span className="text-sm font-medium">{editingStaff.benefits.paidLeave} يوم</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">المكافآت</span>
                        <span className="text-sm font-medium text-green-600">{editingStaff.benefits.bonus} ج.م</span>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="h-5 w-5 ml-2" />
                      الوثائق
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">بطاقة الهوية</span>
                        <span className={`text-sm ${editingStaff.documents.id ? 'text-green-600' : 'text-red-600'}`}>
                          {editingStaff.documents.id ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">عقد العمل</span>
                        <span className={`text-sm ${editingStaff.documents.contract ? 'text-green-600' : 'text-red-600'}`}>
                          {editingStaff.documents.contract ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">الشهادات</span>
                        <span className={`text-sm ${editingStaff.documents.certificate ? 'text-green-600' : 'text-red-600'}`}>
                          {editingStaff.documents.certificate ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="h-5 w-5 ml-2" />
                      الصلاحيات
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {editingStaff.permissions.map((permission) => (
                        <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200">
              <div className="flex space-x-3 space-x-reverse">
                <button className="btn-secondary">
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل البيانات
                </button>
                <button className="btn-secondary">
                  <FileText className="h-4 w-4 ml-2" />
                  طباعة التقرير
                </button>
              </div>
              <button
                onClick={() => setEditingStaff(null)}
                className="btn-primary"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">إضافة موظف جديد</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">المعلومات الأساسية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
                      <input type="text" className="input-field" placeholder="الاسم الكامل" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
                      <input type="email" className="input-field" placeholder="البريد الإلكتروني" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</label>
                      <input type="tel" className="input-field" placeholder="رقم الهاتف" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
                      <input type="date" className="input-field" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                      <input type="text" className="input-field" placeholder="العنوان الكامل" />
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات العمل</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">المنصب *</label>
                      <input type="text" className="input-field" placeholder="المنصب" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">القسم *</label>
                      <select className="input-field" required>
                        <option value="">اختر القسم</option>
                        {departments.filter(dept => dept !== 'all').map(department => (
                          <option key={department} value={department}>
                            {department}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الراتب *</label>
                      <input type="number" className="input-field" placeholder="الراتب بالجنيه المصري" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التوظيف *</label>
                      <input type="date" className="input-field" required />
                    </div>
                  </div>
                </div>

                {/* Work Schedule */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">جدول العمل</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">وقت البداية</label>
                      <input type="time" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">وقت النهاية</label>
                      <input type="time" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">أيام العمل</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map((day) => (
                        <label key={day} className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 ml-2" />
                          <span className="text-sm">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">جهة الاتصال في الطوارئ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                      <input type="text" className="input-field" placeholder="اسم جهة الاتصال" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                      <input type="tel" className="input-field" placeholder="رقم الهاتف" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">صلة القرابة</label>
                      <select className="input-field">
                        <option value="">اختر صلة القرابة</option>
                        <option value="زوج/زوجة">زوج/زوجة</option>
                        <option value="أب/أم">أب/أم</option>
                        <option value="أخ/أخت">أخ/أخت</option>
                        <option value="ابن/ابنة">ابن/ابنة</option>
                        <option value="صديق">صديق</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">الصلاحيات</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {permissions.map((permission) => (
                      <label key={permission} className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 ml-2" />
                        <span className="text-sm">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 space-x-reverse p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 btn-secondary"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  toast.success('تم إضافة الموظف بنجاح');
                }}
                className="flex-1 btn-primary"
              >
                إضافة الموظف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;