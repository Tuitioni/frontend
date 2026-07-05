import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import { Tooltip } from './Tooltip';

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
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-foreground">
          <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-3.5 font-semibold">
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3.5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-border transition-colors hover:bg-muted/50"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      {row[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 flex gap-1">
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

      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-3.5">
        <Button
          variant="outline"
          size="sm"
          className="rounded-pill"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="tabular text-sm font-medium text-muted-foreground">
          Page {currentPage}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="rounded-pill"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage * itemsPerPage >= data.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
