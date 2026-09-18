import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Vistas
import { HomeView } from '../views/home/HomeView';
import { LoginView } from '../views/login/LoginView';
import { RegisterView } from '../views/registro/RegisterView';
import { EventsExplorerView } from '../views/eventos/EventsExplorerView';
import { EventDetailView } from '../views/eventos/EventDetailView';
import { MyTicketsWalletView } from '../views/entradas/MyTicketsWalletView';
import { SingleTicketView } from '../views/entradas/SingleTicketView';
import { QRValidatorView } from '../views/validador/QRValidatorView';
import { AdminDashboardView } from '../views/dashboard/AdminDashboardView';
import { OrganizerDashboardView } from '../views/dashboard/OrganizerDashboardView';
import { UserDashboardView } from '../views/dashboard/UserDashboardView';
import { AdminCategoriesView } from '../views/categorias/AdminCategoriesView';
import { AdminUsersView } from '../views/usuarios/AdminUsersView';
import { ReportsView } from '../views/reportes/ReportsView';
import { StatisticsView } from '../views/estadisticas/StatisticsView';
import { UserPurchasesView } from '../views/compras/UserPurchasesView';
import { UserProfileView } from '../views/usuarios/UserProfileView';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <HomeView />
          </PublicLayout>
        }
      />
      <Route
        path="/eventos"
        element={
          <PublicLayout>
            <EventsExplorerView />
          </PublicLayout>
        }
      />
      <Route
        path="/eventos/:id"
        element={
          <PublicLayout>
            <EventDetailView />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <LoginView />
          </PublicLayout>
        }
      />
      <Route
        path="/registro"
        element={
          <PublicLayout>
            <RegisterView />
          </PublicLayout>
        }
      />

      {/* Rutas Protegidas de Billetera Digital & Ticket Individual */}
      <Route
        path="/mis-entradas"
        element={
          <ProtectedRoute>
            <PublicLayout>
              <MyTicketsWalletView />
            </PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/entradas/:id"
        element={
          <ProtectedRoute>
            <PublicLayout>
              <SingleTicketView />
            </PublicLayout>
          </ProtectedRoute>
        }
      />

      {/* Dashboard Usuario */}
      <Route
        path="/usuario/dashboard"
        element={
          <ProtectedRoute allowedRoles={['USUARIO', 'ORGANIZADOR', 'ADMIN']}>
            <DashboardLayout title="Mi Panel de Usuario" subtitle="Historial y próximas entradas">
              <UserDashboardView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mis-compras"
        element={
          <ProtectedRoute>
            <DashboardLayout title="Mis Compras" subtitle="Historial de órdenes y tickets comprados">
              <UserPurchasesView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/historial"
        element={
          <ProtectedRoute>
            <DashboardLayout title="Historial de Actividad" subtitle="Tus órdenes y asistencias a eventos">
              <UserPurchasesView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <DashboardLayout title="Mi Perfil" subtitle="Información personal y seguridad">
              <UserProfileView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Dashboard Organizador */}
      <Route
        path="/organizador/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ORGANIZADOR', 'ADMIN']}>
            <DashboardLayout title="Panel de Organizador" subtitle="Gestión de eventos, aforos y recaudación">
              <OrganizerDashboardView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizador/mis-eventos"
        element={
          <ProtectedRoute allowedRoles={['ORGANIZADOR', 'ADMIN']}>
            <DashboardLayout title="Mis Eventos" subtitle="Control de cartelera y aforos">
              <OrganizerDashboardView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizador/validar-entrada"
        element={
          <ProtectedRoute allowedRoles={['ORGANIZADOR', 'ADMIN']}>
            <DashboardLayout title="Control de Acceso" subtitle="Validación en tiempo real de entradas con QR">
              <QRValidatorView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Dashboard Administrador */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout title="Panel de Administración General" subtitle="Métricas y control global de EventHub">
              <AdminDashboardView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout title="Directorio de Usuarios" subtitle="Control de accesos y roles del sistema">
              <AdminUsersView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/eventos"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout title="Gestión Global de Eventos" subtitle="Supervisión de toda la cartelera">
              <OrganizerDashboardView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categorias"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout title="Catálogo de Categorías" subtitle="Clasificaciones y filtros del portal">
              <AdminCategoriesView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Módulos Compartidos: Reportes & Estadísticas */}
      <Route
        path="/reportes"
        element={
          <ProtectedRoute allowedRoles={['ORGANIZADOR', 'ADMIN']}>
            <DashboardLayout title="Centro de Reportes" subtitle="Auditoría y exportación de datos">
              <ReportsView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/estadisticas"
        element={
          <ProtectedRoute allowedRoles={['ORGANIZADOR', 'ADMIN']}>
            <DashboardLayout title="Estadísticas y Analítica" subtitle="Métricas de rendimiento de eventos">
              <StatisticsView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
