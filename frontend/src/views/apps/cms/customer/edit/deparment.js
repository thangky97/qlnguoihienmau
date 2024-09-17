import DepartmentService from "@services/DepartmentService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Row } from "reactstrap";
import DepartmentTab from "./edit-deparment";

const DepartmentEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await DepartmentService.detailDepartment(id);
      if (result.isSuccess) {
        setData(result.data);
      }
    })();
  }, []);

  return data ? (
    <DepartmentTab initial={data} />
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Phòng ban Không tồn tại</h4>
    </Alert>
  );
};
export default DepartmentEdit;
