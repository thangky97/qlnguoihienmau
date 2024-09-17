import { Route } from "react-router-dom";
import "@styles/react/apps/app-tour.scss";
import Table from "./Table";

const CustomerList = () => {
  return (
    <>
      <div className="app-user-list">
        <Route component={Table} />
      </div>
    </>
  );
};

export default CustomerList;
