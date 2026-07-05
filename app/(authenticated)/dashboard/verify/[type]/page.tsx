'use client';

import { Upload, AlertCircle, ShieldCheck, ArrowLeft, FileText } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToken } from '@/hooks/useToken';

export default function VerifyDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const { makeAuthenticatedRequest } = useAuth();
  const decodedToken = useToken();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const documentType = params.type as 'nid' | 'birth-certificate' | 'passport';
  const documentTitles = {
    nid: 'National ID',
    'birth-certificate': 'Birth Certificate',
    passport: 'Passport',
  };
  const documentTitle = documentTitles[documentType] || 'Document';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    if (!decodedToken?.sub) {
      setError('Authentication error');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await makeAuthenticatedRequest(
        `/api/teacher/${decodedToken.sub}/verify/${documentType}`,
        {
          method: 'POST',
          data: formData,
          isFormData: true,
        }
      );

      router.push('/dashboard?verification=success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <Card className="rounded-2xl border-border shadow-soft">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-brand-50 text-primary dark:bg-primary/15">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-lg sm:text-xl">Upload {documentTitle}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Verify your identity to build trust with students.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-error/20 bg-error/10 p-3 text-sm font-medium text-error">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="document">Select Document</Label>
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                <Input
                  id="document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {file && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-primary">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </p>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  Accepted formats: PDF, JPG, JPEG, PNG (Max size: 5MB)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="rounded-pill font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !file}
                className="flex-1 rounded-pill font-semibold shadow-glow"
              >
                {loading ? (
                  'Uploading...'
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {documentTitle}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
