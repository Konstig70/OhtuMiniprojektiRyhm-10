import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';

//Set uppi
const backend = express();
const port = 3000;

//JSON käyttöön sekä CORS
backend.use(express.json());
backend.use(cors());

//Kuuntelija post metodille 
backend.post('/', (req, res) => {
  //Tässä otetaan JSON pyyntö eli siis minkä nimistä viitettä haetaan
  const message = req.body;
  console.log(message);
  //Vaihetaan sitten nimi esim id tai mikä vaan nyt keksitään siihen tyypin identifointiin
  res.send(`Hello ${message.nimi} from backend!`)  
})

// listataan viitteiden tyypit JSON-muodossa
backend.get('/viitetyypit', async (req, res) => {        
    
    const response = await haeKaikkiTyypit();
    //Saatiinko mitään takaisin
    if (response) {
      //Jos saatiin palautetaan suoraan kaikki JSON-muodossa 
      res.json(response);
    } else {
      //Muuten lähetetään error koodi.
      res.status(500).send('Virhe luettaessa tiedostoa tai viitetyyppejä ei ole');
    }
       
})

//Konsta: Nyt muutettu tämä omaksi funktioksi testausta varten
async function haeKaikkiTyypit() {
    // luetaan viitetyyppien määrittelyt
    try {
      const data = await fs.readFile('tiedostot/viitemaarittelyt.json', 'utf8');
      var jsonData = JSON.parse(data);
      //Tarkistetaan, että viitetyyppejä on olemassa
      var viitetyypit = Object.keys(jsonData);
            
      if (viitetyypit.length > 0) {
          //Jes oli olemassa, palautetaan ne
          return jsonData;
      } else {
          //Ei ole palautetaan  null 
          return null;
      }
    } catch {
        return null;
    }
    
}

// haetaan halutun tyyppisen viitteen kentät JSON-muodossa
backend.post('/maarittelyt', async (req, res) => {    

    const viitetyyppi = req.body.viitetyyppi;
    //const viitetyyppi = "book";   
    const response = await haeTiettyTyyppi(viitetyyppi);
    if (response) {
      res.json(response);
    } else {
      res.status(500).send('Error reading file');
    }
})

async function haeTiettyTyyppi(viitetyyppi) {
    try {
      const data = await fs.readFile('./tiedostot/viitemaarittelyt.json', 'utf8');
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

//Loggaus, ei tarvii muuten tästä välittää
backend.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//Exportit testejä varten
export default haeKaikkiTyypit;
