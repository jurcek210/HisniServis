
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PregledPopravil.css";

const API_URL = "http://localhost:5000";
const NA_STRAN = 5;

const kategorije = [
  "Vodovod",
  "Elektrika",
  "Ogrevanje",
  "Pleskanje",
  "Mizarstvo",
  "Drugo",
];

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

function PregledPopravil({ uporabnik, token }) {
  const navigate = useNavigate();

  // PODATKI
  const [popravila, setPopravila] = useState([]);
  const [nalaganje, setNalaganje] = useState(true);
  const [napaka, setNapaka] = useState("");
  const [sporocilo, setSporocilo] = useState("");

  const [iskanje, setIskanje] = useState("");
  const [kategorija, setKategorija] = useState("");
  const [lokacija, setLokacija] = useState("");
  const [razvrstitev, setRazvrstitev] = useState("najnovejsa");
  const [stran, setStran] = useState(1);

  const [urejanje, setUrejanje] = useState(null);
  const [shranjevanje, setShranjevanje] = useState(false);

  const [steviloPonudb, setSteviloPonudb] = useState(null);

  const [steviloPotrjenih, setSteviloPotrjenih] = useState(null);

  const [obrazec, setObrazec] = useState({
    naslov: "",
    kategorija: "",
    lokacija: "",
    opis: "",
  });

  const vloga = uporabnik?.vloga || "Gost";
  const uporabnikId = uporabnik?._id || uporabnik?.id;

  const jeLastnik = (popravilo) =>
    vloga === "Stanovalec" &&
    Boolean(uporabnikId) &&
    String(popravilo.stanovalec) === String(uporabnikId);

  const lahkoIzbrise = (popravilo) =>
    vloga === "Administrator" || jeLastnik(popravilo);

  const pridobiPopravila = async (signal) => {
    const response = await fetch(
      `${API_URL}/api/popravila`,
      { signal }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Napaka pri pridobivanju popravil."
      );
    }

    return data.popravila;
  };

  useEffect(() => {
    const controller = new AbortController();

    const nalozi = async () => {
      try {
        const podatki = await pridobiPopravila(
          controller.signal
        );

        if (!controller.signal.aborted) {
          setPopravila(podatki);
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
  }, []);


    
    useEffect(() => {
    if (uporabnik?.vloga !== "Stanovalec" || !token) {
        return;
    }

    const controller = new AbortController();

    const pridobiSteviloPonudb = async () => {
        try {
        const response = await fetch(
            `${API_URL}/api/ponudbe/prejete`,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
            }
        );

        if (!response.ok) {
            throw new Error(
            "Napaka pri pridobivanju števila ponudb."
            );
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
            setSteviloPonudb(data.stevilo);
        }
        } catch (error) {
        if (!controller.signal.aborted) {
            console.error(error);
        }
        }
    };

    pridobiSteviloPonudb();

    return () => controller.abort();
    }, [uporabnik?.vloga, token]);



    
  useEffect(() => {
    if (uporabnik?.vloga !== "Izvajalec" || !token) {
      return;
    }

    const controller = new AbortController();

    const pridobiSteviloPotrjenih = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/ponudbe/potrjene`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            "Napaka pri pridobivanju potrjenih ponudb."
          );
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setSteviloPotrjenih(data.stevilo);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
        }
      }
    };

    pridobiSteviloPotrjenih();

    return () => controller.abort();
  }, [uporabnik?.vloga, token]);



  const filtriranaPopravila = useMemo(() => {
    const iskano = iskanje.trim().toLowerCase();

    return popravila
      .filter((popravilo) => {
        const besedilo = [
          popravilo.naslov,
          popravilo.opis,
          popravilo.kategorija,
          popravilo.lokacija,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const ustrezaIskanju =
          !iskano || besedilo.includes(iskano);

        const ustrezaKategoriji =
          !kategorija ||
          popravilo.kategorija === kategorija;

        const ustrezaLokaciji =
          !lokacija ||
          popravilo.lokacija === lokacija;

        return (
          ustrezaIskanju &&
          ustrezaKategoriji &&
          ustrezaLokaciji
        );
      })
      .sort((a, b) => {
        const datumA = new Date(
          a.datum_objave
        ).getTime();

        const datumB = new Date(
          b.datum_objave
        ).getTime();

        return razvrstitev === "najnovejsa"
          ? datumB - datumA
          : datumA - datumB;
      });
  }, [
    popravila,
    iskanje,
    kategorija,
    lokacija,
    razvrstitev,
  ]);

  const steviloStrani = Math.max(
    1,
    Math.ceil(filtriranaPopravila.length / NA_STRAN)
  );

  const trenutnaStran = Math.min(
    stran,
    steviloStrani
  );

  const prikazanaPopravila = filtriranaPopravila.slice(
    (trenutnaStran - 1) * NA_STRAN,
    trenutnaStran * NA_STRAN
  );

  const osvezi = async () => {
    const podatki = await pridobiPopravila();
    setPopravila(podatki);
  };

  const ponastaviFiltre = () => {
    setIskanje("");
    setKategorija("");
    setLokacija("");
    setRazvrstitev("najnovejsa");
    setStran(1);
  };

  const izbrisiPopravilo = async (popravilo) => {
    if (
      !window.confirm(
        `Ali res želite izbrisati "${popravilo.naslov}"?`
      )
    ) {
      return;
    }

    setNapaka("");
    setSporocilo("");

    try {
      const response = await fetch(
        `${API_URL}/api/popravila/${popravilo.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Brisanje ni uspelo."
        );
      }

      setUrejanje(null);
      setSporocilo(data.message);

      await osvezi();
    } catch (error) {
      setNapaka(error.message);
    }
  };

  const zacniUrejanje = (popravilo) => {
    setNapaka("");
    setUrejanje(popravilo.id);

    setObrazec({
      naslov: popravilo.naslov,
      kategorija: popravilo.kategorija,
      lokacija: popravilo.lokacija || "",
      opis: popravilo.opis,
    });
  };

  const shraniSpremembe = async (e) => {
    e.preventDefault();

    setShranjevanje(true);
    setNapaka("");
    setSporocilo("");

    try {
      if (
        !obrazec.naslov.trim() ||
        !obrazec.kategorija ||
        !obrazec.lokacija ||
        !obrazec.opis.trim()
      ) {
        throw new Error(
          "Izpolnite vsa obvezna polja."
        );
      }

      const response = await fetch(
        `${API_URL}/api/popravila/${urejanje}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(obrazec),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Urejanje ni uspelo."
        );
      }

      setUrejanje(null);
      setSporocilo(data.message);

      await osvezi();
    } catch (error) {
      setNapaka(error.message);
    } finally {
      setShranjevanje(false);
    }
  };

  const datum = (vrednost) =>
    vrednost
      ? new Date(vrednost).toLocaleDateString("sl-SI")
      : "Ni navedeno";

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
            {vloga === "Gost"
              ? "Obiskujete kot gost"
              : `${uporabnik.ime} · ${vloga}`}
          </span>

          {vloga === "Gost" ? (
            <Link
              to="/login"
              className="pp-header-btn"
            >
              Prijava
            </Link>
          ) : (
            <button
              className="pp-header-btn"
              onClick={() =>
                navigate(
                  vloga === "Administrator"
                    ? "/admin"
                    : vloga === "Izvajalec"
                    ? "/izvajalec"
                    : "/stanovalec"
                )
              }
            >
              Moj račun
            </button>
          )}
        </div>
      </header>

      <aside className="pp-sidebar">
        <div className="pp-sidebar-content">
          <div className="pp-sidebar-title">
            DELO IN POPRAVILA
          </div>

          <Link
            to={
              vloga === "Gost"
                ? "/login"
                : vloga === "Administrator"
                ? "/admin"
                : vloga === "Izvajalec"
                ? "/izvajalec"
                : "/stanovalec"
            }
            className="pp-menu-item"
          >
            <span>▦</span>
            Pregled
          </Link>

          <Link
            to="/popravila"
            className="pp-menu-item active"
          >
            <span>▤</span>
            Razpoložljiva popravila
          </Link>

          {vloga === "Izvajalec" && (
          <Link
            to="/izvajalec/ponudbe"
            className="pp-menu-item"
          >
            <span>✓</span>
            Potrjene ponudbe

            <span className="pr-sidebar-count">
              {steviloPotrjenih === null
                ? "..."
                : steviloPotrjenih}
            </span>
          </Link>
        )}

          
            {vloga === "Stanovalec" && (
            <Link
                to="/stanovalec/ponudbe"
                className="pp-menu-item"
            >
                <span>✉</span>
                Prejete ponudbe

                <span className="pr-sidebar-count">
                {steviloPonudb === null
                    ? "..."
                    : steviloPonudb}
                </span>
            </Link>
            )}


          {vloga === "Stanovalec" && (
            <Link
              to="/stanovalec/objavi"
              className="pp-menu-item"
            >
              <span>＋</span>
              Objavi popravilo
            </Link>
          )}

          {vloga === "Gost" && (
            <p className="pp-sidebar-note">
              Za oddajo ponudb se morate prijaviti.
            </p>
          )}
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
          Razpoložljiva popravila
        </div>

        <div className="pp-heading">
          <h1>
            Poiščite svojo naslednjo priložnost.
          </h1>

          <p>
            Prebrskajte objavljena popravila in poiščite
            ustrezno delo.
          </p>
        </div>

        <section className="pp-filters">
          <div className="pp-filters-row">

            <div className="pp-field pp-search-field">
              <label htmlFor="pp-iskanje">
                Išči popravila
              </label>

              <input
                id="pp-iskanje"
                type="search"
                placeholder="Naziv ali ključna beseda"
                value={iskanje}
                onChange={(e) => {
                  setIskanje(e.target.value);
                  setStran(1);
                }}
              />
            </div>

            <div className="pp-field">
              <label htmlFor="pp-kategorija">
                Kategorija
              </label>

              <select
                id="pp-kategorija"
                value={kategorija}
                onChange={(e) => {
                  setKategorija(e.target.value);
                  setStran(1);
                }}
              >
                <option value="">
                  Vse kategorije
                </option>

                {kategorije.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div className="pp-field">
              <label htmlFor="pp-lokacija">
                Lokacija
              </label>

              <select
                id="pp-lokacija"
                value={lokacija}
                onChange={(e) => {
                  setLokacija(e.target.value);
                  setStran(1);
                }}
              >
                <option value="">
                  Vse lokacije
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
            </div>
          </div>

          <div className="pp-filters-bottom">
            <div>
              <span>Aktivni filtri: </span>

              {kategorija || lokacija || iskanje ? (
                <strong>
                  {[
                    kategorija,
                    lokacija,
                    iskanje,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </strong>
              ) : (
                <span>Brez filtrov</span>
              )}

              <button
                className="pp-reset"
                onClick={ponastaviFiltre}
              >
                Počisti vse
              </button>
            </div>

            <span>
              {filtriranaPopravila.length} popravil
              ustreza filtrom
            </span>
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

        {sporocilo && (
          <div className="pp-alert pp-success">
            {sporocilo}
          </div>
        )}

        <div className="pp-content-grid">
          <section className="pp-results">

            <div className="pp-results-header">
              <h2>
                Razpoložljiva popravila

                <span>
                  {filtriranaPopravila.length}
                </span>
              </h2>

              <select
                aria-label="Razvrstitev popravil"
                value={razvrstitev}
                onChange={(e) =>
                  setRazvrstitev(e.target.value)
                }
              >
                <option value="najnovejsa">
                  Najnovejše
                </option>

                <option value="najstarejsa">
                  Najstarejše
                </option>
              </select>
            </div>

            {nalaganje ? (
              <div className="pp-empty">
                Nalaganje popravil...
              </div>
            ) : prikazanaPopravila.length === 0 ? (
              <div className="pp-empty">
                Ni popravil, ki ustrezajo iskanju.
              </div>
            ) : (
              <div className="pp-list">
                {prikazanaPopravila.map((popravilo) => (
                  <article
                    className="pp-repair-card"
                    key={popravilo.id}
                  >

                    <div className="pp-repair-top">
                      <h3>{popravilo.naslov}</h3>

                      <span className="pp-status">
                        {popravilo.status}
                      </span>
                    </div>

                    <div className="pp-repair-meta">
                      <strong>
                        {popravilo.kategorija}
                      </strong>

                      <span>·</span>

                      <span>
                        📍 {popravilo.lokacija ||
                          "Lokacija ni navedena"}
                      </span>
                    </div>

                    <p className="pp-description">
                      {popravilo.opis}
                    </p>

                    <div className="pp-repair-bottom">
                      <div className="pp-repair-info">
                        <span>
                          ◷ Objavljeno:{" "}
                          {datum(popravilo.datum_objave)}
                        </span>

                        {popravilo.fotografijaDodana && (
                          <span>
                            ▧ Fotografija
                          </span>
                        )}
                      </div>

                      <div className="pp-actions">
                        {vloga !== "Gost" && (
                          <button
                            className="pp-details"
                            onClick={() =>
                              navigate(`/popravila/${popravilo.id}`)
                            }
                          >
                            Podrobnosti ›
                          </button>
                        )}

                        {jeLastnik(popravilo) && (
                          <button
                            className="pp-edit"
                            onClick={() =>
                              zacniUrejanje(popravilo)
                            }
                          >
                            Uredi
                          </button>
                        )}

                        {lahkoIzbrise(popravilo) && (
                          <button
                            className="pp-delete"
                            onClick={() =>
                              izbrisiPopravilo(popravilo)
                            }
                          >
                            Izbriši
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="pp-pagination">
              <span>
                Prikazanih {prikazanaPopravila.length}
                {" "}od{" "}
                {filtriranaPopravila.length} popravil
              </span>

              <div className="pp-pages">
                <button
                  disabled={trenutnaStran === 1}
                  onClick={() =>
                    setStran(trenutnaStran - 1)
                  }
                >
                  ‹
                </button>

                {Array.from(
                  { length: steviloStrani },
                  (_, i) => i + 1
                ).map((s) => (
                  <button
                    key={s}
                    className={
                      s === trenutnaStran
                        ? "selected"
                        : ""
                    }
                    onClick={() => setStran(s)}
                  >
                    {s}
                  </button>
                ))}

                <button
                  disabled={
                    trenutnaStran === steviloStrani
                  }
                  onClick={() =>
                    setStran(trenutnaStran + 1)
                  }
                >
                  ›
                </button>
              </div>
            </div>
          </section>

          <aside className="pp-right-panel">
            {vloga === "Gost" ? (
              <div className="pp-info-card">
                <div className="pp-info-header">
                  ♙ Za prijavo potrebujete račun
                </div>

                <div className="pp-info-body">
                  <h3>
                    Trenutno brskate kot gost.
                  </h3>

                  <p>
                    Objavljena popravila lahko
                    pregledujete brez prijave.
                    Za oddajo ponudbe se
                    prijavite v svoj račun.
                  </p>

                  <Link
                    to="/login"
                    className="pp-login-btn"
                  >
                    Prijavite se
                  </Link>

                  <small>
                    Oddaja ponudb je na voljo
                    izvajalcem.
                  </small>
                </div>
              </div>
            ) : (
              <div className="pp-info-card">
                <div className="pp-info-header">
                  Vaš delovni prostor
                </div>

                <div className="pp-info-body">
                  <h3>
                    Pozdravljeni, {uporabnik.ime}!
                  </h3>

                  <p>
                    {vloga === "Izvajalec"
                      ? "Preglejte razpoložljiva dela in izberite ustrezno popravilo."
                      : vloga === "Stanovalec"
                      ? "Pregledujte popravila in upravljajte svoje objave."
                      : "Pregledujte in upravljajte objavljena popravila."}
                  </p>

                  {vloga === "Stanovalec" && (
                    <Link
                      to="/stanovalec/objavi"
                      className="pp-login-btn"
                    >
                      Objavi popravilo
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="pp-tip-card">
              <strong>
                ♧ Najprej poiščite pravo delo
              </strong>

              <p>
                Uporabite filtre za kategorijo
                in lokacijo ter iskanje po
                ključnih besedah.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {urejanje && (
        <div
          className="pp-modal-overlay"
          onClick={() => setUrejanje(null)}
        >
          <div
            className="pp-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Urejanje popravila"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Uredi popravilo</h2>

            <form onSubmit={shraniSpremembe}>

              <label htmlFor="uredi-naslov">
                Naslov
              </label>

              <input
                id="uredi-naslov"
                required
                value={obrazec.naslov}
                onChange={(e) =>
                  setObrazec({
                    ...obrazec,
                    naslov: e.target.value,
                  })
                }
              />

              <label htmlFor="uredi-kategorija">
                Kategorija
              </label>

              <select
                id="uredi-kategorija"
                required
                value={obrazec.kategorija}
                onChange={(e) =>
                  setObrazec({
                    ...obrazec,
                    kategorija: e.target.value,
                  })
                }
              >
                {kategorije.map((k) => (
                  <option
                    key={k}
                    value={k}
                  >
                    {k}
                  </option>
                ))}
              </select>

              <label htmlFor="uredi-lokacija">
                Lokacija
              </label>

              <select
                id="uredi-lokacija"
                required
                value={obrazec.lokacija}
                onChange={(e) =>
                  setObrazec({
                    ...obrazec,
                    lokacija: e.target.value,
                  })
                }
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

              <label htmlFor="uredi-opis">
                Opis
              </label>

              <textarea
                id="uredi-opis"
                required
                rows={5}
                value={obrazec.opis}
                onChange={(e) =>
                  setObrazec({
                    ...obrazec,
                    opis: e.target.value,
                  })
                }
              />

              <div className="pp-modal-actions">
                <button
                  type="submit"
                  disabled={shranjevanje}
                >
                  {shranjevanje
                    ? "Shranjevanje..."
                    : "Shrani spremembe"}
                </button>

                <button
                  type="button"
                  className="pp-cancel"
                  onClick={() => setUrejanje(null)}
                >
                  Prekliči
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PregledPopravil;
