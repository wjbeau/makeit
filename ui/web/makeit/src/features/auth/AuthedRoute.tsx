import React, { PropsWithChildren } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthed } from "./auth.slice"
import { Routes } from "../../app/Routes";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    Redirect,
    RouteProps
  } from "react-router-dom";
  
export function AuthedRoute ({ children, ...rest }:PropsWithChildren<RouteProps>) {
    const auth = useSelector(selectAuthed);

    return (
        <Route
        {...rest}
        render={({ location }) =>
        auth ? (
            children
            ) : (
            <Redirect
                to={{
                pathname: "/login",
                state: { from: location }
                }}
            />
            )
        }
        />
    );
}