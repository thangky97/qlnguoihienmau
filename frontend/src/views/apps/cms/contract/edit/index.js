import ContractService from "@services/ContractService";
import "@styles/react/apps/app-users.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import ContractTab from "./contract";

const ContractEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await ContractService.detailContract(id);
      if (result.isSuccess) {
        setData(result.data);
      }
    })();
  }, [id]);
  return data ? (
    <div className="app-user-edit">
      <ContractTab initial={data} />
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Hợp đồng Không tồn tại</h4>
    </Alert>
  );
};
export default ContractEdit;
