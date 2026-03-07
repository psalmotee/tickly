import { CheckCircle2 } from "lucide-react";

interface FormSuccessProps {
  message: string;
}

export function FormSuccess({ message }: FormSuccessProps) {
  return (
    <div className="flex gap-3 rounded-lg bg-green-500/10 p-3 border border-green-200">
      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
      <p className="text-sm text-green-600">{message}</p>
    </div>
  );
}

