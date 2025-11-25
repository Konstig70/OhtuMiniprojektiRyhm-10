import fs from 'fs/promises';

// luodaan absoluuttinen tiedostopolku 
// (muuten node ei löydä tiedostoa jos komento "node backend.js" on annettu jossain muussa hakemistossa)
const tiedostopolkuViitemaarittelyt = new URL('./tiedostot/viitemaarittelyt.json', import.meta.url);

export async function haeTiettyTyyppi(viitetyyppi) {
    try {
      const data = await fs.readFile(tiedostopolkuViitemaarittelyt, 'utf8');
      var jsonData = JSON.parse(data);      
      // jos haluttu viitetyyppi löytyi, palautetaan se
      if (jsonData.hasOwnProperty(viitetyyppi)) {             
         return jsonData[viitetyyppi];                
      }
      else {
        return null;
      }            
    } catch {
    return null;
  }
}

//Konsta: Nyt muutettu tämä omaksi funktioksi testausta varten
export async function haeKaikkiTyypit() {
    
    // luetaan viitetyyppien määrittelyt
    try {        
      const data = await fs.readFile(tiedostopolkuViitemaarittelyt, 'utf8');          
      var jsonData = JSON.parse(data);      
      //Tarkistetaan, että viitetyyppejä on olemassa
      var viitetyypit = Object.keys(jsonData);
            
      if (viitetyypit.length > 0) {
          //Jes oli olemassa, palautetaan ne
          return {viitetyypit};
      } else {
          //Ei ole palautetaan  null 
          return null;
      }
    } catch {
        return null;
    }
    
}


