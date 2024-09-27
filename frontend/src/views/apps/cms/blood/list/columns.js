import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import { checkauth, formatCurrencys } from "../../../../../utility/Utils";
import { MANAGEMENT } from "../../../../../constants/app";
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

const typeObj = {
  1: {
    text: "Nhập kho",
  },
  2: {
    text: "Xuất kho",
  },
  // 3: {
  //   text: "Chuyển kho",
  // },
};

export default function Columns(userData) {
  const auth = userData?.authorities.find(
    (item) => item.management == MANAGEMENT.MATERIALTRANSACTION
  )?.action;
  const role = userData?.role;

  const isAuthUpdate = checkauth(role, auth, "U");
  return [
    {
      name: "Mã giao dịch",
      minWidth: "200px",
      selector: (row) => row.transactionCode,
      sortable: true,
      sortField: "transactionCode",
      cell: (row) => row?.transactionCode,
    },
    {
      name: "Loại giao dịch",
      minWidth: "200px",
      selector: (row) => row.transactiontype,
      sortable: true,
      sortField: "transactiontype",
      cell: (row) =>
        (row?.blood &&
          row?.blood?.bloodtype &&
          typeObj[row?.blood?.bloodtype].text) ||
        "",
    },
    {
      name: "Bệnh viện",
      minWidth: "200px",
      selector: (row) => row.materialCode,
      sortable: true,
      sortField: "materialCode",
      cell: (row) => row?.blood?.hospital?.name,
    },
    {
      name: "Nhóm máu",
      minWidth: "200px",
      selector: (row) => row.bloodName,
      sortable: true,
      sortField: "bloodName",
      cell: (row) => row?.bloodName,
    },
    {
      name: "Số lượng máu máu",
      minWidth: "200px",
      selector: (row) => row.qty,
      sortable: true,
      sortField: "qty",
      cell: (row) => formatCurrencys(row?.qty) + " ml",
    },
    {
      name: "Ngày giao dịch",
      minWidth: "200px",
      selector: (row) => row?.blood?.transactionDate,
      sortable: true,
      sortField: "transactionDate",
      cell: (row) => row?.blood?.transactionDate,
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
      minWidth: "150px",
      cell: (row) => {
        return (
          isAuthUpdate &&
          row?.id && (
            <Badge color="primary">
              <Link to={`/apps/blood/edit/${row.transactionCode}`}>
                Cập nhật
              </Link>
            </Badge>
          )
        );
      },
    },
  ];
}
