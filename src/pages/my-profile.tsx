export default function MyProfile() {
  return (
    <div className="scroll">
      <div className="page sm">
        <section className="heading">
          <h1>My Profile</h1>
          <p>Some information about profile and what should be done here!</p>
        </section>
        <form className="column xs">
          <label>
            Name
            <input placeholder="Alice" />
          </label>
          <button>
            Save
          </button>
        </form>
      </div>
    </div>
  );
}