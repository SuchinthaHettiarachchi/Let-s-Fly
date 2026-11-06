import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Confirmation shown after any form is submitted. */
export function FormSent({
  title = "Inquiry sent!",
  text = "Thanks! A Let's Fly consultant will call you shortly.",
  onReset,
}: {
  title?: string;
  text?: string;
  onReset: () => void;
}) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-sun-400 text-navy-900">
        <Icon name="check" size={34} />
      </div>
      <div className="font-display text-h3">{title}</div>
      <p className="max-w-[340px] text-body text-ink-600">{text}</p>
      <Button variant="outline" size="md" className="mt-2" onClick={onReset}>
        Send another
      </Button>
    </div>
  );
}
