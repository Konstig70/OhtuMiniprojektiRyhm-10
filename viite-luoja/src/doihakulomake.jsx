// 11.12.2025/Micke

import { useState } from 'react'
import { haeMetadata } from './funkkarit/doihaku.js'


export function Doihakulomake() {

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
            
            // PUUTTUU: TIETOJEN VIENTI LOMAKKEELLE
            console.log(hakutulos);
            
        }       
                    
    }
    
    return(
        <div className='inputContainer'>
            <label>{'DOI: '}
                <input type="text" className='doiHaku' onChange={tallennaDoi} defaultValue=''/>
                <button className="doihaku" onClick={haeMetatiedot}>Hae metatiedot</button>
            </label>
            <div>{doivirhe}</div>
        </div>        
    );


}







