import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
  socket.on("newOrder", (newOrder) => {
    console.log("Received new order via socket:", newOrder);
    fetchOrders(); 
  });

  return () => {
    socket.off("newOrder"); 
  };
}, [socket]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const res = await axios.get("http://localhost:5000/api/orders", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
      const sum = res.data.reduce((acc, curr) => acc + curr.totalAmount, 0);
      setTotal(sum);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, startDate, endDate]);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/order/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredOrders = orders.filter(order =>
    order.formData.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadExcel = () => {
    const data = filteredOrders.map(order => ({
      Name: order.formData.name,
      Phone: order.formData.phone || "-",
      Address: order.formData.address || "-",
      Type: order.orderType,
      Status: order.status,
      Amount: order.totalAmount,
      "Date & Time": new Date(order.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-4 sm:p-8 relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Dashboard</h1>

      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {["All", "Pending", "Completed", "Rejected"].map(label => {
          const value = label.toLowerCase() === "all" ? "" : label.toLowerCase();

          let bgClass = "bg-gray-200 hover:bg-gray-300";
          if (value === "pending") bgClass = "bg-yellow-200 hover:bg-yellow-300";
          else if (value === "completed") bgClass = "bg-green-200 hover:bg-green-300";
          else if (value === "rejected") bgClass = "bg-red-200 hover:bg-red-300";

          return (
            <button
              key={label}
              onClick={() => setStatusFilter(value)}
              className={`px-4 py-2 rounded ${bgClass} transition font-medium capitalize cursor-pointer`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-64 text-sm"
        />
        <button
          onClick={downloadExcel}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Download Excel
        </button>
      </div>

      <div className="text-right font-semibold text-lg text-gray-700 mb-4">
        Total Amount: ₹{total}
      </div>

      <div className="overflow-x-auto shadow rounded-lg bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Date & Time</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id} className="text-center hover:bg-gray-50">
                <td className="p-3 border">{order.formData.name}</td>
                <td className="p-3 border">{order.formData.phone || "-"}</td>
                <td className="p-3 border">{order.formData.address || "-"}</td>
                <td className="p-3 border">{order.orderType}</td>
                <td className="p-3 border capitalize">{order.status}</td>
                <td className="p-3 border">₹{order.totalAmount}</td>
                <td className="p-3 border">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="p-3 border space-x-2">
                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(order._id, "completed")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Completed
                      </button>
                      <button
                        onClick={() => updateStatus(order._id, "rejected")}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
