
import {jest} from '@jest/globals'
import { muokkaaViite } from '../funkkarit/muokkaus.js';

jest.mock('../funkkarit/citekey.js', () => ({
    generateCitekey: jest.fn().mockReturnValue("key1"),
    ensureUniqueCitekey: jest.fn()
}));

describe("muokkaaViite", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    const viitteet = [{"citekey": "abc", "type": "article", "author": "Martti"}];
    const data = [{"citekey": "abc", "type": "article", "author": "Martti"}];
    const setViitteet = jest.fn();
    const setData = jest.fn();


  test("lisätään muokattu viite esikatseluun ja dataan", () => {
    let uusiViite = {"citekey": "abc", "type": "article", "author": "Mikko"};
    let muokattava = {"citekey": "abc", "type": "article", "author": "Martti"};
    
    muokkaaViite(
      true,
      setViitteet,
      viitteet,
      () => null,
      muokattava,
      setData,
      data,
      uusiViite,
      true
    );

    expect(setViitteet).toHaveBeenCalledWith([{"citekey": "abc", "type": "article", "author": "Mikko"}]);
    expect(setData).toHaveBeenCalledWith([{"citekey": "abc", "type": "article", "author": "Mikko"}]);
  });

  test("lisätään uusi viite esikatseluun ja tallennettuihin", () => {
    let uusi = {"title": "abc", "author": "Menninkäinen", "type": "book"};

    muokkaaViite(
        true,
        setViitteet,
        viitteet,
        () => null,
        {},
        setData,
        data,
        uusi,
        true
    );
    expect(setViitteet).toHaveBeenCalled();
    expect(setData).toHaveBeenCalled();

  });

  test("lisätään uusi viite vain tallennettuihin", () => {
    let uusi = {"title": "abc", "author": "Menninkäinen", "type": "book"};

    muokkaaViite(
        false,
        setViitteet,
        viitteet,
        () => null,
        {},
        setData,
        data,
        uusi,
        true
    );
    expect(setData).toHaveBeenCalledTimes(1);
    expect(setViitteet).not.toHaveBeenCalled();
  });
});