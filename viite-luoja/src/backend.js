import express from 'express';
import cors from 'cors';

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

//Loggaus ei tarvii muuten tästä välittää
backend.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

