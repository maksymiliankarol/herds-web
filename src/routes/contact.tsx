import { ChildLayout } from "../layouts/child-layout";

export function Contact() {
  return (
    <ChildLayout>
      <p>
        Write us:{" "}
        <a
          href="mailto:herds@metalogrom.com"
          className="underline hover:decoration-2"
        >
          herds@metalogrom.com
        </a>
      </p>
    </ChildLayout>
  );
}