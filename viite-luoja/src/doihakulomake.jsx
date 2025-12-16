// 11.12.2025/Micke
// 14.12.2025/Micke lisätty metatietojen tallennus

// 10.3389/frvir.2024.1447288
// https://doi.org/10.1037/edu0000473       


import { useState } from 'react'
import { haeMetadata } from './funkkarit/doihaku.js'


export function Doihakulomake({ tallennusfunktio }) {

    const [doi, setDoi] = useState("");
    const [doivirhe, setDoivirhe] = useState("");

    function tallennaDoi(e) {        
        setDoi(e.target.value);        
        setDoivirhe('');
    }
    
    const haeMetatiedot = async () => {
                    
        if (doi.trim().length > 0) {
        
            setDoivirhe('');
        
            const hakutulos = await haeMetadata(doi);
            
            if (typeof hakutulos == 'string') {
                setDoivirhe(hakutulos);
                return null;
            }                       
            
            tallennusfunktio(hakutulos);
            
            const citekey = Object.prototype.hasOwnProperty.call(hakutulos, 'citekey') ? hakutulos.citekey : null; 
            setDoi('');

            if (citekey != null) {
                setDoivirhe(`Viite ${citekey} tallennettu.`);    
            }    
            else {
                setDoivirhe('Metatiedot tallennettu.');    
            }
                        
            /* en saa toimimaan viitelistan vieritystä
            const citekey = Object.prototype.hasOwnProperty.call(hakutulos, 'citekey') ? hakutulos.citekey : null; 
            console.log(citekey);
            
            // <div class="tallennetutViitteet">
            // <ul id="viitelistaus">
            // <li> <a>citekey</a>    
            //const testi = document.getElementById("viitelistaus").innerHTML.replaceAll(/<br>|<\/p>/g, '\n').replaceAll(/<[^<]*>/g, '');
            //const testi = document.getElementById('viitelistaus');
            const testi = document.getElementsByClassName('tallennetutViitteet');
            const linkit = testi[0].getElementsByTagName('a');
            
            linkit[linkit.length - 1].scrollIntoView({ behavior: "instant", block: "end" });
                        
            if (linkit.length > 0) {
            
                for (let i = 0; i < linkit.length; i++) {
                    console.log(linkit[i].childNodes[0].textContent);
                    if (linkit[i].childNodes[0].textContent == citekey) {
                        console.log('löytyi linkki ' + citekey);
                        linkit[i].scrollIntoView();
                        break;
                    }                    
                }                                
            }
            */                     
            
        }       
                    
    }
    
    return(
        <div className='inputContainer'>
            <label>{'DOI: '}
                <input type="text" className='doiHaku' onChange={tallennaDoi} value={doi} />
                <button className="doihaku" onClick={haeMetatiedot}>Hae metatiedot</button>
            </label>
            <div>{doivirhe}</div>
        </div>        
    );


}







