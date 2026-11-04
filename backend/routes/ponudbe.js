
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

export default router;
