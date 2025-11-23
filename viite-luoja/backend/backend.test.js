import { jest } from '@jest/globals';

//Luodaan mockReadFile funktio joka on jest funktio, tässä idea sama kuin pythonin mock luokassa
const mockReadFile = jest.fn();

//Mock readFile, jotta voidaan estää oikea luku 
jest.unstable_mockModule('fs/promises', () => ({
  default: {
    readFile: mockReadFile,
  }
}));

//Importataan backend
const { haeKaikkiTyypit } = await import('./apu.js');

//Testit haeKaikkiTyypit funktiolle. 
describe('haeKaikkiTyypit', () => {
  //Ennen jokaista tuhotaan kaikki mock oliot 
  afterEach(() => {
    jest.clearAllMocks();
  });


  test('palautetaan JSON muodossa luettu data', async () => {
    const mockData = JSON.stringify({ book: { name: 'Book' } });
    //Nyt siis laitetaan mocReadFile palauttamaan aina mockdata
    mockReadFile.mockResolvedValue(mockData);
    
    //Kutsutaan haeKaikkiTyypit funktiota
    const result = await haeKaikkiTyypit();
    //
    //Tulos sama kuin mockdata ja mockReadFile kutsuttu oikealla parametrilla
    expect(result).toEqual(JSON.parse(mockData));
    expect(mockReadFile).toHaveBeenCalledWith('tiedostot/viitemaarittelyt.json', 'utf8');
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
