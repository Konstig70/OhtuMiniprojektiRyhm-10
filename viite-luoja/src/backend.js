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
  const message = req.body;
  console.log(message);
  res.send(`Hello ${message.nimi} from backend!`)
})

backend.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

