# Uporabniške zgodbe – HišniServis

## US-01: Registracija in prijava uporabnika

- **Povezana funkcionalnost:** Registracija in prijava uporabnikov
- **Uporabniška vloga:** Gost, Stanovalec, Izvajalec

**Uporabniška zgodba:**

Kot gost želim ustvariti uporabniški račun in se prijaviti, da lahko uporabljam funkcionalnosti, ki zahtevajo prijavo.

**Kriteriji sprejemljivosti:**

1. Sistem omogoča registracijo z imenom, priimkom, e-poštnim naslovom in geslom.
2. Sistem zavrne registracijo, če je e-poštni naslov že uporabljen.
3. Sistem omogoča prijavo z registriranim e-poštnim naslovom in pravilnim geslom.
4. Pri napačnih prijavnih podatkih sistem prikaže sporočilo o napaki in uporabnika ne prijavi.

## US-02: Objava hišnega popravila

- **Povezana funkcionalnost:** Objavljanje hišnega popravila
- **Uporabniška vloga:** Stanovalec

**Uporabniška zgodba:**

Kot stanovalec želim objaviti hišno popravilo z opisom težave, da lahko pridobim ponudbe izvajalcev.

**Kriteriji sprejemljivosti:**

1. Stanovalec lahko vnese naslov, kategorijo in opis popravila.
2. Sistem zahteva vnos vseh obveznih podatkov pred objavo.
3. Stanovalec lahko objavi tudi fotografijo težave.
4. Po uspešni objavi se popravilo shrani v podatkovno bazo in je prikazano med odprtimi popravili.

## US-03: Pregled in iskanje popravil

- **Povezana funkcionalnost:** Pregled in iskanje objavljenih popravil
- **Uporabniška vloga:** Gost, Izvajalec

**Uporabniška zgodba:**

Kot izvajalec želim iskati objavljena popravila glede na kategorijo in lokacijo, da lahko najdem dela, ki ustrezajo mojim storitvam in območju delovanja.

**Kriteriji sprejemljivosti:**

1. Sistem prikaže seznam objavljenih popravil, ki so na voljo za pridobivanje ponudb.
2. Izvajalec lahko filtrira popravila glede na kategorijo in lokacijo.
3. Rezultati prikazujejo naslov, kategorijo, opis in lokacijo popravila.
4. Če ni ustreznih rezultatov, sistem prikaže obvestilo, da ni najdenih popravil.

## US-04: Oddaja ponudbe

- **Povezana funkcionalnost:** Oddaja ponudbe za popravilo
- **Uporabniška vloga:** Izvajalec

**Uporabniška zgodba:**

Kot izvajalec želim oddati ponudbo za izbrano popravilo, da lahko stanovalcu ponudim izvedbo dela pod določenimi pogoji.

**Kriteriji sprejemljivosti:**

1. Izvajalec lahko za odprto popravilo vnese ceno, opis in predviden čas izvedbe.
2. Sistem ne dovoli oddaje ponudbe brez obveznih podatkov ali z negativno ceno.
3. Po oddaji se ponudba shrani in poveže z izbranim popravilom ter izvajalcem.
4. Sistem prepreči, da bi izvajalec oddal več ponudb za isto popravilo, če je dovoljena samo ena ponudba na izvajalca.

## US-05: Primerjava prejetih ponudb

- **Povezana funkcionalnost:** Pregled in primerjava prejetih ponudb
- **Uporabniška vloga:** Stanovalec

**Uporabniška zgodba:**

Kot stanovalec želim primerjati prejete ponudbe za svoje popravilo, da lahko izberem izvajalca in pogoje, ki mi najbolj ustrezajo.

**Kriteriji sprejemljivosti:**

1. Stanovalec vidi vse ponudbe, oddane za njegovo popravilo.
2. Vsaka ponudba prikazuje ceno, predviden čas izvedbe, opis in podatke o izvajalcu.
3. Stanovalec lahko primerja podatke o različnih ponudbah na enem mestu.
4. Stanovalec ne more pregledovati ponudb za popravila drugih stanovalcev.

## US-06: Izbira ponudbe

