import React from "react";
import homeIcon from '../assets/img/home.svg';
import { Home } from "../features/home/Home";
import { Login } from "../features/auth/Login";

export const Routes = [
    { path: "/", exact: true, main: () => <Home />, title: "Home", icon: homeIcon, requiresAuth: true, showInMenu: true },
    { path: "/login", exact: true, main: () => <Login />, title: "Login", icon: homeIcon, requiresAuth: false, showInMenu: false },
];

export const GuestRoutes = Routes.filter(r => !r.requiresAuth);