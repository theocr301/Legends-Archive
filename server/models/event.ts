import mongoose, { Schema, Types } from 'mongoose';

interface IHistory {
  title: string;
  date: Date;
  description: string;
  _id?: Types.ObjectId;
}

interface ICar {
  name: string;
  year: number;
  chassisNumber: string;
  imageUrl?: string | null;
  history: IHistory[];
}

const historySchema = new Schema<IHistory>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  }
});

const carSchema = new Schema<ICar>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  chassisNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  history: {
    type: [historySchema],
    default: [],
  }, // Ensure history is always an array
}, { timestamps: true });

export const History = mongoose.model<IHistory>('History', historySchema);
export const Car = mongoose.model<ICar>('Car', carSchema);