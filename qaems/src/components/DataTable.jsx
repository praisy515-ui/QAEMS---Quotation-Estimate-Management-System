import React, { useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function DataTable({
  columns,
  data = [],
  emptyMessage = "No records found.",
  pageSize = 5,
  onRowClick
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Handle column sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle nested properties if key has a dot (e.g. costBreakdown.grandTotal)
        if (String(sortConfig.key).includes(".")) {
          const keys = sortConfig.key.split(".");
          aVal = keys.reduce((acc, curr) => (acc ? acc[curr] : null), a);
          bVal = keys.reduce((acc, curr) => (acc ? acc[curr] : null), b);
        }

        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (aStr < bStr) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aStr > bStr) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  // Handle pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  
  // Reset page if page count decreases
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex flex-col w-full bg-white border rounded-xl dark:bg-brand-charcoal dark:border-white/10 overflow-hidden shadow-sm">
      {/* Table responsive container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50 text-gray-500 font-semibold dark:border-white/10 dark:bg-brand-darkgray/30 dark:text-gray-400">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => col.sortable && requestSort(col.key)}
                  className={`px-6 py-4 font-display font-medium select-none ${
                    col.sortable ? "cursor-pointer hover:text-brand-charcoal dark:hover:text-brand-cream" : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.sortable && sortConfig.key === col.key && (
                      sortConfig.direction === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-white/5">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-gray-50/50 dark:hover:bg-brand-darkgray/10 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-brand-charcoal/80 dark:text-brand-cream/80 font-medium">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="text-sm font-medium">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {sortedData.length > pageSize && (
        <div className="flex items-center justify-between border-t px-6 py-4 dark:border-white/10">
          <span className="text-xs text-gray-400 font-medium">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedData.length)} of {sortedData.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border p-1.5 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-white/10 dark:hover:bg-brand-darkgray transition-colors focus:outline-none"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-brand-bronze dark:text-brand-gold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border p-1.5 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-white/10 dark:hover:bg-brand-darkgray transition-colors focus:outline-none"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
