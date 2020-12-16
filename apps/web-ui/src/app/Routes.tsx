import React, { lazy } from "react";
import { Home, Today, People, MeetingRoom, AccountCircle, Assessment, PermMedia, Email, MonetizationOnOutlined, MonetizationOn } from '@material-ui/icons';

export const routeDefinitions = {
    public: {
        routes: [
            { path: "/", exact: true, main: lazy(() => import('../features/home/HomePage')), title: "Home", icon: <Home />, requiresAuth: true, showInMenu: true },
            { path: "/login", exact: false, main: lazy(() => import('../features/auth/LoginPage')), title: "Login", icon: undefined, requiresAuth: false, showInMenu: false },
            { path: "/calendar", exact: false, main: lazy(() => import('../features/calendar/CalendarPage')), title: "Calendar", icon: <Today />, requiresAuth: true, showInMenu: true },
            { path: "/contacts", exact: false, main: lazy(() => import('../features/contacts/ContactsPage')), title: "Contacts", icon: <People />, requiresAuth: true, showInMenu: true },
            { path: "/messaging", exact: false, main: lazy(() => import('../features/messaging/MessagingPage')), title: "Messaging", icon: <Email />, requiresAuth: true, showInMenu: true },
        ]
    },
    career: {
        title: "Actor's Tools",
        routes: [
            { path: "/auditions/:auditionId/edit", exact: true, main: lazy(() => import('../features/auditions/AuditionEditPage')), title: "Audition Edit", icon: undefined, requiresAuth: true, showInMenu: false },
            { path: "/auditions", exact: false, main: lazy(() => import('../features/auditions/AuditionsPage')), title: "Auditions", icon: <MeetingRoom />, requiresAuth: true, showInMenu: true },
            { path: "/projects", exact: false, main: lazy(() => import('../features/projects/ProjectPage')), title: "Projects", icon: <PermMedia />, requiresAuth: true, showInMenu: true },
            { path: "/finance", exact: false, main: lazy(() => import('../features/finance/FinancePage')), title: "Finance", icon: <MonetizationOn />, requiresAuth: true, showInMenu: true },
            { path: "/profile", exact: false, main: lazy(() => import('../features/profile/ProfilePage')), title: "Profile", icon: <AccountCircle />, requiresAuth: true, showInMenu: true },
            { path: "/analysis", exact: false, main: lazy(() => import('../features/analysis/AnalysisPage')), title: "Analysis", icon: <Assessment />, requiresAuth: true, showInMenu: true },
        ]
    }
}