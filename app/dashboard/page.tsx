"use client";

import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField, Button } from "@mui/material";
import { CSVLink } from "react-csv";
import { format } from "date-fns";

export default function Dashboard() {
    const { data: session } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [showPendingPopover, setShowPendingPopover] = useState(false);

    const pendingUsers = users.filter(u => !u.isApproved);
    const approvedUsers = users.filter(u => u.isApproved);

    useEffect(() => {
        if (session?.user?.role !== 'admin') {
            router.push("/view-order");
        } else {
            fetch("/api/users/list").then(res => res.json()).then(setUsers);
            fetch("/api/orders").then(res => res.json()).then(setOrders);
        }
    }, [session, router]);

    const approveUser = async (id: string) => {
        await fetch("/api/users/approve", {
            method: "POST",
            body: JSON.stringify({ id }),
        });
        setUsers(users.map(u => u._id === id ? { ...u, isApproved: true } : u));
    };

    const filteredData = useMemo(() =>
        orders.filter(order =>
            order.clientName.toLowerCase().includes(search.toLowerCase()) ||
            order.orderId.toLowerCase().includes(search.toLowerCase())
        ),
        [orders, search]
    );

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            {/* User and Trip Sections in a Row */}
            <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pending Users */}
                <div
                    className="relative bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-xl shadow-md text-white cursor-pointer"
                    onMouseEnter={() => setShowPendingPopover(true)}
                    onMouseLeave={() => setShowPendingPopover(false)}
                >
                    <h2 className="text-xl font-semibold mb-3">Pending Users</h2>
                    <div className="bg-white p-3 rounded shadow-sm text-yellow-500 text-center">
                        <p className="text-3xl font-bold">{pendingUsers.length}</p>
                        <p className="text-sm">Total Pending Users</p>
                    </div>


                    {/* Popover Content */}
                    {showPendingPopover && (
                        <div className="absolute top-full left-0 w-full bg-white border border-yellow-400 shadow-md rounded-lg mt-2 p-3 z-10">
                            {pendingUsers.map(user => (
                                <div
                                    key={user._id}
                                    className="flex justify-between items-center p-2 border-b"
                                >
                                    <span>{user.name} ({user.email})</span>
                                    <button
                                        onClick={() => approveUser(user._id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        Approve
                                    </button>
                                </div>
                            ))}
                            {pendingUsers.length === 0 && (
                                <p className="text-center text-gray-500">No pending users</p>
                            )}
                        </div>
                    )}
                </div>


                {/* Approved Users */}
                <div className="bg-gradient-to-r from-green-400 to-teal-500 p-4 rounded-xl shadow-md text-white">
                    <h2 className="text-xl font-semibold mb-3">Approved Users</h2>
                    <div className="bg-white p-3 rounded shadow-sm text-green-500 text-center">
                        <p className="text-3xl font-bold">{approvedUsers.length}</p>
                        <p className="text-sm">Total Approved Users</p>
                    </div>
                </div>


                {/* Upcoming Trips */}
                <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-4 rounded-xl shadow-md text-white">
                    <h2 className="text-xl font-semibold mb-3">Upcoming Trips</h2>
                    <div className="bg-white p-3 rounded shadow-sm text-blue-500 text-center">
                        <p className="text-3xl font-bold">{orders.filter(order => order.tripStatus === "Upcoming").length}</p>
                        <p className="text-sm">Total Upcoming Trips</p>
                    </div>
                </div>


            </section>

            <section className="mt-6">
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <TextField
                            label="Search by Order ID or Client"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            variant="outlined"
                            size="small"
                        />
                        <CSVLink
                            data={orders}
                            filename="orders.csv"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Export to CSV
                        </CSVLink>
                    </div>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Client</TableCell>
                                    <TableCell>Move Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Assigned To</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{order.orderId}</TableCell>
                                        <TableCell>{order.clientName}</TableCell>
                                        <TableCell>{order.moveDate ? format(new Date(order.moveDate), "MM/dd/yyyy, hh:mm:ss a") : "N/A"}</TableCell>
                                        <TableCell>{order.tripStatus}</TableCell>
                                        <TableCell><span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">{order.lineItems[0]?.task || "Unassigned"}</span></TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => router.push(`/order-details?orderId=${order._id}`)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={filteredData.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </section>
        </Layout>
    );
}
