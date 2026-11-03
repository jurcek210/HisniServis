
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const uporabnikSchema = new mongoose.Schema(
  {
    ime: {
      type: String,
      required: true,
      trim: true
    },

    priimek: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    geslo: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    telefon: {
      type: String,
      required: true,
      trim: true
    },

    vloga: {
      type: String,
      enum: ["Stanovalec", "Izvajalec", "Administrator"],
      default: "Stanovalec",
      required: true
    },

    specializacija: {
      type: String,
      trim: true,
      required: function () {
        return this.vloga === "Izvajalec";
      }
    },

    opis: {
    type: String,
    trim: true,
    required: function () {
        return this.vloga === "Izvajalec";
    }
    },

    aktiven: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

uporabnikSchema.pre("save", async function () {
  if (!this.isModified("geslo")) return;

  this.geslo = await bcrypt.hash(this.geslo, 12);
});

uporabnikSchema.methods.preveriGeslo = function (geslo) {
  return bcrypt.compare(geslo, this.geslo);
};

const Uporabnik = mongoose.model("Uporabnik", uporabnikSchema);

export default Uporabnik;
