import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMemberByBCID, deleteMember } from "../services/MemberService";
import { getTodo } from "../services/TodoService";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  FaUserEdit,
  FaTrash,
  FaEye,
  FaPhone,
  FaFilePdf,
  FaMoneyBillWave,
} from "react-icons/fa";

const MemberTable = () => {
  const { todoId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [numberOfInstallments, setNumberOfInstallments] = useState(0);
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [maturityAmount, setMaturityAmount] = useState(0);
  const [nextInstAmount, setNextInstAmount] = useState(0); // New state for next installment amount
  const [nextInstDate, setNextInstDate] = useState(null); // New state for next installment date

  useEffect(() => {
    fetchTodoDetails();
    fetchMembers();
  }, []);

  const fetchTodoDetails = async () => {
    try {
      const response = await getTodo(todoId);
      const { bcAmount, numberOfInstallments, nextInstAmount, nextInstDate } =
        response.data;

      setNumberOfInstallments(numberOfInstallments || 0);
      setInstallmentAmount(bcAmount || 0);
      setMaturityAmount(numberOfInstallments * bcAmount);
      setNextInstAmount(nextInstAmount || 0); // Set next installment amount
      setNextInstDate(nextInstDate || null); // Set next installment date
    } catch (error) {
      console.error("Error fetching todo details:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await getMemberByBCID(todoId);
      const response2 = await getTodo(todoId);

      const numberOfInstallments = response2.data.numberOfInstallments || 0;
      const installmentAmount = response2.data.bcAmount || 0;
      const maturityAmount = numberOfInstallments * installmentAmount;

      setNumberOfInstallments(numberOfInstallments);
      setInstallmentAmount(installmentAmount);
      setMaturityAmount(maturityAmount);

      setMembers(
        response.data.map((member) => ({
          ...member,
          amountReceived: member.contributions.reduce(
            (sum, contribution) => sum + (contribution.amount || 0),
            0
          ),
          maturityAmount: maturityAmount,
        }))
      );
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleAddMember = () => {
    navigate(`/members/${todoId}/add`);
  };

  const handleUpdateMember = (memberId) => {
    navigate(`/members/${todoId}/edit/${memberId}`);
  };

  const handleDeleteMember = async (member) => {
    if (member.bid) {
      alert("This member has an active bid and cannot be deleted.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteMember(member.id);
        fetchMembers();
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowPopup(true);
  };

  const handleViewContries = (memberId) => {
    navigate(`/members/${todoId}/contries/${memberId}`);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedMember(null);
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById("popup-content");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFontSize(12);
      pdf.text(`Member Details - ${new Date().toLocaleString()}`, 10, 10);
      pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);
      pdf.save(`Member_${selectedMember.id}_${Date.now()}.pdf`);
    });
  };

  const handleWhatsAppContact = (member) => {
    setSelectedMember(member);
  
    const {
      phoneNumber,
      name,
      amountReceived,
      maturityAmount,
      status,
      dateJoined,
      maturityDate,
    } = member;
  
    if (!phoneNumber || phoneNumber.trim() === "") {
      alert("या सदस्यासाठी मोबाइल नंबर उपलब्ध नाही.");
      return;
    }
  
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
  
    if (cleanedPhoneNumber.length < 10) {
      alert("अवैध मोबाइल नंबर. Please check/update member details..");
      return;
    }
  
    // Add next installment details to the message
    const nextInstMessage = nextInstAmount && nextInstDate
      ? `\n- पुढील हप्ता: ₹${nextInstAmount} on ${new Date(nextInstDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        })}`
      : "\n- पुढील हप्ता: No upcoming installment.";
  
    const message = `नमस्कार ${name},\n\nतुमच्या सदस्यता तपशीलांविषयी माहिती:\n\n- नाव: ${name}\n- प्राप्त रक्कम: ₹${amountReceived}\n- परिपक्वता रक्कम: ₹${maturityAmount}\n- स्थिती: ${status}\n- सामील होण्याची तारीख: ${new Date(
      dateJoined
    // ).toLocaleDateString()}\n- परिपक्वता तारीख: ${new Date(
    //   maturityDate
    ).toLocaleDateString()}${nextInstMessage}\n\nकृपया वरील माहिती तपासा आणि आम्हाला अद्यतनित करा. धन्यवाद!`;
  
    const encodedMessage = encodeURIComponent(message);
  
    const whatsappUrl = `whatsapp://send?phone=${cleanedPhoneNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Members for BC: {todoId}</h2>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <strong>Maturity Amount:</strong> ₹{maturityAmount}
          <br />
          {nextInstAmount && nextInstDate ? (
            <small>
              <strong>Next Inst:</strong> ®️ ₹{nextInstAmount} on{" "}
              {new Date(nextInstDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              })}
            </small>
          ) : (
            <small>
              <strong>Next Inst:</strong> No upcoming installment.
            </small>
          )}
        </div>

        <button className="btn btn-primary" onClick={handleAddMember}>
          Add Member
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Amount Received</th>
              <th>Bid Details</th>
              <th>Status</th>
              <th>Date Joined</th>
              {/* <th>Maturity Date</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member) => (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.amountReceived}</td>
                  <td className="border p-2">
                    {member.bid && member.bid.bidDate
                      ? `${new Date(member.bid.bidDate).toLocaleDateString(
                          "en-GB"
                        )} bidWin at ®️ ${member.bid.bidAmount}`
                      : "No bid yet"}
                  </td>
                  <td>{member.status}</td>
                  <td>{new Date(member.dateJoined).toLocaleDateString()}</td>
                  {/* <td>{new Date(member.maturityDate).toLocaleDateString()}</td> */}
                  <td>
                    <button
                      className="btn btn-info btn-sm mb-1 me-2"
                      onClick={() => handleUpdateMember(member.id)}
                      title="Edit Member"
                    >
                      <FaUserEdit />
                    </button>
                    <button
                      className="btn btn-success btn-sm mb-1 me-2"
                      onClick={() => handleViewContries(member.id)}
                      title="View Countries"
                    >
                      <FaMoneyBillWave />
                    </button>
                    <button
                      className="btn btn-danger btn-sm mb-1 me-2"
                      onClick={() => handleDeleteMember(member)}
                      title="Delete Member"
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="btn btn-primary btn-sm mb-1 me-2"
                      onClick={() => handleViewMember(member)}
                      title="View Member"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-success btn-sm mb-1 me-2"
                      onClick={() => handleWhatsAppContact(member)}
                      title="View Member"
                    >
                      <FaPhone />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No members found for this Todo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPopup && selectedMember && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-button" onClick={closePopup}>
              &times;
            </button>
            <h3 className="text-center">Member Details</h3>
            <div id="popup-content" className="popup-content">
              <div className="popup-details">
                <p>
                  <strong>ID:</strong> {selectedMember.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedMember.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedMember.email}
                </p>
                <p>
                  <strong>Phone Number:</strong> {selectedMember.phoneNumber}
                </p>
                <p>
                  <strong>Address:</strong> {selectedMember.address}
                </p>
                <p>
                  <strong>Amount Received:</strong>{" "}
                  {selectedMember.amountReceived}
                </p>
                <p>
                  <strong>Maturity Amount:</strong>{" "}
                  {selectedMember.maturityAmount}
                </p>
                <p>
                  <strong>Status:</strong> {selectedMember.status}
                </p>
                <p>
                  <strong>Date Joined:</strong>{" "}
                  {new Date(selectedMember.dateJoined).toLocaleDateString()}
                </p>
                {/* <p>
                  <strong>Maturity Date:</strong>{" "}
                  {new Date(selectedMember.maturityDate).toLocaleDateString()}
                </p> */}
              </div>

              <div className="popup-chart">
                <h4 className="text-center">Financial Overview</h4>
                <Pie
                  data={{
                    labels: ["Amount Received", "Maturity Amount"],
                    datasets: [
                      {
                        data: [
                          selectedMember.amountReceived,
                          selectedMember.maturityAmount,
                        ],
                        backgroundColor: ["#4CAF50", "#FFC107"],
                      },
                    ],
                  }}
                  options={{ maintainAspectRatio: true }}
                />
              </div>
            </div>
            <button
              className="btn btn-success mt-3"
              onClick={handleDownloadPDF}
            >
              <FaFilePdf className="me-2" title="Download PDF" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberTable;
