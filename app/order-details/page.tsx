// "use client";
// import Layout from "@/components/Layout";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function OrderDetailsPage() {
//     const params = useSearchParams();
//     const orderId = params.get("orderId");
//     const [order, setOrder] = useState<any>(null);

//     useEffect(() => {
//         fetch(`/api/orders/${orderId}`)
//             .then((res) => res.json())
//             .then(setOrder);
//     }, [orderId]);

//     if (!order) return <Layout><p>Loading...</p></Layout>;

//     return (
//         <Layout>
//             <h1 className="text-2xl font-bold">Order Details</h1>
//             <pre className="bg-gray-100 p-4 mt-4 rounded">{JSON.stringify(order, null, 2)}</pre>
//         </Layout>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function OrderDetails() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId"); // Example: /view-order?orderId=1234

    useEffect(() => {
        if (!orderId) return;

        const fetchOrderDetails = async () => {
            try {
                const res = await fetch(`/api/orders/${orderId}`);
                if (!res.ok) throw new Error('Order not found');
                const data = await res.json();
                setOrder(data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) return <p>Loading order details...</p>;
    if (!order) return <p>Order not found.</p>;

    return (
        <div className="p-4 border rounded-md bg-gray-100">
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p>Customer: {order.clientName}</p>
            <p>Total Amount: ${order.price}</p>
            <p>Status: {order.vehicleNumber}</p>
            
        </div>
    );
}
