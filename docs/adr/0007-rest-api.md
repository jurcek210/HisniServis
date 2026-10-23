# Izbira REST API-ja za komunikacijo med frontendom in backendom

## Kontekst in opredelitev problema

HišniServis uporablja ločen frontend, izdelan z Reactom in Vite, ter backend, izdelan z Node.js in Express. Frontend mora zalednemu delu pošiljati zahteve za pridobivanje in spreminjanje podatkov o uporabnikih, popravilih in ponudbah. Zato je treba določiti način komunikacije med obema deloma aplikacije ter organizacijo API-poti.

## Obravnavane možnosti

* REST API prek protokola HTTP.
* GraphQL API.
* Neposredna komunikacija med frontendom in podatkovno bazo.

## Izid odločitve

Izbrana možnost: »REST API prek HTTP«, ker omogoča jasno določene končne točke za posamezne vire in operacije. Backend bo prek API-poti sprejemal zahteve frontenda, preverjal vhodne podatke in uporabniške pravice, izvajal poslovno logiko ter vračal odgovore v obliki JSON.

API-poti bodo organizirane glede na vire aplikacije, na primer uporabnike, popravila in ponudbe. Za operacije se bodo uporabljale ustrezne metode HTTP, kot so GET za pridobivanje podatkov, POST za ustvarjanje, PATCH za delno spreminjanje in DELETE za brisanje.

### Posledice

* Dobro, ker sta frontend in backend povezana prek jasno določenega vmesnika.
* Dobro, ker so API-poti organizirane glede na vire aplikacije in jih je lažje vzdrževati.
* Dobro, ker lahko backend centralno izvaja preverjanje podatkov, avtentikacijo in nadzor dostopa.
* Dobro, ker JSON omogoča preprosto izmenjavo podatkov med Reactom in Expressom.
* Slabo, ker je treba načrtovati, implementirati in dokumentirati API-poti.
* Slabo, ker je treba uskladiti strukturo zahtevkov in odgovorov med frontendom in backendom.
* Slabo, ker lahko spremembe API-ja zahtevajo prilagoditve na obeh straneh aplikacije.