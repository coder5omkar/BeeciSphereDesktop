import React, { useState, useEffect } from "react";
import { saveContry, updateContry } from "../services/ContryService"; // Ensure updateContry is imported
import "./AddContryComponent.css"; // Add custom styles for the popup

const AddContryComponent = ({ memberId, contryId, onClose, onContryAdded, contryData }) => {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Returns date in "YYYY-MM-DD"
  };

  const [formData, setFormData] = useState({
    amount: "",
    countryDate: getTodayDate(), // Set today's date as the default value
    numberOfInst: "",
    memberId: memberId,
  });

  // If there's contry data passed, populate form fields for update
  useEffect(() => {
    if (contryData) {
      setFormData({
        ...formData,
        ...contryData,
      });
    }
  }, [contryData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (contryId) {
        // If contryId exists, it's an update
        await updateContry(contryId, formData);
      } else {
        // If no contryId, it's an add
        await saveContry(formData);
      }
      onContryAdded(); // Refresh the parent component after adding or updating the contry
      onClose(); // Close the popup
    } catch (error) {
      console.error("Error saving contry:", error);
      alert("Failed to save contry. Please try again.");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h3 className="text-center mb-4">
          {contryId ? "Update Contry" : "Add Contry"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Country Date:</label>
            <input
              type="date"
              name="countryDate"
              value={formData.countryDate}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Number of Installments:</label>
            <input
              type="number"
              name="numberOfInst"
              value={formData.numberOfInst}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Member ID:</label>
            <input
              type="text"
              name="memberId"
              value={formData.memberId}
              className="form-control"
              readOnly
            />
          </div>
          <div className="form-group text-center mt-3">
            <button type="submit" className="btn btn-primary">
              {contryId ? "Update Contry" : "Add Contry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContryComponent;
