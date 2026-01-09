# Full HRIS Database Schema (DBML)

This document contains a comprehensive database schema for a full-featured HRIS (Human Resource Information System). Use this at [dbdiagram.io](https://dbdiagram.io) to visualize.

## Modules Covered

| Module | Tables |
|--------|--------|
| Core HR | companies, users, employees, departments, positions, branches |
| Compensation | employee_compensation, salary_grades, allowances |
| Time & Attendance | time_events, schedules, shift_patterns |
| Timesheets | timesheets, timesheet_days, timesheet_adjustments, timesheet_anomalies |
| Payroll | pay_periods, payslips, payslip_items, deductions, tax_brackets |
| Leave Management | leave_types, leave_balances, leave_requests, holidays |
| Recruitment | job_postings, applications, interviews, offer_letters |
| Performance | performance_cycles, goals, reviews, competencies, review_competency_scores |
| Learning | courses, enrollments, certifications, employee_certifications |
| Benefits | benefit_plans, benefit_enrollments, dependents, benefit_dependents |
| Documents | documents, document_types |
| **RBAC** | **roles, permissions, role_permissions, user_roles, user_permissions** |
| System | settings, audit_logs, notifications |

---

## DBML Schema

```dbml
title ERD FULL HRIS
// =====================================================
// CORE HR MODULE
// =====================================================

companies [icon: building, color: teal] {
  id int pk
  name string
  legalName string
  taxId string
  registrationNumber string
  industry string
  website string
  logoUrl string
  address text
  city string
  country string
  phone string
  email string
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

branches [icon: map-pin, color: teal] {
  id int pk
  companyId int
  name string
  code string
  address text
  city string
  country string
  phone string
  isHeadquarters boolean
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

departments [icon: layers, color: cyan] {
  id int pk
  companyId int
  parentDepartmentId int  // for hierarchy
  name string
  code string
  costCenter string
  managerId int           // employee who manages this dept
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

positions [icon: briefcase, color: cyan] {
  id int pk
  companyId int
  departmentId int
  title string
  code string
  level int              // 1=Entry, 2=Mid, 3=Senior, 4=Manager, etc.
  salaryGradeId int
  description text
  requirements text
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

// =====================================================
// USERS + AUTH SESSIONS (RBAC is authority)
// =====================================================

users [icon: user, color: blue] {
  id int pk
  companyId int
  email string
  passwordHash string
  displayName string
  firstName string
  lastName string

  // NOTE: RBAC tables are the authority
  // role enum  // ❌ removed

  employeeId int
  isActive boolean

  mfaEnabled boolean
  mfaSecret string
  mfaVerifiedAt timestamp

  lastLoginAt timestamp
  passwordChangedAt timestamp
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

user_sessions [icon: smartphone, color: blue] {
  id int pk
  userId int
  companyId int

  refreshTokenHash string       // hash(token), not the token itself
  sessionStatus enum            // ACTIVE | REVOKED | EXPIRED
  expiresAt timestamp
  revokedAt timestamp

  deviceId string
  deviceName string
  userAgent string
  ipAddress string
  lastSeenAt timestamp

  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

employees [icon: id-card, color: indigo] {
  id int pk
  companyId int
  branchId int
  departmentId int
  positionId int
  reportingManagerId int  // self-referential
  employeeNumber string
  firstName string
  middleName string
  lastName string
  preferredName string
  gender enum            // MALE | FEMALE | OTHER | PREFER_NOT_TO_SAY
  dateOfBirth date
  maritalStatus enum     // SINGLE | MARRIED | DIVORCED | WIDOWED
  nationality string
  email string
  personalEmail string
  phone string
  emergencyContactName string
  emergencyContactPhone string
  emergencyContactRelation string
  currentAddress text
  permanentAddress text
  photoUrl string
  employmentType enum    // FULL_TIME | PART_TIME | CONTRACT | INTERN
  employmentStatus enum  // ACTIVE | ON_LEAVE | SUSPENDED | TERMINATED
  pinHash string
  hiredAt date
  probationEndDate date
  terminatedAt date
  terminationReason string
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

// =====================================================
// COMPENSATION MODULE
// =====================================================

salary_grades [icon: trending-up, color: green] {
  id int pk
  companyId int
  name string           // e.g., "Grade A", "Level 5"
  minSalary decimal
  maxSalary decimal
  currency string
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

employee_compensation [icon: dollar-sign, color: green] {
  id int pk
  employeeId int
  compensationType enum  // HOURLY | DAILY | MONTHLY | ANNUAL
  hourlyRate decimal
  dailyRate decimal
  monthlySalary decimal
  annualSalary decimal
  currency string
  effectiveFrom date
  effectiveTo date
  reason string          // e.g., "Annual Review", "Promotion"
  approvedByUserId int
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

allowances [icon: plus-circle, color: green] {
  id int pk
  employeeId int
  type enum              // TRANSPORT | MEAL | HOUSING | PHONE | OTHER
  label string
  amount decimal
  frequency enum         // MONTHLY | YEARLY | PER_PAYROLL
  taxable boolean
  effectiveFrom date
  effectiveTo date
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

// =====================================================
// TIME & ATTENDANCE MODULE (Normalized workDaysJson)
// =====================================================

shift_patterns [icon: repeat, color: green] {
  id int pk
  companyId int
  name string              // e.g., "Morning Shift", "Night Shift"
  startTime time
  endTime time
  breakDurationMinutes int

  // workDaysJson text      // ❌ removed (normalized)

  isOvernight boolean
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

shift_pattern_days [icon: calendar-days, color: green] {
  id int pk
  shiftPatternId int
  dayOfWeek enum          // MON | TUE | WED | THU | FRI | SAT | SUN
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

schedules [icon: calendar, color: green] {
  id int pk
  employeeId int
  shiftPatternId int
  effectiveFrom date
  effectiveTo date
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

time_events [icon: clock, color: green] {
  id int pk
  employeeId int
  type enum               // CLOCK_IN | CLOCK_OUT | BREAK_IN | BREAK_OUT
  happenedAt timestamp
  source enum             // KIOSK | WEB | MOBILE | BIOMETRIC | MANUAL
  requestId string        // idempotency key
  deviceId string
  ipAddress string
  latitude decimal
  longitude decimal
  photoUrl string         // selfie for verification
  createdByUserId int
  metaJson text
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

// =====================================================
// TIMESHEET MODULE
// =====================================================

timesheets [icon: clipboard, color: purple] {
  id int pk
  employeeId int
  payPeriodId int
  status enum             // DRAFT | SUBMITTED | REVIEWED | APPROVED | REJECTED | LOCKED
  totalRegularMinutes int
  totalOvertimeMinutes int
  totalBreakMinutes int
  daysWorked int
  generatedAt timestamp
  submittedAt timestamp
  reviewedAt timestamp
  reviewedByUserId int
  approvedAt timestamp
  approvedByUserId int
  rejectedAt timestamp
  rejectedByUserId int
  rejectionReason string
  lockedAt timestamp
  lockedByUserId int
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

timesheet_days [icon: calendar-days, color: purple] {
  id int pk
  timesheetId int
  workDate date
  scheduledStartTime time
  scheduledEndTime time
  actualStartTime time
  actualEndTime time
  regularMinutes int
  breakMinutes int
  overtimeMinutes int
  lateMinutes int
  undertimeMinutes int
  status enum             // PRESENT | ABSENT | HALF_DAY | ON_LEAVE | HOLIDAY
  anomaliesJson text
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

timesheet_anomalies [icon: alert-triangle, color: red] {
  id int pk
  timesheetDayId int
  code string             // MISSING_CLOCK_OUT | EXCESSIVE_HOURS | LATE_ARRIVAL | etc.
  severity enum           // INFO | WARN | ERROR
  message string
  resolvedAt timestamp
  resolvedByUserId int
  resolutionNote string
  metaJson text
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

timesheet_adjustments [icon: edit-3, color: red] {
  id int pk
  timesheetDayId int
  field enum              // REGULAR | BREAK | OVERTIME | LATE | UNDERTIME
  mode enum               // DELTA | OVERRIDE
  originalValue int
  newValue int
  reason string
  createdByUserId int
  approvedByUserId int
  approvedAt timestamp
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

// =====================================================
// PAYROLL MODULE
// =====================================================

pay_periods [icon: calendar, color: orange] {
  id int pk
  companyId int
  periodType enum         // WEEKLY | BI_WEEKLY | SEMI_MONTHLY | MONTHLY
  name string             // e.g., "January 1-15, 2026"
  startDate date
  endDate date
  payDate date
  status enum             // OPEN | PROCESSING | CLOSED | FINALIZED
  closedAt timestamp
  closedByUserId int
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

payslips [icon: file-text, color: amber] {
  id int pk
  employeeId int
  payPeriodId int
  status enum             // DRAFT | GENERATED | FINALIZED | PAID | VOID
  payslipNumber string    // e.g., "PS-2026-001234"
  currency string
  totalRegularMinutes int
  totalOvertimeMinutes int
  basicPay decimal
  overtimePay decimal
  totalAllowances decimal
  grossPay decimal
  totalDeductions decimal
  totalTaxes decimal
  netPay decimal
  bankAccountNumber string
  bankName string
  snapshotJson text
  generatedAt timestamp
  generatedByUserId int
  finalizedAt timestamp
  paidAt timestamp
  voidedAt timestamp
  voidedByUserId int
  voidReason string
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

payslip_items [icon: list, color: amber] {
  id int pk
  payslipId int
  category enum           // EARNING | DEDUCTION | TAX | CONTRIBUTION
  type string             // e.g., BASIC | OVERTIME | SSS | PHILHEALTH | TAX
  code string
  label string
  quantity decimal        // for hourly items
  rate decimal            // for hourly items
  amount decimal
  isTaxable boolean
  metaJson text
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

deductions [icon: minus-circle, color: rose] {
  id int pk
  employeeId int
  type enum               // SSS | PHILHEALTH | PAGIBIG | TAX | LOAN | INSURANCE | OTHER
  label string
  calculationType enum    // FIXED | PERCENTAGE | TIERED
  amount decimal
  percentage decimal      // for percentage type
  maxAmount decimal       // cap
  frequency enum          // PER_PAYROLL | MONTHLY | ONE_TIME
  effectiveFrom date
  effectiveUntil date
  remainingBalance decimal // for loans
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

tax_brackets [icon: percent, color: rose] {
  id int pk
  companyId int
  name string             // e.g., "PH Tax Table 2026"
  minIncome decimal
  maxIncome decimal
  fixedAmount decimal
  percentage decimal
  effectiveYear int
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

// =====================================================
// LEAVE MANAGEMENT MODULE
// =====================================================

leave_types [icon: calendar-x, color: sky] {
  id int pk
  companyId int
  name string             // e.g., "Vacation Leave", "Sick Leave"
  code string             // e.g., "VL", "SL"
  description text
  defaultDaysPerYear decimal
  carryOverLimit decimal
  carryOverExpireMonths int
  isPaid boolean
  requiresApproval boolean
  requiresDocument boolean
  allowHalfDay boolean
  minNoticeDays int
  maxConsecutiveDays int
  applicableGender enum   // ALL | MALE | FEMALE
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

leave_balances [icon: pie-chart, color: sky] {
  id int pk
  employeeId int
  leaveTypeId int
  year int
  entitlement decimal
  used decimal
  pending decimal
  carriedOver decimal
  adjustment decimal
  balance decimal
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

leave_requests [icon: send, color: sky] {
  id int pk
  employeeId int
  leaveTypeId int
  status enum
  startDate date
  endDate date
  isHalfDayStart boolean
  isHalfDayEnd boolean
  totalDays decimal
  reason text
  documentUrl string
  submittedAt timestamp
  approvedByUserId int
  approvedAt timestamp
  rejectedByUserId int
  rejectedAt timestamp
  rejectionReason string
  cancelledAt timestamp
  cancellationReason string
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

holidays [icon: gift, color: sky] {
  id int pk
  companyId int
  branchId int
  name string
  date date
  type enum
  isRecurring boolean
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

// =====================================================
// RECRUITMENT MODULE (Normalized interviewers)
// =====================================================

job_postings [icon: megaphone, color: violet] {
  id int pk
  companyId int
  positionId int
  departmentId int
  branchId int
  title string
  description text
  requirements text
  responsibilities text
  employmentType enum
  experienceLevel enum
  salaryMin decimal
  salaryMax decimal
  currency string
  showSalary boolean
  location string
  isRemote boolean
  status enum
  openings int
  publishedAt timestamp
  closingDate date
  createdByUserId int
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

applications [icon: file-plus, color: violet] {
  id int pk
  jobPostingId int
  status enum
  firstName string
  lastName string
  email string
  phone string
  resumeUrl string
  coverLetterUrl string
  linkedInUrl string
  portfolioUrl string
  currentCompany string
  currentPosition string
  yearsExperience int
  expectedSalary decimal
  availableDate date
  source string
  referredByEmployeeId int
  screeningScore int
  rejectionReason string
  rejectedAt timestamp
  hiredAt timestamp
  hiredAsEmployeeId int
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

interviews [icon: users, color: violet] {
  id int pk
  applicationId int
  round int
  type enum
  status enum
  scheduledAt timestamp
  durationMinutes int
  location string

  // interviewerUserIds text  // ❌ removed (normalized)

  feedbackJson text
  overallRating int
  recommendation enum
  notes text
  completedAt timestamp
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

interview_interviewers [icon: link, color: violet] {
  id int pk
  interviewId int
  userId int
  role enum              // INTERVIEWER | OBSERVER | PANEL_LEAD (optional)
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

offer_letters [icon: mail, color: violet] {
  id int pk
  applicationId int
  status enum
  positionId int
  departmentId int
  salary decimal
  currency string
  startDate date
  expiryDate date
  documentUrl string
  sentAt timestamp
  acceptedAt timestamp
  rejectedAt timestamp
  rejectionReason string
  createdByUserId int
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

// =====================================================
// PERFORMANCE MODULE
// =====================================================

performance_cycles [icon: refresh-cw, color: pink] {
  id int pk
  companyId int
  name string
  type enum
  startDate date
  endDate date
  goalSettingDeadline date
  selfReviewDeadline date
  managerReviewDeadline date
  status enum
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

goals [icon: target, color: pink] {
  id int pk
  employeeId int
  performanceCycleId int
  parentGoalId int
  title string
  description text
  type enum
  priority enum
  status enum
  targetValue decimal
  currentValue decimal
  unit string
  dueDate date
  completedAt timestamp
  weight int
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

competencies [icon: award, color: pink] {
  id int pk
  companyId int
  name string
  description text
  category string
  levelDescriptions text
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

reviews [icon: star, color: pink] {
  id int pk
  employeeId int
  performanceCycleId int
  reviewerId int
  reviewerType enum
  status enum
  overallRating decimal
  goalsRating decimal
  competenciesRating decimal
  strengths text
  areasForImprovement text
  managerComments text
  employeeComments text
  submittedAt timestamp
  acknowledgedAt timestamp
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

review_competency_scores [icon: check-circle, color: pink] {
  id int pk
  reviewId int
  competencyId int
  rating int
  evidence text
  createdAt timestamp
  updatedAt timestamp
}

// =====================================================
// LEARNING & DEVELOPMENT MODULE (Normalized required positions)
// =====================================================

courses [icon: book-open, color: emerald] {
  id int pk
  companyId int
  name string
  description text
  category string
  durationHours decimal
  format enum
  provider string
  cost decimal
  currency string
  isMandatory boolean
  recertificationMonths int
  contentUrl string
  thumbnailUrl string
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

enrollments [icon: user-plus, color: emerald] {
  id int pk
  employeeId int
  courseId int
  status enum
  enrolledAt timestamp
  startedAt timestamp
  completedAt timestamp
  progressPercent int
  score decimal
  certificateUrl string
  expiresAt date
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

certifications [icon: shield, color: emerald] {
  id int pk
  companyId int
  name string
  issuingOrganization string
  category string
  validityMonths int
  isRequired boolean

  // requiredForPositionIds text // ❌ removed (normalized)

  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

certification_required_positions [icon: link, color: emerald] {
  id int pk
  certificationId int
  positionId int
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

employee_certifications [icon: award, color: emerald] {
  id int pk
  employeeId int
  certificationId int
  status enum
  issuedDate date
  expiryDate date
  credentialId string
  documentUrl string
  verificationUrl string
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

// =====================================================
// BENEFITS MODULE
// =====================================================

benefit_plans [icon: heart, color: red] {
  id int pk
  companyId int
  name string
  type enum
  description text
  provider string
  employeeCost decimal
  employerCost decimal
  coverageDetails text
  eligibilityRules text
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

benefit_enrollments [icon: check-square, color: red] {
  id int pk
  employeeId int
  benefitPlanId int
  status enum
  coverageLevel enum
  enrolledAt timestamp
  effectiveDate date
  terminationDate date
  employeeCost decimal
  employerCost decimal
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

dependents [icon: users, color: red] {
  id int pk
  employeeId int
  firstName string
  lastName string
  relationship enum
  dateOfBirth date
  gender enum
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

benefit_dependents [icon: link, color: red] {
  id int pk
  benefitEnrollmentId int
  dependentId int
  createdAt timestamp
}

// =====================================================
// DOCUMENT MANAGEMENT MODULE
// =====================================================

document_types [icon: folder, color: gray] {
  id int pk
  companyId int
  name string
  category string
  isRequired boolean
  requiresExpiry boolean
  reminderDaysBefore int
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

documents [icon: file, color: gray] {
  id int pk
  employeeId int
  documentTypeId int
  title string
  description text
  fileUrl string
  fileSize int
  mimeType string
  version int
  status enum
  issuedDate date
  expiryDate date
  uploadedByUserId int
  approvedByUserId int
  approvedAt timestamp
  rejectedAt timestamp
  rejectionReason string
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

// =====================================================
// RBAC (Role-Based Access Control) MODULE
// =====================================================

roles [icon: key, color: yellow] {
  id int pk
  companyId int
  name string
  code string
  description text
  level int
  isSystemRole boolean
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

permissions [icon: lock, color: yellow] {
  id int pk
  module string
  action string
  code string
  name string
  description string
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
}

role_permissions [icon: link, color: yellow] {
  id int pk
  roleId int
  permissionId int
  createdAt timestamp
}

user_roles [icon: users, color: yellow] {
  id int pk
  userId int
  roleId int
  isPrimary boolean
  assignedByUserId int
  assignedAt timestamp
  expiresAt timestamp
  createdAt timestamp
  updatedAt timestamp
}

user_permissions [icon: user-check, color: yellow] {
  id int pk
  userId int
  permissionId int
  isGranted boolean
  assignedByUserId int
  reason string
  expiresAt timestamp
  createdAt timestamp
  updatedAt timestamp
}

// =====================================================
// SYSTEM MODULE
// =====================================================

settings [icon: settings, color: slate] {
  id int pk
  companyId int
  timezone string
  currency string
  dateFormat string
  timeFormat string
  fiscalYearStartMonth int
  roundingRule string
  breakPolicy string
  overtimeRule string
  overtimeMultiplier decimal
  gracePeriodMinutes int
  payPeriodType string
  defaultHourlyRate decimal
  sessionDurationMinutes int
  passwordMinLength int
  passwordRequireSpecialChar boolean
  mfaRequired boolean
  passwordPolicy text
  pinPolicy text
  dataRetentionMonths int
  createdAt timestamp
  updatedAt timestamp
  deletedAt timestamp
}

audit_logs [icon: shield, color: slate] {
  id int pk
  userId int
  action enum
  entityType string
  entityId int
  description text
  oldValuesJson text
  newValuesJson text
  ipAddress string
  userAgent string
  createdAt timestamp
}

notifications [icon: bell, color: slate] {
  id int pk
  userId int
  type enum
  category string
  title string
  message text
  actionUrl string
  isRead boolean
  readAt timestamp
  createdAt timestamp
}

// =====================================================
// RELATIONSHIPS
// =====================================================

// Core HR
branches.companyId > companies.id
departments.companyId > companies.id
departments.parentDepartmentId > departments.id
departments.managerId > employees.id
positions.companyId > companies.id
positions.departmentId > departments.id
positions.salaryGradeId > salary_grades.id

users.companyId > companies.id
users.employeeId - employees.id

user_sessions.userId > users.id
user_sessions.companyId > companies.id

employees.companyId > companies.id
employees.branchId > branches.id
employees.departmentId > departments.id
employees.positionId > positions.id
employees.reportingManagerId > employees.id

// Compensation
salary_grades.companyId > companies.id
employee_compensation.employeeId > employees.id
employee_compensation.approvedByUserId > users.id
allowances.employeeId > employees.id

// Time & Attendance
shift_patterns.companyId > companies.id
shift_pattern_days.shiftPatternId > shift_patterns.id
schedules.employeeId > employees.id
schedules.shiftPatternId > shift_patterns.id
time_events.employeeId > employees.id
time_events.createdByUserId > users.id

// Timesheets
timesheets.employeeId > employees.id
timesheets.payPeriodId > pay_periods.id
timesheets.reviewedByUserId > users.id
timesheets.approvedByUserId > users.id
timesheets.rejectedByUserId > users.id
timesheets.lockedByUserId > users.id
timesheet_days.timesheetId > timesheets.id
timesheet_anomalies.timesheetDayId > timesheet_days.id
timesheet_anomalies.resolvedByUserId > users.id
timesheet_adjustments.timesheetDayId > timesheet_days.id
timesheet_adjustments.createdByUserId > users.id
timesheet_adjustments.approvedByUserId > users.id

// Payroll
pay_periods.companyId > companies.id
pay_periods.closedByUserId > users.id
payslips.employeeId > employees.id
payslips.payPeriodId > pay_periods.id
payslips.generatedByUserId > users.id
payslips.voidedByUserId > users.id
payslip_items.payslipId > payslips.id
deductions.employeeId > employees.id
tax_brackets.companyId > companies.id

// Leave Management
leave_types.companyId > companies.id
leave_balances.employeeId > employees.id
leave_balances.leaveTypeId > leave_types.id
leave_requests.employeeId > employees.id
leave_requests.leaveTypeId > leave_types.id
leave_requests.approvedByUserId > users.id
leave_requests.rejectedByUserId > users.id
holidays.companyId > companies.id
holidays.branchId > branches.id

// Recruitment
job_postings.companyId > companies.id
job_postings.positionId > positions.id
job_postings.departmentId > departments.id
job_postings.branchId > branches.id
job_postings.createdByUserId > users.id
applications.jobPostingId > job_postings.id
applications.referredByEmployeeId > employees.id
applications.hiredAsEmployeeId > employees.id
interviews.applicationId > applications.id
interview_interviewers.interviewId > interviews.id
interview_interviewers.userId > users.id
offer_letters.applicationId > applications.id
offer_letters.positionId > positions.id
offer_letters.departmentId > departments.id
offer_letters.createdByUserId > users.id

// Performance
performance_cycles.companyId > companies.id
goals.employeeId > employees.id
goals.performanceCycleId > performance_cycles.id
goals.parentGoalId > goals.id
competencies.companyId > companies.id
reviews.employeeId > employees.id
reviews.performanceCycleId > performance_cycles.id
reviews.reviewerId > users.id
review_competency_scores.reviewId > reviews.id
review_competency_scores.competencyId > competencies.id

// Learning
courses.companyId > companies.id
enrollments.employeeId > employees.id
enrollments.courseId > courses.id
certifications.companyId > companies.id
certification_required_positions.certificationId > certifications.id
certification_required_positions.positionId > positions.id
employee_certifications.employeeId > employees.id
employee_certifications.certificationId > certifications.id

// Benefits
benefit_plans.companyId > companies.id
benefit_enrollments.employeeId > employees.id
benefit_enrollments.benefitPlanId > benefit_plans.id
dependents.employeeId > employees.id
benefit_dependents.benefitEnrollmentId > benefit_enrollments.id
benefit_dependents.dependentId > dependents.id

// Documents
document_types.companyId > companies.id
documents.employeeId > employees.id
documents.documentTypeId > document_types.id
documents.uploadedByUserId > users.id
documents.approvedByUserId > users.id

// RBAC
roles.companyId > companies.id
role_permissions.roleId > roles.id
role_permissions.permissionId > permissions.id
user_roles.userId > users.id
user_roles.roleId > roles.id
user_roles.assignedByUserId > users.id
user_permissions.userId > users.id
user_permissions.permissionId > permissions.id
user_permissions.assignedByUserId > users.id

// System
settings.companyId - companies.id
audit_logs.userId > users.id
notifications.userId > users.id

```

---

## Table Count Summary

| Category | Tables |
|----------|--------|
| Core HR | 6 |
| Compensation | 3 |
| Time & Attendance | 3 |
| Timesheets | 4 |
| Payroll | 5 |
| Leave Management | 4 |
| Recruitment | 4 |
| Performance | 5 |
| Learning | 4 |
| Benefits | 4 |
| Documents | 2 |
| **RBAC** | **5** |
| System | 3 |
| **Total** | **52** |

---

*This schema represents a comprehensive full-featured HRIS system. Adapt as needed for your specific requirements.*
