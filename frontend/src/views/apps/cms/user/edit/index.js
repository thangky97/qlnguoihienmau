import UserService from "@services/UserService";
import "@styles/react/apps/app-users.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import EmployyeTab from "./Employee";
const EmployeeEdit = () => {
  const { code } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await UserService.readUser(code);
      if (result.isSuccess) {
        setData(result.data);
      }
    })();
  }, []);

  return data ? (
    // <Row className="app-user-edit">
    // </Row>
    <EmployyeTab initial={data} />
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Cán bộ Không tồn tại</h4>
    </Alert>
  );
};
export default EmployeeEdit;
