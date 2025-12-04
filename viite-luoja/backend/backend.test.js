import { describe, jest } from '@jest/globals';
import { expect } from '@playwright/test';
//import test from 'node:test';

//Luodaan mockReadFile funktio joka on jest funktio, tässä idea sama kuin pythonin mock luokassa
const mockReadFile = jest.fn();

//Mock readFile, jotta voidaan estää oikea luku 
jest.unstable_mockModule('fs/promises', () => ({
  default: {
    readFile: mockReadFile,
  }
}));

//Importataan backend
const { haeKaikkiTyypit, haeTiettyTyyppi } = await import('./apu.js');

//Testit haeTiettyTyyppi funktiolle 
describe('haeTiettyTyyppi', () => {
  afterEach(() => jest.clearAllMocks());

  test('palautetaan JSON muodossa pyydetyt tyypit', async () => {
    
    const mockData = {
            "book":  {"jotain": "muuta"},
            "article" : {"jotain": "muuta"},
            "inproceedings" : {"jotain": "muuta"}
    };
    
    const expectedResult = {
        "jotain": "muuta"
    };
    
    //Nyt siis laitetaan mocReadFile palauttamaan aina mockdata    
    mockReadFile.mockResolvedValue(JSON.stringify(mockData));
    
    //Kutsutaan haeTiettyTyyppi funktiota
    const result = await haeTiettyTyyppi("book");
    const tiedostopolkuViitemaarittelyt = new URL('./tiedostot/viitemaarittelyt.json', import.meta.url);
    //Tulos sama kuin mockdata ja mockReadFile kutsuttu oikealla parametrilla    
    expect(result).toEqual(expectedResult);
    expect(mockReadFile).toHaveBeenCalledWith(tiedostopolkuViitemaarittelyt, 'utf8');
    
  });

  test('palautetaan null, jos tyyppiä ei löydy', async () => {
    const mockData = {
        "book":  {"jotain": "muuta"},
        "article" : {"jotain": "muuta"},
        "inproceedings" : {"jotain": "muuta"}
    };
    
    mockReadFile.mockResolvedValue(JSON.stringify(mockData));
    
    const result = await haeTiettyTyyppi("Ei löydy");
    const tiedostopolkuViitemaarittelyt = new URL('./tiedostot/viitemaarittelyt.json', import.meta.url);
    
    expect(result).toBeNull();
    expect(mockReadFile).toHaveBeenCalledWith(tiedostopolkuViitemaarittelyt, 'utf8');

  });

  //Tismalleen sama kuin haekaikkityypit funkkarissa 
  test('palautetaan null kun tiedoston luku ei onnistu', async () => {
    mockReadFile.mockRejectedValue(new Error('File not found'));
    
    const result = await haeTiettyTyyppi("book");
    
    expect(result).toBeNull();
  });

});

//Testit haeKaikkiTyypit funktiolle. 
describe('haeKaikkiTyypit', () => {
  //Ennen jokaista tuhotaan kaikki mock oliot 
  afterEach(() => {
    jest.clearAllMocks();
  });


  test('palautetaan JSON muodossa luettu data', async () => {
      
    const mockData = {
            "book":  {"jotain": "muuta"},
            "article" : {"jotain": "muuta"},
            "inproceedings" : {"jotain": "muuta"}
    };
    
    const expectedResult = {
        "viitetyypit": ["book", "article", "inproceedings"]
    };
    
    //Nyt siis laitetaan mocReadFile palauttamaan aina mockdata    
    mockReadFile.mockResolvedValue(JSON.stringify(mockData));
    
    //Kutsutaan haeKaikkiTyypit funktiota
    const result = await haeKaikkiTyypit();
    const tiedostopolkuViitemaarittelyt = new URL('./tiedostot/viitemaarittelyt.json', import.meta.url);
    
    //Tulos sama kuin mockdata ja mockReadFile kutsuttu oikealla parametrilla    
    expect(result).toEqual(expectedResult);
    expect(mockReadFile).toHaveBeenCalledWith(tiedostopolkuViitemaarittelyt, 'utf8');
    
  });

  test('palautetaan null kun tiedostossa ei ole viitetyyppejä', async () => {
    const mockData = JSON.stringify({});
    mockReadFile.mockResolvedValue(mockData);
    
    const result = await haeKaikkiTyypit();
    
    expect(result).toBeNull();
  });

  test('palautetaan null kun tiedoston luku ei onnistu', async () => {
    mockReadFile.mockRejectedValue(new Error('File not found'));
    
    const result = await haeKaikkiTyypit();
    
    expect(result).toBeNull();
  });
});
