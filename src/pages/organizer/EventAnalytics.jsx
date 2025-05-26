import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api';

const EventAnalytics = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    ticketsSold: 0,
    ticketsAvailable: 0,
    salesByType: [],
    recentSales: [],
    dailyStats: []
  });

  useEffect(() => {
    fetchEventAnalytics();
  }, [id]);

  const fetchEventAnalytics = async () => {
    try {
      setLoading(true);
      const [eventResponse, analyticsResponse] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/analytics`)
      ]);
      
      setEvent(eventResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-600">Event not found</h3>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{event.title} - Analytics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {analytics.totalRevenue.toLocaleString('en-EG', {
              style: 'currency',
              currency: 'EGP'
            })}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Tickets Sold</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {analytics.ticketsSold} / {analytics.ticketsSold + analytics.ticketsAvailable}
          </p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full"
              style={{
                width: `${(analytics.ticketsSold / (analytics.ticketsSold + analytics.ticketsAvailable)) * 100}%`
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Average Ticket Price</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {(analytics.totalRevenue / analytics.ticketsSold || 0).toLocaleString('en-EG', {
              style: 'currency',
              currency: 'EGP'
            })}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Tickets Available</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.ticketsAvailable}</p>
        </div>
      </div>

      {/* Sales by Ticket Type */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Sales by Ticket Type</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analytics.salesByType.map((type) => (
              <div key={type.name}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{type.name}</span>
                  <span>{type.sold} sold</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{
                      width: `${(type.sold / type.total) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Recent Sales</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.recentSales.map((sale, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.ticketType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.total.toLocaleString('en-EG', {
                      style: 'currency',
                      currency: 'EGP'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Stats Chart */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Daily Sales</h2>
        </div>
        <div className="p-6">
          <div className="h-64">
            {/* Chart will be implemented using a charting library like Chart.js or Recharts */}
            <div className="flex items-center justify-center h-full text-gray-500">
              Chart component will be added here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics; 