# Epic 8: Quality, Testing, and Hardening

## Feature: Automated testing
- [ ] Write backend unit tests for time state machine and payroll calculations
  - [ ] Add test cases for edge scenarios (missing clock-out, multiple breaks, DST/timezone)
- [ ] Write frontend tests for critical flows (time logging, admin generation)
- [ ] Add integration tests for end-to-end pay period → payslip flow

## Feature: Performance and reliability
- [ ] Add database indexes for high-traffic queries (latest status per employee, logs by period)
- [ ] Implement caching for dashboard queries (optional)
- [ ] Add concurrency protections (transactional writes, unique constraints)

## Feature: Security reviews
- [ ] Validate access controls (admin endpoints protected, employee scope enforced)
- [ ] Add input sanitization and output escaping
- [ ] Add audit logging for admin actions (adjustments, payslip generation)
