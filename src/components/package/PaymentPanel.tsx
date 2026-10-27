import { Icon } from "@/components/ui/Icon";
import { paymentMethods, paymentNote, paymentSteps } from "@/data/payments";

export function PaymentPanel() {
  return (
    <div className="flex flex-col gap-9">
      <section className="flex flex-col gap-3">
        <h3 className="font-sans text-h5">Ways to pay</h3>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {paymentMethods.map((m) => (
            <li key={m.title} className="flex gap-3.5 rounded-lg bg-sand-50 px-4 py-4">
              <span className="flex size-10 flex-none items-center justify-center rounded-lg bg-ocean-600 text-white">
                <Icon name={m.icon} size={22} />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-small font-medium">{m.title}</span>
                <span className="text-caption font-normal text-ink-400">{m.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="font-sans text-h5">How payment works</h3>
        <ol className="flex flex-col gap-2">
          {paymentSteps.map((s, i) => (
            <li key={s.title} className="flex gap-3 rounded-lg bg-sand-50 px-4 py-3.5">
              <span className="flex size-6 flex-none items-center justify-center rounded-full bg-navy-900 text-caption text-white">
                {i + 1}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-small font-medium">{s.title}</span>
                <span className="text-caption font-normal text-ink-400">{s.text}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <p className="flex gap-2.5 text-small text-ink-600">
        <Icon name="info" size={18} className="mt-px flex-none text-ocean-600" />
        {paymentNote}
      </p>
    </div>
  );
}
