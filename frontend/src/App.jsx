
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";

const API_URL = "http://localhost:5000";

const poti = {
  Stanovalec: "/stanovalec",
  Izvajalec: "/izvajalec",
  Administrator: "/admin"
};

function PreveriPrijavo({
  uporabnik,
  token,
  dovoljenaVloga,
  children
}) {
  if (!uporabnik || !token) {
    return <Navigate to="/login" replace />;
  }

  if (uporabnik.vloga !== dovoljenaVloga) {
    return (
      <Navigate
        to={poti[uporabnik.vloga] || "/login"}
        replace
      />
    );
  }

  return children;
}

function ZacetnaStran({ uporabnik, onLogout }) {
  return (
    <div className="register-page">
      <div className="register-card">
        <h1>HišniServis</h1>
        <h2>Dobrodošli, {uporabnik.ime}!</h2>

        <p>
          Prijavljeni ste kot {uporabnik.vloga}.
        </p>

        <button onClick={onLogout}>
          Odjava
        </button>
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();

  const [prijava, setPrijava] = useState({
    uporabnik: null,
    token: null
  });

  const [preverjanje, setPreverjanje] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const preveriPrijavo = async () => {
      try {
        const shranjeno = sessionStorage.getItem("prijava");

        if (!shranjeno) return;

        const { token } = JSON.parse(shranjeno);

        if (typeof token !== "string" || !token) {
          throw new Error("JWT manjka.");
        }

        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Prijava ni več veljavna.");
        }

        const data = await response.json();

        if (!poti[data.uporabnik?.vloga]) {
          throw new Error("Neveljavna vloga uporabnika.");
        }

        const novaPrijava = {
          uporabnik: data.uporabnik,
          token
        };

        sessionStorage.setItem(
          "prijava",
          JSON.stringify(novaPrijava)
        );

        if (!controller.signal.aborted) {
          setPrijava(novaPrijava);
        }

      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Preverjanje prijave:", error.message);
        sessionStorage.removeItem("prijava");

        setPrijava({
          uporabnik: null,
          token: null
        });
      } finally {
        if (!controller.signal.aborted) {
          setPreverjanje(false);
        }
      }
    };

    preveriPrijavo();

    return () => controller.abort();
  }, []);

  const handleLogin = (uporabnik, token) => {
    const novaPrijava = { uporabnik, token };

    sessionStorage.setItem(
      "prijava",
      JSON.stringify(novaPrijava)
    );

    setPrijava(novaPrijava);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("prijava");

    setPrijava({
      uporabnik: null,
      token: null
    });

    navigate("/login", { replace: true });
  };

  if (preverjanje) {
    return (
      <div className="register-page">
        <div className="register-card">
          <h2>Preverjanje prijave...</h2>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={
              prijava.uporabnik && prijava.token
                ? poti[prijava.uporabnik.vloga] || "/login"
                : "/login"
            }
            replace
          />
        }
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login onLogin={handleLogin} />}
      />

      {["Stanovalec", "Izvajalec", "Administrator"].map(
        (vloga) => (
          <Route
            key={vloga}
            path={poti[vloga]}
            element={
              <PreveriPrijavo
                uporabnik={prijava.uporabnik}
                token={prijava.token}
                dovoljenaVloga={vloga}
              >
                <ZacetnaStran
                  uporabnik={prijava.uporabnik}
                  onLogout={handleLogout}
                />
              </PreveriPrijavo>
            }
          />
        )
      )}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
