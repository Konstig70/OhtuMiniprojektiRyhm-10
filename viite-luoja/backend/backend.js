import express from 'express';
import cors from 'cors';
import { haeKaikkiTyypit, haeTiettyTyyppi } from './apu.js';
import { haeTietokannasta, lisaaTaiMuokkaa, poista, alusta } from './tietokanta_operaatiot.js';
import { DatabaseSync } from 'node:sqlite';


//Set uppi
//Konsta 11.12 käynnistetään tietokanta yhteys myös
const backend = express();
const port = 3000;
const polku = new URL("./tiedostot/tietokanta.db", import.meta.url);
const db = new DatabaseSync(polku);

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

//Lukee tietokannasta
backend.get('/tietokanta/lue', async (req, res) => {
    const response = haeTietokannasta(db);
    if (response) {
      res.json(response);
    } else {
      res.status(500).send('Error reading database');
    }
})

//Lisää tai muokkaa riviä
backend.post('/tietokanta/muokkaa', async (req, res) => {
  const response = lisaaTaiMuokkaa(db, req.body.viite);
  if (response.changes <= 1) {
    res.status(200).send("ok");
  } else {
    res.status(500).send("Error when adding or modifying table");
  }
})

//Poistaa rivin 
backend.post('/tietokanta/poista', async (req, res) => {
  const response = poista(db, req.body.viite.citekey);
  if (response.changes <= 1) {
    res.status(200).send("Ok");
  } else {
    res.status(500).send("Error when removing row from table");
  }

})

//Loggaus, ei tarvii muuten tästä välittää
const palvelin = backend.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
  alusta(db);
   
})

//SULKEMIS OPERAATIOT 

//Tulostaa viestin ja sulkee db yhteyden
//jos halutaan tietää miksi suljettiin niin lisätkää signal tohon parametriks
function sulje() {
  console.log("Suljetaan bäkkäriä");
  palvelin.close(() => {
    try {
      db.close();
      console.log("Tietokanta suljettu");
    } catch (e) {
      console.log("Virhe tietokannan sulkemisessa:" , e);
    }
    process.exit(0);
  });

}

process.on("SIGINT", sulje);
process.on("SIGTERM", sulje);
process.on("uncaughtException", sulje);

