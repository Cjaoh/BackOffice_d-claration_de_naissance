import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AuthProvider from "./contexts/AuthProvider";
import Layout from "./components/layout/Layout";

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


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Composant principal de l'application
const AppContent: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Chargement...</div>}>
        <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Routes protégées */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout title="Tableau de bord">
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/declarations" element={
          <ProtectedRoute>
            <Layout title="Déclarations">
              <DeclarationsList />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/declarations/new" element={
          <ProtectedRoute>
            <Layout title="Nouvelle déclaration">
              <div className="max-w-4xl mx-auto">
                <DeclarationForm onSave={() => {}} onClose={() => {}} />
              </div>
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/pdf-view" element={
          <ProtectedRoute>
            <Layout title="Visualiser PDF">
              <DeclarationsPdfView />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/statistics" element={
          <ProtectedRoute>
            <Layout title="Statistiques">
              <Statistics />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute>
            <Layout title="Gestion des utilisateurs">
              <UserManagement />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout title="Paramètres">
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
