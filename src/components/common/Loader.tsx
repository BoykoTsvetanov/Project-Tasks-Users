import React from "react";
import { Spin } from "antd";

type LoaderProps = {
  size?: "small" | "default" | "large";
  className?: string;
};

const Loader: React.FC<LoaderProps> = ({ size = "large", className = "" }) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <Spin size={size} data-testid="loading-spinner" />
    </div>
  );
};

export default Loader;
