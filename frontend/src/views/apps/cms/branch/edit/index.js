import BranchService from "@services/BranchService";
import "@styles/react/apps/app-users.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Row } from "reactstrap";
import BranchTab from "./Branch";

const BranchEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => {
      const result = await BranchService.detail(id);
      if (result.isSuccess) {
        setData(result?.data || null);
      }
    })();
  }, []);

  return Object?.values(data)?.length > 0 ? (
    <BranchTab initial={data} />
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Chi nhánh Không tồn tại</h4>
    </Alert>
  );
};
export default BranchEdit;
