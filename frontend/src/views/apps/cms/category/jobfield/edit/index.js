import JobfieldService from "@services/JobfieldService";
import "@styles/react/apps/app-users.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import JobfieldTab from "./Jobfield";

const JobfieldEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => {
      const result = await JobfieldService.detail(id);
      if (result.isSuccess) {
        setData(result?.data || null);
      }
    })();
  }, []);

  return Object?.values(data)?.length > 0 ? (
    <JobfieldTab initial={data} />
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Lĩnh vực Không tồn tại</h4>
    </Alert>
  );
};
export default JobfieldEdit;
