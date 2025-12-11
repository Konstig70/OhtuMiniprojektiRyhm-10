//import { DatabaseSync } from 'node:sqlite';
//import { readFileSync } from 'fs';

const TAULU = `Viitteet`;

/**
  * Hakee tietokannasta kaikki viitteet. Järjestellään citekey:n perusteella 
*/
export function haeTietokannasta(db) {
  const query = db.prepare('SELECT * FROM Viitteet ORDER BY citekey');
  return query.all();
}
/**
  * Alustaa tietokannan eli luo uuden mikäli sitä ei ole olemassa
*/
export function alusta(db) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS ${TAULU}(
    citekey TEXT PRIMARY KEY NOT NULL,
    data TEXT 
  ) STRICT;
  `);
}

/** 
 * Lisää tai muokkaa tietokannan riviä. Palauttaa result objektin
*/
export function lisaaTaiMuokkaa(db, viite) {
  const insert = db.prepare(`INSERT OR REPLACE INTO ${TAULU} VALUES (?, ?)`);
  const tulos = insert.run(`${viite.citekey}`, `${JSON.stringify(viite)}`);
  return tulos;
}

/** 
 * Poistaa tietokannasta rivin. Palauttaa result objektin
*/
export function poista(db, citekey) {
  const remove = db.prepare(`DELETE FROM ${TAULU} WHERE citekey = ?`);
  const tulos = remove.run(citekey);
  return tulos;
}

/** 
 * Testi funkkari saa ajaa, ottakaa pois kommenteist sillo ja ottakaa pois kommenteist ne importit
 */
/**
function luoJaTayta() {
  const polku = new URL("./tiedostot/tietokanta.db", import.meta.url);
  let db = new DatabaseSync(polku);

  const jsonString = readFileSync("./src/esimerkkidata.json", "utf8");
  const data = JSON.parse(jsonString);
  data.forEach(viite => {
    lisaaTaiMuokkaa(db, viite);
  });
  console.log("Alussa", haeTietokannasta(db));
  data[0].author = "Konsta Lahtinen";
  lisaaTaiMuokkaa(db, data[0]);
  console.log("Muokataan ekaa", haeTietokannasta(db));
  poista(db, data[0].citekey);
  console.log("Poistetaan eka", haeTietokannasta(db));
  lisaaTaiMuokkaa(db, data[0]);
  console.log("Lisätään eka takasin", haeTietokannasta(db));
  db.close();
}
*/
