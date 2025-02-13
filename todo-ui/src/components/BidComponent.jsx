import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BidService from "../services/BidService";
import { getMemberByBCID } from "../services/MemberService";

const FrequencyEnum = {
  TENDAYS: "TENDAYS",
  WEEKLY: "WEEKLY",
  BIWEEKLY: "BIWEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
};

const BidComponent = () => {
  const { todoId } = useParams();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [bidDate, setBidDate] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [bidWinner, setBidWinner] = useState("");
  const [members, setMembers] = useState([]);
  const [editingBid, setEditingBid] = useState(null);
  const [errors, setErrors] = useState({});
  const totalNumberOfInstallments = 10; // Define based on your logic
  const frequency = FrequencyEnum.MONTHLY; // Define based on your logic

  useEffect(() => {
    fetchMembers();
  }, [todoId]);

  useEffect(() => {
    if (members.length > 0) {
      const extractedBids = members
        .filter((member) => member.bid)
        .map((member) => member.bid);
      setBids(extractedBids);
    }
  }, [members]);

  const validateInputs = () => {
    let newErrors = {};
    if (!bidDate) newErrors.bidDate = "Bid date is required";
    if (!bidAmount) newErrors.bidAmount = "Bid amount is required";
    if (!bidWinner) newErrors.bidWinner = "Bid winner is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchMembers = () => {
    getMemberByBCID(todoId)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setMembers(response.data);
        } else {
          setMembers([]);
        }
      })
      .catch(() => setMembers([]));
  };

  const calculateNextInstallDate = (bidDate, frequency) => {
    const date = new Date(bidDate);
    switch (frequency) {
      case FrequencyEnum.TENDAYS:
        date.setDate(date.getDate() + 10);
        break;
      case FrequencyEnum.WEEKLY:
        date.setDate(date.getDate() + 7);
        break;
      case FrequencyEnum.BIWEEKLY:
        date.setDate(date.getDate() + 15);
        break;
      case FrequencyEnum.MONTHLY:
        date.setMonth(date.getMonth() + 1);
        break;
      case FrequencyEnum.YEARLY:
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        break;
    }
    return date.toISOString().split("T")[0];
  };

  const handleSaveBid = () => {
    if (!validateInputs()) return;
  
    const bidData = {
      todoId: parseInt(todoId),
      bidDate,
      bidAmount: parseFloat(bidAmount),
      bidWinner: parseInt(bidWinner) || null, // Ensure it's an integer
    };
  
    if (editingBid) {
      BidService.updateBid(editingBid.id, bidData).then(() => {
        alert("Bid updated successfully!");
        fetchMembers();
        setEditingBid(null);
      });
    } else {
      BidService.saveBid(bidData).then(() => {
        fetchMembers();
      });
    }
  
    setBidDate("");
    setBidAmount("");
    setBidWinner("");
  };  

  const handleDeleteBid = (bidId) => {
    if (window.confirm("Are you sure you want to delete this bid?")) {
      BidService.deleteBid(bidId)
        .then(() => {
          alert("Bid deleted successfully!");
          fetchMembers();
        })
        .catch((error) => console.error("Failed to delete bid:", error));
    }
  };

  const handleEditBid = (bid) => {
    setBidDate(bid.bidDate);
    setBidAmount(bid.bidAmount);
    setBidWinner(bid.bidWinner?.toString() || ""); // Ensure it's a string for dropdown
    setEditingBid(bid);
  };

  const winningMemberIds = bids.map((bid) => bid.bidWinner);
  const availableMembers = members.filter(
    (member) => !winningMemberIds.includes(member.id)
  );

  return (
    <div className="container">
      <h2 className="text-center mb-4">Manage Bids for BC {todoId}</h2>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title">{editingBid ? "Edit Bid" : "Add New Bid"}</h4>
          <div className="row">
            <div className="col-md-4">
              <label>Bid Date</label>
              <input
                type="date"
                className="form-control"
                value={bidDate}
                onChange={(e) => setBidDate(e.target.value)}
              />
              {errors.bidDate && <small className="text-danger">{errors.bidDate}</small>}
            </div>
            <div className="col-md-4">
              <label>Bid Amount</label>
              <input
                type="number"
                className="form-control"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
              {errors.bidAmount && <small className="text-danger">{errors.bidAmount}</small>}
            </div>
            {availableMembers.length > 0 && (
              <div className="col-md-4">
                <label>Bid Winner</label>
                <select
                  className="form-control"
                  value={bidWinner}
                  onChange={(e) => setBidWinner(e.target.value)}
                >
                  <option value="">Select a member</option>
                  {availableMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                {errors.bidWinner && <small className="text-danger">{errors.bidWinner}</small>}
              </div>
            )}
          </div>
          <button className="btn btn-primary mt-3" onClick={handleSaveBid}>
            {editingBid ? "Update Bid" : "Save Bid"}
          </button>
          {editingBid && (
            <button className="btn btn-secondary mt-3 ms-2" onClick={() => setEditingBid(null)}>
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title">Bids List</h4>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Bid ID</th>
                <th>Bid Date</th>
                <th>Bid Amount</th>
                <th>Bid Winner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid.id}>
                  <td>{bid.id}</td>
                  <td>{bid.bidDate}</td>
                  <td>{bid.bidAmount}</td>
                  <td>{members.find((m) => m.id === parseInt(bid.bidWinner))?.name || "Unknown"}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditBid(bid)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBid(bid.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BidComponent;
