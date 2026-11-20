import React, { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    const verifyUser = async () => {
      try {
        const { data } = await axios.get(
           `${process.env.REACT_APP_API_URL}/verify`,
          { withCredentials: true }
        );

        if (active) {
          setStatus(data.success ? "authenticated" : "unauthenticated");
        }
      } catch (error) {
        if (active) {
          setStatus("unauthenticated");
        }
      }
    };

    verifyUser();

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return <p>Verifying authentication...</p>;
  }

  if (status === "unauthenticated") {
    window.location.replace(`${process.env.REACT_APP_FRONTEND_URL}/login`);
    return null;
  }

  return children;
};

export default ProtectedRoute;