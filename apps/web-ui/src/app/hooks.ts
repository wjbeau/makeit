import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect } from "react";

export const useAsync = (asyncFn, onSuccess, onError) => {
    useEffect(() => {
      let isMounted = true;
      asyncFn()
        .then(unwrapResult)
        .then((data) => {
            if(isMounted) onSuccess(data)
        })
        .catch((error) => onError(error));
      return () => { isMounted = false };
    }, [asyncFn, onSuccess, onError]);
  }