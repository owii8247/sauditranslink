"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { FaLock } from "react-icons/fa";
import { format } from "date-fns";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

export default function OrderDetails() {
  const { data: session } = useSession();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
 

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <CircularProgress color="primary" size={60} />
          <p className="mt-4 text-lg font-semibold text-gray-600">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-red-500">
          Order not found.
        </p>
      </div>
    );
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Orders Details</h2>

          <div className="space-y-4">
            <div key={order.orderId} className="bg-white p-6 shadow-md rounded-lg border border-gray-200">
              {/* Order List */}
              <div className="space-y-4">

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
                        <span className="font-medium">Move Date:</span> {order.moveDate ? format(new Date(order.moveDate), "MM/dd/yyyy, hh:mm:ss a") : "N/A"}
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
                        <span className="font-medium">Order Price:</span>SAR {order.orderPrice}
                      </p>
                      <p>
                        <span className="font-medium">Order Cost:</span>SAR {order.orderCost}
                      </p>
                    </div>
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">{order.tripStatus}</span>
                  </div>
                </div>
              </div>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="font-medium">Trip Details</h3>
                  </div>
                  <div className="flex items-center gap-1 ml-5">
                  <p className="text-gray-500">No. of Trips:</p>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#f97316', // Orange-500 hex code
                      borderRadius:20,
                      color: '#f97316',
                      '&:hover': {
                        borderColor: '#ea580c', // Darker shade for hover effect
                        backgroundColor: '#ffedd5' // Lighter background for hover
                      }
                    }}
                  >
                    {order.noOfTrips || 1}
                  </Button>
                  </div>
                  <div className="flex items-center gap-1 ml-5">
                  <p className="text-gray-500">Total Cost:</p>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#f97316', // Orange-500 hex code
                      borderRadius:20,
                      color: '#f97316',
                      '&:hover': {
                        borderColor: '#ea580c', // Darker shade for hover effect
                        backgroundColor: '#ffedd5' // Lighter background for hover
                      }
                    }}
                  >
                    SAR {order.orderCost}
                  </Button>
                  </div>
                  <div className="flex items-center gap-4 ml-5">
                    <h3 className="text-orange-500 font-semibold">{order.tripType}</h3>
                    <h3 className="font-semibold">{order.sourceAddress}</h3>
                    <h3 className="font-semibold">To</h3>
                    <h3 className="font-semibold">{order.destinationAddress}</h3>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Trip Type</TableCell>
                          <TableCell>Truck Reg No</TableCell>
                          <TableCell>Driver Name</TableCell>
                          <TableCell>Supplier Name</TableCell>
                          <TableCell>Sourcing POC</TableCell>
                          <TableCell>Trip Cost</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{order.tripType}</TableCell>
                          <TableCell>{order.truckRegNo}</TableCell>
                          <TableCell>{order.driverName}</TableCell>
                          <TableCell>{order.supplierName}</TableCell>
                          <TableCell>{order.loadingPOC}</TableCell>
                          <TableCell>SAR {order.orderCost}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <h3 className="font-medium">Line Items</h3>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Category</TableCell>
                          <TableCell>Sub-Category</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Unit Price</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>VAT</TableCell>
                          <TableCell>VAT Charges</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell>Task</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.lineItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.subCategory}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.unitPrice}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>{item.vat}</TableCell>
                            <TableCell>{item.vatCharges}</TableCell>
                            <TableCell>{item.total}</TableCell>
                            <TableCell>{item.task}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
