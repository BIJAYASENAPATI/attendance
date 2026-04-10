import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar, Users, DollarSign, FileText, Settings, BarChart3,
  Bell, LogOut, Tag, Clock, TrendingUp, CheckCircle, XCircle,
  AlertCircle, CalendarClock, Mail, Phone, Shield, User, AtSign,
  Edit, Save, X, Camera, ChevronRight, Package, Layers, Search,
  Check, IndianRupee,
} from 'lucide-react';
import BookingsPage from '../BookingsPage/BookingsPage';
import StaffPage from '../StaffPage/StaffPage';
import CustomersPage from '../CustomersPage/CustomersPage';
import SettingsPage from '../SettingsPage/SettingsPage';
import InvoicesPage from '../InvoicesPage/InvoicesPage';
import ReportsPage from '../ReportsPage/ReportsPage';
import SlotManagementPage from '../SlotManagementPage/SlotManagementPage';
import ServiceCategoryHome from '../ServiceCategory/ServiceCategoryHome/ServiceCategoryHome';
import {
  useGetAllBookingsQuery,
  useGetAllBookingStatusesQuery,
  useGetServiceCategoriesByBusinessQuery,
  useGetAllServicesQuery,
  useGetAllServiceCategoriesQuery,
  useUpdateServiceMutation,
} from '../../app/service/slice';

/* ─────────────────────────────────────────────────────────────────────────────
   PROFILE HELPERS
───────────────────────────────────────────────────────────────────────────── */
const readStoredProfile = () => {
  try {
    const raw = localStorage.getItem('admin_profile');
    if (raw) {
      const p = JSON.parse(raw);
      const r = p._raw || {};
      const firstName = (p.firstName || p.first_name || r.first_name || r.firstName || '').trim();
      const lastName = (p.lastName || p.last_name || r.last_name || r.lastName || '').trim();
      const email = (p.email || p.email_id || r.email || r.email_id || '').trim();
      const username = (p.username || p.user_name || r.username || r.user_name || (email ? email.split('@')[0] : '')).trim();
      const phone = (p.phone || p.mobile || p.mobile_number || p.phone_number || r.phone || r.mobile || r.mobile_number || r.phone_number || r.contact || '').trim();
      const role = (p.role || r.role || r.designation || localStorage.getItem('role') || 'Administrator').trim();
      const avatar = p.avatar || p.profile_picture || p.image || r.avatar || r.profile_picture || r.image || null;
      return { firstName, lastName, username, email, phone, role, avatar };
    }
  } catch (_) { }
  return { firstName: '', lastName: '', username: '', email: '', phone: '', role: localStorage.getItem('role') || 'Administrator', avatar: null };
};

