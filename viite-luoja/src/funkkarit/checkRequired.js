import viitedata from "../viitemaarittelyt_v2.json" with { type: "json" };

// Tarkistaa onko, pakolliset inputit täytetty, ottaa parametrina input-kenttien arvot
export default function(arvot, tyyppi) {
  
  // Tarkistetaan, onko viitteen tyyppi oikeanlainen. Käytännössä tämä tarvitaan, koska
  // alussa on valittuna "oletus"-niminen tyyppi, joka ei ole oikea viitetyyppi
  const viitteet = Object.keys(viitedata)
  if (!viitteet.includes(tyyppi)) return false;

  // Haetaan valitun viitetyypin kentät
  const kentat = viitedata[tyyppi].fields

  // Käydään läpi kaikki kentät
  for (let i = 0; i < kentat.length; i++) {
    // Jos kenttä on pakollinen ja sitä ei ole täytetty, palautetaan kentän nimi
    // Tähän indeksointiin voi tulla ongelmaa, jos lisätään citekey hakukenttiin, mutta ei viitemäärittelyyn
    if (kentat[i]["required"] && arvot[i].length == 0) { 
      return kentat[i]["fieldname"]
    }
  }

  return true

}