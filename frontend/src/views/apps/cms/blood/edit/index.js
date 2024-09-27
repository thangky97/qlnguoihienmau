import BloodService from "../../../../../services/BloodService";
import "@styles/react/apps/app-users.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import BloodTab from "./Blood";

const BloodEdit = () => {
  const { code } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await BloodService.readBlood(code);
      if (result.isSuccess) {
        setData(result.data);
      }
    })();
  }, [code]);

  return data ? (
    <BloodTab initial={data} />
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Nhập vật tư không tồn tại</h4>
    </Alert>
  );
};
export default BloodEdit;
