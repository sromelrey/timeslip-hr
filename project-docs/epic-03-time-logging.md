# Epic 3: Employee Time Logging (Clock In/Out + Break In/Out)

## Feature: Employee time kiosk / time logging UI
- [x] Build employee time logging screen (Employee Number input + action buttons)
  - [x] Display current server time and employee status (e.g., “Clocked In”, “On Break”)
  - [x] Show last action and timestamp for confirmation
- [x] Implement “analog clock” widget in UI (optional)
  - [x] Add fallback to digital clock on unsupported browsers

## Feature: Time logging API and persistence
- [x] Implement API endpoint to create time log events (clock in/out, break in/out)
  - [x] Validate state transitions (prevent break-out without break-in, etc.)
  - [x] Enforce idempotency (avoid double submissions on refresh/retry)
- [x] Persist time log events and compute derived sessions
  - [x] Store raw events (event-based) and/or computed intervals (session-based)
  - [x] Implement server-side timestamp authority (avoid client-side time spoofing)

## Feature: Real-time and UX resilience
- [x] Add loading, success, and error states to employee UI
  - [x] Provide actionable error messages (e.g., “You are already clocked in.”)
- [x] Implement offline/poor network handling (optional)
  - [x] Queue events locally and sync when online (with strict safeguards)

## Feature: Audit trail and security controls
- [x] Record audit metadata (who, when, device/IP if available)
- [x] Implement rate limiting and abuse prevention for kiosk endpoint
