// pohja erilaisille palvelimen testauksille,
// jotta ei tarvitse koskea App.jsx-tiedostoon
// 25.11.2025 Micke

// NÄYTETÄÄNKÖ NAPIT VAI EI
const naytaDevNapit = false;

import { JsonToBibtex } from './funkkarit/jsonToBibtex.jsx';

// ladataan esimerkkidata tiedostosta
import esimerkkidata from './esimerkkidata.json'


export function Devnapit() {

  if (naytaDevNapit) {

    return (
      <div id="devnapit">        
        {esimerkkidata.map(item => <JsonToBibtex jsonObject={item}/>)}        
      </div>
    );

  }

}


export default Devnapit
