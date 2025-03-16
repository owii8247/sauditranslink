import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true, 
    },
    clientName: { type: String, required: true },
    customerType: { 
        type: String, 
        enum: ["Domestic", "International"], 
        default: "Domestic",
        required: true 
    },
    region: { type: String, default: "" },
    invoiceNumber: { type: String, default: "" },
    moveType: { 
        type: String, 
        enum: ["Domestic", "International"], 
        default: "Domestic",
        required: true 
    },
    moveDate: { type: Date, required: true },
    asset: { type: String, default: "" },
    loadingPOC: { type: String, default: "" },
    commodity: { type: String, default: "" },
    unloadingPOC: { type: String, default: "" },
    orderPrice: { type: Number, required: true },
    orderCost: { type: Number, required: true },
    platformSource: { type: String, default: "" },
    inquiryReceivedOn: { type: String, default: "" },
    sourceAddress: { type: String, required: true },
    destinationAddress: { type: String, required: true },
    totalCost: { type: Number, default: 0 },
    tripType: { 
        type: String, 
        enum: ["Full Truck", "Half Truck", "Empty Truck"], 
        default: "Full Truck",
        required: true 
    },
    truckRegNo: { type: String, default: "" },
    driverName: { type: String, default: "" },
    supplierName: { type: String, default: "" },
    sourcingPOC: { type: String, default: "" },
    tripCost: { type: Number, default: 0 },
    lineItems: [{
        category: { type: String, required: true },
        subCategory: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        amount: { type: Number, required: true },
        vat: { type: Number, default: 0 },
        vatCharges: { type: Number, default: 0 },
        total: { type: Number, required: true },
        task: { type: String, default: "" }
    }],
    tripStatus: {
        type: String,
        enum: [
            "Upcoming", 
            "Start for pick up", 
            "At loading", 
            "Completed loading", 
            "Enroute", 
            "At unloading", 
            "Completed"
        ],
        default: "Upcoming"
    }
}, { timestamps: true });

OrderSchema.pre('save', function (next) {
    if (!this.orderId) {
        this.orderId = `ORD-${Date.now()}`;
    }
    next();
});

OrderSchema.index({ orderId: 1 }, { unique: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
