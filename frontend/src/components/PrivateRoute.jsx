import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ publicPage = false, adminOnly = false }) => {
    const { user } = useSelector((state) => state.auth);

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user?.roles?.includes("ROLE_SELLER");

    const location = useLocation();

    // Public pages (login/register)
    if (publicPage) {
        return user ? <Navigate to="/" replace /> : <Outlet />;
    }

    // Any protected page requires login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Admin section protection
    if (adminOnly) {
        // Seller can access only specific admin routes
        if (isSeller && !isAdmin) {
            const sellerAllowedPaths = [
                "/admin/orders",
                "/admin/products"
            ];

            const sellerAllowed = sellerAllowedPaths.some(path =>
                location.pathname.startsWith(path)
            );

            if (!sellerAllowed) {
                return <Navigate to="/" replace />;
            }
        }

        // Customer cannot access admin pages
        if (!isAdmin && !isSeller) {
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default PrivateRoute;