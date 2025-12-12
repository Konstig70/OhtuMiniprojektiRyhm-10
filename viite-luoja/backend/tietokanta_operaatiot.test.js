// database.node.js
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { DatabaseSync } from 'node:sqlite';
import { alusta, lisaaTaiMuokkaa, haeTietokannasta, poista } from './tietokanta_operaatiot.js';

describe('Tietokanta operaatioiden testit', () => {
  let db;

  //Luodaan uusi tietokanta muitiin joka testin alussa
  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    alusta(db);
  });

  //Suljetaan lopussa aina
  afterEach(() => {
    db.close();
  });

  it('Data lisätään ja haetaan oikein', () => {
    const data = { citekey: 'test', year: 2024 };
    lisaaTaiMuokkaa(db, data);
    
    const result = haeTietokannasta(db);
    assert.deepStrictEqual(result[0], data);
  });

    it('Data muokataan oikein', () => {
    const data = { citekey: 'test', year: 2024 };
    lisaaTaiMuokkaa(db, data);
    data.year = 2020;
    lisaaTaiMuokkaa(db, data);
    const result = haeTietokannasta(db);
    assert.deepStrictEqual(result[0], data);
  });

    it('Data poistetaan oikein', () => {
    const row1 = { citekey: 'test', year: 2024 };
    const row2 = {citekey: 'test2', year: 2020}
    lisaaTaiMuokkaa(db, row1);
    lisaaTaiMuokkaa(db, row2);
    poista(db, row2.citekey);
    const result = haeTietokannasta(db);
    assert.deepStrictEqual(result[0], row1);
  });



});
