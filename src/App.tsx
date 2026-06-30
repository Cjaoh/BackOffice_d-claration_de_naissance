import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./contexts/AuthProvider";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleGuard from "./components/auth/RoleGuard";
import { ROUTES } from "./constants/routes";

// Route-level code splitting
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const DeclarationForm = lazy(() => import("./components/DeclarationForm"));
const DeclarationsList = lazy(() => import("./components/DeclarationsList"));
const DeclarationsPdfView = lazy(() => import("./components/DeclarationsPdfView"));
const Statistics = lazy(() => import("./components/Statistics"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Settings = lazy(() => import("./components/settings/Settings"));
const UserManagement = lazy(() => import("./components/users/UserManagement"));


// Composant principal de l'application
const AppContent: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Chargement...</div>}>
        <Routes>
        {/* Routes publiques */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        
        {/* Routes protégées */}
        <Route path={ROUTES.HOME} element={
          <ProtectedRoute>
            <Layout title="Tableau de bord">
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={ROUTES.DECLARATIONS} element={
          <ProtectedRoute>
            <Layout title="Déclarations">
              <DeclarationsList />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={ROUTES.NEW_DECLARATION} element={
          <ProtectedRoute>
            <Layout title="Nouvelle déclaration">
              <div className="max-w-4xl mx-auto">
                <DeclarationForm onSave={() => {}} onClose={() => {}} />
              </div>
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={ROUTES.PDF_VIEW} element={
          <ProtectedRoute>
            <Layout title="Visualiser PDF">
              <DeclarationsPdfView />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={ROUTES.STATISTICS} element={
          <ProtectedRoute>
            <Layout title="Statistiques">
              <Statistics />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route
          path={ROUTES.USERS}
          element={
            <ProtectedRoute>
    <RoleGuard allowedRoles={['admin']}>
        <Layout title="Gestion des utilisateurs">
            <UserManagement />
        </Layout>
    </RoleGuard>
</ProtectedRoute>
          }
        />
        
        <Route path={ROUTES.SETTINGS} element={
          <ProtectedRoute>
            <Layout title="Paramètres">
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
