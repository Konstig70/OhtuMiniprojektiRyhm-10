import express from 'express';
import cors from 'cors';
import fs from 'fs';

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

backend.post('/maarittelyt', (req, res) => {    

    const viitetyyppi = req.body.viitetyyppi;
    //const viitetyyppi = "book";   
    
    // luetaan viitetyyppien määrittelyt
    fs.readFile('../backend/tiedostot/viitemaarittelyt.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
        } else {
        
            var jsonData = JSON.parse(data);
            
            // jos haluttu viitetyyppi löytyi, palautetaan se
            if (jsonData.hasOwnProperty(viitetyyppi)) {                            
                res.json(jsonData[viitetyyppi]);                
            }
            else {
                res.status(500).send('Viitetyyppiä ${viitetyyppi} ei löytynyt.');
            }            
        }
    });    
})


//Loggaus ei tarvii muuten tästä välittää
backend.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

