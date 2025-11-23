**HUOM!**  
_Citekey_ on viitteen yksilöivä tunnus.  
Se saa sisältää kirjaimia ja numeroita, mutta erikoismerkeistä vain seuraavat: "-", "_", ja ":"  
Citekeyn pituutta ei ole rajoitettu.  
Citekey voidaan muodostaa automaattisesti ensimmäisen tekijän sukunimestä ja julkaisuvuodesta (kunhan se on ainutlaatuinen).  
    
**book.json**  
Laitoin vuosiluvun myös lainausmerkkeihin, käsitellään kaikki merkkijonoina (BibTexin kannata ei merkitystä).    
type: viitteen tyyppi, esim. book  
citekey: vitteen yksilöivä avain johon viitataan latexissa  
  
**book.bib**  
Edellinen BibTeX-muodossa  

**ehkä huomioitavaa?**  
BibTeXissä kenttä voi olla "Kurt G{\"o}del" -> "Kurt Gödel", mutta projektin esimerkissä latexille oli määritelty merkistöksi utf-8, joten ei tarvinne tehdä mitään.  

**BibTeX-linkkejä**  
virallinen sivusto: https://www.ctan.org/pkg/bibtex  
https://en.wikipedia.org/wiki/BibTeX  
https://www.bibtex.com/