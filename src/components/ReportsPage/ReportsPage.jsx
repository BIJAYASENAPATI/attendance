import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  Download,
  FileText,
  Award,
  CreditCard,
  RefreshCw,
  XCircle,
  Filter,
  Search,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Clock,
  Target,
  Percent,
  Globe,
  Phone,
  Mail,
  Store,
  Smartphone
} from 'lucide-react';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('revenue'); // revenue, staff, service, source, payment, tax, cancellation
  const [dateRange, setDateRange] = useState('thisMonth');
  const [selectedPeriod, setSelectedPeriod] = useState({ from: '2026-02-01', to: '2026-02-14' });

  // Mock Revenue Data
  const revenueData = {
    totalRevenue: 125450,
    growth: 15.8,
    avgBookingValue: 1250,
    totalBookings: 156,
    cashRevenue: 45600,
    onlineRevenue: 79850,
    previousPeriod: {
      totalRevenue: 108320,
      totalBookings: 142
    },
    dailyRevenue: [
      { date: '2026-02-01', revenue: 8500, bookings: 12 },
      { date: '2026-02-02', revenue: 9200, bookings: 14 },
      { date: '2026-02-03', revenue: 7800, bookings: 10 },
      { date: '2026-02-04', revenue: 10500, bookings: 15 },
      { date: '2026-02-05', revenue: 8900, bookings: 13 },
      { date: '2026-02-06', revenue: 9600, bookings: 14 },
      { date: '2026-02-07', revenue: 11200, bookings: 16 },
      { date: '2026-02-08', revenue: 8700, bookings: 12 },
      { date: '2026-02-09', revenue: 9400, bookings: 13 },
      { date: '2026-02-10', revenue: 10100, bookings: 15 },
      { date: '2026-02-11', revenue: 8800, bookings: 11 },
      { date: '2026-02-12', revenue: 9500, bookings: 14 },
      { date: '2026-02-13', revenue: 10200, bookings: 15 },
      { date: '2026-02-14', revenue: 8950, bookings: 12 }
    ],
    byService: [
      { name: 'Deep Tissue Massage', revenue: 42000, bookings: 35, percentage: 33.5 },
      { name: 'Haircut', revenue: 28500, bookings: 57, percentage: 22.7 },
      { name: 'Facial Treatment', revenue: 24000, bookings: 30, percentage: 19.1 },
      { name: 'Hot Stone Massage', revenue: 18000, bookings: 12, percentage: 14.3 },
      { name: 'Manicure', revenue: 12950, bookings: 22, percentage: 10.4 }
    ]
  };

  // Mock Staff Performance Data
  const staffPerformance = [
    {
      id: 'STF001',
      name: 'Sarah Johnson',
      avatar: '👩‍⚕️',
      role: 'Senior Therapist',
      totalBookings: 45,
      completedBookings: 43,
      cancelledBookings: 2,
      revenue: 54000,
      avgRating: 4.8,
      commissionEarned: 10800,
      workingHours: 180,
      customerRetention: 85,
      growth: 12.5
    },
    {
      id: 'STF002',
      name: 'John Smith',
      avatar: '👨‍💼',
      role: 'Hair Stylist',
      totalBookings: 52,
      completedBookings: 50,
      cancelledBookings: 2,
      revenue: 26000,
      avgRating: 4.6,
      commissionEarned: 3900,
      workingHours: 176,
      customerRetention: 78,
      growth: 8.3
    },
    {
      id: 'STF003',
      name: 'Emily Davis',
      avatar: '👩',
      role: 'Beautician',
      totalBookings: 38,
      completedBookings: 37,
      cancelledBookings: 1,
      revenue: 30400,
      avgRating: 4.9,
      commissionEarned: 5472,
      workingHours: 152,
      customerRetention: 92,
      growth: 15.2
    },
    {
      id: 'STF004',
      name: 'Michael Brown',
      avatar: '👨‍💼',
      role: 'Receptionist',
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      revenue: 0,
      avgRating: 4.5,
      commissionEarned: 0,
      workingHours: 168,
      customerRetention: 0,
      growth: 0
    }
  ];

  // Mock Service Performance Data
  const servicePerformance = [
    {
      id: 'SRV001',
      name: 'Deep Tissue Massage',
      category: 'Massage',
      totalBookings: 35,
      completedBookings: 34,
      cancelledBookings: 1,
      revenue: 42000,
      avgDuration: 65,
      avgPrice: 1200,
      satisfaction: 4.8,
      repeatCustomers: 28,
      peakDay: 'Saturday',
      peakTime: '2:00 PM - 4:00 PM'
    },
    {
      id: 'SRV002',
      name: 'Haircut',
      category: 'Hair',
      totalBookings: 57,
      completedBookings: 55,
      cancelledBookings: 2,
      revenue: 28500,
      avgDuration: 48,
      avgPrice: 500,
      satisfaction: 4.6,
      repeatCustomers: 42,
      peakDay: 'Friday',
      peakTime: '6:00 PM - 8:00 PM'
    },
    {
      id: 'SRV003',
      name: 'Facial Treatment',
      category: 'Skincare',
      totalBookings: 30,
      completedBookings: 29,
      cancelledBookings: 1,
      revenue: 24000,
      avgDuration: 62,
      avgPrice: 800,
      satisfaction: 4.7,
      repeatCustomers: 21,
      peakDay: 'Sunday',
      peakTime: '11:00 AM - 1:00 PM'
    }
  ];

  // Mock Booking Source Data
  const bookingSourceData = [
    { source: 'Website', bookings: 58, revenue: 69600, percentage: 37.2, growth: 15.3 },
    { source: 'Mobile App', bookings: 42, revenue: 50400, percentage: 26.9, growth: 22.8 },
    { source: 'Phone Call', bookings: 28, revenue: 33600, percentage: 17.9, growth: -5.2 },
    { source: 'Walk-in', bookings: 18, revenue: 21600, percentage: 11.5, growth: 8.1 },
    { source: 'Social Media', bookings: 10, revenue: 12000, percentage: 6.5, growth: 35.6 }
  ];

  // Mock Payment Method Data
  const paymentMethodData = [
    { method: 'Credit Card', transactions: 52, amount: 62400, percentage: 40.5, avgTransaction: 1200 },
    { method: 'UPI', transactions: 38, amount: 45600, percentage: 29.6, avgTransaction: 1200 },
    { method: 'Cash', transactions: 28, amount: 33600, percentage: 21.8, avgTransaction: 1200 },
    { method: 'Debit Card', transactions: 12, amount: 14400, percentage: 8.1, avgTransaction: 1200 }
  ];

  // Mock Tax Report Data
  const taxReportData = {
    totalTaxCollected: 22581,
    gst: 20323,
    serviceTax: 2258,
    taxableAmount: 112905,
    exemptAmount: 12545,
    byRate: [
      { rate: '18% GST', amount: 20323, transactions: 125 },
      { rate: '5% Service Tax', amount: 2258, transactions: 31 }
    ]
  };

  // Mock Cancellation Data
  const cancellationData = {
    totalCancellations: 12,
    cancellationRate: 7.7,
    totalRefunds: 14400,
    byReason: [
      { reason: 'Customer Request', count: 5, percentage: 41.7 },
      { reason: 'Staff Unavailable', count: 3, percentage: 25.0 },
      { reason: 'Weather', count: 2, percentage: 16.7 },
      { reason: 'Emergency', count: 1, percentage: 8.3 },
      { reason: 'Other', count: 1, percentage: 8.3 }
    ],
    byTimeframe: [
      { timeframe: 'Same Day', count: 4, percentage: 33.3 },
      { timeframe: '1-3 Days Before', count: 5, percentage: 41.7 },
      { timeframe: '4-7 Days Before', count: 2, percentage: 16.7 },
      { timeframe: '7+ Days Before', count: 1, percentage: 8.3 }
    ]
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <ArrowUp size={16} className="text-green-600" />;
    if (growth < 0) return <ArrowDown size={16} className="text-red-600" />;
    return null;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">Reports</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="thisWeek">This Week</option>
              <option value="lastWeek">Last Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
              <Download size={20} />
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto border-b border-gray-200">
        {[
          { id: 'revenue', label: 'Revenue', icon: DollarSign },
          { id: 'staff', label: 'Staff Performance', icon: Users },
          { id: 'service', label: 'Service Performance', icon: Award },
          { id: 'source', label: 'Booking Sources', icon: Globe },
          { id: 'payment', label: 'Payment Methods', icon: CreditCard },
          { id: 'tax', label: 'Tax Report', icon: Percent },
          { id: 'cancellation', label: 'Cancellations', icon: XCircle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Revenue Report Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Revenue Stats */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Total Revenue</span>
                <DollarSign size={24} className="opacity-50" />
              </div>
              <div className="text-3xl font-bold mb-2">₹{revenueData.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center gap-2 text-sm">
                {getGrowthIcon(revenueData.growth)}
                <span className="opacity-90">{revenueData.growth}% vs last period</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Avg Booking Value</span>
                <Target size={20} className="text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">₹{revenueData.avgBookingValue.toLocaleString()}</div>
              <div className="text-sm text-gray-500">From {revenueData.totalBookings} bookings</div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Cash Revenue</span>
                <span className="text-2xl">💵</span>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">₹{revenueData.cashRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{((revenueData.cashRevenue / revenueData.totalRevenue) * 100).toFixed(1)}% of total</div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Online Revenue</span>
                <CreditCard size={20} className="text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">₹{revenueData.onlineRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{((revenueData.onlineRevenue / revenueData.totalRevenue) * 100).toFixed(1)}% of total</div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Daily Revenue Trend</h3>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Download size={18} />
                Export
              </button>
            </div>
            <div className="h-64 flex items-end gap-2">
              {revenueData.dailyRevenue.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer relative group"
                    style={{ height: `${(day.revenue / 12000) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{day.revenue.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(day.date).getDate()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Service */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Revenue by Service</h3>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Download size={18} />
                Export
              </button>
            </div>
            <div className="space-y-4">
              {revenueData.byService.map((service, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{service.name}</span>
                      <span className="text-sm text-gray-500">({service.bookings} bookings)</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹{service.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{service.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Staff Performance Tab */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          {/* Staff Performance Cards */}
          <div className="grid grid-cols-1 gap-6">
            {staffPerformance.map(staff => (
              <div key={staff.id} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl">
                      {staff.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{staff.name}</h3>
                      <p className="text-gray-600">{staff.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Award size={16} className="text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">{staff.avgRating}</span>
                        <span className="text-sm text-gray-500">Rating</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">₹{staff.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                    <div className={`flex items-center justify-end gap-1 mt-1 text-sm ${getGrowthColor(staff.growth)}`}>
                      {getGrowthIcon(staff.growth)}
                      <span>{staff.growth}% growth</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{staff.totalBookings}</div>
                    <div className="text-xs text-gray-600 mt-1">Total Bookings</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{staff.completedBookings}</div>
                    <div className="text-xs text-gray-600 mt-1">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{staff.cancelledBookings}</div>
                    <div className="text-xs text-gray-600 mt-1">Cancelled</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">₹{staff.commissionEarned.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 mt-1">Commission</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{staff.workingHours}h</div>
                    <div className="text-xs text-gray-600 mt-1">Working Hours</div>
                  </div>
                  <div className="text-center p-4 bg-cyan-50 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-600">{staff.customerRetention}%</div>
                    <div className="text-xs text-gray-600 mt-1">Retention</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
              <Download size={20} />
              Export Staff Performance Report
            </button>
          </div>
        </div>
      )}

      {/* Service Performance Tab */}
      {activeTab === 'service' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {servicePerformance.map(service => (
              <div key={service.id} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {service.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">₹{service.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{service.totalBookings}</div>
                    <div className="text-xs text-gray-600 mt-1">Total Bookings</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{service.completedBookings}</div>
                    <div className="text-xs text-gray-600 mt-1">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">₹{service.avgPrice}</div>
                    <div className="text-xs text-gray-600 mt-1">Avg Price</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{service.avgDuration}m</div>
                    <div className="text-xs text-gray-600 mt-1">Avg Duration</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{service.satisfaction}</div>
                    <div className="text-xs text-gray-600 mt-1">Satisfaction</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Repeat Customers</div>
                    <div className="font-bold text-gray-900">{service.repeatCustomers} / {service.totalBookings}</div>
                    <div className="text-xs text-green-600">{((service.repeatCustomers / service.totalBookings) * 100).toFixed(1)}% retention</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Peak Day</div>
                    <div className="font-bold text-gray-900">{service.peakDay}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Peak Time</div>
                    <div className="font-bold text-gray-900">{service.peakTime}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
              <Download size={20} />
              Export Service Performance Report
            </button>
          </div>
        </div>
      )}

      {/* Booking Source Tab */}
      {activeTab === 'source' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Total Bookings</div>
              <div className="text-3xl font-bold text-gray-900">
                {bookingSourceData.reduce((sum, s) => sum + s.bookings, 0)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Total Revenue</div>
              <div className="text-3xl font-bold text-green-600">
                ₹{bookingSourceData.reduce((sum, s) => sum + s.revenue, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Top Source</div>
              <div className="text-2xl font-bold text-blue-600">{bookingSourceData[0].source}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Sources Breakdown</h3>
            <div className="space-y-4">
              {bookingSourceData.map((source, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                        {source.source === 'Website' && <Globe size={24} />}
                        {source.source === 'Mobile App' && <Smartphone size={24} />}
                        {source.source === 'Phone Call' && <Phone size={24} />}
                        {source.source === 'Walk-in' && <Store size={24} />}
                        {source.source === 'Social Media' && <Mail size={24} />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{source.source}</div>
                        <div className="text-sm text-gray-600">{source.bookings} bookings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">₹{source.revenue.toLocaleString()}</div>
                      <div className={`text-sm flex items-center gap-1 ${getGrowthColor(source.growth)}`}>
                        {getGrowthIcon(source.growth)}
                        <span>{Math.abs(source.growth)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{source.percentage}% of total</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
              <Download size={20} />
              Export Booking Source Report
            </button>
          </div>
        </div>
      )}

      {/* Payment Method Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Total Transactions</div>
              <div className="text-3xl font-bold text-gray-900">
                {paymentMethodData.reduce((sum, p) => sum + p.transactions, 0)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Total Amount</div>
              <div className="text-3xl font-bold text-green-600">
                ₹{paymentMethodData.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Avg Transaction</div>
              <div className="text-3xl font-bold text-blue-600">₹1,200</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Top Method</div>
              <div className="text-2xl font-bold text-purple-600">{paymentMethodData[0].method}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Methods Breakdown</h3>
            <div className="grid grid-cols-2 gap-6">
              {paymentMethodData.map((payment, idx) => (
                <div key={idx} className="p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{payment.method}</div>
                        <div className="text-sm text-gray-600">{payment.transactions} transactions</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Amount:</span>
                      <span className="font-bold text-gray-900">₹{payment.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Percentage:</span>
                      <span className="font-bold text-blue-600">{payment.percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Transaction:</span>
                      <span className="font-bold text-purple-600">₹{payment.avgTransaction.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${payment.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
              <Download size={20} />
              Export Payment Method Report
            </button>
          </div>
        </div>
      )}

      {/* Tax Report Tab */}
      {activeTab === 'tax' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-sm opacity-90 mb-2">Total Tax Collected</div>
              <div className="text-3xl font-bold">₹{taxReportData.totalTaxCollected.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">GST (18%)</div>
              <div className="text-3xl font-bold text-green-600">₹{taxReportData.gst.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Service Tax</div>
              <div className="text-3xl font-bold text-purple-600">₹{taxReportData.serviceTax.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Taxable Amount</div>
              <div className="text-3xl font-bold text-gray-900">₹{taxReportData.taxableAmount.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Tax Breakdown by Rate</h3>
            <div className="space-y-4">
              {taxReportData.byRate.map((tax, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-bold text-gray-900">{tax.rate}</div>
                      <div className="text-sm text-gray-600">{tax.transactions} transactions</div>
                    </div>
                    <div className="text-xl font-bold text-green-600">₹{tax.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Percent size={24} className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Tax Filing Information</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Your tax report for this period is ready. Please ensure all taxes are filed within the due date.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-700">GSTIN: <strong>27AABCU9603R1ZM</strong></span>
                  <span className="text-gray-700">Period: <strong>February 2026</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
              <Download size={20} />
              Export Tax Report
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Report Tab */}
      {activeTab === 'cancellation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Total Cancellations</div>
              <div className="text-3xl font-bold text-red-600">{cancellationData.totalCancellations}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Cancellation Rate</div>
              <div className="text-3xl font-bold text-orange-600">{cancellationData.cancellationRate}%</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Total Refunds</div>
              <div className="text-3xl font-bold text-purple-600">₹{cancellationData.totalRefunds.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Revenue Loss</div>
              <div className="text-3xl font-bold text-gray-900">₹{cancellationData.totalRefunds.toLocaleString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* By Reason */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Cancellations by Reason</h3>
              <div className="space-y-3">
                {cancellationData.byReason.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{item.reason}</span>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">{item.count}</span>
                        <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Timeframe */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Cancellations by Timeframe</h3>
              <div className="space-y-3">
                {cancellationData.byTimeframe.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{item.timeframe}</span>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">{item.count}</span>
                        <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle size={24} className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Cancellation Insights</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Most cancellations occur 1-3 days before the appointment. Consider implementing a cancellation policy to reduce last-minute cancellations.
                </p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium">
                    View Cancellation Policy
                  </button>
                  <button className="px-4 py-2 border border-yellow-500 text-yellow-700 rounded-lg hover:bg-yellow-100 text-sm font-medium">
                    Send Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
              <Download size={20} />
              Export Cancellation Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;