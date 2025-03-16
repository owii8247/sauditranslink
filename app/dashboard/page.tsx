"use client";

import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTable, usePagination, useSortBy } from "react-table";
import { CSVLink } from "react-csv";
import { format } from "date-fns";


export default function Dashboard() {
    const { data: session } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
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
    }, [session]);

    const approveUser = async (id: string) => {
        await fetch("/api/users/approve", {
            method: "POST",
            body: JSON.stringify({ id }),
        });
        setUsers(users.map(u => u._id === id ? { ...u, isApproved: true } : u));
    };

    const [search, setSearch] = useState("");

    const filteredData = useMemo(() =>
        orders.filter(order =>
            order.clientName.toLowerCase().includes(search.toLowerCase()) ||
            order.orderId.toLowerCase().includes(search.toLowerCase())
        ),
        [orders, search]
    );

    const columns = useMemo(
        () => [
            { Header: "Order ID", accessor: "orderId" },
            { Header: "Client", accessor: "clientName" },
            {
                Header: "Move Date",
                accessor: "moveDate",
                Cell: ({ value }) => value
                    ? format(new Date(value), "MM/dd/yyyy, hh:mm:ss a")
                    : "N/A"
            },
            { Header: "Status", accessor: "tripStatus" },
            { Header: "Assigned To", accessor: "lineItems[0].task", Cell: ({ value }) => value || "Unassigned" },
            {
                Header: "Action",
                Cell: ({ row }) => (
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        onClick={() => router.push(`/order-details?orderId=${row.original._id}`)}
                    >
                        View Details
                    </button>
                )
            },
        ], []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state: { pageIndex },
    } = useTable(
        { columns, data: filteredData, initialState: { pageIndex: 0, pageSize: 5 } },
        useSortBy,
        usePagination
    );


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


            {/* Pending Users */}
            {/* <section className="mt-6">
                <h2 className="text-xl font-semibold">Pending Users</h2>
                {users.filter(u => !u.isApproved).map(user => (
                    <div key={user._id} className="flex justify-between items-center p-3 border">
                        <span>{user.name} ({user.email})</span>
                        <button onClick={() => approveUser(user._id)} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                    </div>
                ))}
            </section> */}

            {/* Approved Users */}
            {/* <section className="mt-6">
                <h2 className="text-xl font-semibold">Approved Users</h2>
                {users.filter(u => u.isApproved).map(user => (
                    <div key={user._id} className="p-3 border">{user.name} ({user.email})</div>
                ))}
            </section> */}

            {/* All Orders */}

            <section className="mt-6">
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            placeholder="Search by Order ID or Client"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="p-2 border rounded w-1/3"
                        />
                        <CSVLink
                            data={orders}
                            filename="orders.csv"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Export to CSV
                        </CSVLink>
                    </div>

                    <table {...getTableProps()} className="w-full mt-4 shadow-lg rounded-lg overflow-hidden">
                        <thead className="bg-blue-600 text-white">
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className="p-3 text-left cursor-pointer"
                                        >
                                            {column.render("Header")}
                                            <span>
                                                {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row);
                                return (
                                    <tr key={row.id} {...row.getRowProps()} className="border-b hover:bg-blue-50">
                                        {row.cells.map(cell => (
                                            <td key={cell.column.id} {...cell.getCellProps()} className="p-3">
                                                {cell.render("Cell")}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}

                        </tbody>
                    </table>

                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={previousPage}
                            disabled={!canPreviousPage}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>
                            Page {pageIndex + 1} of {pageOptions.length}
                        </span>
                        <button
                            onClick={nextPage}
                            disabled={!canNextPage}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
