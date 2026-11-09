
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [formData, setFormData] = useState({
    ime: "",
    priimek: "",
    email: "",
    geslo: "",
    telefon: "",
    vloga: "Stanovalec",
    specializacija: "",
    opis: ""
  });

  const [sporocilo, setSporocilo] = useState("");
  const [napaka, setNapaka] = useState("");
  const [nalaganje, setNalaganje] = useState(false);
  const [prikaziGeslo, setPrikaziGeslo] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSporocilo("");
    setNapaka("");
    setNalaganje(true);

    try {
      const {
        ime,
        priimek,
        email,
        geslo,
        telefon,
        vloga,
        specializacija,
        opis
      } = formData;

      const podatki = {
        ime,
        priimek,
        email,
        geslo,
        telefon,
        vloga,
        ...(vloga === "Izvajalec" && {
          specializacija,
          opis
        })
      };

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(podatki)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registracija ni uspela."
        );
      }

      setSporocilo(
        data.message || "Registracija je bila uspešna."
      );

      setFormData({
        ime: "",
        priimek: "",
        email: "",
        geslo: "",
        telefon: "",
        vloga: "Stanovalec",
        specializacija: "",
        opis: ""
      });

    } catch (error) {
      setNapaka(error.message);
    } finally {
      setNalaganje(false);
    }
  };

  const jeIzvajalec = formData.vloga === "Izvajalec";

  return (
    <div className="auth-layout">
      {/* ZGORNJA NAVIGACIJA */}
      <header className="auth-header">
        <Link to="/popravila" className="auth-logo">
          <span className="auth-logo-icon">⌂</span>
          HišniServis
        </Link>

        <span className="auth-help">
          Potrebujete pomoč?
        </span>
      </header>

      <main className="auth-main">
        <div className="auth-breadcrumb">
          Delovni prostor <span>›</span> Registracija
        </div>

        <div className="auth-card">
          {/* LEVA STRAN */}
          <aside className="auth-info">
            <span className="auth-tag">
              {jeIzvajalec
                ? "ZA IZVAJALCE"
                : "ZA STANOVALCE"}
            </span>

            <h2>
              {jeIzvajalec ? (
                <>
                  Vaše znanje.
                  <br />
                  Nove priložnosti.
                </>
              ) : (
                <>
                  Vaš dom.
                  <br />
                  V dobrih rokah.
                </>
              )}
            </h2>

            <p className="auth-info-description">
              {jeIzvajalec
                ? "Povežite se z naročniki in poiščite delo, ki ustreza vašim storitvam."
                : "Objavite popravilo, pridobite ponudbe in poiščite pravega izvajalca."}
            </p>

            <div className="auth-benefits">
              {jeIzvajalec ? (
                <>
                  <div className="auth-benefit">
                    <span className="auth-benefit-icon">⌕</span>
                    <div>
                      <strong>Poiščite prava dela</strong>
                      <p>
                        Prebrskajte objavljena popravila
                        in poiščite nove priložnosti.
                      </p>
                    </div>
                  </div>

                  <div className="auth-benefit">
                    <span className="auth-benefit-icon">♙</span>
                    <div>
                      <strong>Predstavite svoje storitve</strong>
                      <p>
                        Ustvarite profil s svojo
                        specializacijo in opisom storitev.
                      </p>
                    </div>
                  </div>

                  <div className="auth-benefit">
                    <span className="auth-benefit-icon">▤</span>
                    <div>
                      <strong>Oddajajte ponudbe</strong>
                      <p>
                        Ponudite svoje storitve
                        in pridobite nova naročila.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="auth-benefit">
                    <span className="auth-benefit-icon">＋</span>
                    <div>
                      <strong>Objavite popravilo</strong>
                      <p>
                        Opišite težavo in po želji
                        dodajte fotografijo.
                      </p>
                    </div>
                  </div>

                  <div className="auth-benefit">
                    <span className="auth-benefit-icon">▤</span>
                    <div>
                      <strong>Primerjajte ponudbe</strong>
                      <p>
                        Preglejte prejete ponudbe
                        izvajalcev in izberite najboljšo.
                      </p>
                    </div>
                  </div>

                  <div className="auth-benefit">
                    <span className="auth-benefit-icon">✓</span>
                    <div>
                      <strong>Spremljajte popravila</strong>
                      <p>
                        Spremljajte napredek
                        in zaključek posameznega popravila.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="auth-info-bottom">
              <strong>
                {jeIzvajalec
                  ? "Najprej račun, nato vaš profil."
                  : "Preprosto do pravega izvajalca."}
              </strong>
              <p>
                {jeIzvajalec
                  ? "Po registraciji lahko začnete uporabljati svoj račun izvajalca."
                  : "Ustvarite račun in začnite objavljati popravila."}
              </p>
            </div>
          </aside>

          {/* DESNA STRAN */}
          <section className="auth-form-section">
            <h1>Ustvarite račun</h1>

            <p className="auth-form-subtitle">
              Registrirajte se in začnite uporabljati
              platformo HišniServis.
            </p>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              {/* IME IN PRIIMEK */}
              <div className="auth-row">
                <div className="auth-field">
                  <label htmlFor="ime">Ime</label>
                  <input
                    id="ime"
                    type="text"
                    name="ime"
                    placeholder="Vnesite ime"
                    value={formData.ime}
                    onChange={handleChange}
                    autoComplete="given-name"
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="priimek">
                    Priimek
                  </label>
                  <input
                    id="priimek"
                    type="text"
                    name="priimek"
                    placeholder="Vnesite priimek"
                    value={formData.priimek}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="auth-field">
                <label htmlFor="email">
                  E-poštni naslov
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="ime@primer.si"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              {/* TELEFON */}
              <div className="auth-field">
                <label htmlFor="telefon">
                  Telefonska številka
                </label>
                <input
                  id="telefon"
                  type="tel"
                  name="telefon"
                  placeholder="Npr. 041123456"
                  value={formData.telefon}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                />
              </div>

              {/* GESLO */}
              <div className="auth-field">
                <label htmlFor="geslo">Geslo</label>

                <div className="auth-password">
                  <input
                    id="geslo"
                    type={prikaziGeslo ? "text" : "password"}
                    name="geslo"
                    placeholder="Ustvarite geslo"
                    value={formData.geslo}
                    onChange={handleChange}
                    minLength={8}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setPrikaziGeslo(!prikaziGeslo)
                    }
                  >
                    {prikaziGeslo ? "Skrij" : "Prikaži"}
                  </button>
                </div>

                <small className="auth-hint">
                  Vsaj 8 znakov.
                </small>
              </div>

              {/* UPORABNIŠKA VLOGA */}
              <div className="auth-field">
                <label htmlFor="vloga">
                  Registrirajte se kot
                </label>

                <select
                  id="vloga"
                  name="vloga"
                  value={formData.vloga}
                  onChange={handleChange}
                  required
                >
                  <option value="Stanovalec">
                    Stanovalec
                  </option>
                  <option value="Izvajalec">
                    Izvajalec
                  </option>
                </select>
              </div>

              {/* DODATNA POLJA ZA IZVAJALCA */}
              {jeIzvajalec && (
                <div className="auth-extra-fields">
                  <div className="auth-extra-header">
                    Podatki o vaših storitvah
                  </div>

                  <div className="auth-field">
                    <label htmlFor="specializacija">
                      Specializacija
                    </label>

                    <input
                      id="specializacija"
                      type="text"
                      name="specializacija"
                      placeholder="Npr. Električar"
                      value={formData.specializacija}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label htmlFor="opis">
                      Opis storitev
                    </label>

                    <textarea
                      id="opis"
                      name="opis"
                      placeholder="Opišite svoje storitve..."
                      rows={4}
                      value={formData.opis}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              {/* SPOROČILA */}
              {sporocilo && (
                <div className="auth-success" role="status">
                  {sporocilo}
                </div>
              )}

              {napaka && (
                <div className="auth-error" role="alert">
                  {napaka}
                </div>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={nalaganje}
              >
                {nalaganje
                  ? "Registracija..."
                  : "Registriraj se"}
              </button>
            </form>

            <p className="auth-switch">
              Že imate račun?{" "}
              <Link to="/login">
                Prijavite se
              </Link>
            </p>

            <div className="auth-guest">
              <Link
                to="/popravila"
                className="auth-guest-link"
              >
                Preglej popravila kot gost
              </Link>
            </div>
          </section>
        </div>

        <footer className="auth-footer">
          <span>© 2026 HišniServis</span>
          <span>Vse pravice pridržane</span>
        </footer>
      </main>
    </div>
  );
}

export default Register;
