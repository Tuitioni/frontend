import { cn } from "@/lib/utils";

interface VerificationStatusProps {
  id: string;
  teacherId: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  document: string;
  teacher: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function VerificationStatus({
  status,
  type,
  document,
}: VerificationStatusProps) {
  return (
    <div className="mb-6 p-4 rounded-lg border bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base">Verification Status</h3>
          <p className="text-sm text-muted-foreground">{type} Verification</p>
        </div>
        <div
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            status === "PENDING" && "bg-yellow-100 text-yellow-800",
            status === "APPROVED" && "bg-green-100 text-green-800",
            status === "REJECTED" && "bg-red-100 text-red-800"
          )}
        >
          {status}
        </div>
      </div>
      {status === "PENDING" && (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-muted-foreground">
            Your {type} verification is under review. We&apos;ll notify you once
            it&apos;s complete.
          </p>
          {document && (
            <div className="flex items-center gap-2">
              <a
                href={document}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Uploaded Document
              </a>
            </div>
          )}
        </div>
      )}
      {status === "APPROVED" && (
        <p className="mt-2 text-sm text-green-600">
          Your {type} verification has been approved.
        </p>
      )}
      {status === "REJECTED" && (
        <p className="mt-2 text-sm text-red-600">
          Your {type} verification has been rejected. Please upload a new
          document.
        </p>
      )}
    </div>
  );
}
