import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateBatch from './pages/CreateBatch';
import BatchDetails from './pages/BatchDetails';
import TransporterPanel from './pages/TransporterPanel';
import WarehousePanel from './pages/WarehousePanel';
import RetailerPanel from './pages/RetailerPanel';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import RoleGuard from './components/RoleGuard';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

export default function App() {
    return (
        <AuthProvider>
            <AppProvider>
                <BrowserRouter>
                    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
                        <Navbar />
                        <main>
                            <Routes>
                                <Route path="/" element={<Landing />} />
                                <Route path="/login" element={<Login />} />

                                {/* Farmer Routes */}
                                <Route path="/dashboard" element={
                                    <RoleGuard allowedRoles={['Farmer', 'Admin']}>
                                        <Dashboard />
                                    </RoleGuard>
                                } />
                                <Route path="/create-batch" element={
                                    <RoleGuard allowedRoles={['Farmer', 'Admin']}>
                                        <CreateBatch />
                                    </RoleGuard>
                                } />

                                {/* Shared Detail View */}
                                <Route path="/batch/:id" element={
                                    <RoleGuard allowedRoles={['Farmer', 'Transporter', 'Warehouse', 'Retailer', 'Admin']}>
                                        <BatchDetails />
                                    </RoleGuard>
                                } />

                                {/* Role Specific Panels */}
                                <Route path="/transporter" element={
                                    <RoleGuard allowedRoles={['Transporter', 'Admin']}>
                                        <TransporterPanel />
                                    </RoleGuard>
                                } />

                                <Route path="/warehouse" element={
                                    <RoleGuard allowedRoles={['Warehouse', 'Admin']}>
                                        <WarehousePanel />
                                    </RoleGuard>
                                } />

                                <Route path="/retailer" element={
                                    <RoleGuard allowedRoles={['Retailer', 'Admin']}>
                                        <RetailerPanel />
                                    </RoleGuard>
                                } />

                                <Route path="/admin" element={
                                    <RoleGuard allowedRoles={['Admin']}>
                                        <AdminPanel />
                                    </RoleGuard>
                                } />

                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                    </div>
                </BrowserRouter>
            </AppProvider>
        </AuthProvider>
    );
}
