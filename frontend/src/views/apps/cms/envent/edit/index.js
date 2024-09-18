import EnventService from "@services/EnventService";
import "@styles/react/apps/app-users.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import EnventTab from "./Envent";

const EnventEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      const result = await EnventService.detailEnvent(id);
      if (result.isSuccess) {
        setData(result.data);
      }
    })();
  }, []);

  return data ? (
    <EnventTab initial={data} />
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Sự kiện không tồn tại</h4>
    </Alert>
  );
};
export default EnventEdit;
