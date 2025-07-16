import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Phone } from "lucide-react";

export function ActionBar({ phone, email }: { phone: string; email: string }) {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="outline"
        className="rounded-full border-gray-200 hover:bg-blue-50"
        asChild
        title="Call"
      >
        <a href={`tel:${phone}`}>
          <Phone className="w-5 h-5 text-blue-600" />
        </a>
      </Button>
      <Button
        size="icon"
        variant="outline"
        className="rounded-full border-gray-200 hover:bg-blue-50"
        asChild
        title="SMS"
      >
        <a href={`sms:${phone}`}>
          <MessageSquare className="w-5 h-5 text-blue-600" />
        </a>
      </Button>
      <Button
        size="icon"
        variant="outline"
        className="rounded-full border-gray-200 hover:bg-blue-50"
        asChild
        title="Mail"
      >
        <a href={`mailto:${email}`}>
          <Mail className="w-5 h-5 text-blue-600" />
        </a>
      </Button>
    </div>
  );
}
