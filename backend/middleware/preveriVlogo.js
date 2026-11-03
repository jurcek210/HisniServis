
const preveriVlogo = (...dovoljeneVloge) => {
  return (req, res, next) => {

    if (!req.uporabnik) {
      return res.status(401).json({
        message: "Za dostop se morate prijaviti."
      });
    }

    if (!dovoljeneVloge.includes(req.uporabnik.vloga)) {
      return res.status(403).json({
        message: "Nimate dovoljenja za dostop do te funkcionalnosti."
      });
    }

    next();
  };
};

export default preveriVlogo;
