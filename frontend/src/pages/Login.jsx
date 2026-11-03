import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import "./Login.css";

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

      // Posodobi stanje prijavljenega uporabnika
      onLogin(data.uporabnik, data.token);

      // Preusmeri uporabnika glede na vlogo
      navigate(pot, { replace: true });

    } catch (error) {
      setNapaka(error.message);
    } finally {
      setNalaganje(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card login-card">
        <h1>HišniServis</h1>
        <h2>Prijava</h2>

        <p>Dobrodošli nazaj! Prijavite se v svoj račun.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              E-poštni naslov
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Vnesite e-poštni naslov"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="geslo">Geslo</label>

            <div className="login-password-field">
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
                className="login-password-toggle"
                onClick={() =>
                  setPrikaziGeslo(!prikaziGeslo)
                }
              >
                {prikaziGeslo ? "Skrij" : "Prikaži"}
              </button>
            </div>
          </div>

          {napaka && (
            <p className="error-message" role="alert">
              {napaka}
            </p>
          )}

          <button type="submit" disabled={nalaganje}>
            {nalaganje ? "Prijavljanje..." : "Prijavi se"}
          </button>
        </form>

        <p className="login-register-link">
          Še nimate računa?{" "}
          <Link to="/register">Registrirajte se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
