
import mongoose from "mongoose";

const ponudbaSchema = new mongoose.Schema(
  {
    popravilo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Popravilo",
      required: true,
    },

    izvajalec: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Uporabnik",
      required: true,
    },

    cena: {
      type: Number,
      required: true,
      min: [0.01, "Cena mora biti večja od 0 EUR."],
    },

    opis: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    predviden_cas: {
      type: Number,
      required: true,
      min: [1, "Predviden čas mora biti vsaj 1 dan."],
    },

    datum_oddaje: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["ODDANA", "SPREJETA", "ZAVRNJENA"],
      default: "ODDANA",
    },
  },
  {
    timestamps: true,
  }
);

ponudbaSchema.index(
  { popravilo: 1, izvajalec: 1 },
  { unique: true }
);

const Ponudba = mongoose.model("Ponudba", ponudbaSchema);

export default Ponudba;
