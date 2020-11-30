import React from 'react';
import { Audition } from './audition.state';


export const AuditionsList = (props:any) => {
  const { auditions } = props
   
  return (
    <>
      { auditions.map((audition:Audition) => 
          <div  key={audition.id}>
              This is an audition: {audition.breakdown}
          </div>
      )}
    </>
  );
}

export default AuditionsList;
