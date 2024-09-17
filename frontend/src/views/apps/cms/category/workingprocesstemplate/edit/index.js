import WorkingprocesstemplateService from "@services/WorkingprocesstemplateService";
import "@styles/react/apps/app-users.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import WorkingProcessTemplateTab from "./WorkingProcessTemplate";

const WorkingProcessTemplateEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      const result =
        await WorkingprocesstemplateService.detailWorkingprocesstemplate(id);
      if (result.isSuccess) {
        setData(result.data);
      }
    })();
  }, []);

  return data ? (
    <WorkingProcessTemplateTab initial={data} />
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Quy trình công việc mẫu không tồn tại</h4>
    </Alert>
  );
};
export default WorkingProcessTemplateEdit;
