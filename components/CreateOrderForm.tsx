"use client";

import { useState } from "react";
import { ShimmerButton } from "./magicui/shimmer-button";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const initialOrder = {
    orderId: "",
    clientName: "",
    customerType: "Domestic",
    region: "",
    invoiceNumber: "",
    moveType: "Domestic",
    moveDate: "",
    asset: "",
    loadingPOC: "",
    commodity: "",
    unloadingPOC: "",
    orderPrice: "",
    orderCost: "",
    platformSource: "",
    inquiryReceivedOn: "",
    sourceAddress: "",
    destinationAddress: "",
    totalCost: "",
    tripType: "Full Truck",
    truckRegNo: "",
    driverName: "",
    supplierName: "",
    sourcingPOC: "",
    tripCost: "",
    lineItems: [],
    tripStatus: "Upcoming"
};

export default function CreateOrderForm() {
    const router = useRouter();
    const [order, setOrder] = useState(initialOrder);
    const [lineItems, setLineItems] = useState([{ category: "", subCategory: "", quantity: "", unitPrice: "", amount: "", vat: "", vatCharges: "", total: "", task: "" }]);

    const handleChange = (e) => {
        setOrder({ ...order, [e.target.name]: e.target.value });
    };

    const handleLineItemChange = (index, field, value) => {
        const updatedLineItems = [...lineItems];
        updatedLineItems[index][field] = value;
        if (field === 'quantity' || field === 'unitPrice') {
            const amount = Number(updatedLineItems[index].quantity) * Number(updatedLineItems[index].unitPrice);
            updatedLineItems[index].amount = amount.toFixed(2);
            const vatCharges = (amount * (Number(updatedLineItems[index].vat) / 100)).toFixed(2);
            updatedLineItems[index].vatCharges = vatCharges;
            updatedLineItems[index].total = (amount + Number(vatCharges)).toFixed(2);
        }
        setLineItems(updatedLineItems);
    };

    const addLineItem = () => {
        setLineItems([...lineItems, { category: "", subCategory: "", quantity: "", unitPrice: "", amount: "", vat: "", vatCharges: "", total: "", task: "" }]);
    };



    const submitOrder = async () => {
        const {...orderData } = order; 
        await fetch("/api/orders/create", {
            method: "POST",
            body: JSON.stringify({ ...orderData, lineItems }),
        });
        //alert("Order Created!");
        toast.success('🎉 Order created successfully!', {
            position: 'top-right',
            autoClose: 3000,
          });
    
          setTimeout(() => {
            router.push('/view-order');
          }, 1500);
    };


    const renderInput = (label, name, type = "text") => (
        <div className="flex flex-col">
            <label className="font-medium text-sm">{label}</label>
            <input type={type} name={name} value={order[name]} onChange={handleChange} className="p-2 border rounded" />
        </div>
    );

    return (
        <div className="p-6 bg-white border rounded-lg max-w-8xl mx-auto">
            <div className="flex justify-end mt-4">

                <ShimmerButton className="shadow-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 transition-all duration-300 px-4 py-2 rounded-lg" onClick={submitOrder}>
                    <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                        Create Order
                    </span>
                </ShimmerButton>
            </div>

            {/* Customer Details */}
            <h3 className="font-bold mb-4">Customer Details</h3>
            <section className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                {renderInput("Customer Name", "clientName")}
                <div className="flex flex-col">
                    <label className="font-medium text-sm">Customer Type</label>
                    <select name="customerType" value={order.customerType} onChange={handleChange} className="p-2 border rounded">
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                    </select>
                </div>
                {renderInput("Region", "region")}
                {renderInput("Invoice Number", "invoiceNumber")}
            </section>

            {/* Order Details */}
            <h3 className="font-bold mb-4">Order Details</h3>
            <section className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

                {renderInput("Move Date & Time", "moveDate", "datetime-local")}
                <div className="flex flex-col">
                    <label className="font-medium text-sm">Move Type</label>
                    <select name="moveType" value={order.moveType} onChange={handleChange} className="p-2 border rounded">
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                    </select>
                </div>
                {renderInput("Asset", "asset")}
                {renderInput("Commodity", "commodity")}
                {renderInput("Order Price", "orderPrice")}
                {renderInput("Order Cost", "orderCost")}
                {renderInput("Platform Source", "platformSource")}
                {renderInput("Inquiry Received On", "inquiryReceivedOn")}
                {renderInput("Source Address", "sourceAddress")}
                {renderInput("Destination Address", "destinationAddress")}
            </section>

            {/* Trip Info */}
            <h3 className="font-bold mb-4">Trip Info</h3>
            <section className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

                {renderInput("Truck Reg No", "truckRegNo")}
                <div className="flex flex-col">
                    <label className="font-medium text-sm">Trip Type</label>
                    <select name="tripType" value={order.customerType} onChange={handleChange} className="p-2 border rounded">
                        <option value="Full Truck">Full Truck</option>
                        <option value="Half Truck">Half Truck</option>
                        <option value="Empty">Empty</option>
                    </select>
                </div>
                {renderInput("Driver Name", "driverName")}
                {renderInput("Supplier Name", "supplierName")}
                {renderInput("Sourcing POC", "sourcingPoc")}
                {renderInput("Trip Cost", "tripCost")}

            </section>

            {/* Line Items */}
            <section className="mb-6">
                <h3 className="font-bold mb-4">Line Items</h3>
                {lineItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2">
                        {Object.keys(item).map(key => (
                            <div key={`${index}-${key}`} className="flex flex-col">
                                <label className="font-small capitalize text-sm">{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</label>
                                <input
                                    key={key}
                                    //placeholder={key}
                                    value={item[key]}
                                    onChange={(e) => handleLineItemChange(index, key, e.target.value)}
                                    className="p-2 border rounded"
                                />
                            </div>
                        ))}
                    </div>
                ))}
                <div className="flex justify-end mt-4">
                    <ShimmerButton
                        className="shadow-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 transition-all duration-300 px-4 py-2 rounded-lg"
                        onClick={addLineItem}
                    >
                        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                            +
                        </span>
                    </ShimmerButton>
                </div>

                {/* <button onClick={addLineItem} className="bg-green-500 text-white px-4 py-2 rounded mt-2">+ Add Line Item</button> */}
            </section>

            {/* <button onClick={submitOrder} className="w-full bg-blue-600 text-white px-4 py-2 rounded">Submit Order</button> */}

        </div>
    );
}

