import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../components/TaskForm';

// Mock fetch
global.fetch = jest.fn();

describe('TaskForm Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders form with title and due date inputs', () => {
    render(<TaskForm onTaskCreated={() => {}} />);
    
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha de vencimiento/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear tarea/i })).toBeInTheDocument();
  });

  test('shows error when submitting empty form', async () => {
    render(<TaskForm onTaskCreated={() => {}} />);
    
    const submitButton = screen.getByRole('button', { name: /crear tarea/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  test('submits form successfully with valid data', async () => {
    const mockOnTaskCreated = jest.fn();
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { _id: '1', title: 'Test Task' }, error: null }),
    });

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const titleInput = screen.getByLabelText(/título/i);
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    
    const submitButton = screen.getByRole('button', { name: /crear tarea/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnTaskCreated).toHaveBeenCalled();
    });
  });
});
