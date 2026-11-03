
import express from "express";
import preveriJWT from "../middleware/preveriJWT.js";
import preveriVlogo from "../middleware/preveriVlogo.js";

const router = express.Router();

router.use(preveriJWT);

router.get(
  "/stanovalec",
  preveriVlogo("Stanovalec"),
  (req, res) => {
    res.status(200).json({
      message: "Dostop dovoljen za stanovalca.",
      uporabnik: req.uporabnik
    });
  }
);

router.get(
  "/izvajalec",
  preveriVlogo("Izvajalec"),
  (req, res) => {
    res.status(200).json({
      message: "Dostop dovoljen za izvajalca.",
      uporabnik: req.uporabnik
    });
  }
);

router.get(
  "/admin",
  preveriVlogo("Administrator"),
  (req, res) => {
    res.status(200).json({
      message: "Dostop dovoljen za administratorja.",
      uporabnik: req.uporabnik
    });
  }
);

export default router;
