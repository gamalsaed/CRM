import mongoose, { type ObjectId } from "mongoose";
import validator from "validator";
import { LeadSchema } from "../utils/types/lead-types";

const leadSchema = new mongoose.Schema<LeadSchema>({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: [validator.isMobilePhone, "Please provide a valid phone number"],
  },
  whatsApp: {
    type: String,
    validate: [validator.isMobilePhone, "Please provide a valid phone number"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  address: {
    type: String,
  },
  status: {
    type: String,
    enum: ["new", "contacted", "qualified", "closed", "lost"],
    default: "new",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notes: [
    {
      note: {
        type: String,
        required: true,
        min: 5,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      createdBy: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "User",
        type: String,
        required: true,
      },
    },
  ],
});

const Lead = mongoose.model<LeadSchema>("Lead", leadSchema);

export default Lead;
