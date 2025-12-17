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

  const fetchEquipment = async () => {
    try {
      const res = await axios.get(API_URL);
      setEquipment(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(
        "Cant connect to database from react. Check if server is running."
      );
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.last_cleaned) {
      setError("Please fill in all required fields");
      return;
    }
    setError("");

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
      fetchEquipment();
    } catch (error) {
      setError("Failed to save equipment.");
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
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchEquipment();
      } catch (err) {
        setError("Failed to delete equipment.");
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Equipment Tracker</h1>

      {error && (
        <div
          style={{
            color: "red",
            backgroundColor: "#ffe6e6",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{ marginBottom: "30px", padding: "20px", background: "#f9f9f9" }}
      >
        <h3>{editingId ? "Edit Equipment" : "Add New Equipment"}</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          <input
            type="text"
            placeholder="Equipment Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="Machine">Machine</option>
            <option value="Vessel">Vessel</option>
            <option value="Tank">Tank</option>
            <option value="Mixer">Mixer</option>
          </select>

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>

          <input
            type="date"
            value={formData.last_cleaned}
            onChange={(e) =>
              setFormData({ ...formData, last_cleaned: e.target.value })
            }
          />
          <button type="submit">{editingId ? "Update" : "Submit"}</button>

          {editingId && (
            <button
              type="button"
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
        </form>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr
            style={{
              backgroundColor: "#007bff",
              color: "white",
              textAlign: "left",
            }}
          >
            <th style={{ padding: "10px" }}>Name</th>
            <th style={{ padding: "10px" }}>Type</th>
            <th style={{ padding: "10px" }}>Status</th>
            <th style={{ padding: "10px" }}>Last Cleaned</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipment.length > 0 ? (
            equipment.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{item.name}</td>
                <td style={{ padding: "10px" }}>{item.type}</td>
                <td style={{ padding: "10px" }}>{item.status}</td>
                <td style={{ padding: "10px" }}>
                  {new Date(item.last_cleaned).toLocaleDateString()}
                </td>
                <td style={{ padding: "10px" }}>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ marginLeft: "5px", color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No equipment found. Add some above!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
