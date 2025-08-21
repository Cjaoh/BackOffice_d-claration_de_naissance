import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AuthProvider from "./contexts/AuthProvider";
import Dashboard from "./components/dashboard/Dashboard";
import DeclarationForm from "./components/DeclarationForm";
import DeclarationsList from "./components/DeclarationsList";
import DeclarationsPdfView from "./components/DeclarationsPdfView";
import Statistics from "./components/Statistics";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/layout/Layout";
import Settings from "./components/settings/Settings";
import UserManagement from "./components/users/UserManagement";
// import type { Declaration } from "./services/declarationService";
// import type { DeclarationFormData } from "./components/DeclarationForm";

// function convertDeclarationToFormData(decl: Declaration): Partial<DeclarationFormData> {
//   return {
//     nom: decl.nom,
//     prenom: decl.prenom,
//     dateNaissance: decl.dateNaissance ? new Date(decl.dateNaissance) : null,
//     sexe: decl.sexe === "M" || decl.sexe === "F" ? decl.sexe : "",
//   };
// }

// Composant pour les routes protégées
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
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Routes protégées */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
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
