import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

interface AuthFormProps {
  children: React.ReactNode;
  onSubmit: () => void;
  submitText: string;
  isLoading?: boolean;
}

export function AuthForm({
  children,
  onSubmit,
  submitText,
  isLoading,
}: AuthFormProps) {
  return (
    <Form onSubmit={onSubmit}>
      <div className="space-y-4">
        {children}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Please wait..." : submitText}
        </Button>
      </div>
    </Form>
  );
}
