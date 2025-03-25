// "use client";

// import Sidebar from "@/components/Sidebar";
// import Navbar from "@/components/Navbar";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { FaLock } from "react-icons/fa";


// export default function OrdersPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("Standard");
//   const [orders, setOrders] = useState([]);
//   useEffect(() => {
//     if (status !== "loading" && !session) {
//       router.push("/");
//     } else{
//       fetch("/api/orders").then(res => res.json()).then(setOrders);
//     }
//   }, [session, status, router]);

//   if (status === "loading") {
//     return <p>Loading...</p>;
//   }

//   if (!session) return null;

//   const isAdmin = session?.user?.role === "admin";

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar isAdmin={isAdmin} />
//       <div className="flex-1">
//         <Navbar />
//         <div className="p-6">
//           {/* Page Title */}
//           <h2 className="text-2xl font-semibold mb-6">Orders Page</h2>

//           {/* Tab Navigation */}
//           {/* <div className="flex gap-4 border-b pb-2 mb-6">
//             {["Standard", "LTL", "PortMovement"].map((tab) => (
//               <button
//                 key={tab}
//                 className={`px-4 py-2 rounded-t-lg font-semibold ${
//                   activeTab === tab ? "border-b-4 border-orange-500 text-orange-600" : "text-gray-600"
//                 }`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div> */}

//           {/* Order Filters */}
//           {/* <div className="flex gap-6 text-sm mb-6">
//             <span className="text-blue-600 font-medium">Upcoming - 8246</span>
//             <span className="text-yellow-600 font-medium">Ongoing - 405</span>
//             <span className="text-green-600 font-medium">Completed - 325242</span>
//             <span className="text-red-600 font-medium">Cancelled - 32792</span>
//           </div> */}

//           {/* Order List */}
//           <div className="space-y-4">
//             {orders.map((order) => (
//               <div key={order.orderId} className="bg-white p-6 shadow-md rounded-lg border border-gray-200">
//                 {/* Order Header */}
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center gap-2 text-orange-500 font-semibold">
//                     <span className="text-lg">{order.orderId}</span>
//                     {order.locked && (
//                       <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded flex items-center">
//                         <FaLock className="mr-1" /> Locked
//                       </span>
//                     )}
//                   </div>
//                   <span className="text-sm bg-gray-200 px-2 py-1 rounded">{order.region}</span>
//                 </div>

//                 {/* Client Name */}
//                 <p className="font-medium text-gray-700">{order.clientName}</p>

//                 {/* Order Details Grid */}
//                 <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-gray-600">
//                   <div>
//                     <p>
//                       <span className="font-medium">Move Date:</span> {order.moveDate}
//                     </p>
//                     <p>
//                       <span className="font-medium">Assets:</span> {order.asset}
//                     </p>
//                     <p>
//                       <span className="font-medium">Commodity:</span> {order.commodity}
//                     </p>
//                   </div>
//                   <div>
//                     <p>
//                       <span className="font-medium">Source Address:</span> {order.sourceAddress}
//                     </p>
//                     <p>
//                       <span className="font-medium">Destination Address:</span> {order.destinationAddress}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Order Price & Status */}
//                 <div className="mt-4 flex items-center justify-between">
//                   <div className="text-sm">
//                     <p>
//                       <span className="font-medium">Order Price:</span> {order.orderPrice}
//                     </p>
//                     <p>
//                       <span className="font-medium">Order Cost:</span> {order.orderCost}
//                     </p>
//                   </div>
//                   <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">{order.tripStatus}</span>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="mt-4 flex justify-end gap-3">
//                   <button className="text-blue-500 font-medium hover:underline"
//                   onClick={() => router.push(`/order-details?orderId=${order._id}`)}
//                   >View Details</button>
//                   <button className="text-gray-600 font-medium hover:underline">Audit Trail</button>
//                 </div>
//               </div>
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
import { FaFilter, FaLock } from "react-icons/fa";
import { CircularProgress } from "@mui/material"; // ✅ Import CircularProgress
import { format } from "date-fns";
export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false); // Filter Visibility State
  const [filters, setFilters] = useState({
    locked: false,
    upcoming: false,
    ongoing: false,
    completed: false,
    cancelled: false,
  });

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/");
    } else {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          setFilteredOrders(data);
        });
    }
  }, [session, status, router]);

  useEffect(() => {
    const searchFiltered = orders.filter((order) => {
      const matchesQuery = Object.values(order).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );

      const matchesFilter =
        (!filters.locked || order.locked) &&
        (!filters.upcoming || order.tripStatus === "Upcoming") &&
        (!filters.ongoing || order.tripStatus === "Ongoing") &&
        (!filters.completed || order.tripStatus === "Completed") &&
        (!filters.cancelled || order.tripStatus === "Cancelled");

      return matchesQuery && matchesFilter;
    });

    setFilteredOrders(searchFiltered);
  }, [searchQuery, filters, orders]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress color="primary" size={60} />
      </div>
    );
  }

  if (!session) return null;

  const isAdmin = session?.user?.role === "admin";

  const handleFilterChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Orders Page</h2>

          {/* Search & Filter Section */}
          <div className="flex gap-6 items-start mb-6">
            {/* Search Section */}
            <div className="flex-1 max-w-md w-full md:w-1/2 lg:w-1/3">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>


            {/* Filter Section */}
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setShowFilters(true)}
              onMouseLeave={() => setShowFilters(false)}
              onClick={() => setShowFilters(!showFilters)}
            >
              <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200 flex items-center">
                <FaFilter className="text-orange-500 text-2xl" />
              </div>

              {showFilters && (
                <div className="absolute top-12 left-0 bg-white p-4 shadow-md rounded-lg border border-gray-200 w-60 z-10">
                  <h3 className="text-lg font-semibold mb-4">Filters</h3>
                  <div className="space-y-2">
                    {["locked", "upcoming", "ongoing", "completed", "cancelled"].map((filterKey) => (
                      <label key={filterKey} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters[filterKey]}
                          onChange={() => handleFilterChange(filterKey)}
                          className="accent-orange-500"
                        />
                        {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white p-6 shadow-md rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-orange-500 font-semibold">
                    <span className="text-lg">{order.orderId}</span>
                    {order.locked && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded flex items-center">
                        <FaLock className="mr-1" /> Locked
                      </span>
                    )}
                  </div>
                  <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {order.region}
                  </span>
                </div>

                <p className="font-medium text-gray-700">{order.clientName}</p>

                <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-gray-600">
                  <div>
                    <p>
                      <span className="font-medium">Move Date:</span>{" "}
                      {order.moveDate ? format(new Date(order.moveDate), "MM/dd/yyyy, hh:mm:ss a") : "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Assets:</span> {order.asset}
                    </p>
                    <p>
                      <span className="font-medium">Commodity:</span>{" "}
                      {order.commodity}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Source Address:</span>{" "}
                      {order.sourceAddress}
                    </p>
                    <p>
                      <span className="font-medium">Destination Address:</span>{" "}
                      {order.destinationAddress}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Order Price:</span>{" "}
                      SAR {order.orderPrice}
                    </p>
                    <p>
                      <span className="font-medium">Order Cost:</span>{" "}
                      SAR {order.orderCost}
                    </p>
                  </div>
                  <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                    {order.tripStatus}
                  </span>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    className="text-blue-500 font-medium hover:underline"
                    onClick={() =>
                      router.push(`/order-details?orderId=${order._id}`)
                    }
                  >
                    View Details
                  </button>
                  
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <p className="text-center text-gray-500">No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
