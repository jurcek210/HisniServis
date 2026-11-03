
import express from "express";
import Uporabnik from "../models/Uporabnik.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
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
    } = req.body ?? {};

    const veljavenNiz = (vrednost) =>
      typeof vrednost === "string" &&
      vrednost.trim().length > 0;

    if (
      !veljavenNiz(ime) ||
      !veljavenNiz(priimek) ||
      !veljavenNiz(email) ||
      !veljavenNiz(geslo) ||
      !veljavenNiz(telefon)
    ) {
      return res.status(400).json({
        message: "Izpolniti morate vsa obvezna polja."
      });
    }

    if (!["Stanovalec", "Izvajalec"].includes(vloga)) {
      return res.status(400).json({
        message: "Neveljavna uporabniška vloga."
      });
    }

    if (
      vloga === "Izvajalec" &&
      (!veljavenNiz(specializacija) || !veljavenNiz(opis))
    ) {
      return res.status(400).json({
        message: "Izvajalec mora vnesti specializacijo in opis."
      });
    }

    if (geslo.length < 8) {
      return res.status(400).json({
        message: "Geslo mora vsebovati vsaj 8 znakov."
      });
    }

    const emailNormaliziran = email.trim().toLowerCase();

    const emailVzorec = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailVzorec.test(emailNormaliziran)) {
      return res.status(400).json({
        message: "Neveljaven e-poštni naslov."
      });
    }

    const obstojeci = await Uporabnik.findOne({
      email: emailNormaliziran
    });

    if (obstojeci) {
      return res.status(409).json({
        message: "Uporabnik s tem e-poštnim naslovom že obstaja."
      });
    }

    const podatki = {
      ime: ime.trim(),
      priimek: priimek.trim(),
      email: emailNormaliziran,
      geslo,
      telefon: telefon.trim(),
      vloga
    };

    if (vloga === "Izvajalec") {
      podatki.specializacija = specializacija.trim();
      podatki.opis = opis.trim();
    }

    const uporabnik = await Uporabnik.create(podatki);

    return res.status(201).json({
      message: "Registracija uspešna!",
      uporabnik: {
        id: uporabnik._id,
        ime: uporabnik.ime,
        priimek: uporabnik.priimek,
        email: uporabnik.email,
        telefon: uporabnik.telefon,
        vloga: uporabnik.vloga,
        ...(vloga === "Izvajalec" && {
          specializacija: uporabnik.specializacija,
          opis: uporabnik.opis
        })
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Uporabnik s tem e-poštnim naslovom že obstaja."
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Neveljavni podatki za registracijo."
      });
    }

    console.error("Napaka pri registraciji:", error);

    return res.status(500).json({
      message: "Napaka na strežniku."
    });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, geslo } = req.body ?? {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof geslo !== "string" ||
      !geslo
    ) {
      return res.status(400).json({
        message: "Vnesite e-poštni naslov in geslo."
      });
    }

    const uporabnik = await Uporabnik.findOne({
      email: email.trim().toLowerCase()
    }).select("+geslo");

    if (!uporabnik) {
      return res.status(401).json({
        message: "Napačen e-poštni naslov ali geslo."
      });
    }

    const pravilnoGeslo = await uporabnik.preveriGeslo(geslo);

    if (!pravilnoGeslo) {
      return res.status(401).json({
        message: "Napačen e-poštni naslov ali geslo."
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET ni nastavljen.");
    }

    const token = jwt.sign(
      {
        id: uporabnik._id.toString(),
        vloga: uporabnik.vloga
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d", algorithm: "HS256" }
    );

    return res.status(200).json({
      message: "Prijava uspešna!",
      token,
      uporabnik: {
        id: uporabnik._id,
        ime: uporabnik.ime,
        priimek: uporabnik.priimek,
        email: uporabnik.email,
        vloga: uporabnik.vloga
      }
    });

  } catch (error) {
    console.error("Napaka pri prijavi:", error);

    return res.status(500).json({
      message: "Napaka na strežniku."
    });
  }
});


export default router;
