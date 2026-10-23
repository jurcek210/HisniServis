# Izbira bcrypt za varno shranjevanje gesel

## Kontekst in opredelitev problema

Uporabniki aplikacije HišniServis se bodo registrirali z uporabniškimi računi. Gesel ne smemo shranjevati v izvirni, berljivi obliki, saj bi njihovo razkritje ob morebitnem nepooblaščenem dostopu do podatkovne baze ogrozilo uporabnike. Zato je treba izbrati ustrezen način za varno shranjevanje in preverjanje gesel.

## Obravnavane možnosti

* Uporaba algoritma bcrypt za zgoščevanje gesel.
* Uporaba algoritma Argon2id za zgoščevanje gesel.
* Shranjevanje gesel v izvirni obliki brez zgoščevanja.

## Izid odločitve

Izbrana možnost: »bcrypt«, ker je namenjen zgoščevanju gesel in podpira uporabo naključne soli ter nastavljivo računsko zahtevnost. Ob registraciji se bo shranil rezultat zgoščevanja, ob prijavi pa se bo vneseno geslo preverilo s shranjenim zgoščevanjem.

### Posledice

* Dobro, ker se gesla v podatkovni bazi ne shranjujejo v izvirni obliki.
* Dobro, ker uporaba soli otežuje uporabo vnaprej pripravljenih tabel za ugotavljanje gesel.
* Dobro, ker je mogoče prilagoditi računsko zahtevnost zgoščevanja.
* Slabo, ker je treba ustrezno izbrati računsko zahtevnost, da je preverjanje gesel dovolj varno in še vedno učinkovito.
* Slabo, ker je treba preprečiti uhajanje gesel in rezultatov zgoščevanja v dnevnike ali odgovore API-ja.
* Slabo, ker bcrypt sam po sebi ne zagotavlja varnosti celotnega postopka prijave; potrebni so tudi varna komunikacija, omejevanje poskusov prijave in ustrezno upravljanje sej oziroma žetonov.