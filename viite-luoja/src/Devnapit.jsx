// pohja erilaisille palvelimen testauksille,
// jotta ei tarvitse koskea App.jsx-tiedostoon
// 25.11.2025 Micke

// NÄYTETÄÄNKÖ NAPIT VAI EI
const naytaDevNapit = true;




export function Devnapit() {

  if (naytaDevNapit) {

    return (
    <>
      <div id="devnapit">                
        <DownloadButton textOutput={"rivi 1\nrivi 2\n"} />    
      </div>
      <p>Esimerkki: https://doi.org/10.1037/edu0000473</p>
    </>
    );

  }

}


const DownloadButton = ({textOutput}) => {    
    const file = new Blob([textOutput], {type: 'text/plain'});

    return (            
            <button className="kopioi">
               <a download="viitteet.txt" target="_blank" rel="noreferrer" href={URL.createObjectURL(file)}>Lataa tiedostona (testi)</a>
            </button>                                        
    );
    
}


export default Devnapit
