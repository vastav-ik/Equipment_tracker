import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/equipment";

function App() {
  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "Machine",
    status: "Active",
    last_cleaned: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Filter and Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const fetchEquipment = async () => {
    try {
      const res = await axios.get(API_URL);
      setEquipment(res.data);
      setError("");
    } catch (err) {
      setError(
        "Cannot connect to server. Please ensure the backend is running."
      );
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // Derived State: Logic for Search, Filter, and Sort
  const filteredEquipment = equipment
    .filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = filterType === "All" || item.type === filterType;
      const matchesStatus =
        filterStatus === "All" || item.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.last_cleaned) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({
        name: "",
        type: "Machine",
        status: "Active",
        last_cleaned: "",
      });
      setError("");
      fetchEquipment();
    } catch (error) {
      setError("Failed to save changes to the database.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    const formattedDate = item.last_cleaned
      ? item.last_cleaned.split("T")[0]
      : "";
    setFormData({
      name: item.name,
      type: item.type,
      status: item.status,
      last_cleaned: formattedDate,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchEquipment();
      } catch (err) {
        setError("Error deleting equipment.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            <span className="text-blue-600">Equipment Tracker</span>
          </h1>
          <p className="mt-2 text-slate-600">
            Manage validation and compliance data efficiently.
          </p>
        </header>

        {error && (
          <div className="mb-6 animate-pulse bg-red-50 border-l-4 border-red-500 p-4 text-red-700 shadow-sm rounded-r-md">
            <p className="font-medium">Action Required: {error}</p>
          </div>
        )}

        <section className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-slate-100 transition-all hover:shadow-2xl">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            {editingId ? " Edit Equipment Details" : " Register New Equipment"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5"
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
                Name
              </label>
              <input
                className="w-full border-slate-200 border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="text"
                placeholder="e.g. Tank-01"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
                Type
              </label>
              <select
                className="w-full border-slate-200 border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="Machine">Machine</option>
                <option value="Vessel">Vessel</option>
                <option value="Tank">Tank</option>
                <option value="Mixer">Mixer</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
                Status
              </label>
              <select
                className="w-full border-slate-200 border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
                Last Cleaned
              </label>
              <input
                className="w-full border-slate-200 border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                type="date"
                value={formData.last_cleaned}
                onChange={(e) =>
                  setFormData({ ...formData, last_cleaned: e.target.value })
                }
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 shadow-md active:scale-95 transition"
              >
                {editingId ? "Update" : "Save"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-2.5 rounded-lg hover:bg-slate-200 transition"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      type: "Machine",
                      status: "Active",
                      last_cleaned: "",
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-slate-200/50 p-4 rounded-xl mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400"></span>
            <input
              className="w-full pl-9 pr-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-full p-2 bg-white rounded-lg border-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Machine">Machine</option>
            <option value="Vessel">Vessel</option>
            <option value="Tank">Tank</option>
            <option value="Mixer">Mixer</option>
          </select>
          <select
            className="w-full p-2 bg-white rounded-lg border-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Under Maintenance">Maintenance</option>
          </select>
        </section>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th
                    className="p-5 text-sm font-bold text-slate-500 uppercase cursor-pointer hover:text-blue-600 transition"
                    onClick={() => requestSort("name")}
                  >
                    Name{" "}
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="p-5 text-sm font-bold text-slate-500 uppercase">
                    Type
                  </th>
                  <th className="p-5 text-sm font-bold text-slate-500 uppercase">
                    Status
                  </th>
                  <th
                    className="p-5 text-sm font-bold text-slate-500 uppercase cursor-pointer hover:text-blue-600 transition"
                    onClick={() => requestSort("last_cleaned")}
                  >
                    Last Cleaned{" "}
                    {sortConfig.key === "last_cleaned" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="p-5 text-sm font-bold text-slate-500 uppercase text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEquipment.length > 0 ? (
                  filteredEquipment.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="p-5 font-semibold text-slate-800">
                        {item.name}
                      </td>
                      <td className="p-5 text-slate-600">{item.type}</td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                            item.status === "Active"
                              ? "bg-green-50 text-green-700 ring-green-600/20"
                              : item.status === "Inactive"
                              ? "bg-red-50 text-red-700 ring-red-600/20"
                              : "bg-orange-50 text-orange-700 ring-orange-600/20"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-5 text-slate-600">
                        {new Date(item.last_cleaned).toLocaleDateString()}
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-800 font-bold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700 font-bold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-20 text-center text-slate-400 italic"
                    >
                      No matching records found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
