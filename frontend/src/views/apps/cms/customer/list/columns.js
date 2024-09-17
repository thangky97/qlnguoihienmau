import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import { checkauth } from "../../../../../utility/Utils";
import { MANAGEMENT, ROLES_APP } from "../../../../../constants/app";
import { toast } from "react-toastify";
import CustomerService from "../../../../../services/CustomerService";
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

  const handleRemoveCustomer = async (code, id) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await CustomerService.deleteCustomer({ code, id }).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá khách hàng thành công");
          handleGetlist();
        }
      });
    }
  };

  return [
    {
      name: "Mã",
      minWidth: "100px",
      selector: (row) => row.code,
      sortable: true,
      sortField: "code",
      cell: (row) => row?.code,
    },
    {
      name: "Tên",
      minWidth: "180px",
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
      cell: (row) => (
        <div>
          <div>
            <span>{row?.name}</span>
          </div>
          {/* {row?.phone && (
            <div style={{ paddingTop: "7px" }}>
              <span>Số ĐT: {row?.phone}</span>
            </div>
          )} */}
        </div>
      ),
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
      name: "Tuổi",
      minWidth: "150px",
      selector: (row) => row.date_birthday,
      sortable: true,
      sortField: "date_birthday",
      cell: (row) => {
        const calculateAge = (birthday) => {
          const birthDate = new Date(birthday);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          // Kiểm tra xem đã qua sinh nhật trong năm hiện tại hay chưa
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          return age;
        };

        return calculateAge(row?.date_birthday);
      },
    },
    {
      name: "Email",
      minWidth: "180px",
      selector: (row) => row.email,
      sortable: true,
      sortField: "email",
      cell: (row) => row?.email,
    },
    {
      name: "Cân nặng",
      minWidth: "150px",
      selector: (row) => row.weight,
      sortable: true,
      sortField: "weight",
      cell: (row) => row?.weight,
    },
    {
      name: "Chiều cao",
      minWidth: "150px",
      selector: (row) => row.height,
      sortable: true,
      sortField: "height",
      cell: (row) => row?.height,
    },
    // {
    //   name: "Huyết áp",
    //   minWidth: "150px",
    //   selector: (row) => row.huyetap,
    //   sortable: true,
    //   sortField: "huyetap",
    //   cell: (row) => row?.huyetap,
    // },
    {
      name: "Trạng thái",
      width: "150px",
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
      width: "240px",
      cell: (row) => (
        <div>
          {(isAuthUpdate ||
            role === ROLES_APP.COMPANYADMIN ||
            role === ROLES_APP.ADMIN) &&
            row?.code && (
              <Badge pill variant="primary" color="primary">
                <Link to={`/apps/customer/edit/${row?.code}`}>Cập nhật</Link>
              </Badge>
            )}
          &nbsp;
          {(isAuthUpdate ||
            role === ROLES_APP.COMPANYADMIN ||
            role === ROLES_APP.ADMIN) &&
            row?.code && (
              <Badge pill variant="success" color="success">
                <Link to="#">Lịch sử hiến máu</Link>
              </Badge>
            )}
          &nbsp;
          {(isAuhDelete ||
            role === ROLES_APP.COMPANYADMIN ||
            role === ROLES_APP.ADMIN) &&
            row?.code && (
              <Badge
                pill
                variant="danger"
                color="danger"
                onClick={() => handleRemoveCustomer(row?.code)}
              >
                Xoá
              </Badge>
            )}
        </div>
      ),
    },
  ];
}
