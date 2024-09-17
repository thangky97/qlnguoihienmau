import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import { checkauth } from "../../../../../utility/Utils";
import { MANAGEMENT } from "../../../../../constants/app";
import { toast } from "react-toastify";
import CompanyService from "../../../../../services/CompanyService";

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
    (item) => item.management == MANAGEMENT.ADMIN
  )?.action;
  const role = userData?.role;

  const isAuthUpdate = checkauth(role, auth, "U");
  const isAuhDelete = checkauth(role, auth, "D");

  const handleRemoveArea = async (id, code) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await CompanyService.deleteCompany({ id, code }).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá công ty thành công");
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
      name: "Tên công ty",
      minWidth: "200px",
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
      cell: (row) => row?.name,
    },
    {
      name: "Số điện thoại",
      minWidth: "240px",
      selector: (row) => row.contactmobile,
      sortable: true,
      sortField: "contactmobile",
      cell: (row) => (
        <>
          <div>
            <div className="company">
              <div className="company">{row?.contactmobile}</div>
              <div className="company">{row?.contactemail}</div>
            </div>
          </div>
        </>
      ),
    },
    // {
    //   name: "Email",
    //   minWidth: "200px",
    //   selector: (row) => row.contactemail,
    //   sortable: true,
    //   sortField: "contactemail",
    //   cell: (row) => row?.contactemail,
    // },
    {
      name: "MXH",
      minWidth: "200px",
      selector: (row) => row.phonezalo,
      sortable: true,
      sortField: "phonezalo",
      cell: (row) => (
        <div>
          <div className="company-mxh">
            <div className="company-mxh">
              <a target={"_blank"} href={`https://zalo.me/${row?.phonezalo}`}>
                {row?.phonezalo}
              </a>
            </div>
            <div className="company-mxh">
              <a target="_blank" href={row?.linkfb}>
                {truncateString(row?.linkfb, 20)}
              </a>
            </div>
          </div>
        </div>
      ),
    },
    // {
    //   name: "Facebook",
    //   minWidth: "200px",
    //   selector: (row) => row.linkfb,
    //   sortable: true,
    //   sortField: "linkfb",
    //   cell: (row) => {
    //     const maxLength = 33;
    //     if (row?.linkfb && row?.linkfb.length > maxLength) {
    //       return (
    //         <a target="_blank" href={row?.linkfb}>
    //           {row?.linkfb.substring(0, maxLength) + " ..."}
    //         </a>
    //       );
    //     } else {
    //       return <a target="_blank" href={row?.linkfb}></a>;
    //     }
    //   },
    // },
    {
      name: "Địa chỉ",
      minWidth: "200px",
      selector: (row) => row.address,
      sortable: true,
      sortField: "address",
      cell: (row) => {
        const maxLength = 33;
        if (row?.address && row.address.length > maxLength) {
          return row.address.substring(0, maxLength) + " ...";
        } else {
          return row?.address;
        }
      },
    },
    {
      name: "Mô tả",
      minWidth: "200px",
      selector: (row) => row.description,
      sortable: true,
      sortField: "description",
      cell: (row) => {
        const maxLength = 33;
        if (row?.description && row.description.length > maxLength) {
          return row.description.substring(0, maxLength) + " ...";
        } else {
          return row?.description;
        }
      },
    },
    {
      name: "Trạng thái",
      minWidth: "158px",
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
      name: "Chức năng",
      minWidth: "158px",
      cell: (row) => {
        return (
          <div>
            {isAuthUpdate && row?.id && (
              <Badge color="primary">
                <Link to={`/apps/cms/company/edit/${row.id}`}>Cập nhật</Link>
              </Badge>
            )}
            &nbsp;
            {isAuhDelete && row?.id && (
              <Badge onClick={() => handleRemoveArea(row.id)} color="danger">
                <Link>Xoá</Link>
              </Badge>
            )}
          </div>
        );
      },
    },
  ];
}
