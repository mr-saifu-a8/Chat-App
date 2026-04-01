import React from "react";
import { Trash2, X, CheckSquare, Square } from "lucide-react";

const SelectionBar = ({
  selectedCount,
  totalCount,
  allSelected,
  onSelectAll,
  onDelete,
  onCancel,
}) => {
  return (
    <div
      className="
      shrink-0 flex items-center gap-3 px-4 py-3
      bg-violet-600/20 border-b border-violet-500/30
      backdrop-blur-sm
    "
    >
      {/* Cancel */}
      <button
        onClick={onCancel}
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
      >
        <X className="w-5 h-5 text-white/70" />
      </button>

      {/* Select All checkbox */}
      <button
        onClick={onSelectAll}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {allSelected ? (
          <CheckSquare className="w-5 h-5 text-violet-400" />
        ) : (
          <Square className="w-5 h-5 text-white/40" />
        )}
      </button>

      {/* Count */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">
          {selectedCount} / {totalCount} selected
        </p>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        disabled={selectedCount === 0}
        className="
          flex items-center gap-2 px-4 py-2 rounded-xl
          bg-red-500/20 hover:bg-red-500/30
          border border-red-500/30
          text-red-400 hover:text-red-300
          text-sm font-medium
          disabled:opacity-30 disabled:cursor-not-allowed
          active:scale-95 transition-all duration-150
        "
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default SelectionBar;