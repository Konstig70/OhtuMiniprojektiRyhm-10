// pohja erilaisille palvelimen testauksille,
// jotta ei tarvitse koskea App.jsx-tiedostoon
// 25.11.2025 Micke

// NÄYTETÄÄNKÖ NAPIT VAI EI
const naytaDevNapit = false;




export function Devnapit() {

  if (naytaDevNapit) {

    return (
    <>
      <div id="devnapit">                
        
      </div>
      <p>Esimerkki: https://doi.org/10.1037/edu0000473</p>
    </>
    );

  }

}



/*

const lataaTiedosto = () => {

    if (document.getElementById("esikatseluLista") != null) {
    
        let teksti = document.getElementById("esikatseluLista").innerHTML.replaceAll(/<br>|<\/p>/g, '\n').replaceAll(/<[^<]*>/g, '');
        const tiedosto = new Blob([teksti], {type: 'text/plain'});
       
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "downloadedFile.pdf");
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);

    }

}


const tiedosto = () => {

    if (document.getElementById("esikatseluLista") != null) {
        let teksti = document.getElementById("esikatseluLista").innerHTML.replaceAll(/<br>|<\/p>/g, '\n').replaceAll(/<[^<]*>/g, '');
        return new Blob([teksti], {type: 'text/plain'});
    }
    else {
        return new Blob([''], {type: 'text/plain'});
    }
    
}


const tiedostonLataus = (e) => {   

    // toimii joten kuten...

    if (document.getElementById("esikatseluLista") != null) {
        let teksti = document.getElementById("esikatseluLista").innerHTML.replaceAll(/<br>|<\/p>/g, '\n').replaceAll(/<[^<]*>/g, '');
        e.currentTarget.href = URL.createObjectURL(new Blob([teksti], {type: 'text/plain'}));
    }
    else {        
        e.currentTarget.removeAttribute("href");
    }
        
}


const DownloadButton = ({textOutput}) => {    
    const file = new Blob([textOutput], {type: 'text/plain'});
    
    //let teksti = document.getElementById("esikatseluLista").innerHTML.replaceAll(/<br>|<\/p>/g, '\n').replaceAll(/<[^<]*>/g, '');
    
    const tiedostozz = () => {return new Blob(['jotain'], {type: 'text/plain'}); };
       
    
    return (    
        <>
            <button className="kopioi">            
               <a download="viitteet.txt" target="_blank" rel="noreferrer" href={URL.createObjectURL(tiedosto())}>Lataa tiedostona</a>
            </button> 
            
            <button className="kopioi">            
               <a onClick={(event) => tiedostonLataus(event)} download="viitteet.txt" target="_blank" rel="noreferrer" href='#'>TESTI</a>
            </button>    
        </>
    );
    
}

// let teksti = document.getElementById("esikatseluLista").innerHTML.replaceAll(/<br>|<\/p>/g, '\n').replaceAll(/<[^<]*>/g, '')


*/



export default Devnapit
