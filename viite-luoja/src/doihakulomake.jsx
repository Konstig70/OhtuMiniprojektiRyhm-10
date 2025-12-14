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

            setDoi('');                           
                             
            tallennusfunktio(hakutulos);
            
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







