# Arhitektura in tehnološki sklad – HišniServis

## Arhitektura

HišniServis bo zasnovan kot spletna aplikacija, sestavljena iz treh glavnih delov:

- **frontend** – uporabniški vmesnik,
- **backend** – poslovna logika in REST API,
- **podatkovna baza** – shranjevanje podatkov aplikacije.

### Glavni deli sistema

**Frontend** bo izdelan z uporabo Reacta in Vite. Omogočal bo uporabo funkcionalnosti aplikacije glede na uporabniško vlogo.

**Backend** bo izdelan z Node.js in Express. Skrbel bo za REST API, poslovno logiko, preverjanje pravic uporabnikov in komunikacijo s podatkovno bazo.

**Podatkovna baza** bo MongoDB, v kateri bodo shranjeni podatki o stanovalcih, izvajalcih, popravilih, ponudbah in ocenah.

### Komunikacija med deli sistema

Frontend bo z backendom komuniciral preko HTTP zahtevkov in REST API-ja. Backend bo obdelal zahtevek in po potrebi podatke prebral ali shranil v MongoDB.

```text
Uporabnik
   │
   ▼
React + Vite
   │
   │ HTTP / REST API
   ▼
Node.js + Express
   │
   ▼
MongoDB
```


### Podatkovna baza

Za podatkovno bazo bo uporabljen MongoDB, ki je NoSQL dokumentna podatkovna baza. Podatki bodo organizirani v kolekcije in shranjeni v obliki dokumentov.

Za rešitev je izbrana NoSQL baza, ker omogoča bolj prilagodljivo strukturo podatkov in je primerna za aplikacije. MongoDB omogoča tudi enostavno shranjevanje podatkov v obliki dokumentov, kar je primerno za podatke o popravilih, ponudbah in ocenah.

Za povezovanje backenda z MongoDB bo uporabljena knjižnica **Mongoose**, ki omogoča definiranje modelov, preverjanje strukture podatkov in lažje delo s podatkovno bazo.
### Avtentikacija in upravljanje uporabnikov

Uporabnik se bo prijavil z e-poštnim naslovom in geslom. Geslo bo pred shranjevanjem zgoščeno z uporabo bcrypt.

Za avtentikacijo bo uporabljen JWT. Backend bo na podlagi uporabniške vloge določil, katere funkcionalnosti lahko uporabnik uporablja.

Aplikacija bo podpirala naslednje vloge:

- **Gost**
- **Stanovalec**
- **Izvajalec**
- **Administrator**

Gost lahko uporablja javno dostopne funkcionalnosti brez prijave. Stanovalec in izvajalec se morata za uporabo svojih funkcionalnosti prijaviti. Administrator uporablja posebne pravice za upravljanje in moderiranje aplikacije.

### Lokalni zagon

Za lokalni razvoj bo potreben Node.js in npm. Frontend in backend bosta ločena projekta, MongoDB pa bo mogoče uporabljati lokalno ali preko MongoDB Atlas.

Primer strukture:

```text
hisni-servis/
├── frontend/
├── backend/
└── README.md
```

---

## Tehnološki sklad

## Tehnološki sklad

| Področje | Tehnologija |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Podatkovna baza | MongoDB (NoSQL) |
| Dostop do baze | Mongoose |
| Avtentikacija | JWT |
| Varnost gesel | bcrypt |
| Paketni upravljalnik | npm |
| Lokalni razvoj | Visual Studio Code |

---

## Arhitekturne odločitve

### React + Vite

React je izbran za izdelavo uporabniškega vmesnika, Vite pa za hitro in enostavno razvojno okolje.

### Node.js + Express

Node.js in Express sta izbrana za izdelavo backenda in REST API-ja. Prednost je tudi uporaba JavaScripta na frontend in backend strani.

### MongoDB

MongoDB je izbran zaradi enostavne integracije z Node.js in dokumentnega načina shranjevanja podatkov.

### Mongoose

Mongoose je izbran za lažje povezovanje z MongoDB ter definiranje strukture podatkov.

### REST API

REST API omogoča ločitev uporabniškega vmesnika od poslovne logike in podatkovne baze.

### JWT in bcrypt

JWT je izbran za avtentikacijo uporabnikov, bcrypt pa za varno zgoščevanje gesel.