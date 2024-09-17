import CompanyService from "@services/CompanyService";
import "@styles/react/apps/app-users.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import CompanyTab from "./Company";

const CompanyEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState({});

    useEffect(() => {
      (async () => {
        const result = await CompanyService.detailCompany(id);
        if (result.isSuccess) {
          setData(result?.data || null);
        }
      })();
    }, []);

  return Object?.values(data)?.length > 0 ? (
    <CompanyTab initial={data} />
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Company Không tồn tại</h4>
    </Alert>
  );
};
export default CompanyEdit;
