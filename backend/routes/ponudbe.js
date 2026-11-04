
import express from "express";
import mongoose from "mongoose";

import Ponudba from "../models/Ponudba.js";
import Popravilo from "../models/Popravilo.js";

import preveriJWT from "../middleware/preveriJWT.js";
import preveriVlogo from "../middleware/preveriVlogo.js";

const router = express.Router();

router.post(
  "/",
  preveriJWT,
  preveriVlogo("Izvajalec"),
  async (req, res) => {
    try {
      const {
        popravilo,
        cena,
        opis,
        predviden_cas,
      } = req.body;

      if (
        typeof popravilo !== "string" ||
        !popravilo.trim() ||
        typeof cena !== "number" ||
        !Number.isFinite(cena) ||
        typeof opis !== "string" ||
        !opis.trim() ||
        typeof predviden_cas !== "number" ||
        !Number.isInteger(predviden_cas)
      ) {
        return res.status(400).json({
          message: "Vnesite veljavne podatke ponudbe.",
        });
      }

      if (
        cena <= 0 ||
        predviden_cas < 1
      ) {
        return res.status(400).json({
          message:
            "Cena mora biti večja od 0, čas izvedbe pa vsaj 1 dan.",
        });
      }

      if (!Number.isInteger(Math.round(cena * 100))) {
        return res.status(400).json({
          message: "Neveljavna cena.",
        });
      }

      if (!mongoose.isValidObjectId(popravilo)) {
        return res.status(400).json({
          message: "Neveljaven ID popravila.",
        });
      }

      const obstojecePopravilo = await Popravilo.findById(
        popravilo
      );

      if (!obstojecePopravilo) {
        return res.status(404).json({
          message: "Popravilo ne obstaja.",
        });
      }

      if (obstojecePopravilo.status !== "ODPRTO") {
        return res.status(400).json({
          message:
            "Ponudbo lahko oddate samo za odprta popravila.",
        });
      }

      const obstojecaPonudba = await Ponudba.findOne({
        popravilo,
        izvajalec: req.uporabnik.id,
      });

      if (obstojecaPonudba) {
        return res.status(409).json({
          message:
            "Za to popravilo ste že oddali ponudbo.",
        });
      }

      const novaPonudba = new Ponudba({
        popravilo,
        izvajalec: req.uporabnik.id,
        cena,
        opis: opis.trim(),
        predviden_cas,
      });

      await novaPonudba.save();

      return res.status(201).json({
        message: "Ponudba je bila uspešno oddana.",
        ponudba: {
          id: novaPonudba._id,
          popravilo: novaPonudba.popravilo,
          izvajalec: novaPonudba.izvajalec,
          cena: novaPonudba.cena,
          opis: novaPonudba.opis,
          predviden_cas: novaPonudba.predviden_cas,
          datum_oddaje: novaPonudba.datum_oddaje,
          status: novaPonudba.status,
        },
      });

    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message:
            "Za to popravilo ste že oddali ponudbo.",
        });
      }

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Neveljavni podatki ponudbe.",
        });
      }

      console.error(error);

      return res.status(500).json({
        message: "Napaka pri oddaji ponudbe.",
      });
    }
  }
);


router.get(
  "/popravilo/:popraviloId",
  preveriJWT,
  preveriVlogo("Stanovalec", "Administrator"),
  async (req, res) => {
    try {
      const { popraviloId } = req.params;

      if (!mongoose.isValidObjectId(popraviloId)) {
        return res.status(400).json({
          message: "Neveljaven ID popravila.",
        });
      }

      const popravilo = await Popravilo.findById(
        popraviloId
      ).select("stanovalec naslov kategorija lokacija status");

      if (!popravilo) {
        return res.status(404).json({
          message: "Popravilo ne obstaja.",
        });
      }

      const jeLastnik =
        popravilo.stanovalec.toString() ===
        req.uporabnik.id;

      const jeAdministrator =
        req.uporabnik.vloga === "Administrator";

      if (!jeLastnik && !jeAdministrator) {
        return res.status(403).json({
          message:
            "Pregledujete lahko samo ponudbe za svoja popravila.",
        });
      }

      const ponudbe = await Ponudba.find({
        popravilo: popraviloId,
      })
        .populate(
          "izvajalec",
          "ime priimek"
        )
        .sort({
          datum_oddaje: -1,
        })
        .lean();

      const seznam = ponudbe.map((ponudba) => ({
        id: ponudba._id,
        popravilo: ponudba.popravilo,
        izvajalec: ponudba.izvajalec
          ? {
              id: ponudba.izvajalec._id,
              ime: ponudba.izvajalec.ime,
              priimek: ponudba.izvajalec.priimek,
            }
          : null,
        cena: ponudba.cena,
        opis: ponudba.opis,
        predviden_cas: ponudba.predviden_cas,
        datum_oddaje: ponudba.datum_oddaje,
        status: ponudba.status,
      }));

      return res.status(200).json({
        message: "Ponudbe so bile uspešno pridobljene.",
        popravilo: {
          id: popravilo._id,
          naslov: popravilo.naslov,
          kategorija: popravilo.kategorija,
          lokacija: popravilo.lokacija,
          status: popravilo.status,
        },
        stevilo: seznam.length,
        ponudbe: seznam,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Napaka pri pridobivanju ponudb.",
      });
    }
  }
);

router.get(
  "/prejete",
  preveriJWT,
  preveriVlogo("Stanovalec"),
  async (req, res) => {
    try {
      const popravila = await Popravilo.find({
        stanovalec: req.uporabnik.id,
      })
        .select("_id")
        .lean();

      const idsPopravil = popravila.map(
        (popravilo) => popravilo._id
      );

      const ponudbe = await Ponudba.find({
        popravilo: { $in: idsPopravil },
      })
        .populate(
          "izvajalec",
          "ime priimek"
        )
        .populate(
          "popravilo",
          "naslov kategorija lokacija status"
        )
        .sort({ datum_oddaje: -1 })
        .lean();

      const seznam = ponudbe.map((ponudba) => ({
        id: ponudba._id,

        popravilo: ponudba.popravilo
          ? {
              id: ponudba.popravilo._id,
              naslov: ponudba.popravilo.naslov,
              kategorija: ponudba.popravilo.kategorija,
              lokacija: ponudba.popravilo.lokacija,
              status: ponudba.popravilo.status,
            }
          : null,

        izvajalec: ponudba.izvajalec
          ? {
              id: ponudba.izvajalec._id,
              ime: ponudba.izvajalec.ime,
              priimek: ponudba.izvajalec.priimek,
            }
          : null,

        cena: ponudba.cena,
        opis: ponudba.opis,
        predviden_cas: ponudba.predviden_cas,
        datum_oddaje: ponudba.datum_oddaje,
        status: ponudba.status,
      }));

      return res.status(200).json({
        message: "Prejete ponudbe uspešno pridobljene.",
        stevilo: seznam.length,
        ponudbe: seznam,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Napaka pri pridobivanju prejetih ponudb.",
      });
    }
  }
);


export default router;
