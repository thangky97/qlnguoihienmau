import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
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
  const handleRemoveArea = async (id, code) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await CompanyService.deleteCompany({ id, code }).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá chi nhánh thành công");
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
      name: "Tên Chi Nhánh",
      minWidth: "200px",
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
      cell: (row) => row?.name,
    },
    {
      name: "Số điện thoại",
      minWidth: "180px",
      selector: (row) => row.contactmobile,
      sortable: true,
      sortField: "contactmobile",
      cell: (row) => row?.contactmobile,
    },
    {
      name: "Email",
      minWidth: "200px",
      selector: (row) => row.contactemail,
      sortable: true,
      sortField: "contactemail",
      cell: (row) => row?.contactemail,
    },
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
      minWidth: "180px",
      selector: (row) => row.address,
      sortable: true,
      sortField: "address",
      cell: (row) => {
        const maxLength = 25;
        if (row?.address && row.address.length > maxLength) {
          return row.address.substring(0, maxLength) + " ...";
        } else {
          return row?.address;
        }
      },
    },
    {
      name: "Mô tả",
      minWidth: "180px",
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
      minWidth: "150px",
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
      minWidth: "150px",
      cell: (row) => {
        return (
          <div>
            <Badge color="primary">
              <Link to={`/apps/branch/edit/${row.id}`}>Cập nhật</Link>
            </Badge>

            {/* {row?.id && (
              <div className="mh-100 align-items-center justify-content-center mw-100 ml-1">
                <Badge
                  onClick={() => handleRemoveArea(row.id)}
                  className="badge-lg"
                  pill
                  color="danger"
                  style={{ padding: "10px 20px" }}
                >
                  <Link>Xoá</Link>
                </Badge>
              </div>
            )} */}
          </div>
        );
      },
    },
  ];
}
