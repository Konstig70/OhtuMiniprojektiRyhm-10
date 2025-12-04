// Muodostetaan JSON-muotoisesta viitteestä BibTeX-muotoiset React-elementit
// 4.12.2025/Micke siirretty bibtext-muotoisen datan muodostus omaan tiedostoon jsonToBibtexApu.js

import { jsonToBibtexMuodostaja } from './jsonToBibtexApu.js';

// Luodaan yhdestä json-muotoisesta viitteestä React-elementit
// Jos viitteen tyyppi puuttuu tai se on tuntematon, palautetaan arvo null.
// Jos viitteen citekey puuttuu tai se on tyhjä, palautetaan arvo null.
// Jos viitteessä ei ole muita kenttiä kuin type ja citekey, palautetaan arvo null.
// Jos kentän nimi on tuntematon, se ohitetaan.
// Null-arvoiset kentät ohitetaan.
// Virhetilanteessa palautetaan arvo null.
export function JsonToBibtex({ jsonObject }) { 
    
  let bibtexData = jsonToBibtexMuodostaja(jsonObject);  
  
  //{ "type": "", "citekey": "", "lines": [{"id": "", "data": ""}] }
  if (bibtexData === undefined || bibtexData === null) return null;
  
  let type = bibtexData.type;
  let citekey = bibtexData.citekey;
  let lines = bibtexData.lines;
   
  return (
  <p className="esikatseluViite">
    <span>{`@${type}{${citekey},`}<br/></span>
    {lines.map(item => <span key={item.id} className="indent">{item.data}<br/></span>)}
    <span>{'}'}<br/></span>
  </p>
  );

}

