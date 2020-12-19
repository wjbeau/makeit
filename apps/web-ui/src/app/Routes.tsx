import React, { lazy } from "react";
import { Home, Today, People, MeetingRoom, AccountCircle, Assessment, PermMedia, Email, MonetizationOnOutlined, MonetizationOn, Send } from '@material-ui/icons';

export const routeDefinitions = {
    public: {
        routes: [
            { path: "/", exact: true, main: lazy(() => import('../features/home/HomePage')), title: "Home", icon: <Home />, requiresAuth: true, showInMenu: true },
            { path: "/login", exact: false, main: lazy(() => import('../features/auth/LoginPage')), title: "Login", icon: undefined, requiresAuth: false, showInMenu: false },
            { path: "/calendar", exact: false, main: lazy(() => import('../features/calendar/CalendarPage')), title: "Calendar", icon: <Today />, requiresAuth: true, showInMenu: true },
            { path: "/contacts", exact: false, main: lazy(() => import('../features/contacts/ContactsPage')), title: "Contacts", icon: <People />, requiresAuth: true, showInMenu: true },
        ]
    },
    career: {
        title: "Actor's Tools",
        routes: [
            { path: "/auditions/:auditionId/edit", exact: true, main: lazy(() => import('../features/auditions/AuditionEditPage')), title: "Audition Edit", icon: undefined, requiresAuth: true, showInMenu: false },
            { path: "/auditions", exact: false, main: lazy(() => import('../features/auditions/AuditionsPage')), title: "Auditions", icon: <MeetingRoom />, requiresAuth: true, showInMenu: true },
            { path: "/projects", exact: false, main: lazy(() => import('../features/projects/ProjectPage')), title: "Projects", icon: <PermMedia />, requiresAuth: true, showInMenu: true },
            { path: "/marketing", exact: false, main: lazy(() => import('../features/marketing/MarketingPage')), title: "Marketing", icon: <Send />, requiresAuth: true, showInMenu: true, disabled: true, description: 'Marketing will offer the ability to manage your social media feeds, schedule posts and build a marketing calendar with reminders and automation.' },
            { path: "/finance", exact: false, main: lazy(() => import('../features/finance/FinancePage')), title: "Finance", icon: <MonetizationOn />, requiresAuth: true, showInMenu: true, disabled: true, description: 'Finance will handle expense and income tracking, tax calculations and automatic mileage logging.' },
            { path: "/profile", exact: false, main: lazy(() => import('../features/profile/ProfilePage')), title: "Profile", icon: <AccountCircle />, requiresAuth: true, showInMenu: true, disabled: true, description: 'Profile will offer the ability to publish a public profile as a standalone website, hosting headshots, reels, resumes and general descriptive information, as well as contact forms or links.' },
            { path: "/analysis", exact: false, main: lazy(() => import('../features/analysis/AnalysisPage')), title: "Analysis", icon: <Assessment />, requiresAuth: true, showInMenu: true, disabled: true, description: 'Analysis will give you some statistical data on your career: Audition booking rate, auditions by source and casting office, public profile views, reel viewing stats, etc.' },
        ]
    }
}