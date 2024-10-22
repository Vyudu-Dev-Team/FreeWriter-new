import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoryProvider } from '../contexts/StoryContext';
import Dashboard from './Dashboard';

jest.mock('axios');

const MockDashboard = () => {
  return (
    <BrowserRouter>
      <StoryProvider>
        <Dashboard />
      </StoryProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  test('renders dashboard and displays stories', async () => {
    render(<MockDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Your Stories/i)).toBeInTheDocument();
    });

    // Add more specific tests based on your Dashboard component's content
  });
});