- **Povezana funkcionalnost:** Izbira ponudbe
- **Uporabniška vloga:** Stanovalec

**Uporabniška zgodba:**

Kot stanovalec želim izbrati eno izmed prejetih ponudb, da določim izvajalca, ki bo opravil moje popravilo.

**Kriteriji sprejemljivosti:**

1. Stanovalec lahko izbere samo ponudbo, ki je bila oddana za njegovo popravilo.
2. Za posamezno popravilo je lahko izbrana največ ena ponudba.
3. Po izbiri se status izbrane ponudbe spremeni v »Sprejeta«, ostale ponudbe pa se označijo kot zavrnjene oziroma neizbrane.
4. Po izbiri ponudbe sistem prepreči izbiro druge ponudbe za isto popravilo brez ustreznega postopka preklica.

## US-07: Dogovarjanje in spreminjanje terminov

- **Povezana funkcionalnost:** Dogovarjanje in določanje termina izvedbe
- **Uporabniška vloga:** Stanovalec, Izvajalec

**Uporabniška zgodba:**

Kot stanovalec želim predlagati in potrditi termin izvedbe popravila, da se lahko z izbranim izvajalcem dogovorim za ustrezen čas.

**Kriteriji sprejemljivosti:**

1. Stanovalec ali izbrani izvajalec lahko predlaga termin za sprejeto ponudbo.
2. Predlagani termin vsebuje datum in uro ter je shranjen v evidenci terminov.
3. Druga stran lahko termin potrdi ali zavrne.
4. Če se dogovor spremeni, se lahko predlaga nov termin, prejšnji termin pa ostane evidentiran s svojim statusom.

## US-08: Spreminjanje statusa in zaključek popravila

- **Povezana funkcionalnost:** Spreminjanje statusa in potrditev zaključka popravila
- **Uporabniška vloga:** Izvajalec, Stanovalec

**Uporabniška zgodba:**

Kot izvajalec želim označiti popravilo kot zaključeno, da lahko stanovalec preveri izvedeno delo in potrdi njegov zaključek.

**Kriteriji sprejemljivosti:**

1. Izvajalec lahko spreminja status samo pri popravilu, za katerega je bila izbrana njegova ponudba.
2. Izvajalec lahko po izvedbi dela označi popravilo kot »Zaključeno«.
3. Stanovalec lahko potrdi zaključek samo pri svojem popravilu, ki ga je izvajalec označil kot zaključeno.
4. Po potrditvi stanovalca sistem označi popravilo kot dokončno zaključeno in omogoči oddajo ocene.

## US-09: Ocenjevanje izvedenega dela

- **Povezana funkcionalnost:** Ocena izvedenega popravila
- **Uporabniška vloga:** Stanovalec

**Uporabniška zgodba:**

Kot stanovalec želim oceniti izvedeno popravilo, da lahko drugim uporabnikom pomagam pri izbiri zanesljivega izvajalca.

**Kriteriji sprejemljivosti:**

1. Stanovalec lahko oceni samo ponudbo, ki je bila izbrana za njegovo popravilo in je bilo popravilo potrjeno kot zaključeno.
2. Ocena mora biti celo število na lestvici od 1 do 5.
3. Stanovalec lahko oceni posamezno ponudbo največ enkrat.
4. Ocena lahko vsebuje tudi komentar in je shranjena s povezavo na ocenjevano ponudbo.

## US-10: Pregled zgodovine popravil

- **Povezana funkcionalnost:** Pregled zgodovine popravil
- **Uporabniška vloga:** Stanovalec, Izvajalec

**Uporabniška zgodba:**

Kot stanovalec želim pregledati zgodovino svojih popravil, da lahko preverim pretekla dela in njihove statuse.

**Kriteriji sprejemljivosti:**

1. Stanovalec vidi seznam popravil, ki jih je sam objavil.
2. Seznam prikazuje naslov popravila, datum objave in trenutni status.
3. Izvajalec vidi seznam popravil, za katera je bila izbrana njegova ponudba.
4. Uporabnik ne more pregledovati zasebne zgodovine popravil drugih uporabnikov.

