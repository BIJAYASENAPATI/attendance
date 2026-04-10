import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  CreditCard,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  Printer,
  Mail,
  Calendar,
  Clock,
  Percent,
  Tag,
  TrendingUp,
  Users,
  Gift,
  Crown
} from 'lucide-react';

const InvoicesPage = () => {
  const [activeTab, setActiveTab] = useState('invoices'); // invoices, payments, refunds, tax, discounts, memberships
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Invoices Data
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2026-001',
      customer: { name: 'Emma Wilson', email: 'emma@email.com', avatar: '👩' },
      bookingId: 'BK001',
      date: '2026-02-14',
      dueDate: '2026-02-21',
      services: [
        { name: 'Deep Tissue Massage', price: 1200, quantity: 1, tax: 216 }
      ],
      subtotal: 1200,
      tax: 216,
      discount: 0,
      total: 1416,
      status: 'paid',
      paymentMethod: 'Card',
      paidOn: '2026-02-14'
    },
    {
      id: 'INV-2026-002',
      customer: { name: 'Michael Brown', email: 'michael@email.com', avatar: '👨' },
      bookingId: 'BK002',
      date: '2026-02-14',
      dueDate: '2026-02-21',
      services: [
        { name: 'Haircut', price: 500, quantity: 1, tax: 90 },
        { name: 'Beard Trim', price: 300, quantity: 1, tax: 54 }
      ],
      subtotal: 800,
      tax: 144,
      discount: 50,
      total: 894,
      status: 'pending',
      paymentMethod: null,
      paidOn: null
    },
    {
      id: 'INV-2026-003',
      customer: { name: 'Sarah Miller', email: 'sarah@email.com', avatar: '👧' },
      bookingId: 'BK003',
      date: '2026-02-13',
      dueDate: '2026-02-20',
      services: [
        { name: 'Facial Treatment', price: 800, quantity: 1, tax: 144 }
      ],
      subtotal: 800,
      tax: 144,
      discount: 100,
      total: 844,
      status: 'overdue',
      paymentMethod: null,
      paidOn: null
    }
  ]);

  // Mock Payments Data
  const [payments, setPayments] = useState([
    {
      id: 'PAY-001',
      invoiceId: 'INV-2026-001',
      customer: 'Emma Wilson',
      amount: 1416,
      method: 'Credit Card',
      date: '2026-02-14',
      time: '10:30 AM',
      status: 'completed',
      transactionId: 'TXN123456789',
      notes: ''
    },
    {
      id: 'PAY-002',
      invoiceId: 'INV-2026-004',
      customer: 'David Lee',
      amount: 1500,
      method: 'Cash',
      date: '2026-02-13',
      time: '3:45 PM',
      status: 'completed',
      transactionId: null,
      notes: 'Paid in full'
    },
    {
      id: 'PAY-003',
      invoiceId: 'INV-2026-005',
      customer: 'Jessica Taylor',
      amount: 600,
      method: 'UPI',
      date: '2026-02-12',
      time: '11:20 AM',
      status: 'completed',
      transactionId: 'UPI987654321',
      notes: ''
    }
  ]);

  // Mock Refunds Data
  const [refunds, setRefunds] = useState([
    {
      id: 'REF-001',
      invoiceId: 'INV-2026-010',
      customer: 'Robert Garcia',
      amount: 1200,
      reason: 'Service cancelled by customer',
      date: '2026-02-10',
      status: 'completed',
      method: 'Bank Transfer',
      processedBy: 'Admin'
    },
    {
      id: 'REF-002',
      invoiceId: 'INV-2026-015',
      customer: 'Alice Cooper',
      amount: 500,
      reason: 'Service not satisfactory',
      date: '2026-02-08',
      status: 'pending',
      method: 'Original Payment Method',
      processedBy: null
    }
  ]);

  // Tax & Charges Configuration
  const [taxConfig, setTaxConfig] = useState({
    gst: { enabled: true, rate: 18, type: 'percentage' },
    serviceTax: { enabled: false, rate: 0, type: 'percentage' },
    serviceCharge: { enabled: true, rate: 50, type: 'fixed' },
    convenienceFee: { enabled: false, rate: 2, type: 'percentage' }
  });

  // Discounts & Coupons
  const [discounts, setDiscounts] = useState([
    {
      id: 'DISC001',
      code: 'FIRST20',
      name: 'First Time Customer',
      type: 'percentage',
      value: 20,
      minAmount: 500,
      maxDiscount: 200,
      validFrom: '2026-01-01',
      validTo: '2026-12-31',
      usageLimit: 100,
      usedCount: 45,
      status: 'active'
    },
    {
      id: 'DISC002',
      code: 'HAPPY100',
      name: 'Flat 100 Off',
      type: 'fixed',
      value: 100,
      minAmount: 1000,
      maxDiscount: 100,
      validFrom: '2026-02-01',
      validTo: '2026-02-28',
      usageLimit: 50,
      usedCount: 12,
      status: 'active'
    },
    {
      id: 'DISC003',
      code: 'SUMMER25',
      name: 'Summer Special',
      type: 'percentage',
      value: 25,
      minAmount: 0,
      maxDiscount: 500,
      validFrom: '2026-03-01',
      validTo: '2026-05-31',
      usageLimit: 200,
      usedCount: 0,
      status: 'scheduled'
    }
  ]);

  // Membership Plans
  const [memberships, setMemberships] = useState([
    {
      id: 'MEM001',
      name: 'Silver Membership',
      duration: '3 months',
      price: 2999,
      discount: 10,
      benefits: ['10% off all services', 'Priority booking', '1 free massage/month'],
      status: 'active',
      subscribers: 45,
      icon: '🥈'
    },
    {
      id: 'MEM002',
      name: 'Gold Membership',
      duration: '6 months',
      price: 5499,
      discount: 15,
      benefits: ['15% off all services', 'Priority booking', '2 free services/month', 'Birthday special'],
      status: 'active',
      subscribers: 28,
      icon: '🥇'
    },
    {
      id: 'MEM003',
      name: 'Platinum Membership',
      duration: '12 months',
      price: 9999,
      discount: 20,
      benefits: ['20% off all services', 'Priority booking', 'Unlimited services', 'Exclusive events', 'Personal stylist'],
      status: 'active',
      subscribers: 12,
      icon: '💎'
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
      completed: 'bg-green-100 text-green-700',
      active: 'bg-green-100 text-green-700',
      scheduled: 'bg-blue-100 text-blue-700',
      expired: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  // Create Invoice Modal
  const CreateInvoiceModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-3xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Manual Invoice</h2>
          <button onClick={() => setShowCreateInvoiceModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-6">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Customer</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Select Customer</option>
              <option>Emma Wilson</option>
              <option>Michael Brown</option>
              <option>Sarah Miller</option>
            </select>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Date</label>
              <input type="date" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
              <input type="date" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Services / Items</label>
            <div className="space-y-3">
              <div className="flex gap-3">
                <select className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Select Service</option>
                  <option>Deep Tissue Massage - ₹1,200</option>
                  <option>Haircut - ₹500</option>
                  <option>Facial Treatment - ₹800</option>
                </select>
                <input type="number" placeholder="Qty" className="w-20 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" defaultValue="1" />
                <button type="button" className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  <Plus size={20} />
                </button>
              </div>
              
              {/* Added Services Preview */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Deep Tissue Massage</span>
                  <span className="text-sm font-bold">₹1,200</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Quantity: 1</span>
                  <button className="text-red-600 hover:text-red-700">Remove</button>
                </div>
              </div>
            </div>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Discount / Coupon</label>
            <div className="flex gap-3">
              <input type="text" placeholder="Enter coupon code" className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <button type="button" className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
                Apply
              </button>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-semibold">₹1,200</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (18%):</span>
              <span className="font-semibold">₹216</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount:</span>
              <span className="font-semibold text-green-600">-₹0</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>₹1,416</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
            <textarea rows="3" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Any additional notes..."></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowCreateInvoiceModal(false)} className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Collect Payment Modal
  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Collect Payment</h2>
          <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {selectedInvoice && (
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Invoice ID:</span>
                <span className="font-semibold">{selectedInvoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customer:</span>
                <span className="font-semibold">{selectedInvoice.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount Due:</span>
                <span className="text-2xl font-bold text-blue-600">₹{selectedInvoice.total}</span>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Cash</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>UPI</option>
              <option>Net Banking</option>
              <option>Wallet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Received</label>
            <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction ID (Optional)</label>
            <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="TXN123456789" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
            <textarea rows="2" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Payment notes..."></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Refund Modal
  const RefundModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Process Refund</h2>
          <button onClick={() => setShowRefundModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg mb-4">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Refund Confirmation</p>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Refund Amount</label>
            <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Refund Reason</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Customer Request</option>
              <option>Service Cancelled</option>
              <option>Service Not Satisfactory</option>
              <option>Duplicate Payment</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Refund Method</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Original Payment Method</option>
              <option>Bank Transfer</option>
              <option>Cash</option>
              <option>Store Credit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
            <textarea rows="3" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Additional details..."></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowRefundModal(false)} className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
              Process Refund
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Add Discount Modal
  const AddDiscountModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Discount / Coupon</h2>
          <button onClick={() => setShowDiscountModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Code</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="SAVE20" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Name</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Save 20% Off" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Type</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Percentage</option>
                <option>Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Value</label>
              <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="20" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Amount</label>
              <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Discount</label>
              <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Valid From</label>
              <input type="date" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Valid To</label>
              <input type="date" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Usage Limit</label>
            <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="100" />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowDiscountModal(false)} className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
              Create Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Add Membership Modal
  const AddMembershipModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Membership Package</h2>
          <button onClick={() => setShowMembershipModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Package Name</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Gold Membership" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>12 Months</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
              <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="5499" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Discount (%)</label>
              <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="15" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Benefits</label>
            <div className="space-y-2">
              <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Benefit 1" />
              <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Benefit 2" />
              <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Benefit 3" />
              <button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                <Plus size={16} />
                Add More Benefits
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea rows="3" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Package description..."></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowMembershipModal(false)} className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
              Create Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoicing & Payments</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">Invoices</span>
            </div>
          </div>
          <button 
            onClick={() => setShowCreateInvoiceModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl font-medium"
          >
            <Plus size={20} />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto border-b border-gray-200">
        {[
          { id: 'invoices', label: 'Invoices', icon: FileText },
          { id: 'payments', label: 'Payments', icon: DollarSign },
          { id: 'refunds', label: 'Refunds', icon: RefreshCw },
          { id: 'tax', label: 'Tax & Charges', icon: Percent },
          { id: 'discounts', label: 'Discounts', icon: Tag },
          { id: 'memberships', label: 'Memberships', icon: Crown }
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

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900">{invoices.length}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check size={24} className="text-green-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm">Paid Invoices</p>
              <p className="text-3xl font-bold text-green-600">
                {invoices.filter(i => i.status === 'paid').length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock size={24} className="text-yellow-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {invoices.filter(i => i.status === 'pending').length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm">Overdue</p>
              <p className="text-3xl font-bold text-red-600">
                {invoices.filter(i => i.status === 'overdue').length}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search invoices by ID, customer, or booking..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                <option>All Status</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Overdue</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Filter size={18} />
                Filters
              </button>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Invoice ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-blue-600">{invoice.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                          {invoice.customer.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{invoice.customer.name}</p>
                          <p className="text-sm text-gray-500">{invoice.customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{invoice.date}</td>
                    <td className="px-6 py-4 text-gray-600">{invoice.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-900">₹{invoice.total}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowPaymentModal(true);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Collect Payment"
                        >
                          <DollarSign size={18} />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                          <Download size={18} />
                        </button>
                        <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Send Email">
                          <Send size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <>
          {/* Payment Stats */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Total Collected</p>
              <p className="text-3xl font-bold text-green-600">₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Cash Payments</p>
              <p className="text-3xl font-bold text-gray-900">
                {payments.filter(p => p.method === 'Cash').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Online Payments</p>
              <p className="text-3xl font-bold text-gray-900">
                {payments.filter(p => p.method !== 'Cash').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Today's Collection</p>
              <p className="text-3xl font-bold text-blue-600">₹1,416</p>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Payment History</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Payment ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Invoice</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Method</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{payment.id}</td>
                    <td className="px-6 py-4 text-blue-600">{payment.invoiceId}</td>
                    <td className="px-6 py-4 text-gray-900">{payment.customer}</td>
                    <td className="px-6 py-4 font-bold text-green-600">₹{payment.amount}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{payment.date}</div>
                        <div className="text-gray-500">{payment.time}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Refunds Tab */}
      {activeTab === 'refunds' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Manage refund requests and processing</p>
            <button 
              onClick={() => setShowRefundModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
            >
              <RefreshCw size={20} />
              Process Refund
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Refund ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Invoice</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Reason</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {refunds.map(refund => (
                  <tr key={refund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{refund.id}</td>
                    <td className="px-6 py-4 text-blue-600">{refund.invoiceId}</td>
                    <td className="px-6 py-4 text-gray-900">{refund.customer}</td>
                    <td className="px-6 py-4 font-bold text-red-600">₹{refund.amount}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{refund.reason}</td>
                    <td className="px-6 py-4 text-gray-600">{refund.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(refund.status)}`}>
                        {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {refund.status === 'pending' && (
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                            <Check size={18} />
                          </button>
                        )}
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Tax & Charges Tab */}
      {activeTab === 'tax' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Tax Configuration</h3>
            <div className="space-y-4">
              {Object.entries(taxConfig).map(([key, config]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={config.enabled}
                      className="w-5 h-5 text-blue-500 rounded"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-sm text-gray-600">
                        {config.type === 'percentage' ? `${config.rate}%` : `₹${config.rate} fixed`}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discounts Tab */}
      {activeTab === 'discounts' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Manage discount coupons and promotional codes</p>
            <button 
              onClick={() => setShowDiscountModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              <Plus size={20} />
              Create Coupon
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {discounts.map(discount => (
              <div key={discount.id} className="bg-white rounded-xl p-6 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-mono font-bold text-lg mb-2">
                      {discount.code}
                    </div>
                    <h3 className="font-bold text-gray-900">{discount.name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(discount.status)}`}>
                    {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Discount:</span>
                    <span className="font-bold text-green-600">
                      {discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Min Amount:</span>
                    <span className="font-semibold text-gray-900">₹{discount.minAmount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Usage:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {discount.usedCount} / {discount.usageLimit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Valid: {discount.validFrom}</span>
                    <span>to {discount.validTo}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    Edit
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium">
                    Deactivate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Memberships Tab */}
      {activeTab === 'memberships' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Manage subscription and membership packages</p>
            <button 
              onClick={() => setShowMembershipModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              <Plus size={20} />
              Create Package
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {memberships.map(membership => (
              <div key={membership.id} className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-10">
                  {membership.icon}
                </div>
                
                <div className="relative">
                  <div className="text-6xl mb-4">{membership.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{membership.name}</h3>
                  <p className="text-blue-100 mb-4">{membership.duration}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold">₹{membership.price}</span>
                    <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded">{membership.discount}% OFF</span>
                  </div>

                  <div className="space-y-2 mb-6">
                    {membership.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Check size={16} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm mb-6">
                    <span className="flex items-center gap-2">
                      <Users size={16} />
                      {membership.subscribers} subscribers
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
                      Edit
                    </button>
                    <button className="flex-1 px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 font-medium">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      {showCreateInvoiceModal && <CreateInvoiceModal />}
      {showPaymentModal && <PaymentModal />}
      {showRefundModal && <RefundModal />}
      {showDiscountModal && <AddDiscountModal />}
      {showMembershipModal && <AddMembershipModal />}
    </div>
  );
};

export default InvoicesPage;