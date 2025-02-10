import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMember, updateMember } from "../services/MemberService"; // Assuming these services are defined

// Enum values for MemberStatus
const MemberStatusEnum = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
};

const UpdateMemberComponent = () => {
  const { todoId, memberId } = useParams(); // Get the todoId and memberId from route params
  const navigate = useNavigate();

  const [member, setMember] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    amountReceived: "",
    maturityAmount: "",
    status: MemberStatusEnum.ACTIVE, // Default to ACTIVE status
    dateJoined: "",
    maturityDate: "",
    todoId: todoId, // Automatically associate with the current todoId
  });

  useEffect(() => {
    fetchMember();
  }, []);

  const fetchMember = async () => {
    try {
      const response = await getMember(memberId); // Fetch member details
      setMember(response.data);
    } catch (error) {
      console.error("Error fetching member:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMember(memberId, member); // Update the member via the service
      navigate(`/members/${todoId}`); // Navigate back to the members list page after updating
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Update Member for Todo ID: {todoId}</h2>
      <form onSubmit={handleSubmit} className="form-group shadow-sm p-4 rounded border">
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Name:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={member.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={member.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Phone Number:</label>
            <input
              type="text"
              className="form-control"
              name="phoneNumber"
              value={member.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Address:</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={member.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>
{/* 
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Amount Received:</label>
            <input
              type="number"
              className="form-control"
              name="amountReceived"
              value={member.amountReceived}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Maturity Amount:</label>
            <input
              type="number"
              className="form-control"
              name="maturityAmount"
              value={member.maturityAmount}
              onChange={handleChange}
              required
            />
          </div>
        </div> */}

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Status:</label>
            <select
              className="form-control"
              name="status"
              value={member.status}
              onChange={handleChange}
              required
            >
              <option value={MemberStatusEnum.ACTIVE}>ACTIVE</option>
              <option value={MemberStatusEnum.INACTIVE}>INACTIVE</option>
              <option value={MemberStatusEnum.COMPLETED}>COMPLETED</option>
              <option value={MemberStatusEnum.PENDING}>PENDING</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Date Joined:</label>
            <input
              type="date"
              className="form-control"
              name="dateJoined"
              value={member.dateJoined}
              onChange={handleChange}
              required
            />
          </div>
        </div>
{/* 
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Maturity Date:</label>
            <input
              type="date"
              className="form-control"
              name="maturityDate"
              value={member.maturityDate}
              onChange={handleChange}
              required
            />
          </div>
        </div> */}

        <div className="text-center">
          <button type="submit" className="btn btn-success mt-3 px-4 py-2">
            Update Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMemberComponent;
