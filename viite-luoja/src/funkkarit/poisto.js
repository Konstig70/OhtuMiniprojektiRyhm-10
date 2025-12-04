export function poistaViite(viitteet, setViitteet, poistettava) {
  console.log("poistetaan", poistettava["type"], poistettava["citekey"]); // debug
  let kopio = viitteet.filter(item => item["citekey"] != poistettava["citekey"]);
  setViitteet(kopio);
  return kopio;
}
