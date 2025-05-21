// src/components/events/EventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => (
  <div>
    <h3>{event.title}</h3>
    <p>{event.date}</p>
    <p>{event.location}</p>
    <Link to={`/events/${event.id}`}>View Details</Link>
  </div>
);

export default EventCard;
