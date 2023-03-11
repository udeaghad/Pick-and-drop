import mongoose, { Types, Model  } from "mongoose";

const { Schema } = mongoose;

interface IStatusCount {
  pending: number;
  viewed: number;
  picked: number;
  transit: number;
}

export interface IOfficer {
  name: string;
  password: string;
  address: string;
  company: Types.ObjectId;
  location: string;
  statusCount: IStatusCount
  phoneNumber: string;  
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
    required: [true, "name must be provided"]
  },

  password: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: [true, "address must be provided"],
  },

  company: {
    type: Schema.Types.ObjectId, 
    ref: "Company", 
    required: [true, "Company ID must be provided"]
  },

  location: {
    type: String,
    required: [true, "location must be provided"]
  },

  phoneNumber: {
    type: String,
    required: [true, "Phone Number must be provided"]
  },

  statusCount: {
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
  },

  isAdmin: {
    type: Boolean,
    default: false,
  }

},
{timestamps: true});


OfficerSchema.method('updateStatus', function updateStatus(status: Status){
     if(status === "Pending") {
      this.statusCount.pending += 1;
      return
      }
     
     if(status === "Viewed") {
        this.statusCount.pending -=1;
        this.statusCount.viewed +=1;
        return;
     }

     if(status === "Received"){
       this.statusCount.viewed -=1;
       this.statusCount.picked +=1;
       return;
     }

     if(status === "On Transit"){
      this.statusCount.picked -=1;
      this.statusCount.transit +=1;
      return
     }

     if(status === "Delivered"){
      this.statusCount.transit -=1
      return
     }
})
export default mongoose.model<IOfficer, OfficerModel>("Officer", OfficerSchema);