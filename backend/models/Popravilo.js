import mongoose from "mongoose";

const popraviloSchema = new mongoose.Schema({
  stanovalec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Uporabnik",
    required: true,
  },

  naslov: {
    type: String,
    required: true,
    trim: true,
  },

  kategorija: {
    type: String,
    required: true,
    trim: true,
  },

  opis: {
    type: String,
    required: true,
    trim: true,
  },

  fotografija: {
    data: {
      type: Buffer,
      default: null,
    },
    contentType: {
      type: String,
      default: null,
    },
  },

  lokacija: {
  type: String,
  trim: true,
  default: null,
  },

  status: {
    type: String,
    enum: ["ODPRTO", "V_TEKU", "ZAKLJUCENO"],
    default: "ODPRTO",
  },

  datum_objave: {
    type: Date,
    default: Date.now,
  },
});

const Popravilo = mongoose.model("Popravilo", popraviloSchema);

export default Popravilo;
