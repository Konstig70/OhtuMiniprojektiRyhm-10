// esikatselun latausnappi, tarjotaan .bib -tiedostoa
// 14.12.2025/Micke

export function Latausnappi() {    

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
          
    return (    
        <button className="kopioi">            
            <a onClick={(event) => tiedostonLataus(event)} download="viitteet.bib" target="_blank" rel="noreferrer" href='#'>Lataa tiedosto</a>
        </button>    
    );
    
}
