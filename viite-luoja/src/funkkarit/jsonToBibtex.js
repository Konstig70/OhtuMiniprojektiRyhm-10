// Muodostetaan JSON-muotoisista viitetiedoista BibTeX-muotoinen merkkijono

/*
BibTeX
the values of field can either be enclosed in { } or " "
the field names are case insensitive: each variant is valid
plain numbers do not need to be encloded in { } or " "

JSON:
{
    "type": "book",
    "citekey": "Martin09",
    "author": "Martin, Robert",
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "year": "2008",
    "publisher": "Prentice Hall"
}

BibTeX:
@book{Martin09,
    author = {Martin, Robert},
    title = {Clean Code: A Handbook of Agile Software Craftsmanship},
    year = {2008},
    publisher = {Prentice Hall},
}
*/

/*
Esimerkki miten css-luokat voidaan syöttää funktiolle
const formattingFunctions = {
  "indentation": () => '  ',
  "newline": () => "<br>",
  "type": (value) => `<class="bibTexType">${value}</>`,
  "citekey": (value) => `<class="bibTexCitekey">${value}</>`,
  "key": (value) => `<class="bibTexKey">${value}</>`,
  "value": (value) => `<class="bibTexValue">${value}</>`,
  "entry": (value) => `<class="bibTexEntry">${value}</>`
};
*/

// Annetaan parametrina taulukko, joka sisältää viitteet JSON-muodossa: [{viite}, {viite}, ...]
// Virheelliset viitteet ohitetaan.
// Palauttaa virhetilanteessa arvon null.
// HUOM! Jos parametri 'formattingFunctions' puuttuu, palautetaan BibTeX-tiedostoksi sopiva merkkijono.
export function luoBibtexMerkkijono(jsonArray, formattingFunctions = null) {

  const f = processFormattingFunctions(formattingFunctions);

  if (jsonArray === null || typeof jsonArray != 'object' || !Array.isArray(jsonArray)) {
    console.log(`Annettu parametrin arvo on virheellinen, haluttiin taulukko JSON-muodossa.`);
    return null;
  }

  let result = [];

  jsonArray.forEach((element) => {
    let bibtex = jsonToBibtex(element, f);
    if (bibtex !== null) result.push(f.formatEntry(bibtex));
  });

  if (result.length == 0) return null;

  return result.join("");

}


// Luodaan yhdestä json-muotoisesta viitteestä halutun muotoinen merkkijono.
// Jos viitteen tyyppi puuttuu tai se on tuntematon, palautetaan arvo null.
// Jos viitteen citekey puuttuu tai se on tyhjä, palautetaan arvo null.
// Jos viitteessä ei ole muita kenttiä kuin type ja citekey, palautetaan arvo null.
// Jos kentän nimi on tuntematon, se ohitetaan.
// Null-arvoiset kentät ohitetaan.
// Virhetilanteessa palautetaan arvo null.
function jsonToBibtex(jsonObject, f) {

  let result = [];
  let type = null;
  let citekey = null;

  if (jsonObject === null || typeof jsonObject != 'object' || Array.isArray(jsonObject)) {
    console.log(`Annettu parametrin arvo on virheellinen, haluttiin objekti JSON-muodossa.`);
    return null;
  }

  for (const key in jsonObject) {

    let value = jsonObject[key];

    switch (key.toLowerCase()) {

      case 'citekey':
        citekey = value;
        break;

      case 'type':
        type = value;
        break;

      default:
        if (isValidField(key, value)) {
          result.push(`${f.formatKey(key.toLowerCase())} = ${f.formatValue('{' + String(value) + '}')}`);
        }

    }

  }

  if (!isValidCitekey(citekey)) {
    console.log(`Citekey puuttuu tai on virheellinen: ${citekey}`);
    return null
  }

  if (!isValidType(type)) {
    console.log(`Type puuttuu tai on virheellinen: ${type}`);
    return null
  }

  if (result.length == 0) {
    console.log(`Viitteessä ${citekey} ei ollut yhtään kenttää.`);
    return null
  }

  return `${f.formatType('@' + type)}{${f.formatCitekey(citekey)},${f.addNewline()}${f.addIndentation()}${result.join(',' + f.addNewline() + f.addIndentation())}${f.addNewline()}}`;

}


function isValidType(typename) {

  const validTypes = ["article", "book", "booklet", "conference", "inbook", "incollection", "inproceedings", "manual", "mastersthesis", "misc", "phdthesis", "proceedings", "techreport", "unpublished"];
  return validTypes.includes(typename);

}


function isValidField(fieldname, value) {

  const validFields = ["address", "annote", "author", "booktitle", "chapter", "edition", "editor", "howpublished", "institution", "journal", "month", "note", "number", "organization", "pages", "publisher", "school", "series", "title", "type", "volume", "year", "doi", "issn", "isbn", "url"];
  return validFields.includes(fieldname.toLowerCase()) && value != null;

}


function isValidCitekey(citekey) {
  return citekey !== null && String(citekey).length > 0;
}


function processFormattingFunctions(formattingFunctions) {

  return {
    "addIndentation": formattingFunctions != null && typeof formattingFunctions["indentation"] == 'function' ? formattingFunctions["indentation"] : () => "  ",
    "addNewline": formattingFunctions != null && typeof formattingFunctions["newline"] == 'function' ? formattingFunctions["newline"] : () => "\n",
    "formatType": formattingFunctions != null && typeof formattingFunctions["type"] == 'function' ? formattingFunctions["type"] : (value) => value,
    "formatCitekey": formattingFunctions != null && typeof formattingFunctions["citekey"] == 'function' ? formattingFunctions["citekey"] : (value) => value,
    "formatKey": formattingFunctions != null && typeof formattingFunctions["key"] == 'function' ? formattingFunctions["key"] : (value) => value,
    "formatValue": formattingFunctions != null && typeof formattingFunctions["value"] == 'function' ? formattingFunctions["value"] : (value) => value,
    "formatEntry": formattingFunctions != null && typeof formattingFunctions["entry"] == 'function' ? formattingFunctions["entry"] : (value) => `${value}\n\n`
  }

}
