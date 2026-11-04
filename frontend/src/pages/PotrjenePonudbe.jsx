import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PrejetePonudbe.css";

const API_URL = "http://localhost:5000";

function PotrjenePonudbe({ uporabnik, token }) {
  const navigate = useNavigate();

  const [ponudbe, setPonudbe] = useState([]);
  const [nalaganje, setNalaganje] = useState(true);
  const [napaka, setNapaka] = useState("");

  useEffect(() => {
    if (!token) {
      setNapaka("Za ogled ponudb se morate prijaviti.");
      setNalaganje(false);
      return;
    }

    const controller = new AbortController();

    const pridobiPonudbe = async () => {
      try {
        setNalaganje(true);
        setNapaka("");

        const response = await fetch(
          `${API_URL}/api/ponudbe/potrjene`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Napaka pri pridobivanju potrjenih ponudb."
          );
        }

        if (!controller.signal.aborted) {
          setPonudbe(data.ponudbe || []);
        }

      } catch (error) {
        if (!controller.signal.aborted) {
          setNapaka(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setNalaganje(false);
        }
      }
    };

    pridobiPonudbe();

    return () => controller.abort();
  }, [token]);

  const oblikujCeno = (cena) =>
    new Intl.NumberFormat("sl-SI", {
      style: "currency",
      currency: "EUR",
    }).format(cena);

  const oblikujDatum = (vrednost) =>
    vrednost
      ? new Date(vrednost).toLocaleDateString("sl-SI")
      : "Ni navedeno";

  return (
    <div className="pp-layout">

      {/* ZGORNJA NAVIGACIJA */}
      <header className="pp-header">
        <Link to="/popravila" className="pp-brand">
          <span className="pp-brand-icon">⌂</span>
          <strong>HišniServis</strong>
          <span className="pp-brand-subtitle">
            Delovni prostor
          </span>
        </Link>

        <div className="pp-header-right">
          <span className="pp-vloga">
            {uporabnik?.ime} · Izvajalec
          </span>

          <button
            className="pp-header-btn"
            onClick={() => navigate("/izvajalec")}
          >
            Moj račun
          </button>
        </div>
      </header>

      {/* STRANSKI MENI */}
      <aside className="pp-sidebar">
        <div className="pp-sidebar-content">
          <div className="pp-sidebar-title">
            DELO IN POPRAVILA
          </div>

          <Link
            to="/izvajalec"
            className="pp-menu-item"
          >
            <span>▦</span> Pregled
          </Link>

          <Link
            to="/popravila"
            className="pp-menu-item"
          >
            <span>▤</span> Razpoložljiva popravila
          </Link>

          <Link
            to="/izvajalec/ponudbe"
            className="pp-menu-item active"
          >
            <span>✓</span>
            Potrjene ponudbe

            <span className="pr-sidebar-count">
              {nalaganje ? "..." : ponudbe.length}
            </span>
          </Link>
        </div>

        <div className="pp-sidebar-bottom">
          <strong>Potrebujete pomoč?</strong>
          <p>
            Upravljajte svoja potrjena dela na enem mestu.
          </p>
        </div>
      </aside>

      {/* GLAVNA VSEBINA */}
      <main className="pp-main">
        <div className="pp-breadcrumb">
          Delovni prostor
          <span>›</span>
          Potrjene ponudbe
        </div>

        <div className="pp-heading">
          <h1>Potrjene ponudbe</h1>
          <p>
            Tukaj so prikazane vaše ponudbe,
            ki so jih stanovalci sprejeli.
          </p>
        </div>

        <div className="pr-stats">
          <div className="pr-stat-card">
            <span>Potrjene ponudbe</span>
            <strong>{ponudbe.length}</strong>
          </div>

          <div className="pr-stat-card">
            <span>Sprejeta dela</span>
            <strong>
              {ponudbe.filter(
                (ponudba) =>
                  ponudba.popravilo?.status === "V_TEKU"
              ).length}
            </strong>
          </div>
        </div>

        {napaka && (
          <div className="pp-alert pp-error" role="alert">
            {napaka}
          </div>
        )}

        <section className="pr-results">
          <div className="pr-results-header">
            <h2>
              Vaše potrjene ponudbe
              <span>{ponudbe.length}</span>
            </h2>
          </div>

          {nalaganje ? (
            <div className="pr-empty">
              Nalaganje potrjenih ponudb...
            </div>
          ) : ponudbe.length === 0 ? (
            <div className="pr-empty">
              {napaka
                ? "Ponudb ni bilo mogoče prikazati."
                : "Trenutno še nimate potrjenih ponudb."}
            </div>
          ) : (
            <div className="pr-list">
              {ponudbe.map((ponudba) => (
                <article
                  className="pr-offer-card"
                  key={ponudba.id}
                >
                  {/* NASLOV */}
                  <div className="pr-offer-header">
                    <div>
                      <span className="pr-eyebrow">
                        POTRJENA PONUDBA
                      </span>

                      <h3>
                        {ponudba.popravilo?.naslov ||
                          "Popravilo ni na voljo"}
                      </h3>

                      <p>
                        {ponudba.popravilo?.kategorija}
                        {" · "}
                        {ponudba.popravilo?.lokacija ||
                          "Lokacija ni navedena"}
                      </p>
                    </div>

                    <span className="pr-status">
                      SPREJETA
                    </span>
                  </div>

                  {/* STATUS POPRAVILA */}
                  <div className="pr-provider">
                    <span className="pr-provider-icon">
                      ✓
                    </span>

                    <div>
                      <small>Status popravila</small>
                      <strong>
                        {ponudba.popravilo?.status ||
                          "Ni podatka"}
                      </strong>
                    </div>
                  </div>

                  {/* CENA IN ČAS */}
                  <div className="pr-offer-metrics">
                    <div className="pr-metric">
                      <small>Dogovorjena cena</small>
                      <strong>
                        {oblikujCeno(ponudba.cena)}
                      </strong>
                    </div>

                    <div className="pr-metric">
                      <small>Predviden čas izvedbe</small>
                      <strong>
                        {ponudba.predviden_cas} dni
                      </strong>
                    </div>
                  </div>

                  {/* OPIS PONUDBE */}
                  <div className="pr-description">
                    <strong>Vaša ponudba</strong>
                    <p>{ponudba.opis}</p>
                  </div>

                  {/* OPIS POPRAVILA */}
                  {ponudba.popravilo?.opis && (
                    <div className="pr-description">
                      <strong>Opis popravila</strong>
                      <p>{ponudba.popravilo.opis}</p>
                    </div>
                  )}

                  {/* SPODNJI DEL */}
                  <div className="pr-offer-footer">
                    <span>
                      Oddano:{" "}
                      {oblikujDatum(ponudba.datum_oddaje)}
                    </span>

                    {ponudba.popravilo?.id && (
                      <Link
                        to={`/popravila/${ponudba.popravilo.id}`}
                      >
                        Podrobnosti popravila ›
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default PotrjenePonudbe;
