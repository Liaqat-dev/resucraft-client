import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {BarChart3, ChevronLeft, ChevronRight, FileText, LayoutDashboard, Mail, ShieldAlert, Users,} from 'lucide-react';
import {useSelector} from 'react-redux';
import {RootState} from '@src/slices/store.ts';
import TopBar from '@layout/topBar/topBar.tsx';
import {useAuth} from "@hooks/useAuth.ts";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    {label: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="size-4 shrink-0"/>},
    {label: 'Users', path: '/dashboard/users', icon: <Users className="size-4 shrink-0"/>},
    {label: 'Templates', path: '/dashboard/templates', icon: <FileText className="size-4 shrink-0"/>},
    {label: 'Analytics', path: '/dashboard/analytics', icon: <BarChart3 className="size-4 shrink-0"/>},
    {label: 'Messages', path: '/dashboard/messages', icon: <Mail className="size-4 shrink-0"/>},
];

const DashboardLayout = ({children}: DashboardLayoutProps) => {
    const {user, loading,} = useAuth();
     const {layoutMode, layoutDataColor} = useSelector((state: RootState) => state.Layout);

    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // Sync theme attributes (mirrors what Layout does)
    useEffect(() => {
        document.documentElement.classList.add('scroll-smooth', 'group');
        document.documentElement.setAttribute('data-mode', layoutMode);
        document.documentElement.setAttribute('data-colors', layoutDataColor);
        document.documentElement.setAttribute('data-layout', 'default');
    }, [layoutMode, layoutDataColor]);

    // Still initializing auth (page refresh) — wait before redirecting
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="size-7 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"/>
            </div>
        );
    }

    // Logged in but not admin → send home
    if (user?.role !== 'admin' && user?.role !== 'moderator') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
                <ShieldAlert className="size-12 text-red-500"/>
                <h2 className="text-xl font-semibold">Access Denied</h2>
                <p className="text-gray-500 dark:text-dark-500 text-sm max-w-xs">
                    You don't have permission to access the admin dashboard.
                </p>
                <Link to="/" className="btn btn-primary btn-sm mt-2">
                    Go Home
                </Link>
            </div>
        );
    }

    return (
        <React.Fragment>
            <title>Admin Dashboard | ResuCraft</title>

            <TopBar/>

            <div className="flex min-h-screen pt-[calc(theme('spacing.topbar')_*_1.1)]">
                {/* ── Sidebar ─────────────────────────────────────────── */}
                <aside
                    className={`
                        fixed top-[calc(theme('spacing.topbar')_*_1.1)] bottom-0 left-0 z-[100]
                        flex flex-col border-r border-gray-200 dark:border-dark-800
                        bg-white dark:bg-dark-900
                        transition-[width] duration-200 ease-in-out
                        ${collapsed ? 'w-16' : 'w-56'}
                    `}
                >
                    {/* Collapse toggle */}
                    <button
                        onClick={() => setCollapsed(c => !c)}
                        className="
                            absolute -right-3 top-6 z-10
                            flex items-center justify-center
                            size-6 rounded-full
                            bg-white dark:bg-dark-800
                            border border-gray-200 dark:border-dark-700
                            text-gray-500 dark:text-dark-400
                            hover:text-gray-800 dark:hover:text-dark-100
                            shadow-sm transition-colors
                        "
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed
                            ? <ChevronRight className="size-3"/>
                            : <ChevronLeft className="size-3"/>
                        }
                    </button>

                    {/* Nav items */}
                    <nav className="flex flex-col gap-1 p-2 mt-4">
                        {NAV_ITEMS.map(item => {
                            const isActive =
                                item.path === '/dashboard'
                                    ? location.pathname === '/dashboard'
                                    : location.pathname.startsWith(item.path);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    title={collapsed ? item.label : undefined}
                                    className={`
                                        flex items-center gap-3 px-3 py-2 rounded-md text-sm
                                        transition-colors duration-150
                                        ${isActive
                                        ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium'
                                        : 'text-gray-600 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-dark-100'
                                    }
                                    `}
                                >
                                    {item.icon}
                                    {!collapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* ── Main content ─────────────────────────────────────── */}
                <main
                    className={`
                        flex-1 min-w-0
                        transition-[margin-left] duration-200 ease-in-out
                        ${collapsed ? 'ml-16' : 'ml-56'}
                        p-6
                    `}
                >
                    {children}
                </main>
            </div>
        </React.Fragment>
    );
};

export default DashboardLayout;
