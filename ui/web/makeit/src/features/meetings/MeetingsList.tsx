import React from 'react';


export const MeetingsList = (props:any) => {
  const { meetings } = props
   
  return (
    <>
      { meetings.map((meeting:any) => {
          <div>
              This is a meeting: {meeting.subject}
          </div>
      })}
    </>
  );
}

export default MeetingsList;
