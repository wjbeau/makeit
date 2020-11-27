import React, { lazy } from "react";
import { Home, Today, People, MeetingRoom } from '@material-ui/icons';

export const routeDefinitions = {
    public: {
        routes: [
            { path: "/", exact: true, main: lazy(() => import('../features/home/Home')), title: "Home", icon: <Home />, requiresAuth: true, showInMenu: true },
            { path: "/login", exact: false, main: lazy(() => import('../features/auth/Login')), title: "Login", icon: undefined, requiresAuth: false, showInMenu: false },
        ]
    },
    protected: {
        title: "Career Tracking",
        routes: [
            { path: "/meetings", exact: false, main: lazy(() => import('../features/meetings/Meetings')), title: "Meetings", icon: <MeetingRoom />, requiresAuth: true, showInMenu: true },
            { path: "/calendar", exact: false, main: lazy(() => import('../features/calendar/Calendar')), title: "Calendar", icon: <Today />, requiresAuth: true, showInMenu: true },
            { path: "/contacts", exact: false, main: lazy(() => import('../features/contacts/Contacts')), title: "Contacts", icon: <People />, requiresAuth: true, showInMenu: true },
        ]
    }
}

export const allRoutes = routeDefinitions.public.routes.concat(routeDefinitions.protected.routes)
export const publicRoutes = routeDefinitions.public.routes;