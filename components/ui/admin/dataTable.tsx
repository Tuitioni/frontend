import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../button';
import { LoadingSpinner } from '../LoadingSpinner';
import { Tooltip } from './toolTip';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  data?: any[];
  columns?: Column[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void | Promise<void>;
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete?.(id);
    } finally {
      setDeletingId(null);
    }
  };

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
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
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
                        aria-label="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Edit">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit?.(row.id)}
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(row.id)}
                        disabled={deletingId === row.id}
                        aria-label="Delete"
                      >
                        {deletingId === row.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

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
