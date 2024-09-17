import TaskService from "@services/TaskService";
import "@styles/react/apps/app-users.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import TaskTab from "./task";

const TaskEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await TaskService.detailTask(id);
      if (result.isSuccess) {
        setData(result.data);
      }
    })();
  }, [id]);
  return data ? (
    <div className="app-user-edit">
      <TaskTab initial={data} />
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Chi tiết công việc Không tồn tại</h4>
    </Alert>
  );
};
export default TaskEdit;
