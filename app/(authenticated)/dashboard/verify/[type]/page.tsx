'use client';

import { Upload, AlertCircle } from 'lucide-react';
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
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Upload {documentTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="document">Select Document</Label>
              <Input
                id="document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                Accepted formats: PDF, JPG, JPEG, PNG (Max size: 5MB)
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !file} className="flex-1">
                {loading ? (
                  'Uploading...'
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
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
