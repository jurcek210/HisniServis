# HišniServis – navodila za lokalni zagon

Ta navodila so namenjena vsem, ki projekt **HišniServis** prenesejo oziroma forkajo z GitHuba in ga želijo zagnati na svojem računalniku.

Aplikacijo sestavljajo:
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Podatkovna baza:** MongoDB (lokalno v Dockerju ali v oblaku prek MongoDB Atlas)

> **Pomembno:** `docker-compose.yml` zažene **samo MongoDB**, ne pa celotne aplikacije. Frontend in backend se zaženeta ločeno z Node.js.

## 1. Potrebna programska oprema

Pred začetkom namestite:

| Orodje | Namen | Povezava |
|---|---|---|
| **Git** | Kloniranje repozitorija | https://git-scm.com/downloads |
| **Node.js (LTS) + npm** | Zagon frontenda in backenda | https://nodejs.org/ |
| **Docker Desktop** | Zagon lokalnega MongoDB | https://www.docker.com/products/docker-desktop/ |
| **MongoDB Compass** (neobvezno) | Grafični pregled podatkovne baze | https://www.mongodb.com/try/download/compass |

Na Windows preverite, da je Docker Desktop odprt in da **Docker Engine deluje**. Docker Desktop lahko zahteva WSL 2.

Preverjanje namestitve v terminalu:

```bash
node --version
npm --version
git --version
docker --version
docker compose version
```

## 2. Prenos projekta z GitHuba

Če želite projekt najprej forkati, na GitHubu kliknite **Fork**, nato klonirajte svoj fork:

```bash
git clone https://github.com/VAŠ-UPORABNIK/HišniServis.git
cd HišniServis
```

Namesto `VAŠ-UPORABNIK` uporabite svoje GitHub uporabniško ime. Lahko tudi neposredno klonirate izvirni repozitorij.

Pričakovana osnovna struktura:

```text
HišniServis/
├── backend/
├── frontend/
└── docker-compose.yml
```

## 3. Nastavitev spremenljivk okolja (`backend/.env`)

V mapi `backend` ustvarite datoteko z imenom **`.env`** (ne `.env.txt`). Vanjo vnesite:

```dotenv
PORT=5000
JWT_SECRET=ZAMENJAJ_Z_DOLGIM_NAKLJUCNIM_SKRIVNIM_KLJUCEM
DB_MODE=local
MONGO_URI_LOCAL=mongodb://127.0.0.1:27017/hisniservis
```

Pomen nastavitev:
- `PORT`: vrata Express strežnika.
- `JWT_SECRET`: skrivni ključ za podpisovanje JWT žetonov. **Vsak razvijalec naj uporabi svoj dolg, naključno ustvarjen ključ.**
- `DB_MODE=local`: uporabi lokalno MongoDB.
- `MONGO_URI_LOCAL`: povezava do lokalne baze `hisniservis`.

Če želite podpirati tudi MongoDB Atlas, dodatno nastavite:

```dotenv
MONGO_URI_ATLAS=mongodb+srv://UPORABNIK:GESLO@GRUCA.mongodb.net/hisniservis
```

Zgornji Atlas URI je **samo primer oblike**; uporabite povezavo iz svojega Atlas projekta. Za preklop nastavite `DB_MODE=atlas` in znova zaženite backend. Za lokalni zagon Atlas račun **ni potreben**.

**Nikoli ne objavite prave datoteke `.env` na GitHubu.** V `.gitignore` naj bodo vsaj:

```gitignore
node_modules/
.env
.env.*
!.env.example
```

Priporočljivo je, da avtor repozitorija doda še datoteko `backend/.env.example` z zgornjimi imeni spremenljivk, vendar brez dejanskih gesel oziroma skrivnosti.

## 4. Zagon lokalne baze MongoDB (Docker)

Preverite, ali je Docker Desktop zagnan. V **korenski mapi projekta**, v kateri je `docker-compose.yml`, izvedite:

```bash
docker compose up -d
```

Preverite, ali vsebnik deluje:

```bash
docker ps
```

