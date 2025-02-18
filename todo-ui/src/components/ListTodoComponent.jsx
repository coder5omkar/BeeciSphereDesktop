import React, { useEffect, useState } from "react";
import { deleteTodo, getAllTodos } from "../services/TodoService";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaTrash, FaEye, FaGavel } from "react-icons/fa";
import "./ListTodoComponent.css";

const ListTodoComponent = () => {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    listTodos();
  }, []);

  function listTodos() {
    getAllTodos()
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function addNewTodo() {
    navigate("/add-todo");
  }

  function updateTodo(id) {
    navigate(`/update-todo/${id}`);
  }

  function removeTodo(id) {
    if (window.confirm("Are you sure you want to delete this BC?")) {
      deleteTodo(id)
        .then(() => {
          setTodos(todos.filter((todo) => todo.id !== id));
        })
        .catch((error) => {
          console.error(error);
          alert(
            "Failed to delete Bicee. It has active members and contributions. Delete them first to delete this Bicee."
          );
        });
    }
  }

  function viewMembers(todo) {
    navigate(`/members/${todo.id}`);
  }

  function viewBids(todo) {
    navigate(`/bids/${todo.id}`);
  }

  function getCellColor(nextInstDate) {
    if (!nextInstDate) return "";
    const today = new Date();
    const installmentDate = new Date(nextInstDate);
    const diffInDays = (installmentDate - today) / (1000 * 60 * 60 * 24);

    if (diffInDays < 0) return "table-danger"; // Red for overdue
    if (diffInDays <= 3) return "table-warning"; // Yellow for due in 3 days
    return "";
  }

  const getPrioritySortedTodos = (todos) => {
    if (todos.length === 0) return [];

    const mostRecentTodo = todos.reduce((latest, todo) =>
      todo.updatesTs > latest.updatesTs ? todo : latest
    );

    const remainingTodos = todos.filter(todo => todo !== mostRecentTodo);

    const sortedTodos = remainingTodos.sort((a, b) => {
      const aPriority = getPriorityLevel(a.nextInstDate);
      const bPriority = getPriorityLevel(b.nextInstDate);
      return bPriority - aPriority; // Higher priority first
    });

    return [mostRecentTodo, ...sortedTodos];
  };

  const getPriorityLevel = (nextInstDate) => {
    if (!nextInstDate) return 0;
    const today = new Date();
    const installmentDate = new Date(nextInstDate);
    const diffInDays = (installmentDate - today) / (1000 * 60 * 60 * 24);

    if (diffInDays < 0) return 3; // Overdue
    if (diffInDays <= 2) return 2; // Due soon
    return 1; // On-time
  };

  // Filter todos based on search term
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = getPrioritySortedTodos(filteredTodos).slice(
    indexOfFirstTodo,
    indexOfLastTodo
  );
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

  return (
    <div className="container">
      <h2 className="text-center">MAIN PANEL</h2>
      <div className="d-flex justify-content-between mb-2">
        <button className="btn btn-primary" onClick={addNewTodo}>
          Add New BC
        </button>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by BC Title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>BC Id</th>
              <th>BC Title</th>
              <th>BC Frequency</th>
              <th>NOI/NOP</th>
              <th>Original Ins Amount</th>
              <th>Total Amount</th>
              <th>Start Date</th>
              <th>Previous Install for NB</th>
              <th>Next Install for NB</th>
              <th>Bicee Balance</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTodos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.title}</td>
                <td>{todo.frequency}</td>
                <td>{todo.numberOfInstallments}</td>
                <td>{todo.bcAmount}</td>
                <td>{todo.numberOfInstallments * todo.bcAmount}</td>
                <td>{todo.startDate}</td>
                <td>
                  {todo.currentInstAmount && todo.currentInstDate ? (
                    `Last Inst ®️ ${todo.currentInstAmount} on ${new Date(
                      todo.currentInstDate
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}`
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className={getCellColor(todo.nextInstDate)}>
                  {todo.nextInstAmount && todo.nextInstDate ? (
                    `Next Inst ®️ ${todo.nextInstAmount} on ${new Date(
                      todo.nextInstDate
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}`
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{todo.bcBalance !== null ? todo.bcBalance : "N/A"}</td>
                <td className="actions-column">
                  <button
                    className="btn btn-info btn-sm mb-1 me-2"
                    onClick={() => updateTodo(todo.id)}
                    title="Update Bicee"
                  >
                    <FaUserEdit />
                  </button>
                  <button
                    className="btn btn-danger btn-sm mb-1 me-2"
                    onClick={() => removeTodo(todo.id)}
                    title="Delete Bicee"
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="btn btn-success btn-sm mb-1 me-2"
                    onClick={() => viewMembers(todo)}
                    title="View Members"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn btn-warning btn-sm mb-1 me-2"
                    onClick={() => viewBids(todo)}
                    title="View Bids"
                  >
                    <FaGavel />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTodos.length > 8 && (
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="mx-3">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListTodoComponent;
