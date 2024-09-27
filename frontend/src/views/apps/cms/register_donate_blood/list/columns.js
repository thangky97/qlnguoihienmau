import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import { checkauth } from "../../../../../utility/Utils";
import { MANAGEMENT, ROLES_APP } from "../../../../../constants/app";
import DepartmentService from "@services/DepartmentService";

import { toast } from "react-toastify";
import "./style.scss";
import moment from "moment";

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
      await DepartmentService.deleteDepartment({ id: id }).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá danh mục thành công");
          handleGetlist();
        }
      });
    }
  };

  return [
    {
      name: "Sự kiện",
      minWidth: "200px",
      selector: (row) => row.envent,
      sortable: true,
      sortField: "envent_id",
      cell: (row) => row?.envent?.name,
    },
    {
      name: "Người đăng ký",
      minWidth: "150px",
      selector: (row) => row.customer,
      sortable: true,
      sortField: "created_at",
      cell: (row) => row?.customer?.name,
    },
    {
      name: "Ngày đăng ký",
      minWidth: "150px",
      selector: (row) => row.created_at,
      sortable: true,
      sortField: "created_at",
      cell: (row) =>
        moment(row?.evcreated_atent_date).format("DD/MM/YYYY").toString(),
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
    // {
    //   name: "",
    //   Width: "100px",
    //   cell: (row) => (
    //     <div>
    //       {isAuthUpdate && row?.id && role === ROLES_APP.ADMIN && (
    //         <Badge pill variant="primary" color="primary">
    //           <Link to={`/apps/category-post/edit/${row?.id}`}>Cập nhật</Link>
    //         </Badge>
    //       )}
    //       &nbsp;
    //       {row?.id && (role === ROLES_APP.ADMIN || isAuhDelete) && (
    //         <Badge
    //           pill
    //           variant="danger"
    //           color="danger"
    //           onClick={() => handleRemoveArea(row?.id)}
    //         >
    //           Xoá
    //         </Badge>
    //       )}
    //     </div>
    //   ),
    // },
  ];
}
