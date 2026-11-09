
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./ObjavaPopravila.css";

const API_URL = "http://localhost:5000";

const mesta = [
  "Ljubljana",
  "Maribor",
  "Kranj",
  "Celje",
  "Koper",
  "Velenje",
  "Novo mesto",
  "Ptuj",
  "Trbovlje",
  "Kamnik",
  "Jesenice",
  "Nova Gorica",
  "Domžale",
  "Škofja Loka",
  "Murska Sobota",
];

function ObjavaPopravila({ token }) {
  const [naslov, setNaslov] = useState("");
  const [kategorija, setKategorija] = useState("");
  const [lokacija, setLokacija] = useState("");
  const [opis, setOpis] = useState("");
  const [fotografija, setFotografija] = useState(null);
  const [predogled, setPredogled] = useState(null);

  const [nalaganje, setNalaganje] = useState(false);
  const [sporocilo, setSporocilo] = useState("");
  const [napaka, setNapaka] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!fotografija) {
      setPredogled(null);
      return;
    }

    const url = URL.createObjectURL(fotografija);
    setPredogled(url);

    return () => URL.revokeObjectURL(url);
  }, [fotografija]);

  const izberiFotografijo = (e) => {
    const datoteka = e.target.files?.[0];

    if (!datoteka) return;

    const dovoljeniTipi = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!dovoljeniTipi.includes(datoteka.type)) {
      setNapaka("Dovoljeni formati so JPG, PNG in WebP.");
      e.target.value = "";
      setFotografija(null);
      return;
    }

    if (datoteka.size > 2 * 1024 * 1024) {
      setNapaka("Fotografija ne sme presegati 2 MB.");
      e.target.value = "";
      setFotografija(null);
      return;
    }

    setNapaka("");
    setFotografija(datoteka);
  };

  const odstraniFotografijo = () => {
    setFotografija(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const objaviPopravilo = async (e) => {
    e.preventDefault();

    setNapaka("");
    setSporocilo("");
    setNalaganje(true);

    try {
      if (!token) {
        throw new Error("Za objavo se morate prijaviti.");
      }

      if (
        !naslov.trim() ||
        !kategorija ||
        !lokacija ||
        !opis.trim()
      ) {
        throw new Error("Izpolnite vsa obvezna polja.");
      }

      const podatki = new FormData();

      podatki.append("naslov", naslov.trim());
      podatki.append("kategorija", kategorija);
      podatki.append("lokacija", lokacija);
      podatki.append("opis", opis.trim());

      if (fotografija) {
        podatki.append("fotografija", fotografija);
      }

      const response = await fetch(
        `${API_URL}/api/popravila`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: podatki,
        }
      );

      const rezultat = await response.json();

      if (!response.ok) {
        throw new Error(
          rezultat.message || "Napaka pri objavi popravila."
        );
      }

      setSporocilo("Popravilo je bilo uspešno objavljeno!");

      setNaslov("");
      setKategorija("");
      setLokacija("");
      setOpis("");
      odstraniFotografijo();

    } catch (error) {
      setNapaka(error.message);
    } finally {
      setNalaganje(false);
    }
  };

  return (
    <div className="op-layout">

      <header className="op-header">
        <Link to="/stanovalec" className="op-logo">
          <span className="op-logo-icon">⌂</span>
          <strong>HišniServis</strong>
          <span className="op-logo-subtitle">
            Delovni prostor
          </span>
        </Link>

        <Link to="/popravila" className="op-header-link">
          Pregled popravil
        </Link>
      </header>

      <main className="op-main">

        <div className="op-breadcrumb">
          <Link to="/stanovalec">
            Delovni prostor
          </Link>

          <span>›</span>

          Nova objava
        </div>

        <div className="op-page-heading">
          <h1>Objavite novo popravilo</h1>

          <p>
            Opišite težavo in pridobite ponudbe izvajalcev.
          </p>
        </div>

        <div className="op-card">

          <aside className="op-info">
            <span className="op-tag">
              ZA STANOVALCE
            </span>

            <h2>
              Vaš dom.
              <br />
              V dobrih rokah.
            </h2>

            <p className="op-info-description">
              Objavite popravilo v nekaj korakih in
              poiščite ustreznega izvajalca za svoj dom.
            </p>

            <div className="op-benefits">

              <div className="op-benefit">
                <span className="op-benefit-icon">
                  ▤
                </span>

                <div>
                  <strong>Opišite težavo</strong>

                  <p>
                    Vnesite naslov, kategorijo,
                    lokacijo in podroben opis popravila.
                  </p>
                </div>
              </div>

              <div className="op-benefit">
                <span className="op-benefit-icon">
                  ▧
                </span>

                <div>
                  <strong>Dodajte fotografijo</strong>

                  <p>
                    Fotografija izvajalcem pomaga
                    bolje razumeti težavo.
                  </p>
                </div>
              </div>

              <div className="op-benefit">
                <span className="op-benefit-icon">
                  ♧
                </span>

                <div>
                  <strong>Pridobite ponudbe</strong>

                  <p>
                    Izvajalci lahko pregledajo
                    vašo objavo in oddajo ponudbo.
                  </p>
                </div>
              </div>
            </div>

            <div className="op-info-bottom">
              <strong>
                Preprosto do prave rešitve.
              </strong>

              <p>
                Po objavi bo vaše popravilo vidno
                na seznamu razpoložljivih popravil.
              </p>
            </div>
          </aside>

          <section className="op-form-section">
            <h2>Podatki o popravilu</h2>

            <p className="op-form-subtitle">
              Izpolnite spodnja polja in objavite popravilo.
            </p>

            {sporocilo && (
              <div className="op-success" role="status">
                {sporocilo}
              </div>
            )}

            {napaka && (
              <div className="op-error" role="alert">
                {napaka}
              </div>
            )}

            <form
              className="op-form"
              onSubmit={objaviPopravilo}
            >

              <div className="op-field">
                <label htmlFor="naslov">
                  Naslov popravila
                </label>

                <input
                  id="naslov"
                  type="text"
                  placeholder="Npr. Pokvarjena pipa"
                  value={naslov}
                  onChange={(e) => setNaslov(e.target.value)}
                  maxLength={120}
                  required
                />
              </div>

              <div className="op-field">
                <label htmlFor="kategorija">
                  Kategorija
                </label>

                <select
                  id="kategorija"
                  value={kategorija}
                  onChange={(e) => setKategorija(e.target.value)}
                  required
                >
                  <option value="">
                    Izberite kategorijo
                  </option>

                  <option value="Vodovod">
                    Vodovod
                  </option>

                  <option value="Elektrika">
                    Elektrika
                  </option>

                  <option value="Ogrevanje">
                    Ogrevanje
                  </option>

                  <option value="Pleskanje">
                    Pleskanje
                  </option>

                  <option value="Mizarstvo">
                    Mizarstvo
                  </option>

                  <option value="Drugo">
                    Drugo
                  </option>
                </select>
              </div>

              <div className="op-field">
                <label htmlFor="lokacija">
                  Lokacija popravila
                </label>

                <select
                  id="lokacija"
                  value={lokacija}
                  onChange={(e) => setLokacija(e.target.value)}
                  required
                >
                  <option value="">
                    Izberite mesto
                  </option>

                  {mesta.map((mesto) => (
                    <option
                      key={mesto}
                      value={mesto}
                    >
                      {mesto}
                    </option>
                  ))}
                </select>

                <small>
                  Izberite mesto, v katerem je potrebno popravilo.
                </small>
              </div>

              
              <div className="op-field">
                <label htmlFor="opis">
                  Opis težave
                </label>

                <textarea
                  id="opis"
                  placeholder="Podrobno opišite težavo in kaj je treba popraviti..."
                  value={opis}
                  onChange={(e) => setOpis(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  required
                />

                <small>
                  {opis.length}/2000 znakov
                </small>
              </div>

              <div className="op-field">
                <label htmlFor="fotografija">
                  Fotografija (neobvezno)
                </label>

                <div className="op-upload">
                  <span className="op-upload-icon">
                    ▧
                  </span>

                  <strong>
                    {fotografija
                      ? fotografija.name
                      : "Dodajte fotografijo težave"}
                  </strong>

                  <p>
                    JPG, PNG ali WebP – največ 2 MB
                  </p>

                  <input
                    id="fotografija"
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={izberiFotografijo}
                  />
                </div>
              </div>

              {predogled && (
                <div className="op-preview">
                  <img
                    src={predogled}
                    alt="Predogled fotografije popravila"
                  />

                  <button
                    type="button"
                    onClick={odstraniFotografijo}
                  >
                    Odstrani fotografijo
                  </button>
                </div>
              )}

              <div className="op-form-actions">
                <Link
                  to="/popravila"
                  className="op-cancel"
                >
                  Prekliči
                </Link>

                <button
                  type="submit"
                  className="op-submit"
                  disabled={nalaganje}
                >
                  {nalaganje
                    ? "Objavljanje..."
                    : "Objavi popravilo"}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="op-footer">
          <span>© 2026 HišniServis</span>
          <span>Vse pravice pridržane</span>
        </footer>
      </main>
    </div>
  );
}

export default ObjavaPopravila;
