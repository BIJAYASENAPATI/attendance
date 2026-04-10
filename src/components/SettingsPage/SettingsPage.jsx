import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Clock,
  Calendar,
  Settings,
  Sliders,
  Upload,
  Save,
  Plus,
  Edit,
  Trash2,
  X,
  Globe,
  DollarSign,
  Percent,
  AlertCircle,
  Check,
  Copy
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile'); // profile, branches, hours, holidays, slots, automation
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [showAddHolidayModal, setShowAddHolidayModal] = useState(false);

  // Business Profile State
  const [businessProfile, setBusinessProfile] = useState({
    name: 'BookingPro Salon & Spa',
    tagline: 'Your Beauty, Our Priority',
    email: 'info@bookingpro.com',
    phone: '+91 98765 43210',
    website: 'www.bookingpro.com',
    address: '123 Main Street, Kolkata, West Bengal 700001',
    gstin: '27AABCU9603R1ZM',
    pan: 'AABCU9603R',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    logo: null
  });

  // Branches State
  const [branches, setBranches] = useState([
    {
      id: 'BR001',
      name: 'Main Branch - Park Street',
      address: '123 Park Street, Kolkata 700016',
      phone: '+91 98765 43210',
      email: 'parkstreet@bookingpro.com',
      manager: 'Sarah Johnson',
      status: 'active',
      staff: 12,
      capacity: 8
    },
    {
      id: 'BR002',
      name: 'Salt Lake Branch',
      address: '45 Salt Lake City, Sector V, Kolkata 700091',
      phone: '+91 98765 43211',
      email: 'saltlake@bookingpro.com',
      manager: 'John Smith',
      status: 'active',
      staff: 8,
      capacity: 6
    }
  ]);

  // Business Hours State
  const [businessHours, setBusinessHours] = useState({
    monday: { open: '09:00', close: '20:00', enabled: true },
    tuesday: { open: '09:00', close: '20:00', enabled: true },
    wednesday: { open: '09:00', close: '20:00', enabled: true },
    thursday: { open: '09:00', close: '20:00', enabled: true },
    friday: { open: '09:00', close: '20:00', enabled: true },
    saturday: { open: '10:00', close: '18:00', enabled: true },
    sunday: { open: '10:00', close: '16:00', enabled: false }
  });

  // Holidays State
  const [holidays, setHolidays] = useState([
    { id: 'H001', name: 'New Year', date: '2026-01-01', type: 'Public', recurring: true },
    { id: 'H002', name: 'Republic Day', date: '2026-01-26', type: 'Public', recurring: true },
    { id: 'H003', name: 'Holi', date: '2026-03-14', type: 'Public', recurring: false },
    { id: 'H004', name: 'Independence Day', date: '2026-08-15', type: 'Public', recurring: true },
    { id: 'H005', name: 'Diwali', date: '2026-10-24', type: 'Public', recurring: false },
    { id: 'H006', name: 'Christmas', date: '2026-12-25', type: 'Public', recurring: true }
  ]);

  // Slot Settings State
  const [slotSettings, setSlotSettings] = useState({
    defaultDuration: 30,
    bufferTime: 10,
    maxCapacity: 4,
    advanceBooking: 30,
    minBookingNotice: 2,
    maxBookingsPerSlot: 1,
    allowOverlapping: false,
    autoConfirm: true
  });

  // Auto Generation Rules State
  const [autoRules, setAutoRules] = useState({
    enableAutoGeneration: true,
    generateDaysAhead: 60,
    breakStart: '13:00',
    breakEnd: '14:00',
    enableBreak: true,
    slotInterval: 30,
    lastBookingTime: '19:00'
  });

  // Add Branch Modal
  const AddBranchModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Branch</h2>
          <button onClick={() => setShowAddBranchModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Branch Name</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Downtown Branch" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <textarea rows="3" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Street address, city, postal code"></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input type="tel" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="+91 98765 43210" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="branch@bookingpro.com" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Branch Manager</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Select Manager</option>
                <option>Sarah Johnson</option>
                <option>John Smith</option>
                <option>Emily Davis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Capacity</label>
              <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="8" />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowAddBranchModal(false)} className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
              Add Branch
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Add Holiday Modal
  const AddHolidayModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Holiday</h2>
          <button onClick={() => setShowAddHolidayModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Holiday Name</label>
            <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., Diwali" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input type="date" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Public Holiday</option>
              <option>Business Closure</option>
              <option>Staff Training</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="recurring" className="w-5 h-5 text-blue-500 rounded" />
            <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
              Recurring annually
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowAddHolidayModal(false)} className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
              Add Holiday
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
        <h1 className="text-3xl font-bold text-gray-900">Business Settings</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Settings</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto border-b border-gray-200">
        {[
          { id: 'profile', label: 'Business Profile', icon: Building2 },
          { id: 'branches', label: 'Branches', icon: MapPin },
          { id: 'hours', label: 'Business Hours', icon: Clock },
          { id: 'holidays', label: 'Holidays', icon: Calendar },
          { id: 'slots', label: 'Slot Settings', icon: Sliders },
          { id: 'automation', label: 'Automation', icon: Settings }
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

      {/* Business Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Business Information</h3>
            
            {/* Logo Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Business Logo</label>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                  <Upload size={32} className="text-gray-400" />
                </div>
                <div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-2">
                    Upload Logo
                  </button>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB. Recommended size: 500x500px</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                <input 
                  type="text" 
                  value={businessProfile.name}
                  onChange={(e) => setBusinessProfile({...businessProfile, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tagline</label>
                <input 
                  type="text" 
                  value={businessProfile.tagline}
                  onChange={(e) => setBusinessProfile({...businessProfile, tagline: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={businessProfile.email}
                  onChange={(e) => setBusinessProfile({...businessProfile, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input 
                  type="tel" 
                  value={businessProfile.phone}
                  onChange={(e) => setBusinessProfile({...businessProfile, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea 
                  rows="3"
                  value={businessProfile.address}
                  onChange={(e) => setBusinessProfile({...businessProfile, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                <input 
                  type="url" 
                  value={businessProfile.website}
                  onChange={(e) => setBusinessProfile({...businessProfile, website: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* Tax & Legal Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Tax & Legal Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GSTIN</label>
                <input 
                  type="text" 
                  value={businessProfile.gstin}
                  onChange={(e) => setBusinessProfile({...businessProfile, gstin: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="27AABCU9603R1ZM"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">PAN</label>
                <input 
                  type="text" 
                  value={businessProfile.pan}
                  onChange={(e) => setBusinessProfile({...businessProfile, pan: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="AABCU9603R"
                />
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Regional Settings</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                <select 
                  value={businessProfile.currency}
                  onChange={(e) => setBusinessProfile({...businessProfile, currency: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="INR">INR - Indian Rupee (₹)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
                <select 
                  value={businessProfile.timezone}
                  onChange={(e) => setBusinessProfile({...businessProfile, timezone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date Format</label>
                <select 
                  value={businessProfile.dateFormat}
                  onChange={(e) => setBusinessProfile({...businessProfile, dateFormat: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time Format</label>
                <select 
                  value={businessProfile.timeFormat}
                  onChange={(e) => setBusinessProfile({...businessProfile, timeFormat: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="12h">12 Hour (AM/PM)</option>
                  <option value="24h">24 Hour</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center gap-2">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Branches Tab */}
      {activeTab === 'branches' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Manage multiple locations for your business</p>
            <button 
              onClick={() => setShowAddBranchModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              <Plus size={20} />
              Add Branch
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {branches.map(branch => (
              <div key={branch.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{branch.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      branch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
                    </span>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit size={18} className="text-gray-600" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📞</span>
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>✉️</span>
                    <span>{branch.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Manager</p>
                    <p className="text-sm font-semibold text-gray-900">{branch.manager}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Staff</p>
                    <p className="text-sm font-semibold text-gray-900">{branch.staff}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Capacity</p>
                    <p className="text-sm font-semibold text-gray-900">{branch.capacity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business Hours Tab */}
      {activeTab === 'hours' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Configure Weekly Business Hours</h3>
            <div className="space-y-4">
              {Object.entries(businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-32">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={hours.enabled}
                        onChange={(e) => setBusinessHours({
                          ...businessHours,
                          [day]: {...hours, enabled: e.target.checked}
                        })}
                        className="w-5 h-5 text-blue-500 rounded"
                      />
                      <span className="font-semibold capitalize">{day}</span>
                    </label>
                  </div>

                  <div className="flex-1 flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Opening Time</label>
                      <input 
                        type="time" 
                        value={hours.open}
                        onChange={(e) => setBusinessHours({
                          ...businessHours,
                          [day]: {...hours, open: e.target.value}
                        })}
                        disabled={!hours.enabled}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>

                    <span className="text-gray-400">to</span>

                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Closing Time</label>
                      <input 
                        type="time" 
                        value={hours.close}
                        onChange={(e) => setBusinessHours({
                          ...businessHours,
                          [day]: {...hours, close: e.target.value}
                        })}
                        disabled={!hours.enabled}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {!hours.enabled && (
                    <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
                      Closed
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
              <button className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
                Copy to All Branches
              </button>
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center gap-2">
                <Save size={18} />
                Save Hours
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Holidays Tab */}
      {activeTab === 'holidays' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Manage public holidays and business closures</p>
            <button 
              onClick={() => setShowAddHolidayModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              <Plus size={20} />
              Add Holiday
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Holiday Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Recurring</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {holidays.map(holiday => (
                  <tr key={holiday.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{holiday.name}</td>
                    <td className="px-6 py-4 text-gray-600">{holiday.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {holiday.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {holiday.recurring ? (
                        <span className="flex items-center gap-2 text-green-600">
                          <Check size={16} />
                          <span className="text-sm">Yes</span>
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
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

      {/* Slot Settings Tab */}
      {activeTab === 'slots' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Slot Configuration</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Default Slot Duration (minutes)</label>
                <input 
                  type="number" 
                  value={slotSettings.defaultDuration}
                  onChange={(e) => setSlotSettings({...slotSettings, defaultDuration: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
                <p className="text-xs text-gray-500 mt-1">Standard time allocated for each booking</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Buffer Time (minutes)</label>
                <input 
                  type="number" 
                  value={slotSettings.bufferTime}
                  onChange={(e) => setSlotSettings({...slotSettings, bufferTime: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
                <p className="text-xs text-gray-500 mt-1">Gap between consecutive bookings</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Capacity per Slot</label>
                <input 
                  type="number" 
                  value={slotSettings.maxCapacity}
                  onChange={(e) => setSlotSettings({...slotSettings, maxCapacity: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
                <p className="text-xs text-gray-500 mt-1">Maximum concurrent bookings allowed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Advance Booking (days)</label>
                <input 
                  type="number" 
                  value={slotSettings.advanceBooking}
                  onChange={(e) => setSlotSettings({...slotSettings, advanceBooking: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
                <p className="text-xs text-gray-500 mt-1">How far in advance customers can book</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Booking Notice (hours)</label>
                <input 
                  type="number" 
                  value={slotSettings.minBookingNotice}
                  onChange={(e) => setSlotSettings({...slotSettings, minBookingNotice: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
                <p className="text-xs text-gray-500 mt-1">Minimum time before booking starts</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Bookings per Slot</label>
                <input 
                  type="number" 
                  value={slotSettings.maxBookingsPerSlot}
                  onChange={(e) => setSlotSettings({...slotSettings, maxBookingsPerSlot: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
                <p className="text-xs text-gray-500 mt-1">Limit bookings per time slot</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 pt-6 border-t border-gray-200">
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input 
                  type="checkbox" 
                  checked={slotSettings.allowOverlapping}
                  onChange={(e) => setSlotSettings({...slotSettings, allowOverlapping: e.target.checked})}
                  className="w-5 h-5 text-blue-500 rounded" 
                />
                <div>
                  <p className="font-semibold text-gray-900">Allow Overlapping Bookings</p>
                  <p className="text-sm text-gray-600">Enable multiple bookings at the same time</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input 
                  type="checkbox" 
                  checked={slotSettings.autoConfirm}
                  onChange={(e) => setSlotSettings({...slotSettings, autoConfirm: e.target.checked})}
                  className="w-5 h-5 text-blue-500 rounded" 
                />
                <div>
                  <p className="font-semibold text-gray-900">Auto-Confirm Bookings</p>
                  <p className="text-sm text-gray-600">Automatically confirm bookings without manual approval</p>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
                Reset to Default
              </button>
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center gap-2">
                <Save size={18} />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Auto Slot Generation Rules</h3>
            
            <div className="space-y-4 mb-6">
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input 
                  type="checkbox" 
                  checked={autoRules.enableAutoGeneration}
                  onChange={(e) => setAutoRules({...autoRules, enableAutoGeneration: e.target.checked})}
                  className="w-5 h-5 text-blue-500 rounded" 
                />
                <div>
                  <p className="font-semibold text-gray-900">Enable Auto Slot Generation</p>
                  <p className="text-sm text-gray-600">Automatically create booking slots based on business hours</p>
                </div>
              </label>
            </div>

            {autoRules.enableAutoGeneration && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Generate Slots for (days ahead)</label>
                  <input 
                    type="number" 
                    value={autoRules.generateDaysAhead}
                    onChange={(e) => setAutoRules({...autoRules, generateDaysAhead: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Slot Interval (minutes)</label>
                  <select 
                    value={autoRules.slotInterval}
                    onChange={(e) => setAutoRules({...autoRules, slotInterval: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Booking Time</label>
                  <input 
                    type="time" 
                    value={autoRules.lastBookingTime}
                    onChange={(e) => setAutoRules({...autoRules, lastBookingTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Last slot available for booking</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <input 
                      type="checkbox" 
                      checked={autoRules.enableBreak}
                      onChange={(e) => setAutoRules({...autoRules, enableBreak: e.target.checked})}
                      className="w-4 h-4 text-blue-500 rounded" 
                    />
                    <span className="text-sm font-semibold text-gray-700">Enable Break Time</span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="time" 
                      value={autoRules.breakStart}
                      onChange={(e) => setAutoRules({...autoRules, breakStart: e.target.value})}
                      disabled={!autoRules.enableBreak}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="Start"
                    />
                    <span className="flex items-center text-gray-400">to</span>
                    <input 
                      type="time" 
                      value={autoRules.breakEnd}
                      onChange={(e) => setAutoRules({...autoRules, breakEnd: e.target.value})}
                      disabled={!autoRules.enableBreak}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="End"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
              <button className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
                Run Once Now
              </button>
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center gap-2">
                <Save size={18} />
                Save Rules
              </button>
            </div>
          </div>

          {/* Automation Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings size={24} className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Automation Status</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Slots are automatically generated daily at 12:00 AM based on your business hours and rules.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span>Last run: Today, 12:00 AM</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-600" />
                    <span>Next run: Tomorrow, 12:00 AM</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddBranchModal && <AddBranchModal />}
      {showAddHolidayModal && <AddHolidayModal />}
    </div>
  );
};

export default SettingsPage;