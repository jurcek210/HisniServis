# Izbira tehnologij za backend: Node.js in Express

## Kontekst in opredelitev problema

HišniServis potrebuje zaledni del aplikacije, ki obdeluje zahteve uporabnikov, izvaja poslovno logiko, upravlja popravila in ponudbe ter komunicira s podatkovno bazo. Backend mora omogočati izdelavo REST API-ja in preverjanje pravic uporabnikov glede na njihove vloge.

## Obravnavane možnosti

* Node.js z ogrodjem Express.
* Python z ogrodjem FastAPI.
* Java z ogrodjem Spring Boot.

## Izid odločitve

Izbrana možnost: »Node.js in Express«, ker omogočata izdelavo REST API-ja in uporabo JavaScripta tudi na strežniški strani. Express poenostavi določanje poti, obdelavo zahtevkov in organizacijo strežniške logike.

### Posledice

* Dobro, ker lahko frontend in backend uporabljata JavaScript.
* Dobro, ker Express omogoča preprosto določanje API-poti in obdelavo HTTP-zahtevkov.
* Dobro, ker je mogoče poslovno logiko, avtentikacijo in dostop do podatkovne baze organizirati v ločene module.
* Slabo, ker je treba ustrezno načrtovati strukturo projekta in ravnanje z napakami.
* Slabo, ker je treba samostojno poskrbeti za varnostne mehanizme, preverjanje vhodnih podatkov in nadzor dostopa.
* Slabo, ker lahko neustrezno upravljanje asinhronih operacij povzroči napake pri obdelavi zahtevkov.