import React, { PropsWithChildren, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthed, refreshToken } from './auth.slice';
import { REFRESH_TOKEN_KEY, REFRESH_USER_KEY } from '../../app/config';
import { useAppDispatch } from '../../app/store';
import { unwrapResult } from '@reduxjs/toolkit';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import IfNotLoading from '../layout/IfNotLoading';

export function AuthedRoute({
  children,
  ...rest
}: PropsWithChildren<RouteProps>) {
  let auth = useSelector(selectAuthed);
  const dispatch = useAppDispatch();
  const [refresh, setRefresh] = useState<boolean>(false);

  //if the user previously asked to be remembered, try a reauth here
  if (!auth && !refresh) {
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    const user = localStorage.getItem(REFRESH_USER_KEY);
    console.log('Refresh is here: ' + refresh)
    console.log('User is here: ' + user)
    if (refresh && user) {
      setRefresh(true);
      dispatch(
        refreshToken({ username: user, token: JSON.parse(refresh).token })
      )
        .then(unwrapResult)
        .then((d) => {
          auth = d.user;
          setRefresh(false);
        });
    }
  }

  return (
    <IfNotLoading loading={refresh}>
      <Route
        {...rest}
        render={({ location }) =>
          auth ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location },
              }}
            />
          )
        }
      />
    </IfNotLoading>
  );
}
