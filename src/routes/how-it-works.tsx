import { Link } from "react-router";
import { ChildLayout } from "../layouts/child-layout";

export function HowItWorks() {
  const h1ClassName = "text-2xl font-bold py-4"
  const h2ClassName = "text-xl font-bold py-4"
  const linkClassName = "underline hover:decoration-2 cursor-pointer"

  return (
    <ChildLayout size="xs">
      <h1 className={h1ClassName}>How It Works</h1>

      <p>
        Over two thousand years ago, Aristotle wrote that humans are creatures of the city. 
        He didn't mean that we merely live inside cities. He meant that we become who we are 
        by talking, disagreeing and deciding things together with the people around us.
      </p>

      <p>
        Today we talk to the whole world and barely know our neighbours. Our attention is 
        scattered across feeds that have nothing to do with the street we walk down. 
        This app is a small attempt to bring some of it back home.
      </p>

      <h2 className={h2ClassName}>One city, many rooms</h2>
      <p>
        Every city with more than 100,000 people can have its own chat, divided into rooms: 
        food, events, higher education and more. It's one shared place for the things 
        that matter to people who share the same ground. A recommendation for a good 
        bakery, a last-minute concert, a question about a university course: each 
        finds its natural room.
      </p>

      <h2 className={h2ClassName}>Why a single place matters</h2>
      <p>
        Where you live shapes your days more than almost anything else. When the 
        conversation about a place happens in one spot instead of in a hundred private 
        groups, newcomers can find their way in, and good ideas stop dying in 
        closed circles. A city starts to feel like a community and not just an address.
      </p>

      <h2 className={h2ClassName}>No barriers</h2>
      <p>
        There's no account, no password and no sign-in with a big provider. 
        Just <Link to="/profile" className={linkClassName}>tell us your name</Link>
        {", "}
        then <Link to="/cities" className={linkClassName}>step into your city</Link>.
      </p>
    </ChildLayout>
  );
}