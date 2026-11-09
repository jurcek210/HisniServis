import jwt from "jsonwebtoken";
import Uporabnik from "../models/Uporabnik.js";

const preveriJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Dostop zavrnjen. JWT žeton manjka."
      });
    }

    const token = authHeader.slice(7);

    if (!token) {
      return res.status(401).json({
        message: "JWT žeton manjka."
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    const uporabnik = await Uporabnik.findById(decoded.id);

    if (!uporabnik) {
      return res.status(401).json({
        message: "Uporabnik ne obstaja več."
      });
    }

    req.uporabnik = {
      id: uporabnik._id.toString(),
      ime: uporabnik.ime,
      priimek: uporabnik.priimek,
      email: uporabnik.email,
      vloga: uporabnik.vloga
    };

    next();

  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError" ||
      error.name === "CastError"
    ) {
      return res.status(401).json({
        message: "Neveljaven ali potekel JWT žeton."
      });
    }

    console.error("Napaka pri preverjanju JWT:", error);

    return res.status(500).json({
      message: "Napaka pri preverjanju prijave."
    });
  }
};

export default preveriJWT;
