import viitedata from '../viitemaarittelyt_v2.json' with { type: "json" };

// Konsta 28.11 lisätty setNameList default arvo, jotta voidaan käyttää testeissä ja sovelluksessa
// Hannes 10.12. Ei kutsuta backendiä ollenkaan, vaan luetaan viitteiden tiedot suoraan tiedostosta
export function getFields(viitetyyppi, setNameList = null) {

  // Tarkistetaan, löytyykö valitun viitteen tyyppi viitemäärittelyistä
  let tyypit = Object.keys(viitedata)
  if (!tyypit.includes(viitetyyppi)) return null

  // Kerätään kentät taulukkoon
  let kentat = viitedata[viitetyyppi].fields.map((item) => item.fieldname);
  // Testaamista varten
  if (setNameList) {
    setNameList({"tyyppi": viitetyyppi, "lista": kentat});
    return kentat;
  }
  return kentat;
}
