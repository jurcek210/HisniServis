# Izbira JWT za avtentikacijo uporabnikov

## Kontekst in opredelitev problema

HišniServis omogoča različne funkcionalnosti glede na uporabniško vlogo. Stanovalci lahko objavljajo popravila in izbirajo ponudbe, izvajalci pa oddajajo ponudbe. Administrator ima dodatne pravice za upravljanje in moderiranje platforme. Aplikacija zato potrebuje mehanizem za preverjanje identitete uporabnika in nadzor dostopa do zaščitenih funkcionalnosti.

## Obravnavane možnosti

* Avtentikacija z žetoni JWT.
* Avtentikacija s strežniškimi sejami.
* Uporaba zunanjega ponudnika avtentikacije.

## Izid odločitve

Izbrana možnost: »JWT«, ker omogoča, da backend po uspešni prijavi izda podpisan žeton, ki ga odjemalec pošilja ob dostopu do zaščitenih API-poti. Backend lahko preveri veljavnost žetona in na podlagi preverjene identitete ter uporabniške vloge odloči, ali je dostop dovoljen.

### Posledice

* Dobro, ker lahko backend preverja identiteto uporabnika pri zahtevkih do zaščitenih API-poti.
* Dobro, ker je mogoče preverjanje pristnosti ločiti od poslovne logike posameznih API-poti.
* Dobro, ker lahko sistem na podlagi preverjene identitete in uporabniške vloge omeji dostop do funkcionalnosti.
* Slabo, ker je treba varno upravljati skrivni ključ za podpisovanje žetonov.
* Slabo, ker je treba določiti ustrezen čas veljavnosti žetonov in strategijo za njihovo obnovitev ali preklic.
* Slabo, ker je treba skrbno izbrati način shranjevanja in pošiljanja žetonov ter zaščititi aplikacijo pred napadi, kot sta XSS in CSRF, kjer sta relevantna.

