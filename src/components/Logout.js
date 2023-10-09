import React from "react";
import { useUser } from "./UserContext";

const Logout = () => {
  const { setUser } = useUser();
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    console.log("Logged out successfully");
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
