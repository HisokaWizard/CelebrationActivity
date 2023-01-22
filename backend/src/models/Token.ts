import { Schema, model } from 'mongoose';

const TokenSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, require: true, ref: 'Employee' },
  refreshToken: { type: String, required: true },
});

export const tokenSchema = model('Token', TokenSchema);
