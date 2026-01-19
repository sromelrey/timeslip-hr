"use client";

import { TimeEventType } from "@/lib/enums";

/**
 * Formats a time event type into a human-readable action label
 */
export function formatEventTypeLabel(type: TimeEventType): string {
  const labels: Record<TimeEventType, string> = {
    [TimeEventType.CLOCK_IN]: "Clock In",
    [TimeEventType.CLOCK_OUT]: "Clock Out",
    [TimeEventType.BREAK_IN]: "Break In",
    [TimeEventType.BREAK_OUT]: "Break Out",
  };
  return labels[type] || type.replace("_", " ");
}

/**
 * Creates a formatted success confirmation message with timestamp
 */
export function createSuccessMessage(type: TimeEventType, timestamp?: Date): string {
  const label = formatEventTypeLabel(type);
  const time = timestamp || new Date();
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${label} successful at ${formattedTime}`;
}

/**
 * Creates a friendly error message explaining why an action is unavailable
 * based on the current status
 */
export function getFriendlyUnavailableMessage(
  attemptedAction: TimeEventType,
  currentStatus: TimeEventType | "CLOCKED_OUT" | null
): string {
  const actionLabel = formatEventTypeLabel(attemptedAction);

  // Not clocked in yet
  if (!currentStatus || currentStatus === "CLOCKED_OUT") {
    if (attemptedAction !== TimeEventType.CLOCK_IN) {
      return "You need to Clock In first before you can do that.";
    }
    return "";
  }

  // Currently clocked in (not on break)
  if (currentStatus === TimeEventType.CLOCK_IN || currentStatus === TimeEventType.BREAK_OUT) {
    if (attemptedAction === TimeEventType.CLOCK_IN) {
      return "You're already clocked in. Clock Out first if you need to start a new session.";
    }
    if (attemptedAction === TimeEventType.BREAK_OUT) {
      return "You're not on break. Take a break first with Break In.";
    }
    return "";
  }

  // Currently on break
  if (currentStatus === TimeEventType.BREAK_IN) {
    if (attemptedAction === TimeEventType.CLOCK_IN) {
      return "You're currently on break. Please Break Out first.";
    }
    if (attemptedAction === TimeEventType.CLOCK_OUT) {
      return "You need to Break Out first before clocking out.";
    }
    if (attemptedAction === TimeEventType.BREAK_IN) {
      return "You're already on break.";
    }
    return "";
  }

  return `${actionLabel} is not available right now.`;
}

/**
 * Returns the appropriate tooltip message for a button based on availability
 */
export function getButtonTooltip(
  type: TimeEventType,
  isEnabled: boolean,
  currentStatus: TimeEventType | "CLOCKED_OUT" | null
): string {
  if (isEnabled) {
    const label = formatEventTypeLabel(type);
    return `Click to ${label}`;
  }
  return getFriendlyUnavailableMessage(type, currentStatus);
}

/**
 * Returns a status description for display
 */
export function getStatusDescription(status: TimeEventType | "CLOCKED_OUT" | null): string {
  if (!status || status === "CLOCKED_OUT") {
    return "Not clocked in";
  }

  const descriptions: Record<TimeEventType, string> = {
    [TimeEventType.CLOCK_IN]: "Currently working",
    [TimeEventType.CLOCK_OUT]: "Not clocked in",
    [TimeEventType.BREAK_IN]: "On break",
    [TimeEventType.BREAK_OUT]: "Back from break, working",
  };

  return descriptions[status] || "Unknown status";
}

/**
 * Hook for time confirmation utilities
 */
export function useTimeConfirmation() {
  return {
    createSuccessMessage,
    getFriendlyUnavailableMessage,
    getButtonTooltip,
    getStatusDescription,
    formatEventTypeLabel,
  };
}
