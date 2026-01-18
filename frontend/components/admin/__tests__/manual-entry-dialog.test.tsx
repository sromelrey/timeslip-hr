import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ManualEntryDialog } from '../manual-entry-dialog';

describe('ManualEntryDialog', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <ManualEntryDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Add Manual Entry')).toBeInTheDocument();
    expect(screen.getByText('Regular Session')).toBeInTheDocument();
    expect(screen.getByText('Overtime Session')).toBeInTheDocument();
  });

  it('calculates regular and overtime minutes separately', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ManualEntryDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-01-20' } });
    
    // Regular: 9am - 5pm (8h = 480m)
    // No regular break
    
    // Overtime: 6pm - 8pm (2h = 120m)
    const otStart = screen.getAllByLabelText(/Start/i)[1]; // OT Start
    const otEnd = screen.getAllByLabelText(/End/i)[1];     // OT End
    
    fireEvent.change(otStart, { target: { value: '18:00' } });
    fireEvent.change(otEnd, { target: { value: '20:00' } });

    fireEvent.change(screen.getByLabelText(/Reason/i), { target: { value: 'Regular shift + stay late OT' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Entry/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        workDate: '2025-01-20',
        regularMinutes: 480,
        overtimeMinutes: 120,
        reason: 'Regular shift + stay late OT',
      });
    });
  });

  it('subtracts breaks from each session correctly', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ManualEntryDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-01-20' } });

    // Regular: 9am - 1pm (4h)
    fireEvent.change(screen.getAllByLabelText(/End/i)[0], { target: { value: '13:00' } });
    
    // Overtime: 2pm - 6pm (4h) with 3pm-4pm break (1h) = 3h total (180m)
    const otStart = screen.getAllByLabelText(/Start/i)[1];
    const otEnd = screen.getAllByLabelText(/End/i)[1];
    const otBreakStart = screen.getAllByLabelText(/Break Start/i)[1];
    const otBreakEnd = screen.getAllByLabelText(/Break End/i)[1];

    fireEvent.change(otStart, { target: { value: '14:00' } });
    fireEvent.change(otEnd, { target: { value: '18:00' } });
    fireEvent.change(otBreakStart, { target: { value: '15:00' } });
    fireEvent.change(otBreakEnd, { target: { value: '16:00' } });

    fireEvent.change(screen.getByLabelText(/Reason/i), { target: { value: 'Mixed sessions with OT break' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Entry/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        workDate: '2025-01-20',
        regularMinutes: 240,
        overtimeMinutes: 180,
        reason: 'Mixed sessions with OT break',
      });
    });
  });
});
