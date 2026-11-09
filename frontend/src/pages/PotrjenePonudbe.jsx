
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PrejetePonudbe.css";

const API_URL = "http://localhost:5000";

function PotrjenePonudbe({ uporabnik, token }) {
  const navigate = useNavigate();

  const [ponudbe, setPonudbe] = useState([]);
  const [nalaganje, setNalaganje] = useState(true);
  const [napaka, setNapaka] = useState("");
  const [sporocilo, setSporocilo] = useState("");

  // ID ponudbe, katere status trenutno spreminjamo.
  const [spreminjanje, setSpreminjanje] = useState(null);

  // PRIDOBIVANJE POTRJENIH PONUDB
  const pridobiPonudbe = async (signal) => {
    const response = await fetch(
      `${API_URL}/api/ponudbe/potrjene`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Napaka pri pridobivanju potrjenih ponudb."
      );
    }

    return data.ponudbe || [];
  };

  useEffect(() => {
    const controller = new AbortController();

    const nalozi = async () => {
      try {
        setNalaganje(true);
        setNapaka("");

        if (!token) {
          throw new Error(
            "Za ogled ponudb se morate prijaviti."
          );
        }

        const podatki = await pridobiPonudbe(
          controller.signal
        );

        if (!controller.signal.aborted) {
          setPonudbe(podatki);
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

    nalozi();

    return () => controller.abort();
  }, [token]);

  // SPREMEMBA STATUSA POPRAVILA
  const spremeniStatus = async (ponudba, noviStatus) => {
    const popraviloId = ponudba.popravilo?.id;

    if (!popraviloId || spreminjanje !== null) {
      return;
    }

    // Ob zaključku zahtevamo dodatno potrditev.
    if (noviStatus === "CAKA_POTRDITEV") {
      const potrjeno = window.confirm(
        "Ali ste prepričani, da je delo končano?\n\n" +
        "Popravilo bo poslano stanovalcu v potrditev."
      );

      if (!potrjeno) return;
    }

    setSpreminjanje(ponudba.id);
    setNapaka("");
    setSporocilo("");

    try {
      const response = await fetch(
        `${API_URL}/api/popravila/${popraviloId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: noviStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Sprememba statusa ni uspela."
        );
      }

      // Takoj posodobimo status v Reactu.
      setPonudbe((prejsnje) =>
        prejsnje.map((p) => {
          if (p.id !== ponudba.id || !p.popravilo) {
            return p;
          }

          return {
            ...p,
            popravilo: {
              ...p.popravilo,
              status: data.popravilo.status,
            },
          };
        })
      );

      if (noviStatus === "V_DELU") {
        setSporocilo(
          "Delo je bilo uspešno označeno kot začeto."
        );
      } else {
        setSporocilo(
          "Delo je označeno kot končano in čaka na potrditev stanovalca."
        );
      }

      // Ponovno pridobimo stanje iz MongoDB.
      // Če osvežitev ne uspe, ohranimo že posodobljeno stanje.
      try {
        const osvezeniPodatki = await pridobiPonudbe();
        setPonudbe(osvezeniPodatki);
      } catch (error) {
        console.error(
          "Osveževanje ponudb ni uspelo:",
          error
        );
      }

    } catch (error) {
      setNapaka(error.message);
    } finally {
      setSpreminjanje(null);
    }
  };

  // OBLIKOVANJE PODATKOV
  const oblikujCeno = (cena) =>
    new Intl.NumberFormat("sl-SI", {
      style: "currency",
      currency: "EUR",
    }).format(cena);

  const oblikujDatum = (vrednost) =>
    vrednost
      ? new Date(vrednost).toLocaleDateString("sl-SI")
      : "Ni navedeno";

  const opisStatusa = (status) => {
    switch (status) {
      case "V_TEKU":
        return "Popravilo je dodeljeno izvajalcu.";
      case "V_DELU":
        return "Delo je v izvajanju.";
      case "CAKA_POTRDITEV":
        return "Delo čaka na potrditev stanovalca.";
      case "ZAKLJUCENO":
        return "Stanovalec je potrdil zaključek popravila.";
      default:
        return "Status popravila ni znan.";
    }
  };

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
            Pregledujte svoja potrjena dela
            in spremljajte njihovo izvajanje.
          </p>
        </div>

        {/* STATISTIKA */}
        <div className="pr-stats">
          <div className="pr-stat-card">
            <span>Potrjene ponudbe</span>
            <strong>{ponudbe.length}</strong>
          </div>

          <div className="pr-stat-card">
            <span>Dela v izvajanju</span>
            <strong>
              {ponudbe.filter((ponudba) =>
                ["V_TEKU", "V_DELU"].includes(
                  ponudba.popravilo?.status
                )
              ).length}
            </strong>
          </div>
        </div>

        {/* SPOROČILA */}
        {napaka && (
          <div className="pp-alert pp-error" role="alert">
            {napaka}
          </div>
        )}

        {sporocilo && (
          <div className="pp-alert pp-success" role="status">
            {sporocilo}
          </div>
        )}

        {/* PONUDBE */}
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
              {ponudbe.map((ponudba) => {
                const status =
                  ponudba.popravilo?.status;

                return (
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
                          {status || "Ni podatka"}
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
                        <p>
                          {ponudba.popravilo.opis}
                        </p>
                      </div>
                    )}

                    {/* UPRAVLJANJE STATUSA */}
                    {ponudba.popravilo && (
                      <div className="ps-status-section">
                        <div className="ps-status-heading">
                          <h4>Upravljanje dela</h4>

                          <span className="ps-status-badge">
                            {status}
                          </span>
                        </div>

                        <p className="ps-status-description">
                          {opisStatusa(status)}
                        </p>

                        {status === "V_TEKU" && (
                          <button
                            type="button"
                            className="ps-status-button"
                            disabled={spreminjanje !== null}
                            onClick={() =>
                              spremeniStatus(
                                ponudba,
                                "V_DELU"
                              )
                            }
                          >
                            {spreminjanje === ponudba.id
                              ? "Posodabljanje..."
                              : "▶ Začni delo"}
                          </button>
                        )}

                        {status === "V_DELU" && (
                          <button
                            type="button"
                            className="ps-status-button"
                            disabled={spreminjanje !== null}
                            onClick={() =>
                              spremeniStatus(
                                ponudba,
                                "CAKA_POTRDITEV"
                              )
                            }
                          >
                            {spreminjanje === ponudba.id
                              ? "Posodabljanje..."
                              : "✓ Označi delo kot končano"}
                          </button>
                        )}

                        {status === "CAKA_POTRDITEV" && (
                          <div className="ps-status-waiting">
                            ◷ Čaka na potrditev stanovalca
                          </div>
                        )}

                        {status === "ZAKLJUCENO" && (
                          <div className="ps-status-completed">
                            ✓ Popravilo je zaključeno
                          </div>
                        )}
                      </div>
                    )}

                    {/* SPODNJI DEL */}
                    <div className="pr-offer-footer">
                      <span>
                        Oddano:{" "}
                        {oblikujDatum(
                          ponudba.datum_oddaje
                        )}
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
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default PotrjenePonudbe;
