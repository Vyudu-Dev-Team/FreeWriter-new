import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../contexts/AppContext';
import Dashboard from './Dashboard';
import axios from 'axios';

jest.mock('axios');

const MockDashboard = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <Dashboard />
      </AppProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  test('renders dashboard and displays stories', async () => {
    axios.get.mockResolvedValue({ data: [
      { _id: '1', title: 'Test Story 1', createdAt: new Date().toISOString() },
      { _id: '2', title: 'Test Story 2', createdAt: new Date().toISOString() }
    ]});

    render(<MockDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Your Stories/i)).toBeInTheDocument();
      expect(screen.getByText('Test Story 1')).toBeInTheDocument();
      expect(screen.getByText('Test Story 2')).toBeInTheDocument();
    });
  });

  test('displays error message when fetching stories fails', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch'));

    render(<MockDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch stories/i)).toBeInTheDocument();
    });
  });
});