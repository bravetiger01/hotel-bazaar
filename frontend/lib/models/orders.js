import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  username: { type: String, required: true },
  products: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  orderDate: { type: Date, default: Date.now },
});

export default mongoose.models.order || mongoose.model('order', orderSchema);
