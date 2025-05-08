import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileText, AlertCircle } from "lucide-react";

export function DocumentVerificationCard() {
  const router = useRouter();

  const documentTypes = [
    {
      type: "nid",
      title: "National ID",
      description: "Upload your National ID card for verification",
    },
    {
      type: "birth-certificate",
      title: "Birth Certificate",
      description: "Upload your birth certificate for verification",
    },
    {
      type: "passport",
      title: "Passport",
      description: "Upload your passport for verification",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-lg">Document Verification</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please upload one of the following documents to verify your
            identity:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documentTypes.map((doc) => (
              <Button
                key={doc.type}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() =>
                  router.push(`/dashboard-teacher/verify/${doc.type}`)
                }
              >
                <FileText className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {doc.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
