
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    geslo: ""
  });

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

    setNapaka("");
    setNalaganje(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Prijava ni uspela."
        );
      }

      if (!data.token || !data.uporabnik) {
        throw new Error("Neveljaven odgovor strežnika.");
      }

      const poti = {
        Stanovalec: "/stanovalec",
        Izvajalec: "/izvajalec",
        Administrator: "/admin"
      };

      const pot = poti[data.uporabnik.vloga];

      if (!pot) {
        throw new Error("Neznana uporabniška vloga.");
      }

      onLogin(data.uporabnik, data.token);
      navigate(pot, { replace: true });

    } catch (error) {
      setNapaka(error.message);
    } finally {
      setNalaganje(false);
    }
  };

  return (
    <div className="auth-layout">
      <header className="auth-header">
        <Link to="/popravila" className="auth-logo">
          <span className="auth-logo-icon">⌂</span>
          HišniServis
        </Link>

        <span className="auth-help">Potrebujete pomoč?</span>
      </header>

      <main className="auth-main">
        <div className="auth-breadcrumb">
          Delovni prostor <span>›</span> Prijava
        </div>

        <div className="auth-card">
          <aside className="auth-info">
            <span className="auth-tag">DOBRODOŠLI NAZAJ</span>

            <h2>
              Vaše delo.
              <br />
              Na enem mestu.
            </h2>

            <p className="auth-info-description">
              Prijavite se in nadaljujte z uporabo
              platforme HišniServis.
            </p>

            <div className="auth-benefits">
              <div className="auth-benefit">
                <span className="auth-benefit-icon">⌕</span>
                <div>
                  <strong>Poiščite pravo delo</strong>
                  <p>
                    Prebrskajte razpoložljiva popravila
                    in poiščite nove priložnosti.
                  </p>
                </div>
              </div>

              <div className="auth-benefit">
                <span className="auth-benefit-icon">▤</span>
                <div>
                  <strong>Upravljajte popravila</strong>
                  <p>
                    Spremljajte objavljena popravila
                    in njihove statuse.
                  </p>
                </div>
              </div>

              <div className="auth-benefit">
                <span className="auth-benefit-icon">♧</span>
                <div>
                  <strong>Povežite se z izvajalci</strong>
                  <p>
                    Pridobite ponudbe in poiščite
                    ustreznega izvajalca.
                  </p>
                </div>
              </div>
            </div>

            <div className="auth-info-bottom">
              <strong>Vse na enem mestu.</strong>
              <p>
                Enostavno upravljanje popravil
                in ponudb izvajalcev.
              </p>
            </div>
          </aside>

          <section className="auth-form-section">
            <h1>Prijavite se</h1>
            <p className="auth-form-subtitle">
              Vnesite svoje podatke za dostop do računa.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
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

              <div className="auth-field">
                <label htmlFor="geslo">Geslo</label>

                <div className="auth-password">
                  <input
                    id="geslo"
                    type={prikaziGeslo ? "text" : "password"}
                    name="geslo"
                    placeholder="Vnesite geslo"
                    value={formData.geslo}
                    onChange={handleChange}
                    autoComplete="current-password"
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
              </div>

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
                {nalaganje ? "Prijavljanje..." : "Prijavi se"}
              </button>
            </form>

            <p className="auth-switch">
              Še nimate računa?{" "}
              <Link to="/register">Registrirajte se</Link>
            </p>

            <div className="auth-guest">
              <Link to="/popravila" className="auth-guest-link">
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

export default Login;
