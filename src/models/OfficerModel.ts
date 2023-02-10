import mongoose, { Types, Model  } from "mongoose";

const { Schema } = mongoose;

export interface IOfficer {
  name: string;
  password: string;
  address: string;
  company: Types.ObjectId;
  location: string;
  phoneNumber: string;
  pending: number;
  viewed: number;
  picked: number;
  transit: number;
  isAdmin: boolean;
}

interface IStatusMethods {
  updateStatus(status: Status): void;
}

type OfficerModel = Model<IOfficer, {}, IStatusMethods>;

type Status = "Pending" | "Viewed" | "Received" | "On Transit" | "Delivered";

const OfficerSchema = new Schema<IOfficer, OfficerModel, IStatusMethods>({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true,
  },

  company: {
    type: Schema.Types.ObjectId, 
    ref: "Company", 
    requird: true
  },

  location: {
    type: String,
  },

  phoneNumber: {
    type: String,
  },

  pending: {
    type: Number,
    default: 0,
  },
  viewed: {
    type: Number,
    default: 0,
  },
  picked: {
    type: Number,
    default: 0,
  },
  transit: {
    type: Number,
    default: 0,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  }

},
{timestamps: true});


OfficerSchema.method('updateStatus', function updateStatus(status: Status){
     if(status === "Pending") {
      this.pending += 1;
      return
      }
     if(status === "Viewed") {
        this.pending -=1;
        this.viewed +=1;
        return;
     }

     if(status === "Received"){
       this.viewed -=1;
       this.picked +=1;
       return;
     }

     if(status === "On Transit"){
      this.picked -=1;
      this.transit +=1;
      return
     }

     if(status === "Delivered"){
      this.transit -=1
      return
     }
})
export default mongoose.model<IOfficer, OfficerModel>("Officer", OfficerSchema);