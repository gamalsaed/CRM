import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  status: {
    type: String,
    enum: ["new", "contacted", "qualified", "closed"],
    default: "new",
  },
});
