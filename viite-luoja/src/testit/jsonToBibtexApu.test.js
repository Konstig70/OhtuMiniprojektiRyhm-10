import { jest } from '@jest/globals';
import { jsonToBibtexMuodostaja } from '../funkkarit/jsonToBibtexApu.js';

describe('jsonToBibtexMuodostaja', () => {

  test('Parametri on null', () => {
    const result = jsonToBibtexMuodostaja(null);
    expect(result).toBeNull();
  });

  test('Parametri on tyhjä', () => {
    const result = jsonToBibtexMuodostaja();
    expect(result).toBeNull();
  });

  test('Viitteen tyyppi puuttuu', () => {
    const result = jsonToBibtexMuodostaja({"citekey": "citekey1", "author": "Kirjailija1"});
    expect(result).toBeNull();
  });

  test('Viitteen tyyppi on virheellinen', () => {
    const result = jsonToBibtexMuodostaja({"type": "kirja", "citekey": "citekey1", "author": "Kirjailija1"});
    expect(result).toBeNull();
  });

  test('Citekey puuttuu', () => {
    const result = jsonToBibtexMuodostaja({"type": "book", "author": "Kirjailija1"});
    expect(result).toBeNull();
  });

  test('Citekey on virheellinen', () => {
    const result = jsonToBibtexMuodostaja({"type": "book", "citekey": null, "author": "Kirjailija1"});
    expect(result).toBeNull();
  });

  test('Viitteessä ei ole muita tietoja kuin tyyppi ja citekey', () => {
    const result = jsonToBibtexMuodostaja({"type": "book", "citekey": "citekey1"});
    expect(result).toBeNull();
  });
  
  test('Viitteessä on tuntemattomia kenttiä', () => { 
    
    const result = jsonToBibtexMuodostaja({"type": "book", "citekey": "citekey1", "author": "Kirjailija1", "tuntematon": ["1", "2"]});
    const expectedResult = { 
      "type": "book", 
      "citekey": "citekey1", 
      "lines": [ {"id": "citekey1-author", "data": "    author = {Kirjailija1},"} ] 
    };    
    
    expect(result).toEqual(expectedResult);
    
  });

  test('Viitteessä on vain tunnettuja kenttiä', () => {
    
    const result = jsonToBibtexMuodostaja({"type": "book", "citekey": "citekey1", "author": "Kirjailija1", "title": "Julkaisun nimi"});
    const expectedResult = { 
      "type": "book", 
      "citekey": "citekey1", 
      "lines": [ {"id": "citekey1-author", "data": "    author = {Kirjailija1},"}, {"id": "citekey1-title", "data": "    title = {Julkaisun nimi},"}] 
    };    
    
    expect(result).toEqual(expectedResult);
        
  });

});
