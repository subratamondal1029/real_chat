import React from "react";

const ContactCard = ({ data, avterLogo, ...props }) => {

  return (
    <div
      className="contact"
     {...props}
    >
      <img src={avterLogo} alt={`${data.username} Logo`} />
      <div>
        <p>{data.fullName}</p>
        <p className="recentMessage">
          {data?.messages?.[data.messages.length - 1].text}
        </p>
      </div>
      <p>{data?.lastMessagetime}</p>
    </div>
  );
};

export default ContactCard;
