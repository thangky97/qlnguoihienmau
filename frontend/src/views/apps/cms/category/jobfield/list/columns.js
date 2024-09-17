import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import { toast } from "react-toastify";
import { MANAGEMENT, ROLES_APP } from "../../../../../../constants/app";
import { checkauth } from "../../../../../../utility/Utils";
import JobfieldService from "../../../../../../services/JobfieldService";
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
    (item) => item.management == MANAGEMENT.CATEGORY
  )?.action;
  const role = userData?.role;

  const isAuthUpdate = checkauth(role, auth, "U");
  const isAuthDelete = checkauth(role, auth, "D");

  const handleRemoveJobfield = async (id) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await JobfieldService.deleteJobfield(id).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá lĩnh vực thành công");
          handleGetlist();
        }
      });
    }
  };

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  };

  return [
    {
      name: "Mã lĩnh vực",
      width: "150px",
      selector: (row) => row.code,
      sortable: true,
      sortField: "code",
      cell: (row) => row?.code,
    },
    {
      name: "Tên lĩnh vực",
      minWidth: "200px",
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
      cell: (row) => row?.name,
    },
    {
      name: "Mô tả",
      minWidth: "300px",
      selector: (row) => row.description,
      sortable: true,
      sortField: "description",
      cell: (row) => {
        const maxLength = 25;
        if (row?.description && row.description.length > maxLength) {
          return row.description.substring(0, maxLength) + " ...";
        } else {
          return row?.description;
        }
      },
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
      width: "150px",
      cell: (row) => {
        return (
          <div >
            {(isAuthUpdate || role === ROLES_APP.ADMIN || role === ROLES_APP.COMPANYADMIN) && row?.id && (
              <Badge color="primary" >
                <Link to={`/apps/category/jobfield/edit/${row.id}`}>
                  Cập nhật
                </Link>
              </Badge>
            )}
            &nbsp;
            { (isAuthDelete  || role === ROLES_APP.ADMIN || role === ROLES_APP.COMPANYADMIN) && row?.id && (
              <Badge               
                onClick={() => handleRemoveJobfield(row.id)}
                color="danger"                
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
