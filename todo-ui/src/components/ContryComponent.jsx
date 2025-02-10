import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getAllContries,
  deleteContry,
  getContryById,
  getContryByMemberId,
} from "../services/ContryService"; // Ensure you have getContryById for fetching specific contry data
import AddContryComponent from "./AddUpdateContryComponent";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ContryComponent = () => {
  const { memberId, name } = useParams();
  const [contries, setContries] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentContry, setCurrentContry] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Contributions",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    fetchContries();
  }, [memberId]);

  const fetchContries = async () => {
    try {
      const response = await getContryByMemberId(memberId);
      setContries(response.data);
      updateChartData(response.data);
    } catch (error) {
      console.error("Error fetching contries:", error);
    }
  };

  const updateChartData = (contries) => {
    const labels = contries.map((contry) => `Contry ${contry.id}`);
    const data = contries.map((contry) => contry.amount);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: "Contributions",
          data: data,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const handleAddContryPopup = () => {
    setCurrentContry(null);
    setShowPopup(true);
  };

  const handleUpdateContryPopup = async (contryId) => {
    try {
      const response = await getContryById(contryId);
      setCurrentContry(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching contry:", error);
    }
  };

  const handleDeleteContry = async (contryId) => {
    if (window.confirm("Are you sure you want to delete this contry?")) {
      try {
        await deleteContry(contryId);
        fetchContries();
      } catch (error) {
        console.error("Error deleting contry:", error);
      }
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleContryAdded = () => {
    fetchContries();
  };

  return (
    <div className="container my-4">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side - Contry Component with tile-like design */}
        <div
          style={{
            flex: 1,
            marginRight: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <h2 className="text-center mb-4">
            Contries for Member: <strong>{name}</strong> (ID:{" "}
            <strong>{memberId}</strong>)
          </h2>
          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-primary" onClick={handleAddContryPopup}>
              Add Contry
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>ContryId</th>
                  <th>Contry Amount</th>
                  <th>Contry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contries.length > 0 ? (
                  contries.map((contry) => (
                    <tr key={contry.id}>
                      <td>{contry.id}</td>
                      <td>{contry.amount}</td>
                      <td>{contry.countryDate}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => handleUpdateContryPopup(contry.id)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger btn-sm ml-2"
                          onClick={() => handleDeleteContry(contry.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Contries available for this member.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showPopup && (
            <AddContryComponent
              memberId={memberId}
              contryId={currentContry?.id}
              contryData={currentContry}
              onClose={handleClosePopup}
              onContryAdded={handleContryAdded}
            />
          )}
        </div>

        {/* Vertical Divider */}
        <div
          style={{
            width: "2px",
            backgroundColor: "#ddd",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        ></div>

        {/* Right side - Dynamic Bar Chart with tile-like design */}
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <h3 className="text-center mb-4">Contributions Overview</h3>
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default ContryComponent;
