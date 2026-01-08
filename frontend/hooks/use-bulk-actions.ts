"use client";

import { useState, useCallback } from "react";

/**
 * useBulkActions - Hook for managing bulk selection and actions on tables
 * 
 * @example
 * const { selectedIds, toggleSelection, selectAll, clearSelection, isSelected, hasSelection } = useBulkActions<number>();
 * 
 * // In table row
 * <Checkbox checked={isSelected(row.id)} onCheckedChange={() => toggleSelection(row.id)} />
 * 
 * // Bulk action bar
 * {hasSelection && (
 *   <div>
 *     <span>{selectedIds.size} selected</span>
 *     <Button onClick={() => handleBulkDelete([...selectedIds])}>Delete Selected</Button>
 *   </div>
 * )}
 */
export function useBulkActions<T extends string | number = number>() {
  const [selectedIds, setSelectedIds] = useState<Set<T>>(new Set());

  const toggleSelection = useCallback((id: T) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: T[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback(
    (id: T) => selectedIds.has(id),
    [selectedIds]
  );

  const toggleAll = useCallback(
    (allIds: T[]) => {
      if (selectedIds.size === allIds.length) {
        clearSelection();
      } else {
        selectAll(allIds);
      }
    },
    [selectedIds.size, clearSelection, selectAll]
  );

  const isAllSelected = useCallback(
    (allIds: T[]) => allIds.length > 0 && selectedIds.size === allIds.length,
    [selectedIds.size]
  );

  const isSomeSelected = useCallback(
    (allIds: T[]) => selectedIds.size > 0 && selectedIds.size < allIds.length,
    [selectedIds.size]
  );

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    hasSelection: selectedIds.size > 0,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    toggleAll,
    isAllSelected,
    isSomeSelected,
    getSelectedArray: () => Array.from(selectedIds),
  };
}

export type BulkActionsReturn<T extends string | number = number> = ReturnType<
  typeof useBulkActions<T>
>;
