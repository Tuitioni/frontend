import { useState } from "react";
import { Button } from "../button";
import { Tooltip } from "./toolTip";

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  data?: any[];
  columns?: Column[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function DataTable({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onView,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-3">
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((row, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      {row[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 flex gap-2">
                    <Tooltip content="View">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView?.(row.id)}
                      >
                        👁️
                      </Button>
                    </Tooltip>
                    <Tooltip content="Edit">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit?.(row.id)}
                      >
                        ✏️
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete?.(row.id)}
                      >
                        🗑️
                      </Button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-700">Page {currentPage}</span>
        <Button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage * itemsPerPage >= data.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
