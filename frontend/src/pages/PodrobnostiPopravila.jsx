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

  useEffect(() => {
    const controller = new AbortController();
    let ustvarjenUrl = null;

    const pridobiPodatke = async () => {
      setNalaganje(true);
      setNapaka("");
      setNapakaSlike("");
      setPopravilo(null);
      setSlikaUrl(null);

      try {
        if (!token) {
          throw new Error("Za ogled podrobnosti se morate prijaviti.");
        }

        // PRIDOBIVANJE PODATKOV O POPRAVILU
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
            data.message || "Popravila ni bilo mogoče pridobiti."
          );
        }

        if (controller.signal.aborted) return;

        setPopravilo(data.popravilo);

        // PRIDOBIVANJE FOTOGRAFIJE
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
              throw new Error("Fotografije ni bilo mogoče naložiti.");
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

      {/* NAVIGACIJA */}
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

          <Link to="/popravila" className="pd-header-button">
            Vsa popravila
          </Link>
        </div>
      </header>

      <main className="pd-main">

        {/* NAZAJ NA SEZNAM */}
        <Link to="/popravila" className="pd-back">
          ← Nazaj na seznam popravil
        </Link>

        {nalaganje ? (
          <div className="pd-message">
            Nalaganje podatkov o popravilu...
          </div>
        ) : napaka ? (
          <div className="pd-message pd-error" role="alert">
            {napaka}
          </div>
        ) : popravilo ? (
          <>
            {/* NASLOV POPRAVILA */}
            <div className="pd-page-heading">
              <div>
                <div className="pd-breadcrumb">
                  Delovni prostor › Popravila › Podrobnosti
                </div>

                <h1>{popravilo.naslov}</h1>

                <p>
                  {popravilo.kategorija}
                  {" · "}
                  {popravilo.lokacija || "Lokacija ni navedena"}
                  {" · "}
                  {datum(popravilo.datum_objave)}
                </p>
              </div>

              <span className="pd-status">
                {popravilo.status}
              </span>
            </div>

            {/* PODROBNOSTI */}
            <div className="pd-content-grid">

              {/* LEVI DEL - FOTOGRAFIJA */}
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
                      <p>Fotografija trenutno ni na voljo.</p>
                    ) : (
                      <p>Fotografija ni bila dodana.</p>
                    )}
                  </div>
                )}

                <div className="pd-photo-footer">
                  {popravilo.fotografijaDodana
                    ? "Fotografija, ki jo je dodal stanovalec."
                    : "Stanovalec ni priložil fotografije."}
                </div>
              </section>

              {/* DESNI DEL */}
              <div className="pd-details-column">

                {/* OPIS */}
                <section className="pd-detail-card">
                  <h2>Opis popravila</h2>

                  <p className="pd-description">
                    {popravilo.opis}
                  </p>
                </section>

                {/* OSNOVNE INFORMACIJE */}
                <section className="pd-detail-card">
                  <h2>Informacije o popravilu</h2>

                  <div className="pd-info-row">
                    <span>Kategorija</span>
                    <strong>{popravilo.kategorija}</strong>
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
                    <strong>{popravilo.status}</strong>
                  </div>

                  <div className="pd-info-row">
                    <span>Datum objave</span>
                    <strong>
                      {datum(popravilo.datum_objave)}
                    </strong>
                  </div>
                </section>

                {/* SPODNJI DEL */}
                <section className="pd-action-card">
                  <h3>Vas zanima to popravilo?</h3>

                  {uporabnik?.vloga === "Izvajalec" ? (
                    <p>
                      Tukaj boste lahko oddali ponudbo
                      za izvedbo popravila.
                    </p>
                  ) : (
                    <p>
                      Preglejte informacije o objavljenem
                      popravilu in njegovo trenutno stanje.
                    </p>
                  )}

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
