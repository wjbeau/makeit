import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthed } from "./auth.slice";

export const IfAuthenticated : FunctionComponent = (props) => {
  const authed = useSelector(selectAuthed);

  return (
    <>
        {authed && props.children}
    </>
  );
}
