import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { saveMember } from "../services/MemberService"; // Assuming saveMember is defined in your service

// Enum values for MemberStatus
const MemberStatusEnum = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
};

const AddMemberComponent = () => {
  const { todoId: todo } = useParams(); // Get the todoId from route params
  const navigate = useNavigate();

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Returns date in "YYYY-MM-DD"
  };

  const [member, setMember] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    amountReceived: "",
    maturityAmount: "",
    status: MemberStatusEnum.ACTIVE, // Default to ACTIVE status
    dateJoined: getTodayDate(),
    maturityDate: "",
    todoId: todo, // Automatically associate with the current todoId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveMember(member); // Save the member via the service
      navigate(`/members/${todo}`); // Navigate back to the members list page after saving
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Member for BC ID: {todo}</h2>
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

        {/* <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Amount Received:</label>
            <input
              type="number"
              className="form-control"
              name="amountReceived"
              value={member.amountReceived}
              onChange={handleChange}
              required
            /> */}
          {/* </div>
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

        {/* <div className="row mb-3">
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
          <button type="submit" className="btn btn-primary mt-3 px-4 py-2">
            Add Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMemberComponent;
