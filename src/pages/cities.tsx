export default function Cities() {
  return (
    <div className="scroll">
      <div className="page sm">
        <section className="heading">
          <h1>Cities</h1>
          <p>Something about cities here!</p>
        </section>
        <section className="column">
          <input  
            placeholder="Warsaw"
          />
          <ul>
            <li><a href="/city/warsaw">Warsaw</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}