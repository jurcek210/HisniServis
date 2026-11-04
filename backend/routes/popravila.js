
import express from "express";
import multer from "multer";
import Popravilo from "../models/Popravilo.js";

import preveriJWT from "../middleware/preveriJWT.js";
import preveriVlogo from "../middleware/preveriVlogo.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const dovoljeniTipi = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!dovoljeniTipi.includes(file.mimetype)) {
      return cb(new Error("Nedovoljen format fotografije."));
    }

    cb(null, true);
  },
});

router.post(
  "/",
  preveriJWT,
  preveriVlogo("Stanovalec"),
  (req, res, next) => {
    upload.single("fotografija")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      const { naslov, kategorija, opis } = req.body;

      if (
        typeof naslov !== "string" ||
        !naslov.trim() ||
        typeof kategorija !== "string" ||
        !kategorija.trim() ||
        typeof opis !== "string" ||
        !opis.trim()
      ) {
        return res.status(400).json({
          message: "Naslov, kategorija in opis so obvezni.",
        });
      }

      const novoPopravilo = new Popravilo({
        stanovalec: req.uporabnik.id,
        naslov: naslov.trim(),
        kategorija: kategorija.trim(),
        opis: opis.trim(),
      });

      if (req.file) {
        novoPopravilo.fotografija = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      await novoPopravilo.save();

      return res.status(201).json({
        message: "Popravilo je bilo uspešno objavljeno.",
        popravilo: {
          id: novoPopravilo._id,
          naslov: novoPopravilo.naslov,
          kategorija: novoPopravilo.kategorija,
          opis: novoPopravilo.opis,
          status: novoPopravilo.status,
          datum_objave: novoPopravilo.datum_objave,
          fotografijaDodana: !!req.file,
        },
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Neveljavni podatki popravila.",
        });
      }

      console.error(error);

      return res.status(500).json({
        message: "Napaka pri shranjevanju popravila.",
      });
    }
  }
);


router.get("/:id/fotografija", preveriJWT, async (req, res) => {
  try {
    const popravilo = await Popravilo.findById(req.params.id);

    if (!popravilo) {
      return res.status(404).json({
        message: "Popravilo ne obstaja.",
      });
    }

    if (!popravilo.fotografija?.data) {
      return res.status(404).json({
        message: "Popravilo nima fotografije.",
      });
    }

    res.set("Content-Type", popravilo.fotografija.contentType);
    res.send(popravilo.fotografija.data);

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Neveljaven ID popravila.",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Napaka pri pridobivanju fotografije.",
    });
  }
});


router.get(
  "/",
  async (req, res) => {
    try {
      const popravila = await Popravilo.find({
        status: "ODPRTO"
      })
        .select(
          "stanovalec naslov kategorija opis status datum_objave fotografija.contentType"
        )
        .sort({ datum_objave: -1 })
        .lean();

      const seznam = popravila.map((popravilo) => ({
        id: popravilo._id,
        naslov: popravilo.naslov,
        kategorija: popravilo.kategorija,
        opis: popravilo.opis,
        status: popravilo.status,
        datum_objave: popravilo.datum_objave,
        stanovalec: popravilo.stanovalec?.toString(),
        fotografijaDodana: Boolean(
          popravilo.fotografija?.contentType
        ),
      }));

      return res.status(200).json({
        message: "Seznam popravil uspešno pridobljen.",
        stevilo: seznam.length,
        popravila: seznam,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Napaka pri pridobivanju popravil.",
      });
    }
  }
);


router.patch("/:id", preveriJWT, async (req, res) => {
  try {
    const popravilo = await Popravilo.findById(req.params.id);

    if (!popravilo) {
      return res.status(404).json({
        message: "Popravilo ne obstaja.",
      });
    }

    const jeLastnik =
      popravilo.stanovalec.toString() === req.uporabnik.id;

    if (req.uporabnik.vloga !== "Stanovalec" || !jeLastnik) {
      return res.status(403).json({
        message: "Urejate lahko samo svoja popravila.",
      });
    }

    if (popravilo.status !== "ODPRTO") {
      return res.status(400).json({
        message: "Urejate lahko samo odprta popravila.",
      });
    }

    const { naslov, kategorija, opis } = req.body;

    if (
      typeof naslov !== "string" || !naslov.trim() ||
      typeof kategorija !== "string" || !kategorija.trim() ||
      typeof opis !== "string" || !opis.trim()
    ) {
      return res.status(400).json({
        message: "Vsa obvezna polja morajo biti izpolnjena.",
      });
    }

    popravilo.naslov = naslov.trim();
    popravilo.kategorija = kategorija.trim();
    popravilo.opis = opis.trim();

    await popravilo.save();

    return res.status(200).json({
      message: "Popravilo je bilo uspešno posodobljeno.",
    });

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Neveljaven ID popravila.",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Napaka pri posodabljanju popravila.",
    });
  }
});




router.delete("/:id", preveriJWT, async (req, res) => {
  try {
    const popravilo = await Popravilo.findById(req.params.id);

    if (!popravilo) {
      return res.status(404).json({
        message: "Popravilo ne obstaja.",
      });
    }

    const jeAdmin = req.uporabnik.vloga === "Administrator";

    const jeLastnik =
      req.uporabnik.vloga === "Stanovalec" &&
      popravilo.stanovalec.toString() === req.uporabnik.id;

    if (!jeAdmin && !jeLastnik) {
      return res.status(403).json({
        message: "Nimate dovoljenja za brisanje popravila.",
      });
    }

    if (!jeAdmin && popravilo.status !== "ODPRTO") {
      return res.status(400).json({
        message: "Izbrišete lahko samo odprta popravila.",
      });
    }

    await popravilo.deleteOne();

    return res.status(200).json({
      message: "Popravilo je bilo uspešno izbrisano.",
    });

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Neveljaven ID popravila.",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Napaka pri brisanju popravila.",
    });
  }
});


export default router;
