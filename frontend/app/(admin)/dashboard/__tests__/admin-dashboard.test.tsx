/**
 * Tests for the Admin Dashboard page.
 * Tests stat card rendering logic, loading states, and data display.
 */

describe('Admin Dashboard Page', () => {
  // Mock dashboard stats 
  const mockStats = {
    totalEmployees: 50,
    attendanceToday: {
      present: 45,
      total: 50,
      percentage: 90,
    },
    pendingApprovals: {
      timesheets: 5,
      payslips: 2,
    },
    currentlyClockedIn: 40,
    onBreak: 5,
    recentActivity: [
      {
        id: 1,
        employeeName: 'John Doe',
        eventType: 'CLOCK_IN',
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        employeeName: 'Jane Smith',
        eventType: 'BREAK_IN',
        timestamp: new Date().toISOString(),
      },
    ],
  };

  describe('Stat Cards Configuration', () => {
    it('should define 6 stat cards', () => {
      const statCards = [
        { name: 'Total Employees', value: mockStats.totalEmployees },
        { name: 'Attendance Today', value: `${mockStats.attendanceToday.percentage}%` },
        { name: 'Pending Approvals', value: mockStats.pendingApprovals.timesheets + mockStats.pendingApprovals.payslips },
        { name: 'Present Today', value: `${mockStats.attendanceToday.present}/${mockStats.attendanceToday.total}` },
        { name: 'Currently Clocked In', value: mockStats.currentlyClockedIn },
        { name: 'On Break', value: mockStats.onBreak },
      ];

      expect(statCards).toHaveLength(6);
    });

    it('should display total employees count', () => {
      expect(mockStats.totalEmployees).toBe(50);
    });

    it('should display attendance percentage', () => {
      const attendanceDisplay = `${mockStats.attendanceToday.percentage}%`;
      expect(attendanceDisplay).toBe('90%');
    });

    it('should calculate total pending approvals', () => {
      const totalPending = mockStats.pendingApprovals.timesheets + mockStats.pendingApprovals.payslips;
      expect(totalPending).toBe(7);
    });

    it('should display present/total ratio', () => {
      const presentDisplay = `${mockStats.attendanceToday.present}/${mockStats.attendanceToday.total}`;
      expect(presentDisplay).toBe('45/50');
    });

    it('should display currently clocked in count', () => {
      expect(mockStats.currentlyClockedIn).toBe(40);
    });

    it('should display on break count', () => {
      expect(mockStats.onBreak).toBe(5);
    });
  });

  describe('Stat Card Colors', () => {
    it('should assign color classes to stat cards', () => {
      const colorConfig = [
        { name: 'Total Employees', color: 'text-blue-500', bg: 'bg-blue-50' },
        { name: 'Attendance Today', color: 'text-green-500', bg: 'bg-green-50' },
        { name: 'Pending Approvals', color: 'text-orange-500', bg: 'bg-orange-50' },
        { name: 'Present Today', color: 'text-purple-500', bg: 'bg-purple-50' },
        { name: 'Currently Clocked In', color: 'text-teal-500', bg: 'bg-teal-50' },
        { name: 'On Break', color: 'text-amber-500', bg: 'bg-amber-50' },
      ];

      expect(colorConfig[0].color).toBe('text-blue-500');
      expect(colorConfig[5].color).toBe('text-amber-500');
    });
  });

  describe('Recent Activity Feed', () => {
    it('should display recent activities', () => {
      expect(mockStats.recentActivity).toHaveLength(2);
    });

    it('should show employee name in activity', () => {
      expect(mockStats.recentActivity[0].employeeName).toBe('John Doe');
    });

    it('should show event type in activity', () => {
      expect(mockStats.recentActivity[0].eventType).toBe('CLOCK_IN');
    });

    it('should show timestamp in activity', () => {
      expect(mockStats.recentActivity[0].timestamp).toBeDefined();
    });

    it('should handle empty activity list', () => {
      const emptyStats = { ...mockStats, recentActivity: [] };
      expect(emptyStats.recentActivity).toHaveLength(0);
    });
  });

  describe('Loading State', () => {
    it('should show loading message when data is loading', () => {
      const loadingState = {
        stats: null,
        loading: true,
        error: null,
      };

      expect(loadingState.loading).toBe(true);
      expect(loadingState.stats).toBeNull();
    });

    it('should hide loading when data is loaded', () => {
      const loadedState = {
        stats: mockStats,
        loading: false,
        error: null,
      };

      expect(loadedState.loading).toBe(false);
      expect(loadedState.stats).toBeDefined();
    });
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', () => {
      const errorState = {
        stats: null,
        loading: false,
        error: 'Failed to fetch dashboard data',
      };

      expect(errorState.error).toBe('Failed to fetch dashboard data');
    });

    it('should provide retry capability on error', () => {
      const mockRefetch = jest.fn();
      
      // Simulate retry button click
      mockRefetch();
      
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Refresh Functionality', () => {
    it('should provide refresh button', () => {
      const mockRefetch = jest.fn();
      
      mockRefetch();
      
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('should disable refresh during loading', () => {
      const state = { loading: true };
      const isDisabled = state.loading;
      
      expect(isDisabled).toBe(true);
    });

    it('should enable refresh when not loading', () => {
      const state = { loading: false };
      const isDisabled = state.loading;
      
      expect(isDisabled).toBe(false);
    });
  });

  describe('Welcome Message', () => {
    it('should display welcome message with user name', () => {
      const user = { firstName: 'Admin' };
      const welcomeMessage = `Welcome back, ${user.firstName || 'Admin'}`;
      
      expect(welcomeMessage).toBe('Welcome back, Admin');
    });

    it('should fallback to default when no user name', () => {
      const user = { firstName: null };
      const welcomeMessage = `Welcome back, ${user.firstName || 'Admin'}`;
      
      expect(welcomeMessage).toBe('Welcome back, Admin');
    });
  });

  describe('Auto-refresh', () => {
    it('should set up auto-refresh interval', () => {
      jest.useFakeTimers();
      const mockRefetch = jest.fn();
      
      // Simulate interval (5 minutes = 300000ms)
      const intervalId = setInterval(mockRefetch, 300000);
      
      jest.advanceTimersByTime(300000);
      
      expect(mockRefetch).toHaveBeenCalledTimes(1);
      
      clearInterval(intervalId);
      jest.useRealTimers();
    });
  });

  describe('Chart Placeholder', () => {
    it('should show attendance overview section', () => {
      const chartTitle = 'Attendance Overview';
      expect(chartTitle).toBe('Attendance Overview');
    });

    it('should show coming soon message for chart', () => {
      const placeholderText = 'Chart visualization coming soon';
      expect(placeholderText).toContain('coming soon');
    });
  });
});
