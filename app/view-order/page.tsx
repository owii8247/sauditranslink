// "use client"; // Ensure this is at the top!

// import Sidebar from "@/components/Sidebar";
// import Navbar from "@/components/Navbar";
// import OrderCard from "@/components/OrderCard";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// const orders = [
//   {
//     orderId: "2450249144",
//     clientName: "IBRAHIM ABDULLAH AL FARES",
//     moveDate: "23/10/2024 9:00 PM",
//     asset: "Full Truck 13.6M",
//     commodity: "Steel Structure",
//     source: "Jubail, Saudi Arabia",
//     destination: "Jeddah, Saudi Arabia",
//     price: "3,967.50",
//     cost: "3,795.00",
//     status: "Completed",
//   },
//   {
//     orderId: "2450247970",
//     clientName: "Afia International Company",
//     moveDate: "21/10/2024 10:00 AM",
//     asset: "Full Truck 13.6M",
//     commodity: "Food Items - Oils",
//     source: "Jeddah, Saudi Arabia",
//     destination: "Dammam, Saudi Arabia",
//     price: "2,277.00",
//     cost: "2,185.00",
//     status: "Completed",
//   },
// ];

// export default function OrdersPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status !== "loading" && !session) {
//       router.push("/");
//     }
//   }, [session, status, router]);

//   if (status === "loading") {
//     return <p>Loading...</p>; // Prevent rendering until session is loaded
//   }

//   if (!session) return null; // Prevents unnecessary rendering

//   const isAdmin = session?.user?.role === "admin";

//   return (
//     <div className="flex">
//       <Sidebar isAdmin={isAdmin} />
//       <div className="flex-1">
//         <Navbar />
//         <div className="p-6">
//           <h2 className="text-2xl font-semibold mb-4">Orders Page</h2>
//           <div className="grid gap-4">
//             {orders.map((order) => (
//               <OrderCard key={order.orderId} {...order} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";

// const orders = [
//   {
//     orderId: "ORD2450249144",
//     clientName: "IBRAHIM ABDULLAH AL FARES AND BROTHER FOR TRANSPORTATION CO. (Eastern)",
//     moveDate: "23/10/2024 9:00 PM",
//     asset: "Full Truck 13.6M (1)",
//     commodity: "Steel Structure",
//     source: "Jubail, Saudi Arabia",
//     destination: "Jeddah, Saudi Arabia",
//     price: "SAR 3,967.50",
//     cost: "SAR 3,795.00",
//     status: "Completed",
//     locked: true,
//     region: "KSA",
//   },
//   {
//     orderId: "ORD2450247970",
//     clientName: "Afia International Company",
//     moveDate: "21/10/2024 10:00 AM",
//     asset: "Full Truck 13.6M (1)",
//     commodity: "Food Items - Oils",
//     source: "Jeddah, Saudi Arabia",
//     destination: "Dammam, Saudi Arabia",
//     price: "SAR 2,277.00",
//     cost: "SAR 2,185.00",
//     status: "Completed",
//     locked: true,
//     region: "KSA",
//   },
// ];



export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Standard");
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/");
    } else{
      fetch("/api/orders").then(res => res.json()).then(setOrders);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) return null;

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          {/* Page Title */}
          <h2 className="text-2xl font-semibold mb-6">Orders Page</h2>

          {/* Tab Navigation */}
          <div className="flex gap-4 border-b pb-2 mb-6">
            {["Standard", "LTL", "PortMovement"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-t-lg font-semibold ${
                  activeTab === tab ? "border-b-4 border-orange-500 text-orange-600" : "text-gray-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Order Filters */}
          <div className="flex gap-6 text-sm mb-6">
            <span className="text-blue-600 font-medium">Upcoming - 8246</span>
            <span className="text-yellow-600 font-medium">Ongoing - 405</span>
            <span className="text-green-600 font-medium">Completed - 325242</span>
            <span className="text-red-600 font-medium">Cancelled - 32792</span>
          </div>

          {/* Order List */}
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white p-6 shadow-md rounded-lg border border-gray-200">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-orange-500 font-semibold">
                    <span className="text-lg">{order.orderId}</span>
                    {order.locked && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded flex items-center">
                        <FaLock className="mr-1" /> Locked
                      </span>
                    )}
                  </div>
                  <span className="text-sm bg-gray-200 px-2 py-1 rounded">{order.region}</span>
                </div>

                {/* Client Name */}
                <p className="font-medium text-gray-700">{order.clientName}</p>

                {/* Order Details Grid */}
                <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-gray-600">
                  <div>
                    <p>
                      <span className="font-medium">Move Date:</span> {order.moveDate}
                    </p>
                    <p>
                      <span className="font-medium">Assets:</span> {order.asset}
                    </p>
                    <p>
                      <span className="font-medium">Commodity:</span> {order.commodity}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Source Address:</span> {order.sourceAddress}
                    </p>
                    <p>
                      <span className="font-medium">Destination Address:</span> {order.destinationAddress}
                    </p>
                  </div>
                </div>

                {/* Order Price & Status */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Order Price:</span> {order.orderPrice}
                    </p>
                    <p>
                      <span className="font-medium">Order Cost:</span> {order.orderCost}
                    </p>
                  </div>
                  <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">{order.tripStatus}</span>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end gap-3">
                  <button className="text-blue-500 font-medium hover:underline"
                  onClick={() => router.push(`/order-details?orderId=${order.orderId}`)}
                  >View Details</button>
                  <button className="text-gray-600 font-medium hover:underline">Audit Trail</button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