const saveProfile = (updated) => {
  try {
    const existing = JSON.parse(localStorage.getItem('admin_profile') || '{}');
    localStorage.setItem('admin_profile', JSON.stringify({ ...existing, ...updated }));
  } catch {
    localStorage.setItem('admin_profile', JSON.stringify(updated));
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   EDIT SERVICE MODAL
───────────────────────────────────────────────────────────────────────────── */
const EditServiceModal = ({ service, onClose }) => {
  const [updateService, { isLoading }] = useUpdateServiceMutation();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: service?.name || service?.service_name || '',
    description: service?.description || service?.service_description || '',
    pre_payment_required: service?.pre_payment_required || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateService({ id: service.id, data: form }).unwrap();
      setSuccess(true);
      setTimeout(onClose, 1800);
    } catch (err) { alert(err?.data?.message || 'Failed to update service'); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(15,23,42,0.55)',
      backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      animation: 'esm-fade .2s ease',
    }}>
      <style>{`
        @keyframes esm-fade  { from{opacity:0} to{opacity:1} }
        @keyframes esm-scale { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes esm-pop   { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.18)} 100%{transform:scale(1);opacity:1} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        .esm-modal { animation: esm-scale .26s cubic-bezier(.22,1,.36,1) both; }
        .esm-input:focus { border-color: #a5b4fc !important; box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
      `}</style>

      <div className="esm-modal" style={{
        background: '#fff', borderRadius: 24, width: '100%', maxWidth: 480,
        overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,.22)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '22px 22px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Edit size={19} color="#2563eb" />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>Edit Service</p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{service?.name || service?.service_name}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: 7, borderRadius: 9, border: 'none', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} color="#64748b" />
          </button>
        </div>

        <div style={{ height: 1, background: '#f1f5f9', margin: '0 22px' }} />

        {/* Body */}
        <div style={{ padding: '18px 22px 22px' }}>
          {!success ? (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Service Name */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 7 }}>
                    Service Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange} required
                    placeholder="e.g. Deep Cleaning, Hair Cut"
                    className="esm-input"
                    style={{ width: '100%', padding: '11px 14px', fontSize: 14, fontWeight: 500, border: '1.5px solid #e2e8f0', borderRadius: 14, background: '#fff', outline: 'none', color: '#1e293b', fontFamily: 'inherit', transition: 'border-color .15s, box-shadow .15s' }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 7 }}>
                    Description <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    name="description" value={form.description} onChange={handleChange} required
                    rows={4} placeholder="Describe what this service includes…"
                    className="esm-input"
                    style={{ width: '100%', padding: '11px 14px', fontSize: 14, fontWeight: 500, border: '1.5px solid #e2e8f0', borderRadius: 14, background: '#fff', outline: 'none', color: '#1e293b', fontFamily: 'inherit', resize: 'none', lineHeight: 1.6, transition: 'border-color .15s, box-shadow .15s' }}
                  />
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5, fontWeight: 500 }}>{form.description.length} characters</p>
                </div>

                {/* Pre-payment Toggle */}
                <div
                  onClick={() => setForm(prev => ({ ...prev, pre_payment_required: !prev.pre_payment_required }))}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                    padding: '14px 16px', borderRadius: 16, cursor: 'pointer', userSelect: 'none',
                    border: `2px solid ${form.pre_payment_required ? '#fdba74' : '#e2e8f0'}`,
                    background: form.pre_payment_required ? '#fff7ed' : '#f8fafc',
                    transition: 'all .18s',
                  }}
                >
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Require Pre-payment</p>
                    <p style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>Customers must pay before the service is confirmed</p>
                  </div>
                  <div style={{
                    position: 'relative', width: 44, height: 24, borderRadius: 999, flexShrink: 0,
                    background: form.pre_payment_required ? '#f97316' : '#cbd5e1',
                    transition: 'background .2s',
                  }}>
                    <div style={{
                      position: 'absolute', top: 3, left: 3, width: 18, height: 18,
                      background: '#fff', borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,.18)',
                      transition: 'transform .2s',
                      transform: form.pre_payment_required ? 'translateX(20px)' : 'translateX(0)',
                    }} />
                  </div>
                </div>

                <div style={{ height: 1, background: 'linear-gradient(90deg,#e0e7ff,#c7d2fe,#e0e7ff)' }} />

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={onClose}
                    style={{ flex: 1, padding: 12, borderRadius: 14, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#475569', fontFamily: 'inherit', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isLoading || !form.name.trim()}
                    style={{ flex: 1, padding: 12, borderRadius: 14, border: 'none', fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'linear-gradient(135deg,#4f46e5,#6366f1)', boxShadow: '0 4px 14px rgba(79,70,229,.35)', opacity: (isLoading || !form.name.trim()) ? 0.6 : 1 }}>
                    {isLoading
                      ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} /> Updating…</>
                      : <><Save size={14} /> Save Changes</>
                    }
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
              <div style={{
                width: 62, height: 62, borderRadius: '50%',
                background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                boxShadow: '0 6px 24px rgba(34,197,94,.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px', animation: 'esm-pop .38s cubic-bezier(.22,1,.36,1) both',
              }}>
                <Check size={28} color="#fff" />
              </div>
              <p style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', marginBottom: 5 }}>Updated!</p>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Service saved successfully.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICES DRAWER
   — Clicking a service card navigates to /dashboard/services/:id
   — Edit icon (pencil) button opens EditServiceModal
───────────────────────────────────────────────────────────────────────────── */
const ServicesDrawer = ({ onClose, onSelectService, onEditService }) => {
  const { data: servicesResp, isLoading: svcLoading } = useGetAllServicesQuery();
  const { data: categoriesResp } = useGetAllServiceCategoriesQuery();
  const [search, setSearch] = useState('');

  const services = React.useMemo(() => {
    const raw = servicesResp?.data || servicesResp?.services || servicesResp || [];
    return Array.isArray(raw) ? raw : [];
  }, [servicesResp]);

  const categories = React.useMemo(() => {
    const raw = categoriesResp?.data || categoriesResp || [];
    return Array.isArray(raw) ? raw : [];
  }, [categoriesResp]);

  const getCategoryName = (svc) => {
    const id = svc.service_category_id || svc.category_id;
    return categories.find(c => c.id === id)?.name || null;
  };

  const filtered = services.filter(s => {
    const name = (s.name || s.service_name || '').toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const CAT_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ec4899', '#06b6d4', '#f59e0b', '#6366f1'];
  const catColorMap = React.useMemo(() => {
    const map = {};
    categories.forEach((c, i) => { map[c.id] = CAT_COLORS[i % CAT_COLORS.length]; });
    return map;
  }, [categories]);

  const getAccentColor = (svc) => {
    const id = svc.service_category_id || svc.category_id;
    return catColorMap[id] || '#6366f1';
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 90,
        background: 'rgba(15,23,42,0.28)',
        animation: 'sdr-fade .2s ease',
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 91,
        width: 380, background: '#fff',
        boxShadow: '-8px 0 40px rgba(0,0,0,.14)',
        display: 'flex', flexDirection: 'column',
        animation: 'sdr-slide .28s cubic-bezier(.22,1,.36,1) both',
      }}>
        <style>{`
          @keyframes sdr-fade  { from{opacity:0} to{opacity:1} }
          @keyframes sdr-slide { from{transform:translateX(100%)} to{transform:translateX(0)} }
          @keyframes sdr-shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
          .sdr-card { transition: all .15s; }
          .sdr-card:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,.08); border-color: #e0e7ff !important; }
          .sdr-card:active { transform: scale(.98); }
          .sdr-edit-btn { transition: background .15s, transform .15s; }
          .sdr-edit-btn:hover { background: #eff6ff !important; transform: scale(1.1); }
          .sdr-search:focus { border-color: #a5b4fc !important; box-shadow: 0 0 0 3px rgba(99,102,241,.10); }
        `}</style>

        {/* Header */}
        <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#eff6ff,#ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={18} color="#4f46e5" />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', lineHeight: 1.2 }}>All Services</p>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{services.length} service{services.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={15} color="#64748b" />
            </button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              className="sdr-search"
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search services…"
              style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1.5px solid #e2e8f0', borderRadius: 11, fontSize: 13, color: '#1e293b', background: '#f8fafc', outline: 'none', fontFamily: 'inherit', transition: 'border-color .15s, box-shadow .15s' }}
            />
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
          {svcLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ height: 70, borderRadius: 14, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8eef5 50%,#f1f5f9 75%)', backgroundSize: '400px 100%', animation: 'sdr-shimmer 1.4s infinite linear' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Package size={22} color="#94a3b8" />
              </div>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 4 }}>No services found</p>
              <p style={{ fontSize: 12, color: '#9ca3af' }}>{search ? 'Try a different search' : 'No services available'}</p>
            </div>
          ) : (
            filtered.map(svc => {
              const name = svc.name || svc.service_name || 'Unnamed';
              const catName = getCategoryName(svc);
              const accent = getAccentColor(svc);
              const initial = name[0]?.toUpperCase() || 'S';
              const isActive = svc.status === 'Active' || svc.status === 'active' || svc.is_active;

              return (
                <div
                  key={svc.id}
                  className="sdr-card"
                  onClick={() => onSelectService(svc)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '13px 16px', borderRadius: 14,
                    border: '1.5px solid #f1f5f9', cursor: 'pointer',
                    background: '#fff', marginBottom: 8,
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                    background: `${accent}18`,
                    border: `1.5px solid ${accent}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 17, fontWeight: 800, color: accent,
                  }}>
                    {initial}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                      {catName && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: `${accent}15`, color: accent, letterSpacing: '0.02em' }}>
                          {catName}
                        </span>
                      )}
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                        background: isActive ? '#dcfce7' : '#f1f5f9',
                        color: isActive ? '#16a34a' : '#94a3b8',
                      }}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Edit button — stops propagation so it doesn't navigate */}
                  <button
                    className="sdr-edit-btn"
                    onClick={e => { e.stopPropagation(); onEditService(svc); }}
                    style={{
                      width: 32, height: 32, borderRadius: 9,
                      background: '#f8fafc', border: '1px solid #e2e8f0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, cursor: 'pointer',
                    }}
                    title="Edit service"
                  >
                    <Edit size={13} color="#6366f1" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CATEGORY PICKER MODAL
───────────────────────────────────────────────────────────────────────────── */
const CategoryPickerModal = ({ onClose, onSelect }) => {
  const businessId = localStorage.getItem('business_id');
  const { data: categoriesRaw, isLoading } = useGetServiceCategoriesByBusinessQuery(businessId);

  const categories = React.useMemo(() => {
    if (!categoriesRaw) return [];
    if (Array.isArray(categoriesRaw)) return categoriesRaw;
    if (Array.isArray(categoriesRaw.data)) return categoriesRaw.data;
    return [];
  }, [categoriesRaw]);

  const COLORS = [
    { bg: '#eff6ff', border: '#bfdbfe', icon: '#2563eb' },
    { bg: '#f5f3ff', border: '#ddd6fe', icon: '#7c3aed' },
    { bg: '#ecfdf5', border: '#a7f3d0', icon: '#059669' },
    { bg: '#fff7ed', border: '#fed7aa', icon: '#ea580c' },
    { bg: '#fdf2f8', border: '#f5d0fe', icon: '#9333ea' },
    { bg: '#f0fdf4', border: '#bbf7d0', icon: '#16a34a' },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', animation: 'cpFadeIn 0.18s ease' }} />
      <div onClick={e => e.stopPropagation()} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 51, width: '100%', maxWidth: 460, background: '#fff', borderRadius: 24, boxShadow: '0 32px 80px rgba(0,0,0,0.22)', animation: 'cpSlideUp 0.24s cubic-bezier(.22,1,.36,1)', overflow: 'hidden', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <style>{`
          @keyframes cpFadeIn  { from{opacity:0} to{opacity:1} }
          @keyframes cpSlideUp { from{opacity:0;transform:translate(-50%,-46%) scale(0.96)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
          .cp-cat-btn { transition:transform .15s, box-shadow .15s; }
          .cp-cat-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.10) !important; }
          .cp-cat-btn:active { transform:scale(.97); }
        `}</style>
        <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', lineHeight: 1.2 }}>Choose a Category</p>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>Select a category to view its services</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} color="#64748b" />
          </button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '14px 20px 20px' }}>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ height: 64, borderRadius: 14, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8eef5 50%,#f1f5f9 75%)', backgroundSize: '400px 100%', animation: 'shimmer 1.4s infinite linear' }} />
              ))}
              <style>{`@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}`}</style>
            </div>
          ) : categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Layers size={24} color="#6366f1" />
              </div>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 4 }}>No categories found</p>
              <p style={{ fontSize: 12, color: '#9ca3af' }}>Add a service category first</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {categories.map((cat, i) => {
                const c = COLORS[i % COLORS.length];
                const name = cat.name || cat.category_name || cat.title || `Category ${cat.id}`;
                const count = cat.services_count ?? cat.service_count ?? cat.services?.length ?? null;
                const initial = name[0]?.toUpperCase() || 'C';
                return (
                  <button key={cat.id || i} className="cp-cat-btn" onClick={() => onSelect(cat)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: '#fff', border: `1.5px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${c.border}` }}>
                      {cat.image ? <img src={cat.image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} /> : <span style={{ fontWeight: 800, fontSize: 16, color: c.icon }}>{initial}</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
                      {count !== null && <p style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{count} service{count !== 1 ? 's' : ''}</p>}
                    </div>
                    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${c.border}` }}>
                      <ChevronRight size={14} color={c.icon} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN PROFILE PANEL
───────────────────────────────────────────────────────────────────────────── */
const AdminProfilePanel = ({ onClose, onSaved }) => {
  const [profile, setProfile] = useState(readStoredProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef(null);

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim();
  const displayName = fullName || profile.username || 'Admin';
  const initials = fullName ? ((profile.firstName?.[0] || '') + (profile.lastName?.[0] || '')).toUpperCase() : (profile.username?.[0] || 'A').toUpperCase();
  const currentAvatar = avatarPreview || profile.avatar;

  const handleAvatarChange = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => setAvatarPreview(r.result); r.readAsDataURL(f); };
  const handleSave = () => { const u = { ...form, avatar: avatarPreview || profile.avatar }; saveProfile(u); setProfile(u); setIsEditing(false); setAvatarPreview(null); onSaved?.(); };
  const handleCancel = () => { setForm({ ...profile }); setAvatarPreview(null); setIsEditing(false); };

  const VIEW_FIELDS = [
    { label: 'Full Name', value: fullName || '—', icon: <User size={14} />, color: '#7c3aed', bg: '#f3f0ff' },
    { label: 'Username', value: profile.username || '—', icon: <AtSign size={14} />, color: '#2563eb', bg: '#eff6ff' },
    { label: 'Email', value: profile.email || '—', icon: <Mail size={14} />, color: '#059669', bg: '#ecfdf5' },
    { label: 'Phone', value: profile.phone || '—', icon: <Phone size={14} />, color: '#d97706', bg: '#fffbeb' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: '100%', marginTop: 10, width: 320, zIndex: 50, background: '#fff', borderRadius: 24, border: '1px solid #ede9fe', boxShadow: '0 24px 60px rgba(99,102,241,0.18),0 8px 24px rgba(0,0,0,0.07)', animation: 'profileSlideIn 0.22s cubic-bezier(.34,1.56,.64,1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <style>{`
          @keyframes profileSlideIn{from{opacity:0;transform:translateY(-12px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
          .pf-input{width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:13px;color:#1e293b;background:#f8fafc;transition:all 0.2s;outline:none;box-sizing:border-box;font-family:inherit;}
          .pf-input:focus{border-color:#8b5cf6;background:#fff;box-shadow:0 0 0 3px rgba(139,92,246,0.12);}
          .pf-label{display:block;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:5px;}
          .pf-field-row:hover{background:#f5f3ff !important;border-color:#ddd6fe !important;}
        `}</style>
        <div style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 55%,#a855f7 100%)', padding: '18px 18px 56px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: -28, right: -20, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ position: 'absolute', bottom: -24, left: -14, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.8)' }} />
              <span style={{ color: 'rgba(255,255,255,0.92)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>My Profile</span>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={13} color="#fff" />
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 76, height: 76, borderRadius: 22, background: 'linear-gradient(135deg,#a78bfa,#818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', border: '3px solid rgba(255,255,255,0.9)', boxShadow: '0 10px 32px rgba(0,0,0,0.28)', overflow: 'hidden', letterSpacing: 1 }}>
                {currentAvatar ? <img src={currentAvatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
              </div>
              <div style={{ position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: '#22c55e', border: '2.5px solid #7c3aed', boxShadow: '0 0 10px rgba(34,197,94,0.7)' }} />
              {isEditing && <button onClick={() => fileRef.current?.click()} style={{ position: 'absolute', inset: 0, borderRadius: 22, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}><Camera size={20} color="#fff" /></button>}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: -32, display: 'flex', justifyContent: 'center', padding: '0 16px 2px', position: 'relative', zIndex: 2, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: '12px 28px', textAlign: 'center', boxShadow: '0 6px 28px rgba(99,102,241,0.16),0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0eeff', minWidth: 210 }}>
            <p style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', lineHeight: 1.2, marginBottom: 6 }}>{displayName}</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 12px', borderRadius: 999, background: 'linear-gradient(135deg,#ede9fe 0%,#dbeafe 100%)', fontSize: 10, fontWeight: 700, color: '#4f46e5', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              <Shield size={9} /> {profile.role || 'Administrator'}
            </span>
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, paddingBottom: 4 }}>
          {!isEditing ? (
            <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {VIEW_FIELDS.map(({ label, value, icon, color, bg }) => (
                <div key={label} className="pf-field-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', background: value === '—' ? '#f8fafc' : '#fdfcff', borderRadius: 14, border: `1.5px solid ${value === '—' ? '#f1f5f9' : '#ede9fe'}`, opacity: value === '—' ? 0.55 : 1, transition: 'all 0.18s' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color, boxShadow: `0 2px 8px ${bg}` }}>{icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 3 }}>{label}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: value === '—' ? '#cbd5e1' : '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
                  </div>
                  {value !== '—' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, opacity: 0.5, flexShrink: 0 }} />}
                </div>
              ))}
              <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#e8eaff,transparent)', margin: '2px 0' }} />
              <button onClick={() => { setForm({ ...profile }); setIsEditing(true); }} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 4px 20px rgba(79,70,229,0.38)', fontFamily: 'inherit', transition: 'all 0.2s', letterSpacing: '0.02em' }}>
                <Edit size={14} /> Edit Profile
              </button>
            </div>
          ) : (
            <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[{ key: 'firstName', label: 'First Name', placeholder: 'First' }, { key: 'lastName', label: 'Last Name', placeholder: 'Last' }].map(({ key, label, placeholder }) => (
                  <div key={key}><label className="pf-label">{label}</label><input className="pf-input" type="text" value={form[key] || ''} placeholder={placeholder} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} /></div>
                ))}
              </div>
              {[{ key: 'username', label: 'Username', type: 'text', placeholder: '@username' }, { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' }, { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' }].map(({ key, label, type, placeholder }) => (
                <div key={key}><label className="pf-label">{label}</label><input className="pf-input" type={type} value={form[key] || ''} placeholder={placeholder} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} /></div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                <button onClick={handleCancel} style={{ flex: 1, padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: 12, background: '#f8fafc', color: '#64748b', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                <button onClick={handleSave} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 16px rgba(79,70,229,0.35)', fontFamily: 'inherit' }}>
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   DASHBOARD HOME
───────────────────────────────────────────────────────────────────────────── */
const DashboardHome = ({ onNavigate }) => {
  const { data: bookings = [], isLoading } = useGetAllBookingsQuery();
  useGetAllBookingStatusesQuery();
  const today = new Date().toISOString().split('T')[0];

  const stats = React.useMemo(() => {
    const todayBookings = bookings.filter(b => { const d = b.slot?.date || b.date || b.created_at?.split('T')[0]; return d === today; });
    const upcomingBookings = bookings.filter(b => { const d = b.slot?.date || b.date || b.created_at?.split('T')[0]; return d && d > today; });
    const pendingPayment = bookings.filter(b => b.booking_status?.status?.toLowerCase() === 'pending');
    const totalRevenue = bookings.filter(b => b.booking_status?.status?.toLowerCase() === 'completed').reduce((s, b) => s + parseFloat(b.total_amount || 0), 0);
    const completedToday = todayBookings.filter(b => b.booking_status?.status?.toLowerCase() === 'completed');
    const cancelledToday = todayBookings.filter(b => b.booking_status?.status?.toLowerCase() === 'cancelled');
    const upcoming = upcomingBookings.filter(b => ['confirmed', 'pending'].includes(b.booking_status?.status?.toLowerCase()));
    return { todayTotal: todayBookings.length, todayBookings, upcomingTotal: upcoming.length || upcomingBookings.length, upcomingBookings, pendingPayment: pendingPayment.length, totalRevenue, completedToday: completedToday.length, cancelledToday: cancelledToday.length };
  }, [bookings, today]);

  const getStatusColor = (s = '') => { const v = s.toLowerCase(); if (v === 'confirmed') return 'bg-blue-100 text-blue-700'; if (v === 'pending') return 'bg-yellow-100 text-yellow-700'; if (v === 'completed') return 'bg-green-100 text-green-700'; if (v === 'cancelled') return 'bg-red-100 text-red-700'; return 'bg-gray-100 text-gray-700'; };
  const formatTime = (t) => { if (!t) return ''; const [h, m] = t.split(':'); const hr = parseInt(h); return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`; };
  const formatCurrency = (a) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(a);

  if (isLoading) return (<div className="flex items-center justify-center py-24"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" /><span className="ml-3 text-gray-500 font-medium">Loading dashboard...</span></div>);

  return (
    <div>
      <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1><p className="text-gray-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Today's Bookings", val: stats.todayTotal, from: 'from-blue-500', to: 'to-blue-600', icon: Calendar, sub: <><span className="flex items-center gap-1 text-xs text-blue-100"><CheckCircle size={12} />{stats.completedToday} completed</span><span className="flex items-center gap-1 text-xs text-blue-100"><XCircle size={12} />{stats.cancelledToday} cancelled</span></>, page: 'Bookings' },
          { label: 'Upcoming Bookings', val: stats.upcomingTotal, from: 'from-green-500', to: 'to-emerald-600', icon: Clock, sub: <span className="text-xs text-green-100">Future scheduled appointments</span>, page: 'Bookings' },
          { label: 'Pending Payments', val: stats.pendingPayment, from: 'from-orange-500', to: 'to-amber-500', icon: AlertCircle, sub: <span className="text-xs text-orange-100">Awaiting confirmation</span>, page: 'Invoices' },
        ].map(({ label, val, from, to, icon: Icon, sub, page }) => (
          <button key={label} onClick={() => onNavigate(page)} className={`group bg-gradient-to-br ${from} ${to} rounded-2xl p-6 text-white hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl text-left`}>
            <div className="flex justify-between items-start mb-4"><div><p className="text-white/80 text-sm font-medium mb-1">{label}</p><p className="text-4xl font-bold">{val}</p></div><div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Icon size={24} className="text-white" /></div></div>
            <div className="flex items-center gap-3 mt-2 pt-3 border-t border-white/20">{sub}</div>
          </button>
        ))}
        <button onClick={() => onNavigate('Reports')} className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl text-left">
          <div className="flex justify-between items-start mb-4"><div><p className="text-purple-100 text-sm font-medium mb-1">Total Revenue</p><p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p></div><div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><DollarSign size={24} className="text-white" /></div></div>
          <div className="flex items-end gap-1 h-8 mt-2 pt-2 border-t border-white/20">{[40, 60, 55, 70, 65, 50, 75, 85].map((h, i) => <div key={i} className="flex-1 bg-white/30 rounded-t" style={{ height: `${h}%` }} />)}</div>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {[
          { title: "Today's Bookings", count: stats.todayTotal, items: stats.todayBookings, color: 'blue', icon: Calendar, getDate: b => b.slot?.start_time ? formatTime(b.slot.start_time) : null },
          { title: 'Upcoming Bookings', count: stats.upcomingTotal, items: stats.upcomingBookings.slice(0, 10), color: 'green', icon: Clock, getDate: b => { const d = b.slot?.date || b.date; return d ? `${new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}${b.slot?.start_time ? ` · ${formatTime(b.slot.start_time)}` : ''}` : null; } },
        ].map(({ title, count, items, color, icon: Icon, getDate }) => (
          <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2"><div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}><Icon size={16} className={`text-${color}-600`} /></div><h2 className="font-bold text-gray-900">{title}</h2><span className={`px-2 py-0.5 bg-${color}-100 text-${color}-700 text-xs font-bold rounded-full`}>{count}</span></div>
              <button onClick={() => onNavigate('Bookings')} className={`text-xs text-${color}-500 hover:text-${color}-700 font-semibold cursor-pointer`}>View All →</button>
            </div>
            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {items.length === 0 ? (<div className="flex flex-col items-center justify-center py-12 text-gray-400"><Icon size={36} className="mb-2 text-gray-300" /><p className="text-sm font-medium">No {title.toLowerCase()}</p></div>) : items.map(b => (
                <div key={b.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br from-${color}-400 to-${color === 'blue' ? 'purple' : 'emerald'}-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>{(b.customer?.first_name?.[0] || '?').toUpperCase()}</div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{b.customer?.first_name} {b.customer?.last_name}</p><p className="text-xs text-gray-500 truncate">{b.service?.name || '—'}</p></div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(b.booking_status?.status)}`}>{b.booking_status?.status || 'Unknown'}</span>{getDate(b) && <span className="text-xs text-gray-400">{getDate(b)}</span>}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Quick Actions</h2>
        <p className="text-gray-600 mb-6 text-sm">Manage your business from one place.</p>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => onNavigate('Services Management')} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors cursor-pointer shadow-sm">Manage Services</button>
          <button onClick={() => onNavigate('Staff')} className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors cursor-pointer">Manage Staff</button>
          <button onClick={() => onNavigate('Slot Management')} className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors cursor-pointer">Slot Management</button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN DASHBOARD SHELL
───────────────────────────────────────────────────────────────────────────── */
export default function BookingDashboard({ children }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [topBarProfile, setTopBarProfile] = useState(readStoredProfile);

  // Services submenu
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Services drawer + edit modal
  const [showServicesDrawer, setShowServicesDrawer] = useState(false);
  const [editServiceTarget, setEditServiceTarget] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const refreshTopBar = useCallback(() => setTopBarProfile(readStoredProfile()), []);

  useEffect(() => {
    if (location.state?.activeMenu) {
      setActiveMenu(location.state.activeMenu);
      window.history.replaceState({}, document.title);
      return;
    }
    if (location.pathname.includes('/services')) setActiveMenu('Services Management');
    else if (location.pathname === '/dashboard' && activeMenu.includes('Services')) setActiveMenu('Dashboard');
  }, [location.pathname, location.state]);

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard' },
    { icon: Tag, label: 'Services Management', hasChildren: true },
    { icon: CalendarClock, label: 'Slot Management' },
    { icon: Calendar, label: 'Bookings' },
    { icon: Users, label: 'Staff' },
    { icon: Users, label: 'Customers' },
    { icon: FileText, label: 'Invoices' },
    { icon: BarChart3, label: 'Reports' },
    { icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    ['token', 'role', 'business_id', 'admin_profile'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  };

  const handleMenuClick = (item) => {
    if (item.hasChildren) {
      setServicesExpanded(p => !p);
      setActiveMenu('Services Management');
      setSelectedCategory(null);
      setShowServicesDrawer(false);
      setShowProfilePanel(false);
      setTimeout(() => navigate('/dashboard', { replace: true }), 0);
      return;
    }
    setActiveMenu(item.label);
    setServicesExpanded(false);
    setSelectedCategory(null);
    setShowServicesDrawer(false);
    setShowProfilePanel(false);
    setTimeout(() => navigate('/dashboard', { replace: true }), 0);
  };

  const handleCategorySelect = (cat) => {
    setShowCategoryPicker(false);
    setSelectedCategory(cat);
    setActiveMenu('Services Management');
    const catId = cat?.id || cat?.category_id;
    const catName = cat?.name || cat?.category_name || cat?.title || 'Category';
    navigate(`/dashboard/services/category/${catId}`, { state: { categoryName: catName } });
  };

  const handleServicesSubClick = () => {
    setShowServicesDrawer(true);
  };

  const renderPageContent = () => {
    if (location.pathname !== '/dashboard' && children) return children;
    if (activeMenu === 'Services Management') return <ServiceCategoryHome />;
    switch (activeMenu) {
      case 'Bookings': return <BookingsPage />;
      case 'Slot Management': return <SlotManagementPage />;
      case 'Staff': return <StaffPage />;
      case 'Customers': return <CustomersPage />;
      case 'Invoices': return <InvoicesPage />;
      case 'Reports': return <ReportsPage />;
      case 'Settings': return <SettingsPage />;
      default: return <DashboardHome onNavigate={label => handleMenuClick({ label })} />;
    }
  };

  const isMenuActive = (label) => {
    if (label === 'Services Management') return location.pathname.includes('/services') || activeMenu === 'Services Management';
    return activeMenu === label && location.pathname === '/dashboard';
  };

  const sidebarWidth = sidebarCollapsed ? '72px' : '280px';
  const topFullName = [topBarProfile.firstName, topBarProfile.lastName].filter(Boolean).join(' ').trim();
  const topDisplay = topFullName || topBarProfile.username || 'Admin';
  const topInitials = topFullName
    ? ((topBarProfile.firstName?.[0] || '') + (topBarProfile.lastName?.[0] || '')).toUpperCase()
    : (topBarProfile.username?.[0] || 'A').toUpperCase();

  const isServicesActive = isMenuActive('Services Management');

  useEffect(() => {
    if (isServicesActive) setServicesExpanded(true);
  }, [isServicesActive]);

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden" style={{ height: '100vh' }}>

      {/* ── Sidebar ── */}
      <div
        style={{ width: sidebarWidth, minWidth: sidebarWidth, transition: 'width 0.25s ease,min-width 0.25s ease' }}
        className="h-full bg-gradient-to-b from-blue-600 via-blue-500 to-blue-600 shadow-xl flex flex-col z-30 overflow-hidden flex-shrink-0"
      >
        {/* Brand */}
        <div className="flex items-center justify-between mb-8 px-3 pt-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarCollapsed(p => !p)}
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md flex-shrink-0 hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
              <Calendar className="text-blue-600" size={24} />
            </button>
            <div style={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto', overflow: 'hidden', transition: 'opacity 0.2s ease,width 0.25s ease', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
              <h1 className="font-bold text-lg text-white leading-tight">BookingPro</h1>
              <span className="text-xs text-blue-100">Admin</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="space-y-1 flex-1 px-2 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item, i) => {
            const active = isMenuActive(item.label);

            if (item.hasChildren) {
              return (
                <div key={i}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-lg transition-all duration-200 cursor-pointer
                      ${active ? 'bg-white text-blue-600 shadow-lg' : 'text-white hover:bg-blue-700/50'}
                      ${sidebarCollapsed ? 'justify-center' : 'text-left'}`}
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    <span style={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto', overflow: 'hidden', transition: 'opacity 0.2s ease,width 0.25s ease', whiteSpace: 'nowrap' }}
                      className="font-medium text-sm flex-1">
                      {item.label}
                    </span>
                    {!sidebarCollapsed && (
                      <ChevronRight size={14} className="flex-shrink-0 transition-transform duration-220"
                        style={{ transform: servicesExpanded ? 'rotate(90deg)' : 'rotate(0deg)', opacity: 0.75, color: active ? '#2563eb' : '#fff' }}
                      />
                    )}
                  </button>

                  {/* Sub-menu */}
                  {!sidebarCollapsed && (
                    <div style={{
                      overflow: 'hidden',
                      maxHeight: servicesExpanded ? '60px' : '0px',
                      opacity: servicesExpanded ? 1 : 0,
                      transition: 'max-height 0.28s cubic-bezier(.4,0,.2,1), opacity 0.22s',
                      marginLeft: 14, paddingLeft: 10,
                      borderLeft: '2px solid rgba(255,255,255,0.18)',
                      marginTop: servicesExpanded ? 4 : 0,
                      marginBottom: servicesExpanded ? 4 : 0,
                    }}>
                      <button
                        onClick={handleServicesSubClick}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer text-left"
                        style={{
                          background: showServicesDrawer ? 'rgba(255,255,255,0.22)' : 'transparent',
                          border: showServicesDrawer ? '1px solid rgba(255,255,255,0.35)' : '1px solid transparent',
                          color: showServicesDrawer ? '#fff' : 'rgba(255,255,255,0.75)',
                        }}
                        onMouseEnter={e => { if (!showServicesDrawer) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; } }}
                        onMouseLeave={e => { if (!showServicesDrawer) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; } }}
                      >
                        <Package size={15} className="flex-shrink-0" />
                        <span className="text-xs flex-1 truncate" style={{ fontWeight: 600 }}>Services</span>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: 'rgba(255,255,255,0.2)', color: '#fff', letterSpacing: '0.04em', flexShrink: 0 }}>
                          all
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button key={i} onClick={() => handleMenuClick(item)} title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-lg transition-all duration-200 cursor-pointer
                  ${active ? 'bg-white text-blue-600 shadow-lg' : 'text-white hover:bg-blue-700/50'}
                  ${sidebarCollapsed ? 'justify-center' : 'text-left'}`}>
                <item.icon size={20} className="flex-shrink-0" />
                <span style={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto', overflow: 'hidden', transition: 'opacity 0.2s ease,width 0.25s ease', whiteSpace: 'nowrap' }}
                  className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-blue-400/40 px-2 pb-4 flex-shrink-0">
          <button onClick={handleLogout} title={sidebarCollapsed ? 'Logout' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-lg bg-red-500/20 hover:bg-red-500 border border-red-400/30 hover:border-red-500 text-red-200 hover:text-white transition-all duration-200 group cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-red-500/30 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
              <LogOut size={16} className="text-red-200 group-hover:text-white" />
            </div>
            <span style={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto', overflow: 'hidden', transition: 'opacity 0.2s ease,width 0.25s ease', whiteSpace: 'nowrap' }}
              className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <div className="flex-shrink-0 z-20 bg-gradient-to-r from-blue-50 via-white to-purple-50 border-b border-gray-200 px-8 py-2 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              {location.pathname.includes('/services')
                ? 'Services Management'
                : selectedCategory
                  ? `Services — ${selectedCategory.name || selectedCategory.category_name || selectedCategory.title}`
                  : activeMenu}
            </h2>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors cursor-pointer shadow-sm">
                <Bell size={18} /><span className="text-sm font-medium">Send Notification</span>
              </button>
              <button className="relative p-2.5 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
                <Bell size={20} className="text-gray-600" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-semibold">2</div>
              </button>
              <div className="relative">
                <button onClick={() => setShowProfilePanel(p => !p)} className="flex items-center gap-3 pl-4 pr-2 py-2 hover:bg-purple-100 rounded-lg transition-colors" style={{ cursor: 'pointer' }}>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{topDisplay}</p>
                    <p className="text-xs text-gray-400 leading-tight">{topBarProfile.role || 'Administrator'}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md overflow-hidden border-2 border-white"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', cursor: 'pointer' }}>
                    {topBarProfile.avatar
                      ? <img src={topBarProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
                      : <span className="text-sm">{topInitials}</span>}
                  </div>
                </button>
                {showProfilePanel && (
                  <AdminProfilePanel
                    onClose={() => setShowProfilePanel(false)}
                    onSaved={() => { refreshTopBar(); setShowProfilePanel(false); }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-8">{renderPageContent()}</div>
        </div>
      </div>

      {/* ── Category Picker Modal ── */}
      {showCategoryPicker && (
        <CategoryPickerModal
          onClose={() => setShowCategoryPicker(false)}
          onSelect={handleCategorySelect}
        />
      )}

      {/* ── Services Drawer ──
           onSelectService  → navigates to /dashboard/services/:id
           onEditService    → opens EditServiceModal
      ── */}
      {showServicesDrawer && (
        <ServicesDrawer
          onClose={() => setShowServicesDrawer(false)}
          onSelectService={(svc) => {
            setShowServicesDrawer(false);
            navigate(`/dashboard/services/${svc.id}`);
          }}
          onEditService={(svc) => {
            setShowServicesDrawer(false);
            setEditServiceTarget(svc);
          }}
        />
      )}

      {/* ── Edit Service Modal ── */}
      {editServiceTarget && (
        <EditServiceModal
          service={editServiceTarget}
          onClose={() => setEditServiceTarget(null)}
        />
      )}
    </div>
  );
}