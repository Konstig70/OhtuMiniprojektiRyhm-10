import { generateCitekey } from '../funkkarit/citekey';

describe('generateCitekey', () => {
    
    test('yksi author pilkulla', () => {
        const arvot = {
            author: "Martin, Robert",
            year: 2008,
        };
        expect(generateCitekey(arvot)).toBe("Martin08");
    })

    test('yksi author ilman pilkkua', () => {
        const arvot = {
            author: "Robert Martin",
            year: 2008,
        };
        expect(generateCitekey(arvot)).toBe("Martin08");
    })

    test('useampi author pilkuilla', () => {
        const arvot = {
            author: "Vihvainen, Arto and Paksula, Matti and Luukkainen, Matti",
            year: 2011,
        };
        expect(generateCitekey(arvot)).toBe("VPL11");
    })

    test('useampi author ilman pilkkuja', () => {
        const arvot = {
            author: "Allan Collins and John Seely Brown and Ann Holum",
            year: 1991,
        };
        expect(generateCitekey(arvot)).toBe("CBH91");
    })
    
    test('ei authoria', () => {
        const arvot = {
            title: "Testi Title Jee",
            year: 1998,
        };
        expect(generateCitekey(arvot)).toBe("TTJ98");
    })

    test('ei julkaisuvuotta', () => {
        const arvot = {
            author: "Kalle Kalastaja"
        };
        expect(generateCitekey(arvot)).toBe("Kalastaja00");
    })
});