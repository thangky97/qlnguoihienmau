import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import { checkauth } from "../../../../../utility/Utils";
import { MANAGEMENT } from "../../../../../constants/app";
import { toast } from "react-toastify";
import EnventService from "../../../../../services/EnventService";
import moment from "moment";

const statusObj = {
  ACTIVE: {
    text: "Đã phê duyệt",
    bgr: "light-success",
  },
  DEACTIVE: {
    text: "Chưa phê duyệt",
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
      name: "Tên sự kiện",
      minWidth: "150px",
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
      cell: (row) => row?.name,
    },
    {
      name: "Ngày tổ chức",
      minWidth: "150px",
      selector: (row) => row?.event_date,
      sortable: true,
      sortField: "event_date",
      cell: (row) => moment(row?.event_date).format("DD/MM/YYYY").toString(),
    },
    {
      name: "Tg bắt đầu",
      minWidth: "150px",
      selector: (row) => row.start_time,
      sortable: true,
      sortField: "start_time",
      cell: (row) => row?.start_time,
    },
    {
      name: "Tg kết thúc",
      minWidth: "150px",
      selector: (row) => row.end_time,
      sortable: true,
      sortField: "end_time",
      cell: (row) => row?.end_time,
    },
    {
      name: "Địa điểm",
      minWidth: "150px",
      selector: (row) => row.location,
      sortable: true,
      sortField: "location",
      cell: (row) => row?.location,
    },
    {
      name: "Số lượng máu",
      minWidth: "150px",
      selector: (row) => row.blood_count,
      sortable: true,
      sortField: "blood_count",
      cell: (row) => row?.blood_count,
    },
    {
      name: "Nhóm máu",
      minWidth: "150px",
      selector: (row) => row.blood_type,
      sortable: true,
      sortField: "blood_type",
      cell: (row) => row?.blood_type,
    },
    {
      name: "Danh mục",
      minWidth: "150px",
      selector: (row) => row.category_post_id,
      sortable: true,
      sortField: "category_post_id",
      cell: (row) => row?.categoryPost?.name,
    },
    {
      name: "Trạng thái",
      width: "150px",
      selector: (row) => row.status,
      sortable: true,
      sortField: "status",
      cell: (row) => (
        <Badge
          className="text-capitalize"
          color={statusObj[row?.status]?.bgr}
          pill
        >
          {statusObj[row?.status]?.text}
        </Badge>
      ),
    },
    {
      name: "",
      minWidth: "180px",
      cell: (row) => {
        return (
          <div className="badge-container">
            {isAuthUpdate && row?.id && (
              <Badge color="primary" className="badge">
                <Link to={`/apps/envent/edit/${row.id}`}>Sửa</Link>
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
