import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";

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

  const [prijava, setPrijava] = useState(() => {
    try {
      const shranjeno = sessionStorage.getItem("prijava");

      return shranjeno
        ? JSON.parse(shranjeno)
        : { uporabnik: null, token: null };
    } catch {
      return { uporabnik: null, token: null };
    }
  });

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
