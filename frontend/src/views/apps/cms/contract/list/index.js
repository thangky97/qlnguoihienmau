import { ChevronDown, Download, Share } from "react-feather";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import ReactPaginate from "react-paginate";
import Button from "reactstrap/lib/Button";
import CardBody from "reactstrap/lib/CardBody";
import { Label } from "reactstrap";
import ContractService from "../../../../../services/ContractService";
import { checkauth, selectThemeColors } from "../../../../../utility/Utils";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { MANAGEMENT, ROLES_APP } from "../../../../../constants/app";
import CustomerService from "../../../../../services/CustomerService";
import JobfieldService from "../../../../../services/JobfieldService";
import moment from "moment";
import XLSX from "xlsx";
import { exportHeaderContract } from "../../../../../constants/export";
import importContract from "./IMPORT_CONTRACT.xlsx";
import { toast } from "react-toastify";
import "./contract.scss";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// chat gpt

import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Badge,
} from "reactstrap";

import TaskAssignment from "./taskassignment";

// Badge colors
const badgeColors = {
  CONTACT: "#FF6384",
  Survey: "#36A2EB",
  NEGOTIATION: "#FFCE56",
  SURNOTIMPLEMENTEDVEY: "#FF9F40",
  CONTRACT: "#4BC0C0",
};

// Badge colors
const excelProcessStatusColors = {
  CONTACT: "FF6384",
  Survey: "36A2EB",
  NEGOTIATION: "FFCE56",
  SURNOTIMPLEMENTEDVEY: "FF9F40",
  CONTRACT: "4BC0C0",
};


const processingStatusObject = {
  CONTACT: {
    value: "CONTACT",
    label: "Đang thực hiện",
    bgr: "#FF6384",
  },
  Survey: {
    value: "Survey",
    label: "Vướng mắc",
    bgr: "#36A2EB",
  },
  NEGOTIATION: {
    value: "NEGOTIATION",
    label: "Quá hạn",
    bgr: "#FFCE56",
  },
  SURNOTIMPLEMENTEDVEY: {
    value: "SURNOTIMPLEMENTEDVEY",
    label: "Hoàn thành",
    bgr: "#FF9F40",
  },
  CONTRACT: {
    value: "CONTRACT",
    label: "Đã thanh toán",
    bgr: "#4BC0C0",
  },
};

const statuses = Object.keys(processingStatusObject).map((key) => ({
  value: processingStatusObject[key].value,
  label: processingStatusObject[key].label,
}));

