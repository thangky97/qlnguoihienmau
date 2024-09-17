import { Fragment, useEffect, useState } from "react";

import { formatText } from "@utils";
import CustomLoader from "./../../../../components/custom/CustomLoader";
import DataTable from "react-data-table-component";
import { ChevronDown, Download, Share } from "react-feather";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import ReactPaginate from "react-paginate";
import Button from "reactstrap/lib/Button";
import CardBody from "reactstrap/lib/CardBody";
import { Badge, Card, Col, Input, Label, Row } from "reactstrap";
import OpportunityService from "../../../../../services/OpportunityService";
import { checkauth, selectThemeColors } from "../../../../../utility/Utils";
import { useSelector } from "react-redux";
import { Link, useLocation, useHistory } from "react-router-dom";
import { MANAGEMENT, ROLES_APP } from "../../../../../constants/app";
import CustomerService from "../../../../../services/CustomerService";
import JobfieldService from "../../../../../services/JobfieldService";
import XLSX from "xlsx";
import { exportHeaderInquiry } from "../../../../../constants/export";
import { toast } from "react-toastify";
import importInquiry from "./IMPORT_INQUIRY.xlsx";
import { startOfMonth, endOfMonth, format } from "date-fns";
import './style.scss';


// import * as ExcelJS from 'exceljs';
import ExcelJS from 'exceljs';
  import { saveAs } from 'file-saver';

// Chat gpt
// import React, { useState, useEffect } from 'react';
import {
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Form,
  InputGroup,
  InputGroupText,
} from "reactstrap";

// Badge colors
const badgeColors = {
  tiepXuc: "#FF6384", // Color for "Tiếp xúc"
  khaoSat: "#36A2EB", // Color for "Khảo sát "
  baoGia: "#7625BE", // Color for "báo giá"
  dangThuongThao: "#FFCE56", // Color for "Đang thương thảo"
  khongThucHien: "#FF9F40", // Color for "Không thực hiện"
  kyHD: "#4BC0C0", // Color for "Ký HĐ"
};

// Badge colors
const excelProcessStatusColors = {
  tiepXuc: "FF6384", // Color for "Tiếp xúc"
  khaoSat: "36A2EB", // Color for "Khảo sát "
  baoGia: "7625BE", // Color for "báo giá"
  dangThuongThao: "FFCE56", // Color for "Đang thương thảo"
  khongThucHien: "FF9F40", // Color for "Không thực hiện"
  kyHD: "4BC0C0", // Color for "Ký HĐ"
};

const processingStatusObject = {
  tiepXuc: {
    value: "tiepXuc",
    label: "Tiếp xúc",
    bgr: "#FF6384",
  },
  khaoSat: {
    value: "khaoSat",
    label: "Khảo sát",
    bgr: "#36A2EB",
  },
  baoGia: {
    value: "baoGia",
    label: "Báo giá",
    bgr: "#7625BE",
  },
  dangThuongThao: {
    value: "dangThuongThao",
    label: "Đang thương thảo",
    bgr: "#FFCE56",
  },
  khongThucHien: {
    value: "khongThucHien",
    label: "Không thực hiện",
    bgr: "#FF9F40",
  },
  kyHD: {
    value: "kyHD",
    label: "Ký HD",
    bgr: "#4BC0C0",
  },
};

const statuses = Object.keys(processingStatusObject).map((key) => ({
  value: processingStatusObject[key].value,
  label: processingStatusObject[key].label,
}));

