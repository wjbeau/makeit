import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthed } from "./auth.slice";

export const IfAuthenticated : FunctionComponent = (props) => {
  const authed = useSelector(selectAuthed);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
        {authed && props.children}
    </>
  );
}
