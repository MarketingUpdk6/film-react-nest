import { Schema } from 'mongoose';

export const scheduleSchema = new Schema(
  {
    id: { type: String, required: true },
    daytime: { type: String, required: true },
    hall: { type: Number, required: true },
    rows: { type: Number, required: true },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    taken: { type: [String], required: true },
  },
  {
    _id: false,
  },
);

export const filmSchema = new Schema(
  {
    id: { type: String, required: true },
    rating: { type: Number, required: true },
    director: { type: String, required: true },
    tags: { type: [String], required: true },
    image: { type: String, required: true },
    cover: { type: String, required: true },
    title: { type: String, required: true },
    about: { type: String, required: true },
    description: { type: String, required: true },
    schedule: { type: [scheduleSchema], required: true },
  },
  {
    collection: 'films',
    versionKey: false,
  },
);
