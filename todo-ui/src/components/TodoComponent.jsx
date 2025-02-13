import React, { useEffect, useState } from "react";
import { getTodo, saveTodo, updateTodo } from "../services/TodoService";
import { useNavigate, useParams } from "react-router-dom";

const FrequencyEnum = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  BIWEEKLY: "BIWEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
  TENDAYS: "TENDAYS",
};

const TodoComponent = () => {
  const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState(FrequencyEnum.MONTHLY);
  const [numberOfInstallments, setNumberOfInstallments] = useState("");
  const [bcAmount, setBcAmount] = useState("");
  const [completed, setCompleted] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(""); // Read-only field
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();

  // Function to calculate end date based on start date, frequency, and number of installments
  const calculateEndDate = (startDate, frequency, numberOfInstallments) => {
    if (!startDate || !numberOfInstallments) return ""; // Avoid invalid calculations

    const start = new Date(startDate);
    let daysToAdd = 0;

    switch (frequency) {
      case "TENDAYS":
        daysToAdd = numberOfInstallments * 10;
        break;
      case "MONTHLY":
        daysToAdd = numberOfInstallments * 30;
        break;
      case "WEEKLY":
        daysToAdd = numberOfInstallments * 7;
        break;
      case "BIWEEKLY":
        daysToAdd = numberOfInstallments * 15;
        break;
      case "YEARLY":
        daysToAdd = numberOfInstallments * 365;
        break;
      default:
        daysToAdd = 0;
    }

    start.setDate(start.getDate() + daysToAdd);
    return start.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  // Auto-calculate end date whenever relevant fields change
  useEffect(() => {
    if (startDate && numberOfInstallments) {
      setEndDate(calculateEndDate(startDate, frequency, numberOfInstallments));
    }
  }, [startDate, frequency, numberOfInstallments]);

  function validateForm() {
    let errors = {};
    if (!title.trim()) errors.title = "Title is required";
    // if (!description.trim()) errors.description = "Description is required";
    if (!frequency) errors.frequency = "Frequency is required";
    if (!numberOfInstallments || isNaN(numberOfInstallments)) {
      errors.numberOfInstallments = "Valid Number of Installments is required";
    }
    if (!bcAmount || isNaN(bcAmount))
      errors.bcAmount = "Valid Installment Amount is required";
    if (!startDate) errors.startDate = "Start Date is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function saveOrUpdateTodo(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const todo = {
      title,
      // description,
      frequency,
      numberOfInstallments,
      bcAmount,
      completed,
      startDate,
      endDate,
    };

    if (id) {
      updateTodo(id, todo)
        .then(() => navigate("/todos"))
        .catch((error) => console.error(error));
    } else {
      saveTodo(todo)
        .then(() => navigate("/todos"))
        .catch((error) => console.error(error));
    }
  }

  useEffect(() => {
    if (id) {
      getTodo(id)
        .then((response) => {
          setTitle(response.data.title);
          // setDescription(response.data.description);
          setFrequency(response.data.frequency);
          setNumberOfInstallments(response.data.numberOfInstallments);
          setBcAmount(response.data.bcAmount);
          setCompleted(response.data.completed);
          setStartDate(response.data.startDate);
          setEndDate(response.data.endDate); // Populate pre-existing end date
        })
        .catch((error) => console.error(error));
    }
  }, [id]);

  return (
    <div className="container">
      <br /> <br />
      <div className="row">
        <div className="card col-md-6 offset-md-3">
          <h2 className="text-center">{id ? "Update Bicee" : "Add New Bicee"}</h2>
          <div className="card-body">
            <form>
              <div className="form-group mb-2">
                <label className="form-label">BC Title:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter BC Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <small className="text-danger">{errors.title}</small>}
              </div>

              {/* <div className="form-group mb-2">
                <label className="form-label">BC Description:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter BC Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && <small className="text-danger">{errors.description}</small>}
              </div> */}

              <div className="form-group mb-2">
                <label className="form-label">BC Frequency:</label>
                <select
                  className="form-control"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  {Object.values(FrequencyEnum).map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
                {errors.frequency && <small className="text-danger">{errors.frequency}</small>}
              </div>

              <div className="form-group mb-2">
                <label className="form-label">NOI:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Number of Installments"
                  value={numberOfInstallments}
                  onChange={(e) => setNumberOfInstallments(e.target.value)}
                />
                {errors.numberOfInstallments && (
                  <small className="text-danger">{errors.numberOfInstallments}</small>
                )}
              </div>

              <div className="form-group mb-2">
                <label className="form-label">INS Amt:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Installment Amount"
                  value={bcAmount}
                  onChange={(e) => setBcAmount(e.target.value)}
                />
                {errors.bcAmount && <small className="text-danger">{errors.bcAmount}</small>}
              </div>

              <div className="form-group mb-2">
                <label className="form-label">Start Date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                {errors.startDate && <small className="text-danger">{errors.startDate}</small>}
              </div>

              {/* Display calculated end date (read-only) */}
              <div className="form-group mb-2">
                <label className="form-label">Tentative End Date:</label>
                <input type="text" className="form-control" value={endDate} readOnly />
              </div>

              <button className="btn btn-success" onClick={saveOrUpdateTodo}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoComponent;
