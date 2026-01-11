# TimeSlip-HR Admin Guide

Welcome to the TimeSlip-HR Administrator Guide. This comprehensive documentation covers all administrative features and workflows.

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Dashboard Overview](#2-dashboard-overview)
3. [Employee Management](#3-employee-management)
4. [Time Event Review](#4-time-event-review)
5. [Timesheet Management](#5-timesheet-management)
6. [Payroll Workflows](#6-payroll-workflows)
7. [System Settings](#7-system-settings)
8. [Reports and Analytics](#8-reports-and-analytics)
9. [Audit Logs](#9-audit-logs)
10. [Best Practices](#10-best-practices)
11. [Troubleshooting](#11-troubleshooting)
12. [Keyboard Shortcuts](#12-keyboard-shortcuts)

---

## 1. Getting Started

### First-Time Login

1. Navigate to `http://your-domain.com/sign-in`
2. Enter your admin email and password
3. Upon first login, you'll be prompted to change your password
4. Complete your profile setup

### Understanding the Dashboard Layout

The admin interface consists of:

- **Sidebar Navigation** (left): Quick access to all modules
- **Main Content Area** (center): Active module content
- **Header** (top): User profile, notifications, quick actions

### Navigation Overview

| Module | Description | Path |
|--------|-------------|------|
| Dashboard | Overview and statistics | `/admin/dashboard` |
| Employees | Employee management | `/admin/employee` |
| Timesheets | Timesheet review and approval | `/admin/timesheet` |
| Payroll | Pay periods and payslips | `/admin/payroll` |
| Reports | Analytics and exports | `/admin/reports` |
| Settings | System configuration | `/admin/settings` |

---

## 2. Dashboard Overview

### Real-Time Metrics

The dashboard displays four key metrics:

| Metric | Description |
|--------|-------------|
| **Total Employees** | Count of active employees in the system |
| **Clocked In** | Employees currently working |
| **On Break** | Employees currently on break |
| **Total Hours Today** | Cumulative hours worked today |

### Recent Activity Feed

Shows the latest time events across all employees:
- Clock in/out events
- Break in/out events
- Timesheet adjustments made by admins

**Filtering Options:**
- Filter by date range
- Filter by specific employee
- Filter by event type

### Quick Actions

- **+ Add Employee**: Opens the new employee dialog
- **Generate Timesheets**: Opens timesheet generation dialog
- **View Reports**: Navigate to reports module

---

## 3. Employee Management

### Adding New Employees

1. Navigate to **Employees** → Click **Add Employee**
2. Fill in required fields:
   - **Employee Number**: Unique identifier (e.g., 1001001)
   - **First Name** and **Last Name**
   - **Email Address**: Used for notifications and portal login
3. Fill optional fields:
   - Phone number
   - Department
4. Set employment details:
   - **Employment Type**: Full-time, Part-time, or Contractor
   - **Hourly Rate** or **Salary**
   - **Start Date**
5. Click **Save**

### Editing Employee Information

1. Find the employee in the table
2. Click the **Edit** button (pencil icon)
3. Update the necessary fields:
   - Contact details
   - Employment type
   - Compensation
   - Status
4. Click **Save Changes**

### Managing Employee Status

**Active vs. Inactive:**
- **Active**: Can clock in/out and appears in payroll
- **Inactive**: Cannot clock in, excluded from new payroll

**To deactivate an employee:**
1. Open the employee's edit dialog
2. Toggle the **Status** to Inactive
3. Save changes

> ⚠️ **Note**: Deactivating an employee does not delete their historical data.

### Bulk Operations

1. Check the boxes next to employees you want to select
2. A bulk actions bar appears at the top
3. Available actions:
   - **Export Selected**: Download CSV of selected employees
   - **Delete Selected**: Remove selected employees (with confirmation)

### Searching and Filtering

- **Search**: Type in the search box to filter by name, employee number, or email
- **Filter by Type**: Select employment type from dropdown
- **Filter by Status**: Show only active or inactive employees

---

## 4. Time Event Review

### Understanding Time Event Types

| Event Type | Description |
|------------|-------------|
| **Clock In** | Employee starts work |
| **Clock Out** | Employee ends work |
| **Break In** | Employee starts break |
| **Break Out** | Employee returns from break |

### Viewing Raw Time Events

1. Navigate to **Timesheets**
2. Click on a specific timesheet
3. Scroll to the **Time Events** section
4. Events are listed chronologically with timestamps

### Identifying Invalid Sequences

The system automatically flags invalid sequences:
- Clock Out before Clock In
- Break Out without Break In
- Multiple consecutive Clock Ins

Flagged events display a ⚠️ warning icon.

### Event Sources

| Source | Description |
|--------|-------------|
| **KIOSK** | Submitted via the kiosk terminal |
| **PORTAL** | Submitted via employee portal |
| **ADMIN** | Manually added by administrator |

---

## 5. Timesheet Management

### Generating Timesheets

**Prerequisites:**
- Pay period must exist
- Employees must have time events in the period

**Steps:**
1. Navigate to **Timesheets**
2. Click **Generate Timesheets**
3. Select the pay period
4. Choose employees (all or specific)
5. Click **Generate**

The system will:
- Process all time events for the period
- Calculate regular hours, breaks, and overtime
- Flag any anomalies detected

### Timesheet Statuses

| Status | Description | Editable |
|--------|-------------|----------|
| **DRAFT** | Initial state after generation | ✅ Yes |
| **REVIEWED** | Admin has reviewed | ✅ Yes |
| **APPROVED** | Ready for payroll | ✅ Yes |
| **LOCKED** | Final, cannot be edited | ❌ No |

### Reviewing Timesheet Details

Each timesheet shows:
- **Employee Information**: Name, employee number
- **Period**: Start date to end date
- **Summary Metrics**:
  - Total hours worked
  - Regular hours
  - Overtime hours
  - Break duration
  - Days worked
- **Daily Breakdown**: Expandable section with per-day details

### Handling Anomalies

Common anomaly types:

| Anomaly | Description | Quick Fix |
|---------|-------------|-----------|
| Missing Break | Worked 6+ hours without break | Apply standard 60-min break |
| Excessive Overtime | OT exceeds threshold | Review and confirm/adjust |
| Incomplete Day | Missing clock out | Add clock out time |
| Invalid Sequence | Events in wrong order | Review and correct |

**Using Quick Fix:**
1. Click the **Quick Fix** button next to the anomaly
2. Review the suggested adjustment
3. Modify the reason if needed
4. Click **Apply Quick Fix**

### Making Manual Adjustments

1. Click **Adjust** on the timesheet day row
2. Select the field: Regular, Break, or Overtime
3. Choose mode:
   - **Add/Subtract**: Add or remove minutes from current value
   - **Set Value**: Override with a specific value
4. Enter the minutes
5. Enter a reason (minimum 10 characters - required for audit)
6. Click **Save Adjustment**

### Approving and Locking Timesheets

**Workflow:**
1. Review all timesheet entries and anomalies
2. Make necessary adjustments
3. Change status to **REVIEWED**
4. If satisfied, change to **APPROVED**
5. After payroll generation, change to **LOCKED**

> 💡 **Tip**: Only lock timesheets after payslips are generated and verified.

### Exporting Timesheets

1. Select timesheets using checkboxes
2. Click **Export** button
3. Choose format: CSV or Excel
4. Download begins automatically

**CSV Fields:**
- Employee Number, Name
- Period Start/End
- Regular Hours, Overtime Hours, Break Duration
- Total Hours, Status

---

## 6. Payroll Workflows

### Pay Period Management

#### Creating a Pay Period

1. Navigate to **Payroll** → **Pay Periods** tab
2. Click **Create Pay Period**
3. Select period type:
   - **Weekly**: 7 days
   - **Bi-Weekly**: 14 days
   - **Semi-Monthly**: 15th and end of month
   - **Monthly**: Full month
4. Set start and end dates
5. Click **Create**

#### Closing/Reopening Periods

- **Close Period**: Prevents further timesheet changes
- **Reopen Period**: Allows additional changes (use sparingly)

### Payslip Generation

**Prerequisites:**
1. Pay period must be created
2. Timesheets for all employees must be **APPROVED**
3. Employee compensation rates must be set

**Steps:**
1. Navigate to **Payroll** → **Payslips** tab
2. Click **Generate Payslips**
3. Select the pay period
4. Review employee list (those with approved timesheets)
5. Click **Generate**

**Calculation Logic:**

```
For Hourly Employees:
  Gross Pay = (Hourly Rate × Regular Hours) + (Hourly Rate × OT Multiplier × OT Hours)

For Salaried Employees:
  Daily Rate = Monthly Salary ÷ Working Days in Month
  Gross Pay = Daily Rate × Days Worked

Deductions = Sum of all applicable deductions
Net Pay = Gross Pay - Total Deductions
```

### Reviewing Payslips

Each payslip shows:
- **Employee Details**: Name, employee number, department
- **Pay Period**: Start and end dates
- **Hours Breakdown**: Regular, overtime, total
- **Earnings**: Base pay, overtime pay, gross pay
- **Deductions**: Line items for each deduction
- **Net Pay**: Final amount

### Payslip Actions

| Action | Description |
|--------|-------------|
| **Preview PDF** | View payslip as PDF in browser |
| **Download PDF** | Save individual payslip |
| **Bulk Download** | Download all selected as ZIP |
| **Export CSV** | Export payslip data |

### Managing Deductions

#### Creating Deduction Types

1. Navigate to **Payroll** → **Deductions** tab
2. Click **Add Deduction**
3. Enter details:
   - **Name**: e.g., "Health Insurance"
   - **Type**: Fixed Amount or Percentage
   - **Value**: Amount or percentage
   - **Applicable To**: All employees or specific
4. Click **Save**

#### Common Deduction Types

| Deduction | Type | Typical Value |
|-----------|------|---------------|
| SSS | Percentage | Variable based on salary |
| PhilHealth | Percentage | 4% (shared employee/employer) |
| Pag-IBIG | Fixed | ₱100 - ₱200 |
| Tax Withholding | Percentage | Based on tax bracket |

---

## 7. System Settings

### General Settings

| Setting | Description |
|---------|-------------|
| **Company Name** | Displayed on payslips and reports |
| **Timezone** | Used for time event timestamps |
| **Date Format** | MM/DD/YYYY or DD/MM/YYYY |
| **Currency** | Currency symbol for payslips |

### Payroll Policies

#### Working Hours
- **Standard Daily Hours**: Default 8 hours
- **Standard Weekly Hours**: Default 40 hours

#### Overtime Rules
- **Overtime Threshold**: Hours per day before OT kicks in
- **Overtime Multiplier**: e.g., 1.5x for time-and-a-half

#### Break Policies
- **Minimum Break Duration**: e.g., 30 minutes
- **Required Break After**: e.g., 6 hours of work
- **Paid/Unpaid Breaks**: Whether breaks are paid

#### Rounding Rules
- **Clock In Rounding**: Round to nearest 5, 10, or 15 minutes
- **Direction**: Round up, down, or nearest

### Security Settings

| Setting | Description |
|---------|-------------|
| **Minimum Password Length** | Default: 8 characters |
| **Require Special Characters** | Yes/No |
| **Password Expiration** | Days until password must change |
| **Session Timeout** | Minutes of inactivity before logout |
| **Require PIN for Kiosk** | Enforce PIN on kiosk logins |

### Saving Settings

1. Make your changes
2. Click **Save Settings**
3. Changes take effect immediately

> ⚠️ **Warning**: Some settings (like rounding rules) only affect future time events.

---

## 8. Reports and Analytics

### Attendance Summary

**Available Metrics:**
- Total attendance days per employee
- Total hours worked
- Overtime hours
- Late arrivals count
- Early departures count
- Absences

**Generating a Report:**
1. Navigate to **Reports**
2. Click **Attendance Summary**
3. Select date range
4. Select employees or "All"
5. Click **Generate**
6. Export as PDF, CSV, or Excel

### Timesheet Reports

- **Individual Timesheet**: Detailed report for one employee
- **Bulk Timesheet**: Summary for all employees in a period
- **Anomaly Report**: All anomalies detected in a period

### Payroll Reports

- **Payroll Summary**: Total gross, deductions, net by period
- **Employee Payroll**: Individual payroll history
- **Deduction Summary**: Breakdown of all deductions applied

---

## 9. Audit Logs

### Viewing Audit Logs

1. Navigate to **Settings** → **Audit Logs**
2. Browse the log entries

### Logged Actions

| Action | What's Logged |
|--------|---------------|
| Employee CRUD | Create, update, delete employees |
| Timesheet Adjustments | All manual adjustments with reasons |
| Payslip Generation | When payslips were created |
| Status Changes | Timesheet status transitions |
| Settings Changes | Any configuration modifications |

### Filtering Logs

- **By User**: Who performed the action
- **By Date**: Date range filter
- **By Action Type**: Filter specific action types

### Exporting Logs

Click **Export** to download logs as CSV for compliance records.

---

## 10. Best Practices

### Weekly Workflow

| Day | Task |
|-----|------|
| Monday | Review previous week's timesheets |
| Tuesday-Wednesday | Address anomalies and make adjustments |
| Thursday | Approve reviewed timesheets |
| Friday | Generate payslips (if pay period ends) |

### Monthly Payroll Workflow

1. **Day 1**: Create new pay period
2. **End of Period + 1 day**: Generate timesheets
3. **End + 2-3 days**: Review, adjust, approve timesheets
4. **End + 4 days**: Generate payslips
5. **Pay Day**: Distribute payslips, close/lock period

### Data Integrity Tips

- Always review anomalies before approving timesheets
- Require detailed reasons for all adjustments
- Lock timesheets after payslips are generated
- Regular backup of audit logs

### Communication Tips

- Notify employees of any timesheet corrections
- Send payslips promptly after generation
- Document any recurring issues for training

---

## 11. Troubleshooting

### Employee Can't Clock In

**Possible Causes:**
1. Employee status is Inactive
2. Employee number not found
3. Network connectivity issues

**Solutions:**
1. Check employee status in admin panel
2. Verify employee number is correct
3. Check kiosk network connection

### Timesheet Generation Fails

**Possible Causes:**
1. No time events in the period
2. Pay period dates are incorrect
3. System error

**Solutions:**
1. Verify employees have time events in the date range
2. Check pay period start/end dates
3. Check server logs or contact support

### Payslip Calculation Discrepancies

**Verification Steps:**
1. Open timesheet and verify total hours
2. Check employee compensation settings
3. Verify deduction amounts
4. Manually calculate and compare

### Browser Issues

- **Clear cache and cookies**
- Use supported browsers: Chrome, Edge, Firefox, Safari
- Disable browser extensions that may interfere
- Try incognito/private browsing mode

---

## 12. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Open quick search |
| `Ctrl/Cmd + N` | Open "New Item" dialog |
| `Ctrl/Cmd + S` | Save current form |
| `Escape` | Close dialog / Clear selection |
| `↑ / ↓` | Navigate table rows |
| `Enter` | Open selected row details |

---

## Need Help?

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#11-troubleshooting) section
2. Review the [Audit Logs](#9-audit-logs) for error entries
3. Contact your system administrator
4. Submit a support ticket

---

*Last Updated: January 2026*
