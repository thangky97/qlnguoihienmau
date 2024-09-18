import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import { checkauth } from "../../../../../utility/Utils";
import { MANAGEMENT } from "../../../../../constants/app";
import { toast } from "react-toastify";
import EnventService from "../../../../../services/EnventService";

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
    (item) => item.management == MANAGEMENT.CATEGORY
  )?.action;
  const role = userData?.role;

  const isAuthUpdate = checkauth(role, auth, "U");
  const isAuthDelete = checkauth(role, auth, "D");

  const handleDeleteEnvent = async (id) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await EnventService.deleteEnvent(id).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá sự kiện thành công");
          handleGetlist();
        }
      });
    }
  };

  return [
    {
      name: "Lĩnh vực",
      minWidth: "140px",
      selector: (row) => row.jobfield_id,
      sortable: true,
      sortField: "jobfield_id",
      cell: (row) => row?.jobfield?.name,
    },
    {
      name: "Tên nhiệm vụ",
      minWidth: "250px",
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
      cell: (row) => row?.name,
    },
    {
      name: "Phòng ban",
      minWidth: "150px",
      selector: (row) => row?.departmentld,
      sortable: true,
      sortField: "department_id",
      cell: (row) => row?.departmentld?.name,
    },
    {
      name: "Trình tự",
      minWidth: "50px",
      selector: (row) => row.sequence,
      sortable: true,
      sortField: "sequence",
      cell: (row) => row?.sequence,
    },
    {
      name: "Số ngày xử lý",
      minWidth: "150px",
      selector: (row) => row.limitdays,
      sortable: true,
      sortField: "limitdays",
      cell: (row) => row?.limitdays,
    },
    {
      name: "",
      minWidth: "150px",
      cell: (row) => {
        return (
          <div className="badge-container">
            {isAuthUpdate && row?.id && (
              <Badge color="primary" className="badge">
                <Link to={`/apps/envent/edit/${row.id}`}>Cập nhật</Link>
              </Badge>
            )}
            &nbsp;
            {isAuthDelete && row?.id && userData?.role === "ADMIN" && (
              <Badge
                style={{
                  width: "80px",
                  display: "inline-block",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleDeleteEnvent(row?.id)}
                color="danger"
                className="badge"
              >
                Xoá
              </Badge>
            )}
          </div>
        );
      },
    },
  ];
}