const InquiryList = () => {
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [search, setSearch] = useState({
    doanhNghiep: "",
    linhVuc: "",
    createDateFrom: "",
    createDateTo: "",
    tinhTrang: "",
  });

  const [isCheck, setIscheck] = useState(false);
  // previous backup
  const history = useHistory();

  const [selectedStatus, setSelectedStatus] = useState();
  const userData = useSelector((state) => state?.auth?.userData);
  const location = useLocation();
  const [customer, setUserData] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState();

  const [jobfieldData, setListJobfield] = useState();

  const [selectedJobfield, setSelectedJobfield] = useState();

  const searchParams = new URLSearchParams(location.search);
  const jobfield = searchParams.get("jobfield");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const processingStatusCounts = searchParams.get("processingStatusCounts");

  const auth = userData?.authorities.find(
    (item) => item.management === MANAGEMENT.INQUIRY
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

   

const handleExportXLSX = async () => {
  if (!data || data.length <= 0) {
    return;
  }

  // Create a new Excel workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(exportHeaderInquiry.EXPORT_WS);

  // Define headers
  worksheet.addRow([
    exportHeaderInquiry.ID,
    exportHeaderInquiry.CUSTOMER,
    exportHeaderInquiry.CUSTOMER_TYPE,
    exportHeaderInquiry.JOBFIELD,
    exportHeaderInquiry.STATUS,
    "", "", "", "", ""  // Placeholder for status sub-headers
  ]);

  worksheet.addRow([
    "", "", "", "",
    exportHeaderInquiry.STATUS_TIEPXUC,
    exportHeaderInquiry.STATUS_KHAOSAT,
    exportHeaderInquiry.STATUS_BAOGIA,
    exportHeaderInquiry.STATUS_DANGTHUONGTHAO,
    exportHeaderInquiry.STATUS_KHONGTHUCHIEN,
    exportHeaderInquiry.STATUS_KYHOPDONG,
  ]);

  // Style the header rows (bold and bordered)
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(2).font = { bold: true };
  worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    cell.alignment = { horizontal: 'center', wrapText: true }; // Wrap text for header row
  });
  worksheet.getRow(2).eachCell({ includeEmpty: true }, (cell) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    cell.alignment = { horizontal: 'center', wrapText: true }; // Wrap text for header row
  });

  // Add data rows and format status cells
  data.forEach((row, rowIndex) => {
    const statusTiepxuc = row?.processingStatus === "tiepXuc" ? row?.note : '';
    const statusKhaosat = row?.processingStatus === "khaoSat" ? row?.note : '';
    const statusBaogia = row?.processingStatus === "baoGia" ? row?.note : '';
    const statusDangthuongthao = row?.processingStatus === "dangThuongThao" ? row?.note : '';
    const statusKhongthuchien = row?.processingStatus === "khongThucHien" ? row?.note : '';
    const statusKyHD = row?.processingStatus === "kyHD" ? row?.note : '';

    const addedRow = worksheet.addRow([
      row?.id,
      `${row?.customer?.code} - ${row?.customer?.name}`,
      row?.customer?.loaiHinh ?? "",
      row?.jobfield?.name,
      statusTiepxuc,
      statusKhaosat,
      statusBaogia,
      statusDangthuongthao,
      statusKhongthuchien,
      statusKyHD,
    ]);

    // Add border to each cell in the row
    addedRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { wrapText: true }; // Enable text wrapping for all data cells

    });

    // Format status cells (columns 5 to 10) with different fill colors based on status
    const statusColumns = [5, 6, 7, 8, 9, 10];  // Columns that contain status
    statusColumns.forEach((colIndex) => {
      const statusCell = addedRow.getCell(colIndex);
      statusCell.alignment = { horizontal: 'center', wrapText: true };
      // Apply fill color based on status
      if (statusCell.value) {
        switch (colIndex) {
          case 5: // Tiep Xuc
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: excelProcessStatusColors?.tiepXuc } }; // Light pink
            break;
          case 6: // Khao Sat
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: excelProcessStatusColors?.khaoSat  } }; // Light yellow
            break;
          case 7: // Bao Gia
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: excelProcessStatusColors?.baoGia  } }; // Light green
            break;
          case 8: // Dang Thuong Thao
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: excelProcessStatusColors?.dangThuongThao  } }; // Light red
            break;
          case 9: // Khong Thuc Hien
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: excelProcessStatusColors?.khongThucHien  } }; // Light blue
            break;
          case 10: // Ky Hop Dong
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: excelProcessStatusColors?.kyHD  } }; // Light purple
            break;
          default:
            break;
        }
      }
    });
  });

  // Adjust column width
  worksheet.columns.forEach((column) => {
    column.width = 20; // Set column width as needed
  });

  // Generate the Excel file buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Create a Blob and trigger download
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${exportHeaderInquiry.EXPORT_WB}.xlsx`);
};

  
  

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const handleClick = () => {
    history.push("/apps/inquiry/add");
  };

  // Handle Delete
  const handleDeleteInquiry = async (id) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await OpportunityService.delete(id).then((res) => {
        if (res?.isSuccess) {
          toast.success("Xoá nhu cầu thành công");
          handleGetlist();
        }
      });
    }
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
    OpportunityService.UpLoadExcel(imageData).then((res) => {
      if (res.isSuccess) {
        toast.success("Tải lên thành công");
        handleGetlist();
      }
    });
  };

  const handleGetlist = async (query) => {
    const result = await OpportunityService.getAll({
      ...query,
    });
    if (result.isSuccess) {
      setData(result.data);
    }
  };

  useEffect(() => {
    handleGetlist({
      jobfield_id: jobfield || selectedJobfield?.value || undefined,
      customer_code: selectedCustomer?.value || undefined,
      startDate: search?.createDateFrom ? search?.createDateFrom : undefined,
      endDate: search?.createDateTo ? search?.createDateTo : undefined,
      processingStatus: processingStatusCounts || selectedStatus || undefined,
    });
    setCurrentPage(1);
  }, [
    selectedStatus,
    selectedJobfield,
    selectedCustomer,
    // startDate,
    // endDate,
    search,
    processingStatusCounts,
    jobfield,
  ]);

  useEffect(() => {
    // Calculate default values
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");

    // Set default values
    
    setSearch({
      createDateFrom: formattedStartDate,
      createDateTo: formattedEndDate,
    });

    (async () => {
      const { data } = await CustomerService.getAllCustomer({
        status: "ACTIVE",
      });
      setUserData(data);
    })();
    (async () => {
      const { data } = await JobfieldService.getAll({
        status: "ACTIVE",
      });
      setListJobfield(data);
    })();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data?.length / itemsPerPage);

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
          <Col sm="4" className="">
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
                          label: `${item?.name} - MST: ${item?.tax_code}`,
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
          <Col sm="4" className="my-1">
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
          <Col sm="4">
            <InputGroup>
              <Input
                type="date"
                placeholder="Ngày tạo từ"
                value={search.createDateFrom}
                onChange={(e) =>
                  setSearch({ ...search, createDateFrom: e.target.value })
                }
              />
              <Input
                type="date"
                placeholder="Ngày tạo đến"
                value={search.createDateTo}
                onChange={(e) =>
                  setSearch({ ...search, createDateTo: e.target.value })
                }
              />
            </InputGroup>
          </Col>
        </Row>
      )}
      <Row className="align-items-center d-lg-flex d-none d-md-flex">
        <Col sm={4}>
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
                        label: `${item?.name} - MST: ${item?.tax_code}`,
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
        <Col sm={3}>
          {/* <InputGroup className="mb-3"> */}
          {/* <Input placeholder="Lĩnh vực" value={search.linhVuc} onChange={(e) => setSearch({ ...search, linhVuc: e.target.value })} /> */}

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

          {/* </InputGroup> */}
        </Col>
        <Col sm={5}>
          <InputGroup>
            <Input
              type="date"
              placeholder="Ngày tạo từ"
              value={search.createDateFrom}
              onChange={(e) =>
                setSearch({ ...search, createDateFrom: e.target.value })
              }
            />
            <Input
              type="date"
              placeholder="Ngày tạo đến"
              value={search.createDateTo}
              onChange={(e) =>
                setSearch({ ...search, createDateTo: e.target.value })
              }
            />
          </InputGroup>
        </Col>
      </Row>

      <div className="mb-3 mt-2">
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

      <Row className="mx-0 mb-1 d-flex align-items-center justify-content-between">
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
                    to={importInquiry}
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
                <span className="align-middle ms-25">Tạo nhu cầu</span>
              </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {currentItems?.length > 0 ? (
        <>
          <div className="table-responsive">
            <Table striped bordered hover className="table-inquiry">
              <thead>
                <tr>
                  <th rowSpan="2">TT</th>
                  <th rowSpan="2" style={{ textAlign: "center" }}>
                    Tên Doanh nghiệp
                  </th>
                  <th rowSpan="2" style={{ textAlign: "center" }}>
                    Loại Hình
                  </th>
                  <th rowSpan="2" style={{ textAlign: "center" }}>
                    Lĩnh vực / Nhu cầu
                  </th>
                  <th colSpan="6" style={{ textAlign: "center" }}>
                    Tình trạng
                  </th>
                  <th rowSpan="2" style={{ textAlign: "center" }}>
                    Hành động
                  </th>
                </tr>
                <tr>
                  <th style={{ textAlign: "center" }}>Tiếp xúc</th>
                  <th style={{ textAlign: "center" }}>Khảo sát</th>
                  <th style={{ textAlign: "center" }}>Báo giá</th>
                  <th style={{ textAlign: "center" }}>Đang thương thảo</th>
                  <th style={{ textAlign: "center" }}>Không thực hiện</th>
                  <th style={{ textAlign: "center" }}>Ký HĐ</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item?.id}>
                    <td>{item?.id}</td>
                    <td>{item?.customer?.name}</td>
                    <td>{item?.customer?.loaiHinh}</td>
                    <td>{item?.jobfield?.name}</td>

                    {[
                      "tiepXuc",
                      "khaoSat",
                      "baoGia",
                      "dangThuongThao",
                      "khongThucHien",
                      "kyHD",
                    ].map((status) => (
                      <td
                        key={status}
                        style={{
                          color: "#fff",
                          backgroundColor:
                            item?.processingStatus === status
                              ? badgeColors[status]
                              : "",
                        }}
                      >
                        {item?.processingStatus === status
                          ? item?.note?.length > 20
                            ? `${item.note.slice(0, 20)}...`
                            : item.note
                          : ""}
                      </td>
                    ))}

                    <td>
                      {isAuthUpdate && item?.id && (
                        <Badge color="primary" className="badge-block">
                          <Link to={`/apps/inquiry/edit/${item?.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                            Cập nhật
                          </Link>
                        </Badge>
                      )}
                      {(isAuthDelete || role === ROLES_APP.ADMIN || role === ROLES_APP.COMPANYADMIN)  && item?.id && (
                        <Badge
                          color="danger"
                          onClick={() => handleDeleteInquiry(item?.id)}
                          className="badge-block"
                          style={{ cursor: "pointer" }}
                        >
                          Xóa
                        </Badge>
                      )}
                    </td>

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

export default InquiryList;
