import { ChildLayout } from "../layouts/child-layout";

export function PrivacyPolicy() {
  const h1ClassName = "text-2xl font-bold py-4"
  const h2ClassName = "text-xl font-bold py-4"
  const listClassName = "list-disc pl-6 flex flex-col gap-2"

  return (
    <ChildLayout size="xs">
      <h1 className={h1ClassName}>Privacy Policy</h1>
      <p>
        Last updated: 29/11/2026. Controller: metalogrom.com, contact:
        herds@metalogrom.com.
      </p>

      <h2 className={h2ClassName}>What we process</h2>
      <ul className={listClassName}>
        <li>
          <b>Your name and messages.</b> The name you choose and what you write are visible to
          everyone in the room. Basis: our legitimate interest in running the chat.
        </li>
        <li>
          <b>Your IP address.</b> Used to limit connections and message rates and to block
          abuse, and may appear in short-lived server logs. Basis: our legitimate interest in
          security.
        </li>
        <li>
          <b>Bot check.</b> Cloudflare Turnstile checks that you are human, which involves
          browser and network signals processed by Cloudflare.
        </li>
      </ul>

      <h2 className={h2ClassName}>Your browser</h2>
      <p>
        Your chosen name is saved in your browser's local storage so you don't have to enter
        it again. If you choose a language, we save it in a cookie (herds_lang, one year) to remember it. We use no analytics or advertising cookies.
      </p>

      <h2 className={h2ClassName}>How long we keep it</h2>
      <p>
        Each room keeps its last 100 messages, and anything older than 30 days is deleted.
        We don't keep IP addresses beyond the temporary technical logs of our hosting.
      </p>

      <h2 className={h2ClassName}>Who receives it</h2>
      <p>
        Other users see your name and messages. Our infrastructure provider, Cloudflare,
        processes data on our behalf and may do so outside your country under its standard
        safeguards. We don't sell data.
      </p>

      <h2 className={h2ClassName}>Your rights</h2>
      <p>
        You can ask to access, correct or delete your data, to object to processing, or to
        complain to your data protection authority. Since there are no accounts, tell us the
        room, name and approximate time of the messages so we can find them. Write to
        herds@metalogrom.com.
      </p>

      <h2 className={h2ClassName}>Children and changes</h2>
      <p>
        Herds is not for people under 16. We may update this policy and will change the date
        above when we do.
      </p>
    </ChildLayout>
  );
}