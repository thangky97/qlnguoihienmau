import JobService from "@services/JobService";
import "@styles/react/apps/app-users.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import JobTab from "./job";

const JobEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await JobService.detailJob(id);
      if (result.isSuccess) {
        setData(result.data);
      }
    })();
  }, [id]);
  return data ? (
    <div className="app-user-edit">
      <JobTab initial={data} />
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Công việc Không tồn tại</h4>
    </Alert>
  );
};
export default JobEdit;
