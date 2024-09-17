import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import { checkauth } from "../../../../../utility/Utils";
import { MANAGEMENT, ROLES_APP } from "../../../../../constants/app";
import UserService from "@services/UserService";
import { toast } from "react-toastify";
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

const roleObj = {
  STAFF: {
    text: "Nhân viên",
  },
  ADMIN: {
    text: "Quản trị viên",
  },
};

export default function Columns(userData, handleGetlist) {
  const auth = userData?.authorities.find(
    (item) => item.management == MANAGEMENT.USER
  )?.action;
  const role = userData?.role;

  const isAuthUpdate = checkauth(role, auth, "U");
  const isAuthDelete = checkauth(role, auth, "D");

  const handleRemoveUser = async (code, id) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await UserService.deleteUser({ code, id }).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá cán bộ thành công");
          handleGetlist();
        }
      });
    }
  };

  return [
    {
      name: "Mã",
      minWidth: "120px",
      selector: (row) => row.code,
      sortable: true,
      sortField: "fullname",
      cell: (row) => row?.code,
    },
    {
      name: "Tên",
      minWidth: "250px",
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
      cell: (row) => (
        <div>
          <div>
            <span>{row?.name}</span>
          </div>
          {/* <div style={{ paddingTop: "7px" }}>
            <span>{row?.email}</span>
          </div> */}
        </div>
      ),
    },
    {
      name: "Tài khoản",
      minWidth: "150px",
      selector: (row) => row.username,
      sortable: true,
      sortField: "username",
      cell: (row) => row?.username,
    },
    {
      name: "Email",
      minWidth: "230px",
      selector: (row) => row.email,
      sortable: true,
      sortField: "email",
      cell: (row) => row?.email,
    },
    {
      name: "Vai trò",
      minWidth: "140px",
      selector: (row) => row.role,
      sortable: true,
      sortField: "phone",
      cell: (row) => roleObj[row.role]?.text,
    },
    {
      name: "Trạng thái",
      minWidth: "150px",
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
      name: "Chức năng",
      minWidth: "150px",
      cell: (row) => (
        <div>
          {isAuthUpdate &&
            row?.code &&
            (row?.role === ROLES_APP.ADMIN
              ? role === ROLES_APP.ADMIN
              : true) && (
              <Badge color="primary">
                <Link to={`/apps/user/edit/${row.code}`}>Cập nhật</Link>
              </Badge>
            )}
          &nbsp;
          {(isAuthDelete || userData?.role === ROLES_APP.ADMIN) &&
            row?.code &&
            (row?.role === ROLES_APP.ADMIN
              ? role === ROLES_APP.ADMIN
              : true) && (
              <Badge onClick={() => handleRemoveUser(row.code)} color="danger">
                Xoá
              </Badge>
            )}
        </div>
      ),
    },
  ];
}
