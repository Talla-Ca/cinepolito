import api from './config';

export const createTicket = async (ticketData) => {
  const response = await api.post('/tickets/', ticketData);
  return response.data;
};

export const getTicketsByFunction = async (functionId) => {
  const response = await api.get(`/tickets/${functionId}`);
  return response.data;
};
