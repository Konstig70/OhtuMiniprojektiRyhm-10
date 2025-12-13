export function poistaViite(viitteet, setViitteet, poistettava) {
  console.log("poistetaan", poistettava["type"], poistettava["citekey"]); // debug
  let kopio = viitteet.filter(item => item["citekey"] != poistettava["citekey"]);
  setViitteet(kopio);
  
  //Konsta 13.12 Poistetaan myös palvelimelta 
  viePalvelimelle(poistettava);
  return kopio;
}

async function viePalvelimelle(data) {
  const response = await fetch("https://ohtuminiprojektiryhm-10-backend.onrender.com/tietokanta/poista", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ viite: data }),
  });
  if (!response.ok) {
      throw new Error(`Virhe lähetyksessä: ${response.status}`);
    }
    console.log("Poistaminen onnistu!");
}

