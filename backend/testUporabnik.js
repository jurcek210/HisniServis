
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Uporabnik from "./models/Uporabnik.js";

dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Uporabnik.init();

    console.log("MongoDB povezan!");

    // Ustvarimo testnega stanovalca
    const uporabnik = await Uporabnik.create({
      ime: "Test",
      priimek: "Stanovalec",
      email: "test.stanovalec@example.com",
      geslo: "TestGeslo123!",
      telefon: "041123456",
      vloga: "Stanovalec"
    });

    console.log("Uporabnik ustvarjen:", uporabnik.email);

    // Preverimo, ali je geslo zgoščeno
    const shranjen = await Uporabnik.findById(uporabnik._id)
      .select("+geslo");

    console.log(
      "Geslo je zgoščeno:",
      shranjen.geslo !== "TestGeslo123!" &&
      await bcrypt.compare("TestGeslo123!", shranjen.geslo)
    );

    // Preverimo privzeto izključitev gesla
    const brezGesla = await Uporabnik.findById(uporabnik._id);

    console.log(
      "Geslo ni vključeno v poizvedbo:",
      brezGesla.geslo === undefined
    );

    // Preverimo unikatnost e-pošte
    try {
      await Uporabnik.create({
        ime: "Drug",
        priimek: "Stanovalec",
        email: "test.stanovalec@example.com",
        geslo: "DrugoGeslo123!",
        telefon: "041987654",
        vloga: "Stanovalec"
      });

      console.log("NAPAKA: podvojen email je bil dovoljen!");
    } catch (error) {
      console.log(
        "Podvojen email zavrnjen:",
        error.code === 11000
      );
    }

    // Odstranimo testnega uporabnika
    await Uporabnik.findByIdAndDelete(uporabnik._id);
    console.log("Testni uporabnik odstranjen.");

  } catch (error) {
    console.error("Napaka:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

test();
