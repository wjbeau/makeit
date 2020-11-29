import React from 'react';
import { Audition } from './audition.state';


export const AuditionsList = (props:any) => {
  const { auditions } = props
   
  return (
    <>
      { auditions.map((audition:Audition) => {
          <div>
              This is an audition: {audition.subject}
          </div>
      })}
    </>
  );
}

export default AuditionsList;
