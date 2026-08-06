import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { PurchaseRequestList } from '@/pages/PurchaseRequests/PurchaseRequestList';
import { CreatePurchaseRequest } from '@/pages/PurchaseRequests/CreatePurchaseRequest';
import { PurchaseRequestDetails } from '@/pages/PurchaseRequests/PurchaseRequestDetails';
import { UploadQuotationPage } from '@/pages/UploadQuotation/UploadQuotationPage';
import { QuotationPreview } from '@/pages/UploadQuotation/QuotationPreview';
import { VendorComparisonWorkspace } from '@/pages/VendorComparison/VendorComparisonWorkspace';
import { PolicyValidationPage } from '@/pages/PolicyValidation/PolicyValidationPage';
import { ApprovalWorkspace } from '@/pages/Approval/ApprovalWorkspace';
import { VendorProfilePage } from '@/pages/VendorProfile/VendorProfilePage';
import { ProcurementAnalytics } from '@/pages/Analytics/ProcurementAnalytics';
import { DecisionExplainability } from '@/pages/Explainability/DecisionExplainability';
import { AdminPanel } from '@/pages/Admin/AdminPanel';
import { SystemDashboard } from '@/pages/Admin/SystemDashboard';
import { UserManagement } from '@/pages/Users/UserManagement';
import { ReportsCenter } from '@/pages/Reports/ReportsCenter';
import { NotificationsCenter } from '@/pages/Notifications/NotificationsCenter';
import { AIMonitoring } from '@/pages/Monitoring/AIMonitoring';
import { RuleBuilder } from '@/pages/Settings/RuleBuilder';
import { SecurityCenter } from '@/pages/Security/SecurityCenter';
import { ActivityCenter } from '@/pages/Users/ActivityCenter';
import { HelpCenter } from '@/pages/Help/HelpCenter';
import { ProfilePage } from '@/pages/Settings/ProfilePage';
import { LandingPage } from '@/pages/Landing/LandingPage';
import { ErrorPage } from '@/pages/Errors/ErrorPage';
import { PurchaseOrders } from '@/pages/PurchaseOrders';
import { AuditTrail } from '@/pages/AuditTrail';
import { Settings } from '@/pages/Settings';
import { MainLayout } from '@/layouts/MainLayout';
import { GuardedRoute, AnonymousRoute } from '@/routes/GuardedRoute';

// Helper component to render a page inside MainLayout
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AnonymousRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Public Error & Status Pages */}
        <Route path="/403" element={<ErrorPage code="403" />} />
        <Route path="/404" element={<ErrorPage code="404" />} />
        <Route path="/500" element={<ErrorPage code="500" />} />
        <Route path="/maintenance" element={<ErrorPage code="maintenance" />} />
        <Route path="/unauthorized" element={<ErrorPage code="unauthorized" />} />

        {/* Guarded Routes */}
        <Route element={<GuardedRoute />}>
          <Route
            path="/dashboard"
            element={
              <LayoutWrapper>
                <Dashboard />
              </LayoutWrapper>
            }
          />
          <Route
            path="/purchase-requests"
            element={
              <LayoutWrapper>
                <PurchaseRequestList />
              </LayoutWrapper>
            }
          />
          <Route
            path="/purchase-requests/new"
            element={
              <LayoutWrapper>
                <CreatePurchaseRequest />
              </LayoutWrapper>
            }
          />
          <Route
            path="/purchase-requests/:id"
            element={
              <LayoutWrapper>
                <PurchaseRequestDetails />
              </LayoutWrapper>
            }
          />
          <Route
            path="/purchase-requests/:id/edit"
            element={
              <LayoutWrapper>
                <CreatePurchaseRequest />
              </LayoutWrapper>
            }
          />
          <Route
            path="/upload-quotations"
            element={
              <LayoutWrapper>
                <UploadQuotationPage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/quotations/:id/preview"
            element={
              <LayoutWrapper>
                <QuotationPreview />
              </LayoutWrapper>
            }
          />
          <Route
            path="/vendor-comparison"
            element={
              <LayoutWrapper>
                <VendorComparisonWorkspace />
              </LayoutWrapper>
            }
          />
          <Route
            path="/policy-validation"
            element={
              <LayoutWrapper>
                <PolicyValidationPage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/approvals"
            element={
              <LayoutWrapper>
                <ApprovalWorkspace />
              </LayoutWrapper>
            }
          />
          <Route
            path="/vendors/:id"
            element={
              <LayoutWrapper>
                <VendorProfilePage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/analytics"
            element={
              <LayoutWrapper>
                <ProcurementAnalytics />
              </LayoutWrapper>
            }
          />
          <Route
            path="/explainability"
            element={
              <LayoutWrapper>
                <DecisionExplainability />
              </LayoutWrapper>
            }
          />
          <Route
            path="/purchase-orders"
            element={
              <LayoutWrapper>
                <PurchaseOrders />
              </LayoutWrapper>
            }
          />
          <Route
            path="/audit-trail"
            element={
              <LayoutWrapper>
                <AuditTrail />
              </LayoutWrapper>
            }
          />
          <Route
            path="/settings"
            element={
              <LayoutWrapper>
                <Settings />
              </LayoutWrapper>
            }
          />
          <Route
            path="/admin"
            element={
              <LayoutWrapper>
                <AdminPanel />
              </LayoutWrapper>
            }
          />
          <Route
            path="/admin/system"
            element={
              <LayoutWrapper>
                <SystemDashboard />
              </LayoutWrapper>
            }
          />
          <Route
            path="/admin/users"
            element={
              <LayoutWrapper>
                <UserManagement />
              </LayoutWrapper>
            }
          />
          <Route
            path="/reports"
            element={
              <LayoutWrapper>
                <ReportsCenter />
              </LayoutWrapper>
            }
          />
          <Route
            path="/notifications"
            element={
              <LayoutWrapper>
                <NotificationsCenter />
              </LayoutWrapper>
            }
          />
          <Route
            path="/monitoring"
            element={
              <LayoutWrapper>
                <AIMonitoring />
              </LayoutWrapper>
            }
          />
          <Route
            path="/settings/rules"
            element={
              <LayoutWrapper>
                <RuleBuilder />
              </LayoutWrapper>
            }
          />
          <Route
            path="/settings/security"
            element={
              <LayoutWrapper>
                <SecurityCenter />
              </LayoutWrapper>
            }
          />
          <Route
            path="/activity"
            element={
              <LayoutWrapper>
                <ActivityCenter />
              </LayoutWrapper>
            }
          />
          <Route
            path="/help"
            element={
              <LayoutWrapper>
                <HelpCenter />
              </LayoutWrapper>
            }
          />
          <Route
            path="/settings/profile"
            element={
              <LayoutWrapper>
                <ProfilePage />
              </LayoutWrapper>
            }
          />
          {/* Catch-all redirected to error page */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
