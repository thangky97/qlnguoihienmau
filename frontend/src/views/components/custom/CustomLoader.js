import React from "react";
import { Spinner } from "reactstrap";

const CustomLoader = () => {
  return (
    <div className="pt-2 pb-5">
      <Spinner
        color="primary"
        style={{
          height: "3rem",
          width: "3rem",
        }}
      />
    </div>
  );
};

export default CustomLoader;
