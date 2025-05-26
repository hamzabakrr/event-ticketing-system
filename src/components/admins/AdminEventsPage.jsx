import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events/admin', {
        params: { status: filter === 'all' ? '' : filter }
      });
      setEvents(res.data);
    } catch (err) {
      toast.error('Failed to load events');
    }
  };

  const handleStatusChange = async (eventId, status) => {
    try {
      await axios.patch(`/api/events/${eventId}/status`, { status });
      toast.success('Event status updated');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <TableContainer component={Paper}>
      <div style={{ padding: '16px' }}>
        <Button onClick={() => setFilter('all')}>All</Button>
        <Button onClick={() => setFilter('pending')}>Pending</Button>
        <Button onClick={() => setFilter('approved')}>Approved</Button>
        <Button onClick={() => setFilter('declined')}>Declined</Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Organizer</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map(event => (
            <TableRow key={event._id}>
              <TableCell>{event.title}</TableCell>
              <TableCell>{event.organizer.name}</TableCell>
              <TableCell>
                <Chip 
                  label={event.status} 
                  color={
                    event.status === 'approved' ? 'success' : 
                    event.status === 'pending' ? 'warning' : 'error'
                  } 
                />
              </TableCell>
              <TableCell>
                {event.status === 'pending' && (
                  <>
                    <Button onClick={() => handleStatusChange(event._id, 'approved')}>
                      Approve
                    </Button>
                    <Button onClick={() => handleStatusChange(event._id, 'declined')}>
                      Decline
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
