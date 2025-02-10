import { useEffect } from "react";

const ThanksComponent = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.close(); // Closes the current browser tab/window
    }, 2000);

    return () => clearTimeout(timer); // Cleanup in case the component unmounts early
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Thank you!</h2>
      <p>The application is shutting down...</p>
    </div>
  );
};

export default ThanksComponent;
