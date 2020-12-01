import React from 'react';
import { Audition } from '@makeit/types';


export const AuditionsList = (props) => {
  const { auditions } = props
   
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      { auditions.map((audition:Audition) => 
          <div  key={audition.id}>
              This is an audition: {audition.breakdown.project.name}
          </div>
      )}
    </>
  );
}

export default AuditionsList;