const ContractList = () => {
  const [data, setData] = useState();
  const [isCheck, setIscheck] = useState(false);
  const [search, setSearch] = useState({
    contractNumber: "",
    customer: "",
    name: "",
    startDate: "",
    endDate: "",
  });
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  const userData = useSelector((state) => state?.auth?.userData);
  const [customer, setCustomerData] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [jobfieldData, setListJobfield] = useState();
  const [selectedJobfield, setSelectedJobfield] = useState();
  const [name, setName] = useState(undefined);
  const location = useLocation();

  const [selectedInquiry, setSelectedInquiry] = useState();

  const searchParams = new URLSearchParams(location.search);
  const jobfield = searchParams.get("jobfield");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const processingStatusCounts = searchParams.get("processingStatusCounts");

  const auth = userData?.authorities.find(
    (item) => item.management === MANAGEMENT.CONTRACT
  )?.action;
  const role = userData?.role;

  const isAuth = checkauth(role, auth, "E");
  const isAuthimport = checkauth(role, auth, "I");
  const isAuthCreate = checkauth(role, auth, "C");
  const isAuthUpdate = checkauth(role, auth, "U");
  const isAuthDelete = checkauth(role, auth, "D");
  const {
    control,
    formState: { errors },
  } = useForm();

  const history = useHistory();
  const handleClick = () => {
    history.push("/apps/contract/add");
  };

  useEffect(() => {
    (async () => {
      const { data } = await CustomerService.getAllCustomer({
        status: "ACTIVE",
      });
      setCustomerData(data);
    })();
    (async () => {
      const { data } = await JobfieldService.getAll({
        status: "ACTIVE",
      });
      setListJobfield(data);
    })();
  }, []);

  const handleGetlist = async (query) => {
    const result = await ContractService.getAllContract({
      ...query,
    });
    if (result.isSuccess) {
      setData(result.data);
    }
  };

  useEffect(() => {
    handleGetlist({
      // status: selectedStatus?.value || undefined,
      jobfield_id: jobfield || selectedJobfield?.value || undefined,
      inquiry_id: selectedInquiry?.value || undefined,
      customer_code: selectedCustomer?.value || undefined,
      name: (name && name?.trim()) || undefined,
      startDate: startDate ? startDate : undefined,
      endDate: endDate ? endDate : undefined,
      processingStatus: processingStatusCounts || selectedStatus || undefined,
    });
    setCurrentPage(1);
  }, [
    selectedStatus,
    selectedJobfield,
    selectedInquiry,
    selectedCustomer,
    name,
    startDate,
    endDate,
    processingStatusCounts,
    jobfield,
  ]);

  //hàm export sang file xlsx
  // const handleExportXLSX = () => {
  //   if (data?.length <= 0) {
  //     return;
  //   }
  //   //đặt tên cột
  //   let tableXLSX = [
  //     {
  //       A: exportHeaderContract.ID,
  //       B: exportHeaderContract.NAME,
  //       C: exportHeaderContract.CUSTOMER,
  //       D: exportHeaderContract.CONTRACT_DATE,
  //       E: exportHeaderContract.CONTRACT_DURATION,
  //       F: exportHeaderContract.STATUS,
  //       G: "",
  //       H: "",
  //       I: "",
  //       J: "",
  //       K: "",
  //     },
  //   ];
  //   //set giá trị cho mỗi cột
  //   data.forEach((row) => {
  //     tableXLSX.push({
  //       A: row?.contract_number_information,
  //       B: row?.name,
  //       C: row?.jobfield?.name,
  //       D: row?.inquiry?.name,
  //       E: row?.customer?.name,
  //       F: row?.contractUser?.name + " " + row?.contractUser?.username,
  //       G: moment(row?.createDate).format("DD/MM/YYYY").toString(),
  //       H: row?.description,
  //     });
  //   });

  //   //title cho bảng
  //   tableXLSX = [{ A: exportHeaderContract.EXPORT_TITLE }].concat(tableXLSX);
  //   var wb = XLSX.utils.book_new();
  //   var ws = XLSX.utils.json_to_sheet(tableXLSX, {
  //     skipHeader: true,
  //   });

  //   XLSX.utils.book_append_sheet(wb, ws, exportHeaderContract.EXPORT_WS);

  //   XLSX.writeFile(wb, exportHeaderContract.EXPORT_WB);
  // };




const handleExportXLSX = async () => {
  if (!data || data.length <= 0) {
    return;
  }

  // Create a new Excel workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(exportHeaderContract.EXPORT_WS);

  // Define headers with status column spanning 2 rows
  worksheet.mergeCells('A1:A2'); // ID column
  worksheet.mergeCells('B1:B2'); // Name column
  worksheet.mergeCells('C1:C2'); // Customer column
  worksheet.mergeCells('D1:D2'); // Contract Date column
  worksheet.mergeCells('E1:E2'); // Contract Duration column

  // Set header values
  worksheet.getCell('A1').value = exportHeaderContract.ID;
  worksheet.getCell('B1').value = exportHeaderContract.NAME;
  worksheet.getCell('C1').value = exportHeaderContract.CUSTOMER;
  worksheet.getCell('D1').value = exportHeaderContract.CONTRACT_DATE;
  worksheet.getCell('E1').value = exportHeaderContract.CONTRACT_DURATION;

  worksheet.mergeCells('F1:J1'); // Status column header spanning across 5 sub-columns
  worksheet.getCell('F1').value = exportHeaderContract.STATUS;

  // Sub-headers for status columns
  worksheet.getCell('F2').value = exportHeaderContract.STATUS_DANGTHUCHIEN;
  worksheet.getCell('G2').value = exportHeaderContract.STATUS_VUONGMAC;
  worksheet.getCell('H2').value = exportHeaderContract.STATUS_QUAHAN;
  worksheet.getCell('I2').value = exportHeaderContract.STATUS_HOANTHANH;
  worksheet.getCell('J2').value = exportHeaderContract.STATUS_DATTHANHTOAN;

  // Add data rows
  data.forEach((row) => {
    const statusDangthuchien = row?.processingStatus === processingStatusObject?.CONTACT.value ? (row?.note !== '' ? row?.note : 'x') : '';
    const statusVuongmac = row?.processingStatus === processingStatusObject?.Survey.value ? (row?.note !== '' ? row?.note : 'x') : '';
    const statusQuahan = row?.processingStatus === processingStatusObject?.NEGOTIATION.value ? (row?.note !== '' ? row?.note : 'x') : '';
    const statusHoanthanh = row?.processingStatus === processingStatusObject?.SURNOTIMPLEMENTEDVEY.value ? (row?.note !== '' ? row?.note : 'x') : '';
    const statusDatthanhtoan = row?.processingStatus === processingStatusObject?.CONTRACT.value ? (row?.note !== '' ? row?.note : 'x') : '';

    const rowData = worksheet.addRow([
      row?.id,  // ID
      `${row?.contract_number_information } - ${row?.description}`, // Name
      row?.customer?.name, // Customer
      moment(row?.signing_date).format('DD/MM/YYYY').toString(), // Contract Date
      row?.duration, // Contract Duration
      statusDangthuchien, // Đang thực hiện
      statusVuongmac, // Vướng mắc
      statusQuahan, // Quá hạn
      statusHoanthanh, // Hoàn thành
      statusDatthanhtoan, // Đã thanh toán
    ]);

    // Set border and fill for each status column
    ['F', 'G', 'H', 'I', 'J'].forEach((col, index) => {
      const cell = worksheet.getCell(`${col}${rowData.number}`);

      // Add a thin border to all sides
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      // Fill colors based on status
      if (index === 0 && statusDangthuchien) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: excelProcessStatusColors?.CONTACT }, // Blue for Đang thực hiện
        };
      } else if (index === 1 && statusVuongmac) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: excelProcessStatusColors?.Survey }, // Yellow for Vướng mắc
        };
      } else if (index === 2 && statusQuahan) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: excelProcessStatusColors?.NEGOTIATION }, // Red for Quá hạn
        };
      } else if (index === 3 && statusHoanthanh) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: excelProcessStatusColors?.SURNOTIMPLEMENTEDVEY }, // Teal for Hoàn thành
        };
      } else if (index === 4 && statusDatthanhtoan) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: excelProcessStatusColors?.CONTRACT }, // Orange for Đã thanh toán
        };
      }
    });
  });

  // Style the headers (bold and centered) and wrap text for columns A, B, C, D, E
  worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  worksheet.getRow(2).eachCell({ includeEmpty: true }, (cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Apply border and wrap text to columns A, B, C, D, E
  ['A', 'B', 'C', 'D', 'E'].forEach((col) => {
    worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    });
  });

  // Apply border and wrap text to status columns F to J
  ['F', 'G', 'H', 'I', 'J'].forEach((col) => {
    worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    });
  });

  // Style the worksheet columns (optional)
  worksheet.columns.forEach((column) => {
    column.width = 20; // Set the width for each column
  });

  // Generate the Excel file buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Create a Blob and trigger download
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${exportHeaderContract.EXPORT_WB}.xlsx`);
};

  


  // import
  const onChangeUpload = (e) => {
    let files = e.target.files;
    const imageData = new FormData();
    imageData.append("file", files[0]);
    handleImport(imageData);
    e.target.value = null;
  };

  const handleImport = (imageData) => {
    ContractService.UpLoadExcel(imageData).then((res) => {
      if (res.isSuccess) {
        toast.success("Tải lên thành công");
        handleGetlist();
      }
    });
  };

  const handleDateChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteContract = async (id) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await ContractService.deleteContract({ id }).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá hợp đồng thành công");
          handleGetlist();
        }
      });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data?.length / itemsPerPage);
  // Modal dialog
  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const toggleModal = () => {
    setModal(!modal);
    if (modal) setSelectedItem(null); // Reset selectedItem khi modal đóng
  };
  const handleLinkClick = (item) => {
    if (selectedItem?.id !== item.id) {
      setSelectedItem(item);
      toggleModal();
    }
  };
  // end Modal dialog

  return (
    <div>
      <Button
        onClick={() => {
          setIscheck(!isCheck);
        }}
        className="d-lg-none d-flex d-md-none text-center justify-content-center text-white w-100 mb-1"
      >
        <span className="text-center">
          {" "}
          {isCheck ? "Ẩn lọc" : "Hiển thị lọc"}
        </span>
      </Button>
      {isCheck && (
        <Row className="d-flex align-items-center justify-content-between d-lg-none d-flex d-md-none">
          <Col md="4" className="mb-1">
            <Input
              type="text"
              placeholder="Số hợp đồng"
              name="name"
              // value={search.name}
              // onChange={handleSearchChange}
              // {...field}
              onChange={(text) => {
                setName(text?.target?.value);
              }}
            />
          </Col>
          <Col md="4" className="mb-1">
            <Controller
              control={control}
              name="customer_code"
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className="react-select"
                  placeholder="Khách hàng"
                  classNamePrefix="select"
                  options={
                    customer?.length > 0 && [
                      {
                        value: null,
                        label: "Chọn khách hàng",
                        number: 0,
                      },
                      ...customer?.map((item, index) => {
                        return {
                          value: item?.code,
                          label: `${item?.code} - ${item?.name}`,
                          number: index + 1,
                        };
                      }),
                    ]
                  }
                  {...field}
                  value={selectedCustomer}
                  onChange={(e) => {
                    field.onChange(e);
                    setSelectedCustomer(e);
                  }}
                />
              )}
            />
          </Col>
          <Col md="4" className="mb-1">
            <Controller
              control={control}
              name="jobfield_id"
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className="react-select"
                  placeholder="Lĩnh vực"
                  classNamePrefix="select"
                  options={
                    jobfieldData?.length > 0 && [
                      {
                        value: null,
                        label: "Chọn lĩnh vực",
                        number: 0,
                      },
                      ...jobfieldData?.map((item, index) => {
                        return {
                          value: item?.id,
                          label: `${item?.code} - ${item?.name}`,
                          number: index + 1,
                        };
                      }),
                    ]
                  }
                  {...field}
                  value={selectedJobfield}
                  onChange={(e) => {
                    field.onChange(e);
                    setSelectedJobfield(e);
                  }}
                />
              )}
            />
          </Col>
          <Col md="4" className="mb-1">
            <Input
              type="date"
              placeholder="Ngày ký từ"
              name="startDate"
              value={search.startDate}
              onChange={handleDateChange}
            />
          </Col>
          <Col md="4" className="mb-2">
            <Input
              type="date"
              placeholder="Ngày ký đến"
              name="endDate"
              value={search.endDate}
              onChange={handleDateChange}
            />
          </Col>
        </Row>
      )}
      <Row className="mb-3 align-items-center d-lg-flex d-none d-md-flex">
        <Col md={2}>
          <Input
            type="text"
            placeholder="Số hợp đồng"
            name="name"
            // value={search.name}
            // onChange={handleSearchChange}
            // {...field}
            onChange={(text) => {
              setName(text?.target?.value);
            }}
          />
        </Col>
        <Col md={3}>
          <Controller
            control={control}
            name="customer_code"
            render={({ field }) => (
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className="react-select"
                placeholder="Khách hàng"
                classNamePrefix="select"
                options={
                  customer?.length > 0 && [
                    {
                      value: null,
                      label: "Chọn khách hàng",
                      number: 0,
                    },
                    ...customer?.map((item, index) => {
                      return {
                        value: item?.code,
                        label: `${item?.code} - ${item?.name}`,
                        number: index + 1,
                      };
                    }),
                  ]
                }
                {...field}
                value={selectedCustomer}
                onChange={(e) => {
                  field.onChange(e);
                  setSelectedCustomer(e);
                }}
              />
            )}
          />
        </Col>
        <Col md="3">
          <Controller
            control={control}
            name="jobfield_id"
            render={({ field }) => (
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className="react-select"
                placeholder="Lĩnh vực"
                classNamePrefix="select"
                options={
                  jobfieldData?.length > 0 && [
                    {
                      value: null,
                      label: "Chọn lĩnh vực",
                      number: 0,
                    },
                    ...jobfieldData?.map((item, index) => {
                      return {
                        value: item?.id,
                        label: `${item?.code} - ${item?.name}`,
                        number: index + 1,
                      };
                    }),
                  ]
                }
                {...field}
                value={selectedJobfield}
                onChange={(e) => {
                  field.onChange(e);
                  setSelectedJobfield(e);
                }}
              />
            )}
          />
        </Col>
        <Col md={2}>
          <Input
            type="date"
            placeholder="Ngày ký từ"
            name="startDate"
            value={search.startDate}
            onChange={handleDateChange}
          />
        </Col>
        <Col md={2}>
          <Input
            type="date"
            placeholder="Ngày ký đến"
            name="endDate"
            value={search.endDate}
            onChange={handleDateChange}
          />
        </Col>
      </Row>
      <div className="mb-3">
        {statuses.map((status) => (
          <Badge
            key={status.value}
            color={selectedStatus === status.value ? "primary" : "secondary"}
            style={{
              backgroundColor: badgeColors[status.value],
              margin: "0.2rem",
              cursor: "pointer",
            }}
            onClick={() => handleStatusFilter(status.value)}
          >
            {status.label}
          </Badge>
        ))}
        <Badge
          color={selectedStatus === null ? "primary" : "secondary"}
          style={{
            backgroundColor: "#6c757d",
            margin: "0.2rem",
            cursor: "pointer",
          }}
          onClick={() => handleStatusFilter(null)}
        >
          All
        </Badge>
      </div>
      <Row className="mb-1 d-flex align-items-center justify-content-between">
        <Col sm="8" className="d-lg-flex d-md-flex align-items-center mt-md-0">
          <div
            className="d-lg-flex d-md-flex align-items-center mt-md-0"
            sm="12"
          >
            <span className="d-lg-flex d-none d-md-flex">
              {isAuth && (
                <div className="d-flex mt-md-0 mt-1">
                  <Button
                    color="dark"
                    outline
                    tag={Label}
                    size="md"
                    onClick={() => handleExportXLSX()}
                  >
                    <Share size={14} />
                    <span className="align-middle ms-25">Export</span>
                  </Button>
                </div>
              )}
           
              {/* {isAuthimport && (
                <div
                  className="d-lg-flex d-none d-md-flex align-items-center mt-md-0 mt-1"
                  sm="12"
                >
                  <Button
                    color="dark"
                    outline
                    tag={Label}
                    size="md"
                    className="ml-1"
                  >
                    <Download size={14} />
                    <span className="align-middle ms-25">
                      Import
                      <Input
                        type="file"
                        onChange={onChangeUpload}
                        hidden
                        accept="xlsx/*"
                      />
                    </span>
                  </Button>

                  <Link
                    to={importContract}
                    className="align-middle ms-25 pl-2 pt-0 mr-1 text-secondary "
                    target="_blank"
                    download
                  >
                    {" "}
                    <Download size={14} /> Download template
                  </Link>
                </div>
              )} */}
            </span>
            {isAuthCreate && (
              <div
                  className="d-lg-flex d-none d-md-flex align-items-center mt-md-0 mt-1 ml-2"
                  sm="12"
                >
              <Button
                className="cursor-pointer"
                color="dark"
                outline
                tag={Label}
                size="md"
                onClick={handleClick}
              >
                <span className="align-middle ms-25">Tạo hợp đồng</span>
              </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
      {currentItems?.length > 0 ? (
        <>
          <div className="table-responsive">
            <Table striped className="table-contract">
              <thead>
                <tr>
                  <th rowSpan={2} style={{ textAlign: "center" }}>
                    TT
                  </th>
                  <th rowSpan={2} style={{ textAlign: "center" }}>
                    Hợp đồng
                  </th>
                  {/* <th rowSpan={2} style={{ textAlign: "center" }}>
                    Tên Hợp đồng
                  </th> */}
                  <th rowSpan={2} style={{ textAlign: "center" }}>
                    Khách hàng
                  </th>
                  <th rowSpan={2} style={{ textAlign: "center" }}>
                    Ngày ký
                  </th>
                  <th rowSpan={2} style={{ textAlign: "center" }}>
                    Thời hạn hợp đồng
                  </th>
                  <th colSpan="5" style={{ textAlign: "center" }}>
                    Tình trạng
                  </th>
                  <th rowSpan={2} style={{ textAlign: "center" }}>
                    {/* Hành động */}
                  </th>
                </tr>
                <tr>
                  <th style={{ textAlign: "center" }}>Đang thực hiện</th>
                  <th style={{ textAlign: "center" }}>Vướng mắc</th>
                  <th style={{ textAlign: "center" }}>Quá hạn</th>
                  <th style={{ textAlign: "center" }}>Hoàn thành</th>
                  <th style={{ textAlign: "center" }}>Đã thanh toán</th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((item) => (
                  <tr key={item.contractNumber}>
                    <td style={{ textAlign: "center" }}>{item?.id}</td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div>{item?.contract_number_information}</div>
                        <div>
                          <Link
                            to="#"
                            onClick={() =>
                              handleLinkClick({ id: item?.id, name: item?.name })
                            }
                          >
                            {item?.name}
                          </Link>
                        </div>
                      </div>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      {item?.customer?.name}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div>
                        {moment(item?.signing_date)
                          .format("DD/MM/YYYY")
                          .toString()}
                      </div>
                      <div>
                      {
                        item?.file_contract && (
                        <a href={item.file_contract} target="_blank" rel="noopener noreferrer">
                          file hợp đồng
                        </a>
                      )}
                    </div>


                    </td>
                    <td style={{ textAlign: "center" }}>{item?.duration}</td>
                    <td
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        backgroundColor:
                          item?.processingStatus === "CONTACT"
                            ? badgeColors["CONTACT"]
                            : "",
                      }}
                    >
                      {
                        // processingStatusObject[item.processingStatus === "CONTACT"]
                        //   ?.label
                        item.processingStatus === "CONTACT" ? item?.note : ""
                      }
                    </td>
                    <td
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        backgroundColor:
                          item?.processingStatus === "Survey"
                            ? badgeColors["Survey"]
                            : "",
                      }}
                    >
                      {item.processingStatus === "Survey" ? item?.note : ""}
                    </td>
                    <td
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        backgroundColor:
                          item?.processingStatus === "NEGOTIATION"
                            ? badgeColors["NEGOTIATION"]
                            : "",
                      }}
                    >
                      {item.processingStatus === "NEGOTIATION"
                        ? item?.note
                        : ""}
                    </td>
                    <td
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        backgroundColor:
                          item?.processingStatus === "SURNOTIMPLEMENTEDVEY"
                            ? badgeColors["SURNOTIMPLEMENTEDVEY"]
                            : "",
                      }}
                    >
                      {item.processingStatus === "SURNOTIMPLEMENTEDVEY"
                        ? item?.note
                        : ""}
                    </td>
                    <td
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        backgroundColor:
                          item?.processingStatus === "CONTRACT"
                            ? badgeColors["CONTRACT"]
                            : "",
                      }}
                    >
                      {item.processingStatus === "CONTRACT" ? item?.note : ""}
                    </td>
                    <td>
                      {(isAuthUpdate || role === ROLES_APP.ADMIN || role === ROLES_APP.COMPANYADMIN) && item?.id && (
                       <Badge color="primary" className="badge-block">
                          <Link to={`/apps/contract/edit/${item.id}`}>
                            Cập nhật
                          </Link>
                        </Badge>
                      )}
                      &nbsp;
                      {(isAuthCreate || role === ROLES_APP.ADMIN || role === ROLES_APP.COMPANYADMIN) &&
                        item?.contract?.length <= 0 &&
                        item?.id && (
                          <Badge
                            color="success"
                            className="badge-block"
                            onClick={() =>
                              history.push({
                                pathname: "/apps/job/add",
                                state: {
                                  contractId: item?.id,
                                  jobfieldId: item?.jobfield_id,
                                },
                              })
                            }
                          >
                            Tạo công việc
                          </Badge>
                        )}
                      &nbsp;
                      { (isAuthDelete || role === ROLES_APP.ADMIN || role === ROLES_APP.COMPANYADMIN) &&
                        item?.id &&
                        (
                          <Badge
                            onClick={() => handleDeleteContract(item?.id)}
                            color="danger"
                            className="badge-block"
                          >
                            Xoá
                          </Badge>
                        )}
                    </td>

                    {/* Modal dialog */}
                    {selectedItem && selectedItem.id === item.id && (
                      <Modal
                        isOpen={modal}
                        toggle={toggleModal}
                        size="xl"
                        style={{ maxWidth: "90%", width: "90%" }}
                      >
                        <ModalHeader toggle={toggleModal}>
                          Chi Tiết Phân Công Nhiệm vụ
                        </ModalHeader>
                        <ModalBody>
                          <TaskAssignment jobid={selectedItem?.id} />
                        </ModalBody>
                      </Modal>
                    )}
                    {/* end Modal dialog */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Pagination>
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink first onClick={() => handlePageChange(1)} />
            </PaginationItem>
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink
                previous
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem
                key={index + 1}
                active={index + 1 === currentPage}
              >
                <PaginationLink onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem disabled={currentPage === totalPages}>
              <PaginationLink
                next
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
            <PaginationItem disabled={currentPage === totalPages}>
              <PaginationLink
                last
                onClick={() => handlePageChange(totalPages)}
              />
            </PaginationItem>
          </Pagination>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>Không có dữ liệu</div>
      )}
    </div>
  );
};

export default ContractList;
