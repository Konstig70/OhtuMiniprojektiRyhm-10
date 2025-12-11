export function generateCitekey(arvot) {

    // alustetaan citekeyn "alku" ja "loppu" osa
    let alku = null;

    // alku osa authorista jos mahdollista
    if (arvot.author) {
        alku = alkuAuthorista(arvot.author);
    } else { // muuten titlestä (ainut kaikille pakollinen kenttä)
        alku = alkuTitlesta(arvot.title);
    }

    let loppu = null;
 
    // loppu osa julkaisuvuodesta
    // jos ei julkaisuvuotta niin default "00"
    // ^ voisi olla myös tyhjä
    if (arvot.year) {
        loppu = String(arvot.year).slice(-2);
    } else loppu = "00";

    let citekey = alku + loppu;
    return citekey;
}

function alkuAuthorista(author) {
    // erotellaan authorit
    let authors = author.split(" and ").map(a => a.trim());

    // jos vain yksi author niin otetaan sukunimi sellaisenaan
    if (authors.length === 1) {
        return getLastname(authors[0]);
    }

    // jos useampi author niin otetaan jokaisen sukunimen eka kirjain
    return authors
        .map(a => getLastname(a)[0].toUpperCase())
        .join("");
}

// erottaa authorin sukunimen "," tai " " kohdalta
// oletuksena input järjestys sukunimi etunimi jos pilkku
// etunimi sukunimi jos ei pilkkua (otettu ohtu sivun mallista)
function getLastname(author) {
    if (author.includes(",")) {
        return author.split(",")[0].trim();
    }
    let osat = author.split(/\s+/);
    return osat[osat.length - 1];
}

// luo alkuosan titlen jokaisen sanan alkukirjaimista
function alkuTitlesta(title) {
    let lyhenne = title
        .split(/\s+/)
        .map(sana => sana[0].toUpperCase())
        .join("");

    return lyhenne;
}

export function ensureUniqueCitekey(start, viitteet) {
    const varatut = new Set(viitteet.map(viite => viite.citekey));

    if (!varatut.has(start)) return start;

    let counter = 1;
    let key = `${start}_${counter}`;

    while (varatut.has(key)) {
        counter++;
        key = `${start}_${counter}`;
    }
    return key;
}