import { expect } from '@jest/globals';
import checkRequired from '../funkkarit/checkRequired';

describe('checkRequired', () => {
    
    test('Palautetaan false, jos kyseessä on oletustyyppi', () => {
        expect(checkRequired([], "oletus")).toBe(false)
    })
    
    test('Palautetaan false, jos tyyppi on vääränlainen', () => {
        expect(checkRequired([], "booooook")).toBe(false)
    })

    test('Palautetaan ensimmäisen täyttämättömän pakollisen kentän nimi', () => {
        expect(checkRequired(["", "", "", "", ""], "book")).toMatch(/author/i)
        expect(checkRequired(["Täytetty", "", "", "", ""], "book")).toMatch(/title/i)
    })

    test('Palautetaan true, jos kaikki pakolliset kentät täytetty', () => {
        expect(checkRequired(["testiAuthor", "testiTitle", "testiDOI"], "manual")).toBe(true)
    })

})
