import React, { useEffect } from "react";
import Swal from "sweetalert2";

export const SuccessAlert = ({ title }) => {
  Swal.fire({
    position: "center",
    icon: "success",
    title: title || "Your work has been saved",
    showConfirmButton: false,
    timer: 1500,
  });
};

export const ErrorAlert = ({ title }) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: title || "Something went wrong!",
  });
};

