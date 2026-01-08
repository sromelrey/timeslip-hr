"use client";

import { useEffect, useCallback } from "react";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description?: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
}

/**
 * useKeyboardShortcuts - Hook for registering global keyboard shortcuts
 * 
 * @example
 * useKeyboardShortcuts([
 *   { key: 'k', ctrlKey: true, action: () => setSearchOpen(true), description: 'Open search' },
 *   { key: 'n', ctrlKey: true, action: () => setDialogOpen(true), description: 'New item' },
 *   { key: 'Escape', action: () => handleClose(), description: 'Close dialog' },
 * ]);
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Allow Escape to work even in inputs
      if (isInput && event.key !== "Escape") {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlOrMeta = event.ctrlKey || event.metaKey;
        const matchesModifiers =
          (shortcut.ctrlKey || shortcut.metaKey
            ? ctrlOrMeta
            : !ctrlOrMeta) &&
          (shortcut.shiftKey ? event.shiftKey : !event.shiftKey) &&
          (shortcut.altKey ? event.altKey : !event.altKey);

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          matchesModifiers
        ) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleKeyDown]);
}

/**
 * Common keyboard shortcuts configuration
 */
export const createCommonShortcuts = ({
  onSearch,
  onNew,
  onSave,
  onClose,
}: {
  onSearch?: () => void;
  onNew?: () => void;
  onSave?: () => void;
  onClose?: () => void;
}): KeyboardShortcut[] => {
  const shortcuts: KeyboardShortcut[] = [];

  if (onSearch) {
    shortcuts.push({
      key: "k",
      ctrlKey: true,
      action: onSearch,
      description: "Open search",
    });
  }

  if (onNew) {
    shortcuts.push({
      key: "n",
      ctrlKey: true,
      action: onNew,
      description: "Create new item",
    });
  }

  if (onSave) {
    shortcuts.push({
      key: "s",
      ctrlKey: true,
      action: onSave,
      description: "Save",
    });
  }

  if (onClose) {
    shortcuts.push({
      key: "Escape",
      action: onClose,
      description: "Close/Cancel",
    });
  }

  return shortcuts;
};
