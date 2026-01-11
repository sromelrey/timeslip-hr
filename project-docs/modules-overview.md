# TimeSlip HR: Modules & Tier Overview

This document provides a comprehensive overview of the modules available in the TimeSlip HR platform, their current implementation status, and how they are bundled across different pricing tiers.

---

## 1. Tier Availability Matrix

The following matrix shows which modules are available in each pricing tier.

| Category | Module | Free | Basic | Pro | Enterprise |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Foundation** | **Core HR (Employees, Depts)** | ✅ | ✅ | ✅ | ✅ |
| | **Company Management** | ✅ | ✅ | ✅ | ✅ |
| **Time** | **Time & Attendance** | ✅ | ✅ | ✅ | ✅ |
| | **Timesheet Management** | ✅ | ✅ | ✅ | ✅ |
| | **Approval Workflows** | ✅ | ✅ | ✅ | ✅ |
| **Finance** | **Payroll Processing** | ✅ | ✅ | ✅ | ✅ |
| | **Payslip Generation** | ✅ | ✅ | ✅ | ✅ |
| | **Statutory Compliance (SSS/PH/PI)** | ✅ | ✅ | ✅ | ✅ |
| **Premium** | **Leave Management** | ❌ | ❌ | ✅ | ✅ |
| | **Advanced Reports** | ❌ | ❌ | ✅ | ✅ |
| | **Recruitment (ATS)** | ❌ | ❌ | ✅ | ✅ |
| | **Performance Management** | ❌ | ❌ | ✅ | ✅ |
| **Enterprise** | **SSO Integration** | ❌ | ❌ | ❌ | ✅ |
| | **Custom Report Builder** | ❌ | ❌ | ❌ | ✅ |
| | **Advanced Audit Logs** | ❌ | ❌ | ❌ | ✅ |
| | **API Access** | ❌ | ❌ | ❌ | ✅ |

> [!NOTE]
> **Free vs Basic**: The primary difference between Free and Basic tiers is the **Scaling Limits** (Employee count, Admin counts, Kiosk sessions) rather than the feature set.

---

## 2. Module Descriptions

### Core HR & Foundation
*   **Company Management**: Multi-tenant infrastructure allowing for multi-branch and multi-legal entity setup.
*   **Employee Management**: Digital records for all staff, including personal info, contact details, and employment history.
*   **Organization Hierarchy**: Management of departments, positions, and reporting lines.

### Time & Attendance
*   **Time Tracking**: Support for multiple clock-in sources (Kiosk, Web, Mobile).
*   **Timesheet Management**: Automated aggregation of clock events into daily and periodic timesheets.
*   **Anomaly Detection**: Automatic flagging of late arrivals, early departures, and missing clock events.

### Payroll & Compliance
*   **Payroll Engine**: Automated calculation of gross-to-net pay based on timesheet data and compensation settings.
*   **Philippine Compliance**: Pre-configured tables for SSS, PhilHealth, Pag-IBIG, and BIR (TRAIN Law) tax brackets.
*   **Payslip Management**: Secure storage and PDF generation of payslips for employees.

### Premium HR Modules (Planned)
*   **Leave Management**: Accrual tracking, application workflows, and balance management.
*   **Recruitment/ATS**: Job posting, applicant tracking, and interview scheduling.
*   - **Performance Management**: KPI tracking, 360-degree feedback, and annual reviews.

---

## 3. Current Implementation Status

| Module | Status | Priority | Implementation Epic |
| :--- | :--- | :--- | :--- |
| **Core HR** | ✅ Implemented | - | EPIC-01 |
| **Auth & User Mgmt** | ✅ Implemented | - | EPIC-02 |
| **Time Tracking (Kiosk)** | ✅ Implemented | - | EPIC-03 |
| **Timesheets** | ✅ Implemented | - | EPIC-04 |
| **Payroll Processing** | ✅ Implemented | - | EPIC-05 |
| **Tier Management** | 📋 Planned | High | EPIC-20 |
| **RBAC (Dynamic)** | 📋 Planned | High | EPIC-10 |
| **Leave Management** | 📋 Planned | Medium | EPIC-07 |
| **Recruitment (ATS)** | 📋 Planned | Low | EPIC-12 |

---

## 4. Scaling Limits per Tier

| Limit | Free | Basic | Pro | Enterprise |
| :--- | :--- | :--- | :--- | :--- |
| **Max Employees** | 20 | Unlimited | Unlimited | Unlimited |
| **Admin Accounts** | 1 | 5 | Unlimited | Unlimited |
| **Simultaneous Kiosks** | 1 | 3 | Unlimited | Unlimited |
| **Data Retention** | 6 Months | Unlimited | Unlimited | Unlimited |
| **Support** | Community | Email / Chat | Priority | 24/7 Dedicated |

---

## 5. Technical Architecture for Gating

The system uses a **Dual-Gating Strategy** to ensure data security and plan compliance:

1.  **Feature Logic Gating (Company Level)**:
    Checks if the company's tier (or active add-ons) includes the requested module via `FeatureAccessGuard`.
2.  **Permission Gating (User Level)**:
    Checks if the specific logged-in user has been granted the specific action (e.g., `payroll.approve`) via `RolesGuard`.

Combined, these ensure that even if a user has "Admin" permissions, they cannot access Premium features if the company is on a Free tier.
