# Izbira npm za upravljanje paketov

## Kontekst in opredelitev problema

Projekt HišniServis uporablja več zunanjih knjižnic in orodij, med drugim React, Vite, Express in Mongoose. Za namestitev odvisnosti, izvajanje razvojnih ukazov in upravljanje različic paketov je potreben paketni upravljalnik.

## Obravnavane možnosti

* npm.
* Yarn.
* pnpm.

## Izid odločitve

Izbrana možnost: »npm«, ker je običajno priložen namestitvi Node.js, podpira upravljanje paketov in skript ter omogoča shranjevanje seznama odvisnosti in njihovih različic v datoteki `package.json`. Za beleženje natančnejših različic odvisnosti se bo uporabljala tudi datoteka `package-lock.json`.

### Posledice

* Dobro, ker je npm neposredno povezan z okoljem Node.js.
* Dobro, ker omogoča namestitev, posodabljanje in odstranjevanje paketov.
* Dobro, ker lahko razvojne ukaze, kot sta zagon aplikacije in izvajanje testov, določimo v `package.json`.
* Dobro, ker `package-lock.json` pomaga ohranjati ponovljive namestitve odvisnosti.
* Slabo, ker je treba redno preverjati in posodabljati projektne odvisnosti.
* Slabo, ker lahko nezdružljive različice paketov povzročijo težave pri namestitvi ali izvajanju aplikacije.