
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./PodrobnostiPopravila.css";

const API_URL = "http://localhost:5000";

function PodrobnostiPopravila({ token, uporabnik }) {
  const { id } = useParams();

  const [popravilo, setPopravilo] = useState(null);
  const [slikaUrl, setSlikaUrl] = useState(null);
  const [nalaganje, setNalaganje] = useState(true);
  const [napaka, setNapaka] = useState("");
  const [napakaSlike, setNapakaSlike] = useState("");

  const [prikaziObrazec, setPrikaziObrazec] = useState(false);
  const [cena, setCena] = useState("");
  const [opisPonudbe, setOpisPonudbe] = useState("");
  const [predvidenCas, setPredvidenCas] = useState("");
  const [oddajanje, setOddajanje] = useState(false);
  const [sporociloPonudbe, setSporociloPonudbe] = useState("");
  const [napakaPonudbe, setNapakaPonudbe] = useState("");
  const [ponudbaOddana, setPonudbaOddana] = useState(false);

  const jeIzvajalec = uporabnik?.vloga === "Izvajalec";

  useEffect(() => {
    const controller = new AbortController();
    let ustvarjenUrl = null;

    const pridobiPodatke = async () => {
      setNalaganje(true);
      setNapaka("");
      setNapakaSlike("");
      setPopravilo(null);
      setSlikaUrl(null);

      setPrikaziObrazec(false);
      setCena("");
      setOpisPonudbe("");
      setPredvidenCas("");
      setSporociloPonudbe("");
      setNapakaPonudbe("");
      setPonudbaOddana(false);

      try {
        if (!token) {
          throw new Error(
            "Za ogled podrobnosti se morate prijaviti."
          );
        }

        const response = await fetch(
          `${API_URL}/api/popravila/${id}`,
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
              "Popravila ni bilo mogoče pridobiti."
          );
        }

        if (controller.signal.aborted) return;

        setPopravilo(data.popravilo);

        if (data.popravilo.fotografijaDodana) {
          try {
            const slikaResponse = await fetch(
              `${API_URL}/api/popravila/${id}/fotografija`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                signal: controller.signal,
              }
            );

            if (!slikaResponse.ok) {
              throw new Error(
                "Fotografije ni bilo mogoče naložiti."
              );
            }

            const blob = await slikaResponse.blob();

            if (controller.signal.aborted) return;

            ustvarjenUrl = URL.createObjectURL(blob);
            setSlikaUrl(ustvarjenUrl);

          } catch (error) {
            if (!controller.signal.aborted) {
              setNapakaSlike(error.message);
            }
          }
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

    pridobiPodatke();

    return () => {
      controller.abort();

      if (ustvarjenUrl) {
        URL.revokeObjectURL(ustvarjenUrl);
      }
    };
  }, [id, token]);

  const oddajPonudbo = async (e) => {
    e.preventDefault();

    setNapakaPonudbe("");
    setSporociloPonudbe("");

    const stevilcnaCena = Number(cena);
    const stevilcniCas = Number(predvidenCas);

    if (
      cena.trim() === "" ||
      !Number.isFinite(stevilcnaCena) ||
      stevilcnaCena <= 0
    ) {
      setNapakaPonudbe(
        "Vnesite veljavno ceno, večjo od 0 €."
      );
      return;
    }

    if (
      predvidenCas.trim() === "" ||
      !Number.isInteger(stevilcniCas) ||
      stevilcniCas < 1
    ) {
      setNapakaPonudbe(
        "Predviden čas mora biti vsaj 1 dan."
      );
      return;
    }

    if (!opisPonudbe.trim()) {
      setNapakaPonudbe(
        "Vnesite opis ponudbe."
      );
      return;
    }

    setOddajanje(true);

    try {
      const response = await fetch(
        `${API_URL}/api/ponudbe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            popravilo: id,
            cena: stevilcnaCena,
            opis: opisPonudbe.trim(),
            predviden_cas: stevilcniCas,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setPonudbaOddana(true);
          setPrikaziObrazec(false);
        }

        throw new Error(
          data.message || "Oddaja ponudbe ni uspela."
        );
      }

      setPonudbaOddana(true);
      setPrikaziObrazec(false);

      setCena("");
      setOpisPonudbe("");
      setPredvidenCas("");

      setSporociloPonudbe(
        "Ponudba je bila uspešno oddana!"
      );

    } catch (error) {
      setNapakaPonudbe(error.message);
    } finally {
      setOddajanje(false);
    }
  };

  const datum = (vrednost) => {
    if (!vrednost) return "Ni navedeno";

    return new Date(vrednost).toLocaleDateString(
      "sl-SI",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  return (
    <div className="pd-layout">

      <header className="pd-header">
        <Link to="/popravila" className="pd-logo">
          <span className="pd-logo-icon">⌂</span>
          <strong>HišniServis</strong>
          <span className="pd-logo-subtitle">
            Delovni prostor
          </span>
        </Link>

        <div className="pd-header-right">
          <span>
            {uporabnik?.ime} · {uporabnik?.vloga}
          </span>

          <Link
            to="/popravila"
            className="pd-header-button"
          >
            Vsa popravila
          </Link>
        </div>
      </header>

      <main className="pd-main">

        <Link to="/popravila" className="pd-back">
          ← Nazaj na seznam popravil
        </Link>

        {nalaganje ? (
          <div className="pd-message">
            Nalaganje podatkov o popravilu...
          </div>
        ) : napaka ? (
          <div
            className="pd-message pd-error"
            role="alert"
          >
            {napaka}
          </div>
        ) : popravilo ? (
          <>
            <div className="pd-page-heading">
              <div>
                <div className="pd-breadcrumb">
                  Delovni prostor › Popravila › Podrobnosti
                </div>

                <h1>{popravilo.naslov}</h1>

                <p>
                  {popravilo.kategorija}
                  {" · "}
                  {popravilo.lokacija ||
                    "Lokacija ni navedena"}
                  {" · "}
                  {datum(popravilo.datum_objave)}
                </p>
              </div>

              <span className="pd-status">
                {popravilo.status}
              </span>
            </div>

            <div className="pd-content-grid">

              <section className="pd-photo-card">
                <div className="pd-section-heading">
                  <h2>Fotografija popravila</h2>
                </div>

                {slikaUrl ? (
                  <div className="pd-photo-container">
                    <img
                      src={slikaUrl}
                      alt={`Fotografija popravila: ${popravilo.naslov}`}
                    />
                  </div>
                ) : (
                  <div className="pd-no-photo">
                    <span className="pd-no-photo-icon">
                      ▧
                    </span>

                    {napakaSlike ? (
                      <p>{napakaSlike}</p>
                    ) : popravilo.fotografijaDodana ? (
                      <p>
                        Fotografija trenutno ni na voljo.
                      </p>
                    ) : (
                      <p>
                        Fotografija ni bila dodana.
                      </p>
                    )}
                  </div>
                )}

                <div className="pd-photo-footer">
                  {popravilo.fotografijaDodana
                    ? "Fotografija, ki jo je dodal stanovalec."
                    : "Stanovalec ni priložil fotografije."}
                </div>
              </section>

              <div className="pd-details-column">

                <section className="pd-detail-card">
                  <h2>Opis popravila</h2>

                  <p className="pd-description">
                    {popravilo.opis}
                  </p>
                </section>

                <section className="pd-detail-card">
                  <h2>Informacije o popravilu</h2>

                  <div className="pd-info-row">
                    <span>Kategorija</span>
                    <strong>
                      {popravilo.kategorija}
                    </strong>
                  </div>

                  <div className="pd-info-row">
                    <span>Lokacija</span>
                    <strong>
                      {popravilo.lokacija ||
                        "Lokacija ni navedena"}
                    </strong>
                  </div>

                  <div className="pd-info-row">
                    <span>Status</span>
                    <strong>
                      {popravilo.status}
                    </strong>
                  </div>

                  <div className="pd-info-row">
                    <span>Datum objave</span>
                    <strong>
                      {datum(popravilo.datum_objave)}
                    </strong>
                  </div>
                </section>

                {jeIzvajalec && (
                  <section className="pd-offer-card">
                    <h2>Oddaja ponudbe</h2>

                    {sporociloPonudbe && (
                      <div
                        className="pd-offer-success"
                        role="status"
                      >
                        {sporociloPonudbe}
                      </div>
                    )}

                    {napakaPonudbe && (
                      <div
                        className="pd-offer-error"
                        role="alert"
                      >
                        {napakaPonudbe}
                      </div>
                    )}

                    {ponudbaOddana ? (
                      <p className="pd-offer-note">
                        Za to popravilo je vaša ponudba že
                        oddana oziroma evidentirana.
                      </p>
                    ) : popravilo.status !== "ODPRTO" ? (
                      <p className="pd-offer-note">
                        Ponudbo je mogoče oddati samo
                        za odprta popravila.
                      </p>
                    ) : !prikaziObrazec ? (
                      <>
                        <p className="pd-offer-note">
                          Vas zanima izvedba tega popravila?
                          Oddajte ponudbo s svojo ceno
                          in predvidenim časom izvedbe.
                        </p>

                        <button
                          type="button"
                          className="pd-offer-open"
                          onClick={() => {
                            setNapakaPonudbe("");
                            setPrikaziObrazec(true);
                          }}
                        >
                          + Oddaj ponudbo
                        </button>
                      </>
                    ) : (
                      <form
                        className="pd-offer-form"
                        onSubmit={oddajPonudbo}
                      >
                        <div className="pd-offer-field">
                          <label htmlFor="ponudba-cena">
                            Cena ponudbe (€)
                          </label>

                          <input
                            id="ponudba-cena"
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="Npr. 150"
                            value={cena}
                            onChange={(e) =>
                              setCena(e.target.value)
                            }
                            required
                          />
                        </div>

                        <div className="pd-offer-field">
                          <label htmlFor="ponudba-cas">
                            Predviden čas izvedbe (dni)
                          </label>

                          <input
                            id="ponudba-cas"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Npr. 2"
                            value={predvidenCas}
                            onChange={(e) =>
                              setPredvidenCas(e.target.value)
                            }
                            required
                          />
                        </div>

                        <div className="pd-offer-field">
                          <label htmlFor="ponudba-opis">
                            Opis ponudbe
                          </label>

                          <textarea
                            id="ponudba-opis"
                            rows={5}
                            maxLength={2000}
                            placeholder="Opišite, kako boste izvedli popravilo, kaj vključuje cena in morebitne dodatne informacije..."
                            value={opisPonudbe}
                            onChange={(e) =>
                              setOpisPonudbe(e.target.value)
                            }
                            required
                          />

                          <small>
                            {opisPonudbe.length}/2000 znakov
                          </small>
                        </div>

                        <div className="pd-offer-actions">
                          <button
                            type="button"
                            className="pd-offer-cancel"
                            onClick={() => {
                              setPrikaziObrazec(false);
                              setNapakaPonudbe("");
                            }}
                            disabled={oddajanje}
                          >
                            Prekliči
                          </button>

                          <button
                            type="submit"
                            className="pd-offer-submit"
                            disabled={oddajanje}
                          >
                            {oddajanje
                              ? "Oddajanje..."
                              : "Pošlji ponudbo"}
                          </button>
                        </div>
                      </form>
                    )}
                  </section>
                )}

                <section className="pd-action-card">
                  <h3>Informacije o popravilu</h3>

                  <p>
                    {jeIzvajalec
                      ? "Preglejte podatke o popravilu in po potrebi oddajte ponudbo za izvedbo."
                      : "Preglejte informacije o objavljenem popravilu in njegovo trenutno stanje."}
                  </p>

                  <Link to="/popravila">
                    Nazaj na popravila
                  </Link>
                </section>
              </div>
            </div>
          </>
        ) : null}

        <footer className="pd-footer">
          <span>© 2026 HišniServis</span>
          <span>Vse pravice pridržane</span>
        </footer>
      </main>
    </div>
  );
}

export default PodrobnostiPopravila;
