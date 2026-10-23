# Izbira MongoDB in Mongoose za shranjevanje podatkov

## Kontekst in opredelitev problema

HišniServis mora shranjevati podatke o uporabnikih, izvajalcih, popravilih, ponudbah in ocenah. Izbrati je treba podatkovno bazo ter način dostopa do nje, ki omogočata učinkovito shranjevanje, pridobivanje in preverjanje podatkov ter integracijo z zalednim delom aplikacije.

## Obravnavane možnosti

* MongoDB z uporabo knjižnice Mongoose.
* PostgreSQL z uporabo knjižnice za povezavo z bazo.
* MySQL z uporabo knjižnice za povezavo z bazo.

## Izid odločitve

Izbrana možnost: »MongoDB z Mongoose«, ker MongoDB shranjuje podatke v obliki dokumentov, Mongoose pa omogoča definiranje podatkovnih modelov, preverjanje podatkov in lažje upravljanje dokumentov iz aplikacije Node.js.

### Posledice

* Dobro, ker dokumentni model MongoDB omogoča prilagodljivo strukturo podatkov.
* Dobro, ker se MongoDB dobro povezuje z Node.js.
* Dobro, ker Mongoose omogoča določanje shem, modelov in validacijskih pravil.
* Dobro, ker lahko z uporabo modelov poenotimo način dostopa do podatkov v aplikaciji.
* Slabo, ker je treba skrbno načrtovati povezave med uporabniki, popravili, ponudbami in ocenami.
* Slabo, ker lahko neustrezna struktura dokumentov povzroči podvajanje podatkov ali zahtevnejše poizvedbe.
* Slabo, ker je treba poleg validacije v Mongoose ustrezno preverjati tudi podatke na drugih mejah aplikacije.