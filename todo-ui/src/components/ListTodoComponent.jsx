import React, { useEffect, useState } from "react";
import { deleteTodo, getAllTodos } from "../services/TodoService";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaTrash, FaEye, FaGavel } from "react-icons/fa";

const ListTodoComponent = () => {
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    listTodos();
  }, []);

  function listTodos() {
    getAllTodos()
      .then((response) => {
        // Preserve the original order of todos
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

  // Function to sort todos by priority (overdue, due soon, on-time)
  const getPrioritySortedTodos = (todos) => {
    return todos.slice().sort((a, b) => {
      const aPriority = getPriorityLevel(a.nextInstDate);
      const bPriority = getPriorityLevel(b.nextInstDate);

      // Higher priority (overdue) comes first
      return bPriority - aPriority;
    });
  };

  // Function to determine priority level
  const getPriorityLevel = (nextInstDate) => {
    if (!nextInstDate) return 0; // No priority if no date
    const today = new Date();
    const installmentDate = new Date(nextInstDate);
    const diffInDays = (installmentDate - today) / (1000 * 60 * 60 * 24);

    if (diffInDays < 0) return 3; // Overdue (highest priority)
    if (diffInDays <= 2) return 2; // Due soon
    return 1; // On-time
  };

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = getPrioritySortedTodos(todos).slice(
    indexOfFirstTodo,
    indexOfLastTodo
  );
  const totalPages = Math.ceil(todos.length / todosPerPage);

  return (
    <div className="container">
      <h2 className="text-center">MAIN PANEL</h2>
      <button className="btn btn-primary mb-2" onClick={addNewTodo}>
        Add New BC
      </button>
      <div>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>BC Id</th>
              <th>BC Title</th>
              {/* <th>BC Description</th> */}
              <th>BC Frequency</th>
              <th>NOI/NOP</th>
              <th>Original Ins Amount</th>
              <th>Total Amount</th>
              <th>Start Date</th>
              <th>Previous Install for NB</th>
              <th>Next Install for NB</th>
              <th>Bicee Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTodos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.title}</td>
                {/* <td>{todo.description}</td> */}
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
                <td>
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

        {todos.length > 10 && (
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