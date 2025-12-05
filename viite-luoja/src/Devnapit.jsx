// pohja erilaisille palvelimen testauksille,
// jotta ei tarvitse koskea App.jsx-tiedostoon
// 5.12.2025 Micke

// NÄYTETÄÄNKÖ NAPIT VAI EI
const naytaDevNapit = false;

// ladataan viitteiden määrittelyt tiedostosta
import viitedata from './viitemaarittelyt_v2.json'

if (naytaDevNapit) { 

  // kaikki viitetyypit
  console.log(`viitetyypit: ${Object.keys(viitedata)}`);

  // tulostetaan yhden viitetyypin tiedot konsoliin
  console.log('esimerkkiviite: book\n' + viitedata['book'].fields.map(item => `${item.fieldname}, ${item.required}, ${item.fieldtype}\n`).join(""));

  // testataan vielä boolean arvo
  console.log(`${viitedata['book'].fields[2].fieldname} required is false: ${viitedata['book'].fields[2].required == false}`);
  
}
 


export function Devnapit() {

  if (naytaDevNapit) {

    return (
      <div id="devnapit">                
        <DownloadButton textOutput={"rivi 1\nrivi 2\n"} />    
      </div>
    );

  }

}

// onnistuu helpoiten linkin download-attribuutilla
const DownloadButton = ({textOutput}) => {    
    const file = new Blob([textOutput], {type: 'text/plain'});

    return (            
            <button className="kopioi"><img src="./src/assets/copy-icon.svg" alt="Lataa tiedosto"/>
               <a download="viitteet.txt" target="_blank" rel="noreferrer" href={URL.createObjectURL(file)}>Download</a>
            </button>                                        
    );
    
}


export default Devnapit
