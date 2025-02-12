import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BidService from "../services/BidService";
import { getMemberByBCID } from "../services/MemberService";

const BidComponent = () => {
  const { todoId } = useParams(); // Get the todoId from the URL
  const navigate = useNavigate();
  const [bids, setBids] = useState([]); // Initialize as an empty array
  const [bidDate, setBidDate] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [bidWinner, setBidWinner] = useState("");
  const [members, setMembers] = useState([]); // Store member details (id, name)
  const [editingBid, setEditingBid] = useState(null); // Track the bid being edited

  useEffect(() => {
    // Fetch members for the todo
    fetchMembers();
  }, [todoId]);

  useEffect(() => {
    // Extract bids from members whenever members data changes
    if (members.length > 0) {
      const extractedBids = members
        .filter((member) => member.bid) // Filter members with bids
        .map((member) => member.bid); // Extract the bid object
      setBids(extractedBids); // Set the bids state
    }
  }, [members]);

  const fetchMembers = () => {
    // Fetch members for the todo
    getMemberByBCID(todoId)
      .then((response) => {
        console.log("Members API Response:", response.data); // Debugging
        if (Array.isArray(response.data)) {
          setMembers(response.data); // Assuming response.data is an array of { id, name }
        } else {
          console.error("Expected an array of members, but got:", response.data);
          setMembers([]); // Set to empty array if the response is not an array
        }
      })
      .catch((error) => {
        console.error("Failed to fetch members:", error);
        setMembers([]); // Set to empty array on error
      });
  };

  const handleSaveBid = () => {
    const bidData = {
      todoId: parseInt(todoId),
      bidDate,
      bidAmount: parseFloat(bidAmount),
      bidWinner: parseInt(bidWinner),
    };

    if (editingBid) {
      // Update existing bid
      BidService.updateBid(editingBid.id, bidData)
        .then(() => {
          alert("Bid updated successfully!");
          fetchMembers(); // Refresh the members list (which will update bids)
          setEditingBid(null); // Reset editing state
        })
        .catch((error) => {
          console.error("Failed to update bid:", error);
          alert("Failed to update bid. Please try again.");
        });
    } else {
      // Create new bid
      BidService.saveBid(bidData)
        .then(() => {
          alert("Bid saved successfully!");
          fetchMembers(); // Refresh the members list (which will update bids)
        })
        .catch((error) => {
          console.error("Failed to save bid:", error);
          alert("Failed to save bid. Please try again.");
        });
    }

    // Clear form fields
    setBidDate("");
    setBidAmount("");
    setBidWinner("");
  };

  const handleDeleteBid = (bidId) => {
    if (window.confirm("Are you sure you want to delete this bid?")) {
      BidService.deleteBid(bidId)
        .then(() => {
          alert("Bid deleted successfully!");
          fetchMembers(); // Refresh the members list (which will update bids)
        })
        .catch((error) => {
          console.error("Failed to delete bid:", error);
          alert("Failed to delete bid. Please try again.");
        });
    }
  };

  const handleEditBid = (bid) => {
    // Set the form fields to the bid being edited
    setBidDate(bid.bidDate);
    setBidAmount(bid.bidAmount);
    setBidWinner(bid.bidWinner);
    setEditingBid(bid); // Track the bid being edited
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Manage Bids for BC {todoId}</h2>

      {/* Bid Form in a Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title">
            {editingBid ? "Edit Bid" : "Add New Bid"}
          </h4>
          <div className="row">
            <div className="col-md-4">
              <label>Bid Date</label>
              <input
                type="date"
                className="form-control"
                value={bidDate}
                onChange={(e) => setBidDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label>Bid Amount</label>
              <input
                type="number"
                className="form-control"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label>Bid Winner</label>
              <select
                className="form-control"
                value={bidWinner}
                onChange={(e) => setBidWinner(e.target.value)}
              >
                <option value="">Select a member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={handleSaveBid}
          >
            {editingBid ? "Update Bid" : "Save Bid"}
          </button>
          {editingBid && (
            <button
              className="btn btn-secondary mt-3 ms-2"
              onClick={() => {
                setEditingBid(null); // Cancel editing
                setBidDate("");
                setBidAmount("");
                setBidWinner("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Bids Table */}
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
                  <td>
                    {members.find((m) => m.id === bid.bidWinner)?.name || "Unknown"}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEditBid(bid)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteBid(bid.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default BidComponent;