Pričakovano ime vsebnika je `hisniservis-mongodb` (če je tako določeno v `docker-compose.yml`), MongoDB pa posluša na `127.0.0.1:27017`.

> Če se pojavi napaka `dockerDesktopLinuxEngine` oziroma `failed to connect to the docker API`, najprej zaženite Docker Desktop in preverite, ali Docker Engine deluje.

Po želji preverite povezavo v **MongoDB Compass** z naslovom:

```text
mongodb://127.0.0.1:27017
```

Baza `hisniservis` se lahko pojavi šele, ko aplikacija vanjo prvič zapiše podatke.

## 5. Namestitev odvisnosti in zagon backenda

Odprite terminal v mapi projekta:

```bash
cd backend
npm install
npm run dev
```

Pri uspešnem zagonu pričakujte približno:

```text
Lokalna MongoDB povezana!
Server deluje na http://localhost:5000
```

API preverite na naslovu:

http://localhost:5000/api/health

Pričakovan odgovor:

```json
{
  "message": "HišniServis API deluje!",
  "database": "Povezana",
  "databaseMode": "local"
}
```

> Ukaz `npm run dev` predpostavlja, da je v `backend/package.json` definiran skript `dev` (npr. z `nodemon`). Če skript ni prisoten, preverite razdelek `scripts` v tej datoteki.

## 6. Namestitev odvisnosti in zagon frontenda

Odprite **nov terminal** (backend naj ostane zagnan), nato iz korenske mape projekta izvedite:

```bash
cd frontend
npm install
npm run dev
```

Aplikacijo odprite v brskalniku:

http://localhost:5173

Frontend je v trenutni konfiguraciji povezan z backendom na `http://localhost:5000`.

## 7. Preizkus delovanja

1. Odprite `http://localhost:5173`.
2. Registrirajte novega testnega uporabnika.
3. Odprite MongoDB Compass in se povežite na `mongodb://127.0.0.1:27017`.
4. V bazi `hisniservis` preverite, ali je bil uporabnik shranjen v ustrezno zbirko.
5. Po želji preizkusite še prijavo in objavo popravila.

**Opomba:** Lokalna baza in MongoDB Atlas sta ločeni. Podatki se med njima ne prenašajo oziroma sinhronizirajo samodejno.

## 8. Ustavitev in ponovni zagon

Za ustavitev frontenda ali backenda v posameznem terminalu pritisnite `Ctrl + C`.

Za ustavitev in odstranitev MongoDB vsebnika (podatki v Docker volumnu ostanejo):

```bash
docker compose down
```

Za ponovni zagon lokalne baze:

```bash
docker compose up -d
```

**Ne uporabljajte `docker compose down -v`, če želite ohraniti podatke**, saj ta ukaz odstrani tudi pripadajoče volumne.

## 9. Pogoste težave

| Težava | Možna rešitev |
|---|---|
| Docker se ne poveže | Zaženite Docker Desktop in preverite Docker Engine. |
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB vsebnik ni zagnan; preverite `docker ps`. |
| `MONGO_URI ... ni nastavljen` | Preverite `backend/.env`, pravilno ime spremenljivke in ponovni zagon backenda. |
| `JWT_SECRET` ni nastavljen | Dodajte svoj `JWT_SECRET` v `backend/.env`. |
| API ne deluje na vratih 5000 | Preverite, ali backend deluje in ali so vrata prosta. |
| Frontend se ne poveže z API-jem | Preverite, ali backend posluša na vratih 5000 in frontend na 5173. |
| V Compassu ni baze `hisniservis` | Najprej ustvarite uporabnika ali drug dokument, nato osvežite pogled. |

---

### Kratek povzetek zagona ob naslednji uporabi

Ko je projekt že nameščen in nastavljen:

**Terminal 1 – korenska mapa:**

```bash
docker compose up -d
```

**Terminal 2 – backend:**

```bash
cd backend
npm run dev
```

**Terminal 3 – frontend:**

```bash
cd frontend
npm run dev
```

Nato odprite **http://localhost:5173**.
