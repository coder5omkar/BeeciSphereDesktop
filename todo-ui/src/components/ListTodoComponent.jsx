import React, { useEffect, useState } from "react";
import { deleteTodo, getAllTodos } from "../services/TodoService";
import { useNavigate } from "react-router-dom";

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
          alert("Failed to delete BC. Please try again.");
        });
    }
  }

  function viewMembers(todo) {
    navigate(`/members/${todo.id}`);
  }

  // Pagination logic
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

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
              <th>BC Description</th>
              <th>BC Frequency</th>
              <th>Number of Installments</th>
              <th>Installment Amount</th>
              <th>Total Amount</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTodos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
                <td>{todo.frequency}</td>
                <td>{todo.numberOfInstallments}</td>
                <td>{todo.bcAmount}</td>
                <td>{todo.numberOfInstallments * todo.bcAmount}</td>
                <td>{todo.startDate}</td>
                <td>{todo.endDate}</td>
                <td>
                  <button className="btn btn-info btn-sm" onClick={() => updateTodo(todo.id)}>
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeTodo(todo.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => viewMembers(todo)}
                    style={{ marginLeft: "10px" }}
                  >
                    View Member Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls - only show if there are more than 10 records */}
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
