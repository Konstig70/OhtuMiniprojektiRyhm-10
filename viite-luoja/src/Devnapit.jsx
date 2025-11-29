// pohja erilaisille palvelimen testauksille,
// jotta ei tarvitse koskea App.jsx-tiedostoon
// 25.11.2025 Micke

// NÄYTETÄÄNKÖ NAPIT VAI EI
const naytaDevNapit = false;


import { luoBibtexMerkkijono } from './funkkarit/jsonToBibtex.js';


async function HaeViitetyypit() {

  try {

    let response = await fetch("http://127.0.0.1:3000/viitetyypit", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }

      // Otetaan vastauksena saadut kentät ja asetetaan ne listaan
      let result = await response.json();
      tulostaTyypit(result);

    } catch (error) {
      console.error(error);
      return null
    }

}


function tulostaTyypit(viitetyypit) {

    if (viitetyypit != null) {
        console.log(viitetyypit["viitetyypit"]);
    }

}


export function Devnapit() {

  if (naytaDevNapit) {

    return (
      <div id="devnapit">
        <button onClick={HaeViitetyypit}>DEV: tulosta kaikki viitetyypit konsoliin</button><br />
        <button onClick={LuoBibtexData}>DEV: tulosta bibtex-esimerkki konsoliin</button>
      </div>
    )

  }

}


const esimerkkidata = [
  {
    "type": "inproceedings",
    "citekey": "VPL11",
    "author": "Vihavainen, Arto and Paksula, Matti and Luukkainen, Matti",
    "title": "Extreme Apprenticeship Method in Teaching Programming for Beginners.",
    "year": "2011",
    "booktitle": "SIGCSE '11: Proceedings of the 42nd SIGCSE technical symposium on Computer science education"
  },
  {
    "type": "article",
    "citekey": "CBH91",
    "author": "Allan Collins and John Seely Brown and Ann Holum",
    "title": "Cognitive apprenticeship: making thinking visible",
    "journal": "American Educator",
    "year": "1991",
    "volume": "6",
    "pages": "38--46"
  },
  {
    "type": "book",
    "citekey": "Martin09",
    "author": "Martin, Robert",
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "year": "2008",
    "publisher": "Prentice Hall"
  }
];

const formattingFunctions = {
  "indentation": () => '  ',
  "newline": () => "<br />\n",
  "type": (value) => `<class="bibTexType">${value}</>`,
  "citekey": (value) => `<class="bibTexCitekey">${value}</>`,
  "key": (value) => `<class="bibTexKey">${value}</>`,
  "value": (value) => `<class="bibTexValue">${value}</>`,
  "entry": (value) => `<class="bibTexEntry">${value}</>\n\n`
};

function LuoBibtexData() {

  console.log("BixTeX tiedostomuodossa:")
  console.log(luoBibtexMerkkijono(esimerkkidata));
  console.log("\n");
  console.log("BibTex sivupohjaan:");
  console.log(luoBibtexMerkkijono(esimerkkidata, formattingFunctions));

}



export default Devnapit
