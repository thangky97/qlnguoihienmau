import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import { checkauth } from "../../../../../utility/Utils";
import { MANAGEMENT, ROLES_APP } from "../../../../../constants/app";
import HospitalService from "@services/HospitalService";

import { toast } from "react-toastify";
import "./style.scss";

const statusObj = {
  ACTIVE: {
    text: "Đang hoạt động",
    bgr: "light-success",
  },
  DEACTIVE: {
    text: "Ngừng hoạt động",
    bgr: "light-danger",
  },
};

export default function Columns(userData, handleGetlist) {
  const auth = userData?.authorities.find(
    (item) => item.management == MANAGEMENT.USER
  )?.action;
  const role = userData?.role;

  const isAuthUpdate = checkauth(role, auth, "U");
  const isAuhDelete = checkauth(role, auth, "D");

  const handleRemoveHospital = async (id) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await HospitalService.deleteHospital({ id: id }).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá bệnh viện thành công");
          handleGetlist();
        }
      });
    }
  };

  return [
    {
      name: "Tên bệnh viện",
      minWidth: "300px",
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
      cell: (row) => row?.name,
    },
    {
      name: "Số điện thoại",
      minWidth: "150px",
      selector: (row) => row.phone,
      sortable: true,
      sortField: "phone",
      cell: (row) => row?.phone,
    },
    {
      name: "Email",
      minWidth: "150px",
      selector: (row) => row.email,
      sortable: true,
      sortField: "email",
      cell: (row) => row?.email,
    },
    {
      name: "Địa chỉ",
      minWidth: "150px",
      selector: (row) => row.address,
      sortable: true,
      sortField: "address",
      cell: (row) => row?.address,
    },
    {
      name: "Trạng thái",
      Width: "100px",
      selector: (row) => row.status,
      sortable: true,
      sortField: "status",
      cell: (row) => (
        <Badge
          className="text-capitalize"
          color={statusObj[row.status]?.bgr}
          pill
        >
          {statusObj[row.status]?.text}
        </Badge>
      ),
    },
    {
      name: "",
      Width: "100px",
      cell: (row) => (
        <div>
          {isAuthUpdate && row?.id && role === ROLES_APP.ADMIN && (
            <Badge pill variant="primary" color="primary">
              <Link to={`/apps/hospital/edit/${row?.id}`}>Cập nhật</Link>
            </Badge>
          )}
          &nbsp;
          {row?.id && (role === ROLES_APP.ADMIN || isAuhDelete) && (
            <Badge
              pill
              variant="danger"
              color="danger"
              onClick={() => handleRemoveHospital(row?.id)}
            >
              Xoá
            </Badge>
          )}
        </div>
      ),
    },
  ];
}
