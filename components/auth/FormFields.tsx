import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EmailField() {
  return (
    <FormField>
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email"
        required
      />
    </FormField>
  );
}

export function PasswordField() {
  return (
    <FormField>
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        placeholder="Enter your password"
        required
      />
    </FormField>
  );
} 