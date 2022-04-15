import React from "react";

type P = {
  message?: string;
};

const ErrorMessage: React.FC<P> = ({ message }) => {
  if (!message) return null;

  return <em className="text-red-500 mt-0.5">{message}</em>;
};

export default ErrorMessage;
