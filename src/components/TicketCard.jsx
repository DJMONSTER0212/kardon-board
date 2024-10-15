import React from "react";
import threeDotsIcon from "../assets/icons_FEtask/3_dot_menu.svg";
import circleIcon from "../assets/icons_FEtask/circle_icon.svg";

const TicketCard = ({ ticket }) => {
  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <div className="ticket-id">{ticket.id}</div>
        <div className="icons"></div>
      </div>
      <h4 className="ticket-title">{ticket.title}</h4>
      <div className="ticket-tags">
        {ticket.tag &&
          ticket.tag.length > 0 &&
          ticket.tag.map((tag, index) => (
            <span
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
              key={index}
              className="ticket-tag"
            >
              <img src={threeDotsIcon} alt="Menu" className="icon-menu" />
              <span style={{gap:"2px"}}>
                <img src={circleIcon} alt="Status" className="icon-status" />
                {" "}
                {tag}
              </span>
            </span>
          ))}
      </div>
    </div>
  );
};

export default TicketCard;
