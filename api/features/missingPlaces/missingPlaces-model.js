import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
  },
  { _id: false },
);

const BboxSchema = new mongoose.Schema(
  {
    north: Number,
    south: Number,
    east: Number,
    west: Number,
  },
  { _id: false },
);

const MissingPlaceSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  googleName: {
    type: String,
    required: true,
    trim: true,
  },

  location: {
    type: LocationSchema,
    required: true,
  },

  bbox: {
    type: BboxSchema,
  },

  radius: {
    type: Number,
  },

  importedAt: {
    type: Date,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const MissingPlace = mongoose.model("missing-place", MissingPlaceSchema);
