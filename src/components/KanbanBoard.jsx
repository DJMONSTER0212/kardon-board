import React, { useState, useEffect } from "react";
import TicketCard from "./TicketCard";
import DisplaySvg from "../assets/icons_FEtask/Display.svg";
import DownSvg from "../assets/icons_FEtask/down.svg";
import LowPriority from "../assets/icons_FEtask/Img_Low_Priority.svg";
import MediumPriority from "../assets/icons_FEtask/Img_Medium_Priority.svg";
import HighPriority from "../assets/icons_FEtask/Img_High_Priority.svg";
import UrgentSvg from "../assets/icons_FEtask/SVG - Urgent Priority colour.svg";
import NoPriority from "../assets/icons_FEtask/No_priority.svg";
import DoneSvg from "../assets/icons_FEtask/Done.svg";
import CancelledSvg from "../assets/icons_FEtask/Cancelled.svg";
import TodoSvg from "../assets/icons_FEtask/To-do.svg";
import InProcessSvg from "../assets/icons_FEtask/in_progress.svg";
import AddSvg from "../assets/icons_FEtask/add.svg";
import menuSvg from "../assets/icons_FEtask/3_dot_menu.svg";
import BackLogSvg from "../assets/icons_FEtask/Backlog.svg";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const statusLabels = {
    Backlog: "Backlog",
    Todo: "Todo",
    "In progress": "In progress",
    Done: "Done",
    Cancelled: "Cancelled",
  };

  const priorityLabels = {
    0: "No priority",
    4: "Urgent",
    3: "High",
    2: "Medium",
    1: "Low",
  };

  const priorityOrder = ["No priority", "Urgent", "High", "Medium", "Low"];

  const statusIcons = {
    Backlog: BackLogSvg,
    Todo: TodoSvg,
    "In progress": InProcessSvg,
    Done: DoneSvg,
    Cancelled: CancelledSvg,
  };

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((data) => {
        setTickets(data.tickets);
        setUsers(data.users);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const groupedTickets = tickets.reduce((acc, ticket) => {
    let key;
    if (groupBy === "user") {
      key = getUserName(ticket.userId);
    } else if (groupBy === "priority") {
      key = priorityLabels[ticket.priority];
    } else {
      key = ticket.status;
    }

    if (!acc[key]) acc[key] = [];
    acc[key].push(ticket);
    return acc;
  }, {});

  const priorityIcons = {
    "No priority": NoPriority,
    Urgent: UrgentSvg,
    High: HighPriority,
    Medium: MediumPriority,
    Low: LowPriority,
  };

  const sortedGroupedTickets =
    groupBy === "status"
      ? Object.keys(statusLabels).map((statusKey) => {
          const statusName = statusLabels[statusKey];
          const ticketsInStatus = groupedTickets[statusName] || [];
          const sortedTickets = ticketsInStatus.sort((a, b) => {
            if (sortBy === "priority") return b.priority - a.priority;
            if (sortBy === "title") return a.title.localeCompare(b.title);
            return 0;
          });
          return { group: statusName, tickets: sortedTickets };
        })
      : groupBy === "user"
      ? users.map((user) => {
          const userName = user.name;
          const ticketsInUser = groupedTickets[userName] || [];
          const sortedTickets = ticketsInUser.sort((a, b) => {
            if (sortBy === "priority") return b.priority - a.priority;
            if (sortBy === "title") return a.title.localeCompare(b.title);
            return 0;
          });
          return { group: userName, tickets: sortedTickets };
        })
      : priorityOrder.map((priorityName) => {
          const ticketsInPriority = groupedTickets[priorityName] || [];
          const sortedTickets = ticketsInPriority.sort((a, b) => {
            if (sortBy === "priority") return b.priority - a.priority;
            if (sortBy === "title") return a.title.localeCompare(b.title);
            return 0;
          });
          return { group: priorityName, tickets: sortedTickets };
        });

  return (
    <div className="kanban-container">
      <div className="kanban-controls">
        <div className="dropdown">
          <button
            className="dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="icon">
              <img src={DisplaySvg} alt="Display Icon" />
            </span>{" "}{" "}
            &nbsp;
            Display <img src={DownSvg} alt="Dropdown Icon" />
          </button>
          {isDropdownOpen && (
            <div style={{width :"250px"}} className="dropdown-content">
              <div style={{display :"flex" ,gap:"50px" , width:"100%" ,justifyContent :"space-between", flexDirection :"row" , alignItems :"center"}}>
                <label>Grouping:</label>
                <select onChange={(e) => setGroupBy(e.target.value)}>
                  <option value="status">Status</option>
                  <option value="user">User</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
              <div style={{display :"flex" ,gap:"50px" , width:"100%" ,justifyContent :"space-between", flexDirection :"row" , alignItems :"center"}}>

                <label>Ordering:</label>
                <select  onChange={(e) => setSortBy(e.target.value)}>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="kanban-board">
        {sortedGroupedTickets.map(({ group, tickets }) => (
          <div key={group} className="kanban-column">
            <div className="column-header">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {groupBy === "status" && statusIcons[group] && (
                  <img
                    src={statusIcons[group]}
                    alt={`${group} Status Icon`}
                    className="status-icon"
                  />
                )}
                {groupBy === "priority" && priorityIcons[group] && (
                  <img
                    src={priorityIcons[group]}
                    alt={`${group} Priority Icon`}
                    className="priority-icon"
                  />
                )}
                <h3>
                  {group}{" "}
                  <span style={{ color: "#89898d" }}>{tickets.length}</span>
                </h3>
              </div>
              <div style={{display : "flex" , flexDirection:"row" , alignItems:"center" , gap:"3px"}}>
                <img src={AddSvg} alt="Add Icon" className="add-icon" />
                <img src={menuSvg} alt="Menu Icon" className="menu-icon" />
              </div>
            </div>

            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
