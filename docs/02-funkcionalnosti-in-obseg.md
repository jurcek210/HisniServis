# Funkcionalnosti in obseg – HišniServis

## Uporabniške vloge

### 1. Gost

Gost je neprijavljen obiskovalec spletne strani.

**Lahko:**
- pregleda javno dostopna popravila,
- pregleda izvajalce,
- pregleda ocene izvajalcev.

**Nima pravice:**
- objaviti popravila,
- oddati ponudbe,
- izbrati ponudbe,
- spreminjati podatkov v aplikaciji.

### 2. Stanovalec

Stanovalec je uporabnik, ki potrebuje izvedbo hišnega popravila.

**Lahko:**
- objavi novo popravilo,
- opiše težavo in doda fotografije,
- pregleda prejete ponudbe,
- primerja ponudbe glede na ceno in podatke o izvajalcu,
- izbere eno izmed prejetih ponudb,
- spremlja status svojega popravila,
- potrdi zaključeno popravilo,
- oceni izvedeno delo.

**Nima pravice:**
- oddajati ponudb za druga popravila,
- spreminjati ponudb drugih uporabnikov,
- spreminjati tujih popravil,
- upravljati izvajalcev.

### 3. Izvajalec

Izvajalec je posameznik, ki opravlja različna servisna in vzdrževalna dela.

**Lahko:**
- pregleda objavljena popravila,
- poišče popravila glede na vrsto dela in lokacijo,
- odda ponudbo za izbrano popravilo,
- določi ceno in predviden čas izvedbe,
- spremlja svoje oddane ponudbe,
- sprejme izbrano delo,
- spreminja status svojega dela,
- pregleda zgodovino svojih opravljenih del in ocene.

**Nima pravice:**
- spreminjati ponudb drugih izvajalcev,
- spreminjati tujih popravil,
- potrditi popravila namesto stanovalca,
- upravljati druge izvajalce.

### 4. Administrator

Administrator skrbi za upravljanje in moderiranje platforme.

**Lahko:**
- upravlja registrirane uporabnike,
- preverja in potrjuje izvajalce,
- pregleduje objavljena popravila,
- moderira objave, komentarje in ocene,
- odstrani neprimerne vsebine,
- upravlja osnovne podatke uporabnikov in izvajalcev.

**Nima pravice:**
- oddajati ponudb v imenu izvajalcev,
- izbirati ponudbe namesto stanovalca,
- spreminjati vsebine ponudb izvajalcev brez razloga,
- potrditi izvedbe popravila namesto stanovalca.

---

## Predvidene funkcionalnosti

### 1. Objavljanje hišnega popravila – **MVP**

Stanovalec lahko objavi novo popravilo. Pri tem vnese naslov oziroma lokacijo, opis težave, kategorijo popravila in po potrebi doda fotografije.

### 2. Pregled in iskanje objavljenih popravil – **MVP**

Izvajalci lahko pregledajo odprta popravila ter jih filtrirajo glede na kategorijo, lokacijo in druge osnovne podatke.

### 3. Oddaja ponudbe za popravilo – **MVP**

Izvajalec lahko za objavljeno popravilo odda ponudbo. Ponudba vsebuje ceno, predviden čas izvedbe in morebiten opis dela.

### 4. Pregled in primerjava prejetih ponudb – **MVP**

Stanovalec lahko za svoje popravilo pregleda prejete ponudbe ter primerja njihove cene, predvidene čase izvedbe in podatke o izvajalcih.

### 5. Izbira ponudbe – **MVP**

Stanovalec izbere eno izmed prejetih ponudb. Po izbiri izbrani izvajalec prevzame delo.

### 6. Spreminjanje statusa in potrditev zaključka popravila – **MVP**

Izvajalec lahko po izvedbi spremeni status popravila v »Zaključeno«. Stanovalec nato potrdi, da je bilo popravilo uspešno izvedeno.

### 7. Dogovarjanje in določanje termina izvedbe

Po izbiri ponudbe se lahko izvajalec in stanovalec dogovorita za termin izvedbe popravila.

### 8. Ocena izvedenega popravila

Po potrditvi zaključka lahko stanovalec oceni izvedeno delo in izvajalca.

### 9. Pregled zgodovine popravil

Stanovalec lahko pregleda svoja pretekla popravila, izvajalec pa svoja opravljena dela.

### 10. Spremljanje statusa popravila

Stanovalec in izvajalec lahko spremljata trenutno stanje popravila, na primer »Objavljeno«, »Ponudbe prejete«, »Ponudba sprejeta«, »V izvedbi« in »Zaključeno«.

### 11. Komunikacija med stanovalcem in izvajalcem

Stanovalec in izbrani izvajalec lahko komunicirata glede podrobnosti popravila, izvedbe in termina.

### 12. Profil izvajalca

Uporabniki lahko pregledajo osnovne informacije o izvajalcu, njegove specializacije in opis storitev.

### 13. Pregled ocen izvajalcev

Stanovalec lahko pred izbiro ponudbe pregleda pretekle ocene izvajalca.

### 14. Moderiranje vsebin

Administrator lahko pregleda in odstrani neprimerne objave, komentarje in ocene ter preverja izvajalce.

---

## Ključne funkcionalnosti prve različice (MVP)

Prva delujoča različica bo vsebovala naslednje ključne funkcionalnosti:

1. **MVP – Objavljanje hišnega popravila**
2. **MVP – Pregled in iskanje objavljenih popravil**
3. **MVP – Oddaja ponudbe za popravilo**
4. **MVP – Pregled in primerjava prejetih ponudb**
5. **MVP – Izbira ponudbe**
6. **MVP – Spreminjanje statusa in potrditev zaključka popravila**

Te funkcionalnosti omogočajo izvedbo osnovnega poslovnega procesa aplikacije od objave težave do zaključka popravila. Domensko specifični deli MVP so predvsem objava popravila, oddaja ponudb, primerjava ponudb, izbira ponudbe ter potrjevanje zaključka popravila.

---

## Kasnejše nadgradnje

V kasnejših različicah bi bilo mogoče dodati:

- **Samodejno priporočanje izvajalcev** glede na vrsto popravila, lokacijo in ocene.
- **Sistem obvestil** za nova popravila, prejete ponudbe, spremembe statusov in prihajajoče termine.
- **Zemljevid popravil in območij delovanja**, ki bi izvajalcem omogočil lažje iskanje del v njihovi bližini.
- **Naprednejši sistem ocen**, ki bi omogočal podrobnejše ocenjevanje kakovosti izvedenega dela.
- **mobilne aplikacije**,ki bi omogočala uporabo aplikacije preko telefona.


---

## Out of scope


- spletnega plačevanja in obdelave bančnih transakcij,
- naprednega sistema preverjanja identitete izvajalcev,
- avtomatskega izračuna cene popravila,
- videoklicev med stanovalcem in izvajalcem,
- povezovanja z zunanjimi računovodskimi sistemi.