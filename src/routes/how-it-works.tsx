import { Link } from "react-router";
import { ChildLayout } from "../layouts/child-layout";
import { useI18n } from "../lib/i18n-context";

const linkClassName = "underline hover:decoration-2";

export function HowItWorks() {
  const { t } = useI18n()
  const h = t.howItWorks

  return (
    <ChildLayout size="xs">
      <h1 className="text-2xl font-bold py-4">{h.title}</h1>
      <p>{h.intro}</p>

      <ol className="list-decimal pl-6 flex flex-col gap-2">
        <li>
          <Link to="/profile" className={linkClassName}>{h.step1.link}</Link>
          {h.step1.after}
        </li>
        <li>
          <Link to="/cities" className={linkClassName}>{h.step2.link}</Link>
          {h.step2.after}
        </li>
        <li>{h.step3}</li>
      </ol>

      <p>{h.note}</p>
    </ChildLayout>
  );
}