const book = async () => {
  await axios.post("/api/bookings", { eventId, quantity });
};