## US-11: Spremljanje statusa popravila

- **Povezana funkcionalnost:** Spremljanje statusa popravila
- **Uporabniška vloga:** Stanovalec, Izvajalec

**Uporabniška zgodba:**

Kot stanovalec želim spremljati trenutni status svojega popravila, da vem, v kateri fazi je postopek izvedbe.

**Kriteriji sprejemljivosti:**

1. Sistem prikazuje status popravila, na primer »Objavljeno«, »Ponudbe prejete«, »Ponudba sprejeta«, »V izvedbi« ali »Zaključeno«.
2. Status se posodobi po izvedbi ustreznega dejanja v postopku.
3. Stanovalec in izbrani izvajalec lahko pregledata status povezanega popravila.
4. Uporabnik ne more samovoljno spreminjati statusa popravila, za katerega nima ustreznih pravic.

## US-12: Komunikacija med stanovalcem in izvajalcem

- **Povezana funkcionalnost:** Komunikacija med stanovalcem in izvajalcem
- **Uporabniška vloga:** Stanovalec, Izvajalec

**Uporabniška zgodba:**

Kot stanovalec želim komunicirati z izbranim izvajalcem, da lahko razjasnim podrobnosti popravila in se dogovorim za izvedbo.

**Kriteriji sprejemljivosti:**

1. Stanovalec in izvajalec lahko komunicirata glede popravila, za katero je bila izbrana ponudba izvajalca.
2. Sporočilo vsebuje besedilo, pošiljatelja in datum pošiljanja.
3. Poslano sporočilo se shrani in je vidno obema udeležencema pogovora.
4. Drugi uporabniki, ki niso udeleženi v pogovoru, nimajo dostopa do njegovih sporočil.

## US-13: Profil izvajalca

- **Povezana funkcionalnost:** Profil izvajalca
- **Uporabniška vloga:** Gost, Stanovalec

**Uporabniška zgodba:**

Kot stanovalec želim pregledati profil izvajalca, da lahko pred izbiro ponudbe preverim njegove storitve in specializacijo.

**Kriteriji sprejemljivosti:**

1. Sistem prikazuje ime izvajalca, specializacijo in opis njegovih storitev.
2. Profil prikazuje kontaktne podatke, ki jih je izvajalec dovolil objaviti.
3. Gost in prijavljeni stanovalec lahko pregledata javno dostopne profile izvajalcev.
4. Osebne podatke, ki niso namenjeni javni objavi, sistem skrije.

## US-14: Pregled ocen izvajalcev

- **Povezana funkcionalnost:** Pregled ocen izvajalcev
- **Uporabniška vloga:** Gost, Stanovalec

**Uporabniška zgodba:**

Kot stanovalec želim pregledati ocene izvajalca, da lahko pred izbiro ponudbe ocenim kakovost njegovega preteklega dela.

**Kriteriji sprejemljivosti:**

1. Sistem prikazuje ocene, povezane s ponudbami izbranega izvajalca.
2. Posamezna ocena prikazuje število zvezdic, komentar in datum oddaje.
3. Sistem prikazuje povprečno oceno izvajalca na podlagi njegovih objavljenih ocen.
4. Sistem pri izračunu povprečja upošteva samo veljavne ocene zaključenih popravil.

## US-15: Moderiranje in preverjanje uporabnikov

- **Povezana funkcionalnost:** Moderiranje vsebin in preverjanje izvajalcev
- **Uporabniška vloga:** Administrator

**Uporabniška zgodba:**

Kot administrator želim preverjati izvajalce in moderirati neprimerne vsebine, da zagotovim bolj zaupanja vredno in varno uporabo platforme.

**Kriteriji sprejemljivosti:**

1. Administrator lahko pregleda seznam registriranih izvajalcev in njihove podatke.
2. Administrator lahko izvajalca potrdi ali zavrne ter se njegov status ustrezno posodobi.
3. Administrator lahko pregleda prijavljene ali neprimerne objave in ocene ter odstrani vsebine, ki kršijo pravila platforme.
4. Sistem omogoča moderiranje samo uporabnikom z administratorskimi pravicami.

---
