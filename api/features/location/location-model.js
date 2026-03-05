import { Schema, model } from "mongoose";

const ZipLocationSchema = new Schema(
  {
    zip: { type: String, required: true, unique: true, index: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    source: { type: String, default: "simplemaps" },
  },
  { timestamps: true },
);

export const ZipLocation = model("ZipLocation", ZipLocationSchema);
