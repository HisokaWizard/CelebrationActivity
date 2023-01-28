import { model, Schema } from 'mongoose';

export const NeuralNetworkDataSchema = new Schema({
  data: { type: Array, unique: true, require: true },
  name: { type: String, unique: true, require: true },
});

export const neuralNetworkSchema = model('NeuralNetworkData', NeuralNetworkDataSchema);
