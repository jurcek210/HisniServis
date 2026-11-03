import { useEffect, useState } from "react";
import "./ObjavaPopravila.css";

function ObjavaPopravila({ token }) {
  const [naslov, setNaslov] = useState("");
  const [kategorija, setKategorija] = useState("");
  const [opis, setOpis] = useState("");
  const [fotografija, setFotografija] = useState(null);
  const [predogled, setPredogled] = useState(null);

  const [nalaganje, setNalaganje] = useState(false);
  const [sporocilo, setSporocilo] = useState("");
  const [napaka, setNapaka] = useState("");

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
    const datoteka = e.target.files[0];

    if (!datoteka) {
      setFotografija(null);
      return;
    }

    const dovoljeniTipi = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!dovoljeniTipi.includes(datoteka.type)) {
      setNapaka("Dovoljeni so JPG, PNG in WebP.");
      e.target.value = "";
      return;
    }

    if (datoteka.size > 2 * 1024 * 1024) {
      setNapaka("Fotografija ne sme presegati 2 MB.");
      e.target.value = "";
      return;
    }

    setNapaka("");
    setFotografija(datoteka);
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

      const podatki = new FormData();
      podatki.append("naslov", naslov);
      podatki.append("kategorija", kategorija);
      podatki.append("opis", opis);

      if (fotografija) {
        podatki.append("fotografija", fotografija);
      }

      const response = await fetch(
        "http://localhost:5000/api/popravila",
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
      setOpis("");
      setFotografija(null);

    } catch (error) {
      setNapaka(error.message);
    } finally {
      setNalaganje(false);
    }
  };

  return (
    <div className="objava-container">
      <div className="objava-card">
        <h1>Objava novega popravila</h1>
        <p>Opišite težavo in pridobite ponudbe izvajalcev.</p>

        {sporocilo && (
          <div className="objava-uspeh">{sporocilo}</div>
        )}

        {napaka && (
          <div className="objava-napaka">{napaka}</div>
        )}

        <form onSubmit={objaviPopravilo}>
          <div className="form-group">
            <label>Naslov popravila</label>
            <input
              type="text"
              placeholder="Npr. Pokvarjena pipa"
              value={naslov}
              onChange={(e) => setNaslov(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Kategorija</label>
            <select
              value={kategorija}
              onChange={(e) => setKategorija(e.target.value)}
              required
            >
              <option value="">Izberite kategorijo</option>
              <option value="Vodovod">Vodovod</option>
              <option value="Elektrika">Elektrika</option>
              <option value="Ogrevanje">Ogrevanje</option>
              <option value="Pleskanje">Pleskanje</option>
              <option value="Mizarstvo">Mizarstvo</option>
              <option value="Drugo">Drugo</option>
            </select>
          </div>

          <div className="form-group">
            <label>Opis težave</label>
            <textarea
              placeholder="Podrobno opišite težavo..."
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              rows="5"
              required
            />
          </div>

          <div className="form-group">
            <label>Fotografija (neobvezno)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={izberiFotografijo}
              key={fotografija ? "izbrana" : "prazna"}
            />
            <small>Dovoljeni formati: JPG, PNG, WebP (največ 2 MB).</small>
          </div>

          {predogled && (
            <div className="predogled">
              <p>Predogled fotografije:</p>
              <img src={predogled} alt="Predogled popravila" />
              <button
                type="button"
                className="odstrani-sliko"
                onClick={() => setFotografija(null)}
              >
                Odstrani fotografijo
              </button>
            </div>
          )}

          <button
            type="submit"
            className="objava-gumb"
            disabled={nalaganje}
          >
            {nalaganje ? "Objavljanje..." : "Objavi popravilo"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ObjavaPopravila;
