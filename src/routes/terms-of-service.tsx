import { ChildLayout } from "../layouts/child-layout";

export function TermsOfService() {
  const h1ClassName = "text-2xl font-bold py-4"
  const h2ClassName = "text-xl font-bold py-4"
  const listClassName = "list-disc pl-6 flex flex-col gap-2"

  return (
    <ChildLayout size="xs">
      <h1 className={h1ClassName}>Terms of Service</h1>
      <p>Last updated: [date]. Herds is operated by [operator name, country] ("we"). By using it you accept these terms.</p>

      <h2 className={h2ClassName}>Who can use it</h2>
      <p>You must be at least 16 years old.</p>

      <h2 className={h2ClassName}>Your messages</h2>
      <p>
        Everything you write is public to anyone in the room, and you are responsible for it.
        There are no accounts, so names are not verified. Don't rely on a name to know who
        someone is.
      </p>

      <h2 className={h2ClassName}>Not allowed</h2>
      <ul className={listClassName}>
        <li>Illegal content, threats, harassment or hate speech.</li>
        <li>Sexual content involving minors, or content that exploits anyone.</li>
        <li>Spam, scams, advertising or automated posting.</li>
        <li>Sharing other people's personal data, or pretending to be someone else.</li>
        <li>Trying to disrupt or bypass the limits of the service.</li>
      </ul>

      <h2 className={h2ClassName}>Moderation</h2>
      <p>
        We may delete messages, close connections or block access at any time, without notice.
        To report abuse or a legal problem, write to herds@metalogrom.com with the room and
        approximate time.
      </p>

      <h2 className={h2ClassName}>No guarantees</h2>
      <p>
        Herds is provided "as is" and may be unavailable or changed at any time. Messages are
        kept only briefly (see the Privacy Policy). To the extent the law allows, we are not
        liable for user messages or for losses from using the service. Nothing here limits
        rights you have by law as a consumer.
      </p>

      <h2 className={h2ClassName}>Changes and law</h2>
      <p>
        We may update these terms; continuing to use Herds means you accept the new version.
        These terms are governed by the law of [country], subject to mandatory consumer
        protections where you live.
      </p>
    </ChildLayout>
  );
}