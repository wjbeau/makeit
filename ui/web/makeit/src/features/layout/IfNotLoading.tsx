import React from 'react';
import Loading from './Loading';

const IfNotLoading = (props:any) => {
    if(props.loading) {
        return <Loading />
    }
    else {
        return <>{props.children}</>
    }
}

export default IfNotLoading;
