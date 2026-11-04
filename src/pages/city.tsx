export default function City() {
  return (
    <div className="grid-two lg">
      <section className="chat column">
        <div className="chat-header">
          Room name
        </div>
        <div className="scroll">
          <div className="chat-message other">Hi! Which city are you looking at?</div>
          <div className="chat-message my">Warsaw.</div>
          <div className="chat-message other">
            Nice choice. It has a lot to offer, so it helps to know what you care about
            most: food, history, nightlife, or just a quiet place to work from.
          </div>
          <div className="chat-message my">
            Mostly quiet places to work, and good coffee nearby.
          </div>
          <div className="chat-message other">Got it.</div>
        </div>
        <div className="chat-input">
          <input placeholder="Type here..."/>
          <button>
            Send
          </button>
        </div>
      </section>
      <section className="scroll news">
        <div className="news-item column">
          <p>Example city news goes here</p>
          <p>{"- "}Date goes here</p>
        </div>
      </section>
    </div>
  );
}