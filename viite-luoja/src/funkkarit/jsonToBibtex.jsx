// Muodostetaan JSON-muotoisesta viitteestä BibTeX-muotoiset React-elementit
// 1.12.2025/Micke

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


// Luodaan yhdestä json-muotoisesta viitteestä React-elementit
// Jos viitteen tyyppi puuttuu tai se on tuntematon, palautetaan arvo null.
// Jos viitteen citekey puuttuu tai se on tyhjä, palautetaan arvo null.
// Jos viitteessä ei ole muita kenttiä kuin type ja citekey, palautetaan arvo null.
// Jos kentän nimi on tuntematon, se ohitetaan.
// Null-arvoiset kentät ohitetaan.
// Virhetilanteessa palautetaan arvo null.
export function JsonToBibtex({ jsonObject }) { 

  let lines = [];
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
          lines.push( `    ${key.toLowerCase()} = {${String(value)}},` );
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

  if (lines.length == 0) {
    console.log(`Viitteessä ${citekey} ei ollut yhtään kenttää.`);
    return null
  }
 
  return (
  <p className="esikatseluViite">
    <span>{`@${type}{${citekey},`}<br/></span>
    {lines.map(item => <span className="indent">{item}<br/></span>)}
    <span>{'}'}<br/></span>
  </p>
  );

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
