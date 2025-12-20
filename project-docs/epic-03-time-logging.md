# Epic 3: Employee Time Logging (Clock In/Out + Break In/Out)

## Feature: Employee time kiosk / time logging UI
- [ ] Build employee time logging screen (Employee Number input + action buttons)
  - [ ] Display current server time and employee status (e.g., “Clocked In”, “On Break”)
  - [ ] Show last action and timestamp for confirmation
- [ ] Implement “analog clock” widget in UI (optional)
  - [ ] Add fallback to digital clock on unsupported browsers

## Feature: Time logging API and persistence
- [ ] Implement API endpoint to create time log events (clock in/out, break in/out)
  - [ ] Validate state transitions (prevent break-out without break-in, etc.)
  - [ ] Enforce idempotency (avoid double submissions on refresh/retry)
- [ ] Persist time log events and compute derived sessions
  - [ ] Store raw events (event-based) and/or computed intervals (session-based)
  - [ ] Implement server-side timestamp authority (avoid client-side time spoofing)

## Feature: Real-time and UX resilience
- [ ] Add loading, success, and error states to employee UI
  - [ ] Provide actionable error messages (e.g., “You are already clocked in.”)
- [ ] Implement offline/poor network handling (optional)
  - [ ] Queue events locally and sync when online (with strict safeguards)

## Feature: Audit trail and security controls
- [ ] Record audit metadata (who, when, device/IP if available)
- [ ] Implement rate limiting and abuse prevention for kiosk endpoint
