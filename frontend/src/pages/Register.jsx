import { useState } from "react";
import "./Register.css";
import { Link } from "react-router-dom";

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

      setSporocilo(data.message);

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

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>HišniServis</h1>
        <h2>Registracija</h2>

        <p>Ustvarite uporabniški račun</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ime">Ime</label>
              <input
                id="ime"
                type="text"
                name="ime"
                value={formData.ime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="priimek">Priimek</label>
              <input
                id="priimek"
                type="text"
                name="priimek"
                value={formData.priimek}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">E-poštni naslov</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefon">Telefon</label>
            <input
              id="telefon"
              type="tel"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="geslo">Geslo</label>
            <input
              id="geslo"
              type="password"
              name="geslo"
              value={formData.geslo}
              onChange={handleChange}
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="vloga">Uporabniška vloga</label>
            <select
              id="vloga"
              name="vloga"
              value={formData.vloga}
              onChange={handleChange}
            >
              <option value="Stanovalec">Stanovalec</option>
              <option value="Izvajalec">Izvajalec</option>
            </select>
          </div>

          {formData.vloga === "Izvajalec" && (
            <>
              <div className="form-group">
                <label htmlFor="specializacija">
                  Specializacija
                </label>
                <input
                  id="specializacija"
                  type="text"
                  name="specializacija"
                  value={formData.specializacija}
                  onChange={handleChange}
                  placeholder="Npr. Električar"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="opis">Opis storitev</label>
                <textarea
                  id="opis"
                  name="opis"
                  value={formData.opis}
                  onChange={handleChange}
                  placeholder="Opišite svoje storitve..."
                  rows={3}
                  required
                />
              </div>
            </>
          )}

          {sporocilo && (
            <p className="success-message" role="status">
              {sporocilo}
            </p>
          )}

          {napaka && (
            <p className="error-message" role="alert">
              {napaka}
            </p>
          )}

          <button type="submit" disabled={nalaganje}>
            {nalaganje ? "Registracija..." : "Registriraj se"}
          </button>
          <p className="login-register-link">
          Že imate račun?{" "}
          <Link to="/login">Prijavite se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
