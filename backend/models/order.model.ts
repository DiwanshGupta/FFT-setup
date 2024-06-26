import mongoose, { Document, Model, Schema } from "mongoose";

export interface Iorder extends Document {
  courseId: string;
  userId: string;
  payment_info: object;
}

const orderSchema = new Schema<Iorder>(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
    },
  },
  { timestamps: true }
);

const OrderModal: Model<Iorder> = mongoose.model("Order", orderSchema);

export default OrderModal;
