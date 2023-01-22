import { Schema, model } from 'mongoose';

export const EmployeeSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  name: { type: String },
  sex: { type: String },
  age: { type: Number },
  avatar: { type: String },
  roomList: { type: Array },
});

export const employeeSchema = model('Employee', EmployeeSchema);
