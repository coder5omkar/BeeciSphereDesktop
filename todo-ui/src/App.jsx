import { useState } from "react";
import "./App.css";
import ListTodoComponent from "./components/ListTodoComponent";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import TodoComponent from "./components/TodoComponent";
import RegisterComponent from "./components/RegisterComponent";
import LoginComponent from "./components/LoginComponent";
import { isUserLoggedIn } from "./services/AuthService";
import MemberTable from "./components/MemberTable";
import MemberComponent from "./components/MemberComponent";
import AddMemberComponent from "./components/AddMemberComponent";
import UpdateMemberComponent from "./components/UpdateMemberComponent";
import ContryComponent from "./components/ContryComponent";
import ThanksComponent from "./components/ThanksComponent";
import BidComponent from "./components/BidComponent"; // Import the new BidComponent

function App() {
  function AuthenticatedRoute({ children }) {
    const isAuth = isUserLoggedIn();
    if (isAuth) {
      return children;
    }
    return <Navigate to="/" />;
  }

  function Layout({ children }) {
    const location = useLocation();
    const hideHeader = location.pathname === "/thanks"; // Hide header on /thanks page

    return (
      <>
        {!hideHeader && <HeaderComponent />}
        {children}
      </>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route
            path="/todos"
            element={
              <AuthenticatedRoute>
                <ListTodoComponent />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/add-todo"
            element={
              <AuthenticatedRoute>
                <TodoComponent />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/update-todo/:id"
            element={
              <AuthenticatedRoute>
                <TodoComponent />
              </AuthenticatedRoute>
            }
          />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route
            path="/members/:todoId"
            element={
              <AuthenticatedRoute>
                <MemberTable />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/members/:todoId/add"
            element={
              <AuthenticatedRoute>
                <AddMemberComponent />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/members/:todoId/contries/:memberId"
            element={
              <AuthenticatedRoute>
                <ContryComponent />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/members/:todoId/edit/:memberId"
            element={
              <AuthenticatedRoute>
                <UpdateMemberComponent />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/bids/:todoId" // New route for BidComponent
            element={
              <AuthenticatedRoute>
                <BidComponent />
              </AuthenticatedRoute>
            }
          />
          <Route path="/thanks" element={<ThanksComponent />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;