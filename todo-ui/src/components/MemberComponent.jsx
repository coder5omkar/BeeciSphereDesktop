import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  getAllMembers,
  deleteMember,
  getMemberByBCID
} from "../services/MemberService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const MemberComponent = () => {
  const { id: todoId } = useParams(); // Get the todoId from route params
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchContries();
  }, [todoId]);

  const fetchMembers = async () => {
    try {
      const response = await getMemberByBCID(todoId);
      const filteredMembers = response.data.filter(
        (member) => member.todo === parseInt(todoId)
      );
      setMembers(filteredMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  const pieChartData = {
    labels: ["Amount Received", "Maturity Amount"],
    datasets: [
      {
        data: [
          selectedMember ? selectedMember.amountReceived : 0,
          selectedMember ? selectedMember.maturityAmount : 0,
        ],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#2C83D8", "#FF1F47"],
      },
    ],
  };

  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleAddMember = () => {
    navigate(`/add-member/${todoId}`); // Navigate to a form for adding a new member
  };

  const handleUpdateMember = (memberId) => {
    navigate(`/update-member/${memberId}`); // Navigate to a form for updating the selected member
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteMember(memberId);
        fetchMembers(); // Refresh the table after deletion
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  return (
    <div className="container" style={{ display: "flex", gap: "20px" }}>
      {/* Left Side: Table */}
      <div style={{ flex: 2 }}>
        <h2 className="text-center">Members</h2>

        <table
          className="table table-bordered table-striped"
          style={{ tableLayout: "fixed", width: "100%" }}
        >
          <thead>
            <tr>
              <th style={{ width: "10%" }}>ID</th>
              <th style={{ width: "20%" }}>Name</th>
              <th style={{ width: "20%" }}>Email</th>
              <th style={{ width: "15%" }}>Phone Number</th>
              <th style={{ width: "15%" }}>Amount Received</th>
              <th style={{ width: "15%" }}>Maturity Amount</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member) => (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.phoneNumber}</td>
                  <td>{member.amountReceived}</td>
                  <td>{member.maturityAmount}</td>
                  <td>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => navigate(`/update-member/${member.id}`)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Right Side: Pie Chart */}
      <div style={{ flex: 1 }}>
        <h3>Contribution Breakdown</h3>
        <Pie data={pieChartData} />
      </div>

      {showModal && selectedMember && (
        <div className="modal" style={modalStyles}>
          <div className="modal-content">
            <span
              className="close-btn"
              onClick={handleCloseModal}
              style={closeButtonStyles}
            >
              &times;
            </span>
            <h3>Member Details</h3>

            <div
              className="details-container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              {/* Left Side: Text Data */}
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Name:</strong> {selectedMember.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedMember.email}
                </p>
                <p>
                  <strong>Phone Number:</strong> {selectedMember.phoneNumber}
                </p>
                <p>
                  <strong>Amount Received:</strong>{" "}
                  {selectedMember.amountReceived}
                </p>
                <p>
                  <strong>Maturity Amount:</strong>{" "}
                  {selectedMember.maturityAmount}
                </p>
              </div>

              {/* Right Side: Chart */}
              <div
                className="chart-container"
                style={{
                  width: "200px",
                  height: "200px",
                }}
              >
                <Pie data={pieChartData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for modal
const modalStyles = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const closeButtonStyles = {
  position: "absolute",
  top: "10px",
  right: "20px",
  fontSize: "30px",
  cursor: "pointer",
};

export default MemberComponent;
