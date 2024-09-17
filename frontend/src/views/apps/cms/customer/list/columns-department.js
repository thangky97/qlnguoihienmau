import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import { checkauth } from "../../../../../utility/Utils";
import { MANAGEMENT, ROLES_APP } from "../../../../../constants/app";
import UserService from "@services/UserService";
import DepartmentService from "@services/DepartmentService";

import { toast } from "react-toastify";
import './style.scss';



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

  const handleRemoveArea = async (id) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await DepartmentService.deleteDepartment({id: id}).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá phòng ban thành công");
          handleGetlist();
        }
      });
    }
  };

  return [
    {
      name: "Mã",
      width: "100px",
      selector: (row) => row.code,
      sortable: true,
      sortField: "fullname",
      cell: (row) => row?.code,
    },
    {
      name: "Tên phòng",
      minWidth: "300px",
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
      cell: (row) => row?.name,
    },
    {
      name: "Mô tả",
      minWidth: '45vW',
      selector: (row) => row.description,
      sortable: true,
      sortField: "description",
      cell: (row) => row?.description,
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
        {isAuthUpdate && row?.id && (
          (row?.role === ROLES_APP.ADMIN || row?.role === ROLES_APP.COMPANYADMIN) 
            ? (row?.role === ROLES_APP.ADMIN || row?.role === ROLES_APP.COMPANYADMIN) 
            : true
        ) && (
          <Badge pill variant="primary" color="primary">
            <Link to={`/apps/department/edit/${row?.id}`}>Cập nhật</Link>
          </Badge>
        )}
        &nbsp;
        {row?.id && (
          (role === ROLES_APP.ADMIN || role === ROLES_APP.COMPANYADMIN || isAuhDelete)
        ) && (
          <Badge pill variant="danger" color="danger" onClick={() => handleRemoveArea(row?.id)}>
            Xoá
          </Badge>
        )}
      </div>
      ),
    },
  ];
}
