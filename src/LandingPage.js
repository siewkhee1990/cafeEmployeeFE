import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="w-50 mx-auto">
      LandingPage
      <div>
        <Button
          variant="outlined"
          color="success"
          onClick={() => navigate("/cafes")}
        >
          go to Cafes
        </Button>
        <Button
          variant="outlined"
          color="success"
          onClick={() => navigate("/employees")}
        >
          go to Employees
        </Button>
      </div>
    </div>
  );
}
