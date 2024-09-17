import CustomerService from "@services/CustomerService";
import "@styles/react/apps/app-users.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Row } from "reactstrap";
import CustomerTab from "./Customer";
const CustomerEdit = () => {
  const { code } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await CustomerService.readCustomer(code);
      if (result.isSuccess) {
        setData(result.data);
      }
    })();
  }, []);

  return data ? (
    <CustomerTab initial={data} />
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Khách hàng Không tồn tại</h4>
    </Alert>
  );
};
export default CustomerEdit;
