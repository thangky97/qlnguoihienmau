import OpportunityService from "@services/OpportunityService";
import "@styles/react/apps/app-users.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import InquiryTab from "./inquiry";

const InquiryEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await OpportunityService.detail(id);
      if (result.isSuccess) {
        setData(result.data);
      }
    })();
  }, [id]);
  return data ? (
    <div className="app-user-edit">
      <InquiryTab initial={data} />
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Nhu cầu Không tồn tại</h4>
    </Alert>
  );
};
export default InquiryEdit;
