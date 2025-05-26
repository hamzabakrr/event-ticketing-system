import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookTicketForm = ({ event }) => {
  const [quantity, setQuantity] = useState(1);
  const [availableTickets, setAvailableTickets] = useState(event.remainingTickets);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/bookings', {
        event: event._id,
        quantity
      });
      toast.success('Booking successful!');
      setAvailableTickets(availableTickets - quantity);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6">Book Tickets</Typography>
      <Typography>Available: {availableTickets}</Typography>
      <TextField
        type="number"
        label="Quantity"
        value={quantity}
        onChange={(e) => {
          const value = Math.min(Number(e.target.value), availableTickets);
          setQuantity(Math.max(value, 1));
        }}
        inputProps={{ min: 1, max: availableTickets }}
        fullWidth
        margin="normal"
      />
      <Typography>Total: ${(quantity * event.ticketPrice).toFixed(2)}</Typography>
      <Button 
        type="submit" 
        variant="contained" 
        disabled={availableTickets <= 0}
      >
        {availableTickets <= 0 ? 'Sold Out' : 'Book Now'}
      </Button>
    </Box>
  );
};
