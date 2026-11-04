import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PrejetePonudbe.css";

const API_URL = "http://localhost:5000";

function PrejetePonudbe({ uporabnik, token }) {
  const navigate = useNavigate();

  const [ponudbe, setPonudbe] = useState([]);
  const [nalaganje, setNalaganje] = useState(true);
  const [napaka, setNapaka] = useState("");

  const [izbranoPopravilo, setIzbranoPopravilo] =
    useState("");

  const [razvrstitev, setRazvrstitev] =
    useState("najnovejse");

  useEffect(() => {
    const controller = new AbortController();

    const naloziPonudbe = async () => {
      try {
        setNalaganje(true);
        setNapaka("");

        const response = await fetch(
          `${API_URL}/api/ponudbe/prejete`,
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
              "Napaka pri pridobivanju ponudb."
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

    naloziPonudbe();

    return () => controller.abort();
  }, [token]);

  const popravila = useMemo(() => {
    const mapa = new Map();

    ponudbe.forEach((ponudba) => {
      if (ponudba.popravilo) {
        mapa.set(
          String(ponudba.popravilo.id),
          ponudba.popravilo
        );
      }
    });

    return [...mapa.values()];
  }, [ponudbe]);

  const filtriranePonudbe = useMemo(() => {
    const rezultat = ponudbe.filter((ponudba) =>
      !izbranoPopravilo ||
      String(ponudba.popravilo?.id) === izbranoPopravilo
    );

    return [...rezultat].sort((a, b) => {
      if (razvrstitev === "najcenejse") {
        return a.cena - b.cena;
      }

      if (razvrstitev === "najdrazje") {
        return b.cena - a.cena;
      }

      if (razvrstitev === "najhitreje") {
        return a.predviden_cas - b.predviden_cas;
      }

      return (
        new Date(b.datum_oddaje).getTime() -
        new Date(a.datum_oddaje).getTime()
      );
    });
  }, [ponudbe, izbranoPopravilo, razvrstitev]);

  const oblikujCeno = (cena) =>
    new Intl.NumberFormat("sl-SI", {
      style: "currency",
      currency: "EUR",
    }).format(cena);

  const oblikujDatum = (datum) =>
    datum
      ? new Date(datum).toLocaleDateString("sl-SI")
      : "Ni navedeno";

  const najnizjeCene = useMemo(() => {
    const mapa = new Map();

    ponudbe.forEach((ponudba) => {
      if (!ponudba.popravilo || ponudba.status !== "ODDANA") {
        return;
      }

      const id = String(ponudba.popravilo.id);
      const trenutna = mapa.get(id);

      if (trenutna === undefined || ponudba.cena < trenutna) {
        mapa.set(id, ponudba.cena);
      }
    });

    return mapa;
  }, [ponudbe]);

  return (
    <div className="pp-layout">

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
            {uporabnik?.ime} · {uporabnik?.vloga}
          </span>

          <button
            className="pp-header-btn"
            onClick={() => navigate("/stanovalec")}
          >
            Moj račun
          </button>
        </div>
      </header>

      <aside className="pp-sidebar">
        <div className="pp-sidebar-content">
          <div className="pp-sidebar-title">
            DELO IN POPRAVILA
          </div>

          <Link
            to="/stanovalec"
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
            to="/stanovalec/ponudbe"
            className="pp-menu-item active"
          >
            <span>✉</span>
            Prejete ponudbe

            <span className="pr-sidebar-count">
              {nalaganje ? "..." : ponudbe.length}
            </span>
          </Link>

          <Link
            to="/stanovalec/objavi"
            className="pp-menu-item"
          >
            <span>＋</span> Objavi popravilo
          </Link>
        </div>

        <div className="pp-sidebar-bottom">
          <strong>Potrebujete pomoč?</strong>
          <p>
            Upravljajte popravila na enem mestu.
          </p>
        </div>
      </aside>

      <main className="pp-main">
        <div className="pp-breadcrumb">
          Delovni prostor
          <span>›</span>
          Prejete ponudbe
        </div>

        <div className="pp-heading">
          <h1>Prejete ponudbe</h1>

          <p>
            Preglejte ponudbe izvajalcev in primerjajte
            njihove cene ter predvidene čase izvedbe.
          </p>
        </div>

        <div className="pr-stats">
          <div className="pr-stat-card">
            <span>Vse prejete ponudbe</span>
            <strong>{ponudbe.length}</strong>
          </div>

          <div className="pr-stat-card">
            <span>Popravila s ponudbami</span>
            <strong>{popravila.length}</strong>
          </div>
        </div>

        <section className="pp-filters">
          <div className="pp-filters-row">

            <div className="pp-field">
              <label htmlFor="pr-popravilo">
                Popravilo
              </label>

              <select
                id="pr-popravilo"
                value={izbranoPopravilo}
                onChange={(e) =>
                  setIzbranoPopravilo(e.target.value)
                }
              >
                <option value="">Vsa popravila</option>

                {popravila.map((popravilo) => (
                  <option
                    key={popravilo.id}
                    value={popravilo.id}
                  >
                    {popravilo.naslov}
                  </option>
                ))}
              </select>
            </div>

            <div className="pp-field">
              <label htmlFor="pr-razvrstitev">
                Razvrsti ponudbe
              </label>

              <select
                id="pr-razvrstitev"
                value={razvrstitev}
                onChange={(e) =>
                  setRazvrstitev(e.target.value)
                }
              >
                <option value="najnovejse">
                  Najnovejše
                </option>

                <option value="najcenejse">
                  Najnižja cena
                </option>

                <option value="najdrazje">
                  Najvišja cena
                </option>

                <option value="najhitreje">
                  Najkrajši čas izvedbe
                </option>
              </select>
            </div>
          </div>

          <div className="pp-filters-bottom">
            <span>
              Prikazanih {filtriranePonudbe.length} ponudb
            </span>

            <button
              className="pp-reset"
              onClick={() => {
                setIzbranoPopravilo("");
                setRazvrstitev("najnovejse");
              }}
            >
              Počisti filtre
            </button>
          </div>
        </section>

        {napaka && (
          <div
            className="pp-alert pp-error"
            role="alert"
          >
            {napaka}
          </div>
        )}

        <section className="pr-results">
          <div className="pr-results-header">
            <h2>
              Ponudbe izvajalcev
              <span>{filtriranePonudbe.length}</span>
            </h2>
          </div>

          {nalaganje ? (
            <div className="pr-empty">
              Nalaganje ponudb...
            </div>
          ) : filtriranePonudbe.length === 0 ? (
            <div className="pr-empty">
              {napaka
                ? "Ponudb ni bilo mogoče prikazati."
                : "Trenutno ni prejetih ponudb za izbrane kriterije."}
            </div>
          ) : (
            <div className="pr-list">
              {filtriranePonudbe.map((ponudba) => {
                const jeNajcenejsa =
                  ponudba.status === "ODDANA" &&
                  ponudba.popravilo &&
                  ponudba.cena === najnizjeCene.get(
                    String(ponudba.popravilo.id)
                  );

                return (
                  <article
                    className="pr-offer-card"
                    key={ponudba.id}
                  >
                    <div className="pr-offer-header">
                      <div>
                        <span className="pr-eyebrow">
                          PONUDBA ZA POPRAVILO
                        </span>

                        <h3>
                          {ponudba.popravilo?.naslov ||
                            "Neznano popravilo"}
                        </h3>

                        <p>
                          {ponudba.popravilo?.kategorija}
                          {" · "}
                          {ponudba.popravilo?.lokacija ||
                            "Lokacija ni navedena"}
                        </p>
                      </div>

                      <span className="pr-status">
                        {ponudba.status}
                      </span>
                    </div>

                    <div className="pr-provider">
                      <span className="pr-provider-icon">
                        ♙
                      </span>

                      <div>
                        <small>Izvajalec</small>
                        <strong>
                          {ponudba.izvajalec
                            ? `${ponudba.izvajalec.ime} ${ponudba.izvajalec.priimek}`
                            : "Neznan izvajalec"}
                        </strong>
                      </div>
                    </div>

                    {/* CENA IN ČAS */}
                    <div className="pr-offer-metrics">
                      <div className="pr-metric">
                        <small>Ponujena cena</small>
                        <strong>
                          {oblikujCeno(ponudba.cena)}
                        </strong>

                        {jeNajcenejsa && (
                          <span className="pr-best">
                            Najnižja cena za to popravilo
                          </span>
                        )}
                      </div>

                      <div className="pr-metric">
                        <small>Predviden čas izvedbe</small>
                        <strong>
                          {ponudba.predviden_cas} dni
                        </strong>
                      </div>
                    </div>

                    <div className="pr-description">
                      <strong>Opis ponudbe</strong>
                      <p>{ponudba.opis}</p>
                    </div>

                    <div className="pr-offer-footer">
                      <span>
                        Oddano:{" "}
                        {oblikujDatum(ponudba.datum_oddaje)}
                      </span>

                      {ponudba.popravilo?.id && (
                        <Link
                          to={`/popravila/${ponudba.popravilo.id}`}
                        >
                          Poglej popravilo ›
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="pd-footer">
          <span>© 2026 HišniServis</span>
          <span>Vse pravice pridržane</span>
        </footer>
      </main>
    </div>
  );
}

export default PrejetePonudbe;
