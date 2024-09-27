import RegisterDonateBloodService from "@services/RegisterDonateBloodService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import RegisterDonateBloodTab from "./RegisterDonateBlood";

const RegisterDonateBloodEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await RegisterDonateBloodService.detailRegisterDonateBlood(
        id
      );
      if (result.isSuccess) {
        setData(result.data);
      }
    })();
  }, []);

  return data ? (
    <RegisterDonateBloodTab initial={data} />
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Người hiến máu không tồn tại</h4>
    </Alert>
  );
};
export default RegisterDonateBloodEdit;
