// pohja erilaisille palvelimen testauksille,
// jotta ei tarvitse koskea App.jsx-tiedostoon
// 25.11.2025 Micke

// NÄYTETÄÄNKÖ NAPIT VAI EI
const naytaDevNapit = false;


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
