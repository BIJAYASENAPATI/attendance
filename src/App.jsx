import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/authentication/Login/Login';
import BookingDashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/authentication/ProtectedRoute/ProtectedRoute';

// Service Category & Services
import CategoryServicesPage from './components/ServiceCategory/ServicePage/CategoryServicesPage/CategoryServicesPage';
import CreateServiceForCategory from './components/ServiceCategory/ServicePage/CreateServiceForCategory/CreateServiceForCategory';
import GetServiceById from './components/ServiceCategory/ServicePage/GetServiceById/GetServiceById';
import UpdateService from './components/ServiceCategory/ServicePage/UpdateService/UpdateService';

// Price Management
import ServicePricesPage from './components/ServiceCategory/ServicePage/PriceManagement/ServicePricesPage/ServicePricesPage';
import CreateServicePrice from './components/ServiceCategory/ServicePage/PriceManagement/CreateServicePrice/CreateServicePrice';
import UpdateServicePrice from './components/ServiceCategory/ServicePage/PriceManagement/UpdateServicePrice/UpdateServicePrice';
import DeleteServicePrice from './components/ServiceCategory/ServicePage/PriceManagement/DeleteServicePrice/DeleteServicePrice';

// Description Management
import ServiceDescriptionsPage from './components/ServiceCategory/ServicePage/DescriptionManagement/ServiceDescriptionsPage/ServiceDescriptionsPage';
import CreateServiceDescription from './components/ServiceCategory/ServicePage/DescriptionManagement/CreateServiceDescription/CreateServiceDescription';
import UpdateServiceDescription from './components/ServiceCategory/ServicePage/DescriptionManagement/UpdateServiceDescription/UpdateServiceDescription';

// Metadata Management
import ServiceMetadataPage from './components/ServiceCategory/ServicePage/ServiceMetadataPage/ServiceMetadataPage';

// Zone Management
import ServiceZonesPage from './components/ServiceCategory/ServicePage/Servicezonespage/Servicezonespage';
import CustomersPage from './components/CustomersPage/CustomersPage';
import GetCustomerById from './components/Customerspage/Getcustomerbyid/Getcustomerbyid';
import UpdateCustomer from './components/Customerspage/Updatecustomer/Updatecustomer';
import DeleteCustomer from './components/Customerspage/Deletecustomer/Deletecustomer';
import BookingsPage from './components/BookingsPage/BookingsPage';

function App() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/login" element={<Login />} />

      {/* ── Dashboard (base, no children) ── */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <BookingDashboard />
          </ProtectedRoute>
        }
      />

        //  SERVICE CATEGORY ROUTES
      <Route
        path="/dashboard/services/category/:categoryId"
        element={
          <ProtectedRoute>
            <BookingDashboard><CategoryServicesPage /></BookingDashboard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/services/category/:categoryId/create"
        element={
          <ProtectedRoute>
            <BookingDashboard><CreateServiceForCategory /></BookingDashboard>
          </ProtectedRoute>
        }
      />

        // INDIVIDUAL SERVICE ROUTES
      <Route
        path="/dashboard/services/update/:id"
        element={
          <ProtectedRoute>
            <BookingDashboard><UpdateService /></BookingDashboard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/services/:id"
        element={
          <ProtectedRoute>
            <BookingDashboard><GetServiceById /></BookingDashboard>
          </ProtectedRoute>
        }
      />


        // PRICE MANAGEMENT
      <Route
        path="/dashboard/services/:id/prices"
        element={
          <ProtectedRoute>
            <BookingDashboard><ServicePricesPage /></BookingDashboard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/services/:id/prices/create"
        element={
          <ProtectedRoute>
            <BookingDashboard><CreateServicePrice /></BookingDashboard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/services/:id/prices/update/:priceId"
        element={
          <ProtectedRoute>
            <BookingDashboard><UpdateServicePrice /></BookingDashboard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/services/:id/prices/delete/:priceId"
        element={
          <ProtectedRoute>
            <BookingDashboard><DeleteServicePrice /></BookingDashboard>
          </ProtectedRoute>
        }
      />

        //  DESCRIPTION MANAGEMENT
      <Route
        path="/dashboard/services/:id/descriptions"
        element={
          <ProtectedRoute>
            <BookingDashboard><ServiceDescriptionsPage /></BookingDashboard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/services/:id/descriptions/create"
        element={
          <ProtectedRoute>
            <BookingDashboard><CreateServiceDescription /></BookingDashboard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/services/:id/descriptions/update/:descId"
        element={
          <ProtectedRoute>
            <BookingDashboard><UpdateServiceDescription /></BookingDashboard>
          </ProtectedRoute>
        }
      />

      //  METADATA MANAGEMENT  (was MISSING — caused login redirect)
      <Route
        path="/dashboard/services/:id/metadata"
        element={
          <ProtectedRoute>
            <BookingDashboard><ServiceMetadataPage /></BookingDashboard>
          </ProtectedRoute>
        }
      />

      // ZONE MANAGEMENT 
      <Route
        path="/dashboard/services/:id/zones"
        element={
          <ProtectedRoute>
            <BookingDashboard><ServiceZonesPage /></BookingDashboard>
          </ProtectedRoute>
        }
      />

      //  CUSTOMER MANAGEMENT
      <Route path="/dashboard/customers" element={<ProtectedRoute> <BookingDashboard><CustomersPage /></BookingDashboard> </ProtectedRoute>} />
      <Route path="/dashboard/customers/:id" element={<ProtectedRoute> <BookingDashboard><GetCustomerById /></BookingDashboard> </ProtectedRoute>} />
      <Route path="/dashboard/customers/update/:id" element={<ProtectedRoute> <BookingDashboard><UpdateCustomer /></BookingDashboard> </ProtectedRoute>} />
      <Route path="/dashboard/customers/delete/:id" element={<ProtectedRoute> <BookingDashboard><DeleteCustomer /></BookingDashboard> </ProtectedRoute>} />


      //  BOOKING MANAGEMENT ROUTES
      <Route
        path="/dashboard/bookings"
        element={
          <ProtectedRoute>
            <BookingDashboard><BookingsPage /></BookingDashboard>
          </ProtectedRoute>
        }
      />


      {/* ── Redirects ── */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;