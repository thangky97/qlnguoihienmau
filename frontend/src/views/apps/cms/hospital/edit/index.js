import HospitalService from "@services/HospitalService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import HospitalTab from "./Hospital";

const HospitalEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await HospitalService.detailHospital(id);
      if (result.isSuccess) {
        setData(result.data);
      }
    })();
  }, []);

  return data ? (
    <HospitalTab initial={data} />
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Bệnh viện Không tồn tại</h4>
    </Alert>
  );
};
export default HospitalEdit;
