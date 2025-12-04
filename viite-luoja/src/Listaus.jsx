function Listaus({ viitteet, poistaViite }) {
  if (!viitteet || viitteet.length == 0) return;

  // Lista jokaisesta viitteestä
  const Lista = () => {
    return(
      <ul id="viitelistaus">
      {viitteet.map(item => <li key={item["citekey"]}>
	      <button onClick={() => poistaViite(item)}> x </button>
	      {item["citekey"]}
	      {Arvot(item)}
	      </li>)}
      </ul>
    );
  }

  // Lista viitteen kentistä, joissa on jotakin
  const Arvot = (item) => {
    // Ei listata citekeyta, koska se on jo ylempänä
    let kentat = Object.keys(item).filter(key => key != "citekey");

    return (
      <ul>
      {kentat.flatMap(kentta => item[kentta] != "" ?  <li key={kentta}>{kentta + ": " + item[kentta]}</li> : "")}
      </ul>
    );
  }

  return (
    <div>
    <legend>Lisätyt viitteet</legend>
    <Lista />
    </div>
  );
}

export default Listaus
