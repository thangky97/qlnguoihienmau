import EnventService from "../../../../../services/EnventService";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { selectThemeColors } from "@utils";
import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import CustomLoader from "../../../../components/custom/CustomLoader";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { Button, Card, Col, Form, Label, Row } from "reactstrap";
import { Link } from "react-router-dom";

import { checkauth } from "../../../../../utility/Utils";
import Columns from "./columns";
import { useSelector } from "react-redux";
import { MANAGEMENT } from "../../../../../constants/app";
import "./style.scss";
import CategoryPostService from "@services/CategoryPostService";

const CustomHeader = (props) => {
  const { data, userData } = props;

  const auth = userData?.authorities.find(
    (item) => item.management == MANAGEMENT.CATEGORY
  )?.action;
  const role = userData?.role;

  const isAuthCreate = checkauth(role, auth, "C");

  const statusObj = {
    ACTIVE: {
      text: "Đã phê duyệt",
      bgr: "light-success",
    },
    DEACTIVE: {
      text: "Chờ phê duyệt",
      bgr: "light-danger",
    },
  };

  return (
    <div
      className="invoice-list-table-header w-100 mr-1 mb-75 d-lg-flex d-md-flex"
      style={{ marginLeft: "-0.7rem" }}
    >
      <div className="d-flex mt-md-0 mr-2 ">
        <span className="d-lg-flex d-none d-md-flex align-items-center mt-md-0"></span>

        {isAuthCreate && (
          <Link to="/apps/envent/add">
            <Button color="dark" outline tag={Label} size="md" className="ml-1">
              <span className="align-middle ms-25">Tạo sự kiện</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

const EnventList = () => {
  const userData = useSelector((state) => state?.auth?.userData);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [total, setTotal] = useState();
  const [params, setParams] = useState({
    page: {
      page: 1,
      limit: 25,
    },
    filter: {
      // title: null,
    },
    sort: {
      by: "sequence",
      type: "ASC",
    },
  });

  const [loading, setLoading] = useState();
  const [status, setStatus] = useState(undefined);

  const [categoryPost, setCategoryPost] = useState();
  const [selectedCategoryPost, setSelectedCategoryPost] = useState();

  useEffect(() => {
    (async () => {
      const { data } = await CategoryPostService.getAllCategoryPost({
        status: "ACTIVE",
      });
      setCategoryPost(data);
    })();
  }, []);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const onSubmit = (data) => {
    setParams((prev) => {
      return {
        ...prev,
        filter: {
          ...data,
          status: data?.status?.value,
          category_post_id: data?.category_post_id?.value || null,
        },
        page: {
          ...prev.page,
          page: 1,
        },
      };
    });
    setCurrentPage(1);
  };

  const handleGetlist = async (value) => {
    setLoading(true);
    const result = await EnventService.getListEnvent(params);

    if (result.isSuccess) {
      // const sortedList = result.data.list.sort((a, b) => a.sequence - b.sequence);

      const sortedList = result.data.list.sort((a, b) => {
        if (a.sequence !== b.sequence) {
          return a.sequence - b.sequence;
        }

        if (a.departmentId !== b.departmentId) {
          return a.departmentId - b.departmentId;
        }

        return a.id - b.id;
      });

      setData(sortedList);
      // setData(result.data.list);
      setTotal(
        Number(Math.ceil(result.data.count / (params.page.limit || 10)))
      );
    } else {
    }
    setLoading(false);
  };

  const handleSort = async (column, sortDirection) => {
    setParams((prev) => {
      return {
        ...prev,
        sort: {
          sortBy: column.sortField,
          sortDirection,
        },
      };
    });
  };

  const customStyles = {
    rows: {
      style: {
        "&:last-of-type": {
          // fontFamily: "Montserrat, Helvetica, Arial, serif", // Include multiple font families
          // color: "#rgba(0,0,0,0.87)",
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
          borderBottomColor: "#e3e3e3",
        },
        textTransform: "none" /* Prevent capitalization */,
      },
    },
    headCells: {
      style: {
        // fontFamily: "Times New Roman, Tahoma, Montserrat, Helvetica, Arial, serif", // Apply to header cells
        // color: "#rgba(0,0,0,0.87)",
        textTransform: "none", // Prevent capitalization
      },
    },
    // Additional styles for other parts of the table
  };

  const CustomPagination = () => {
    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={total || 1}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => {
          setParams((prev) => {
            return {
              ...prev,
              page: {
                ...prev.page,
                page: page.selected + 1,
              },
            };
          });
          setCurrentPage(page.selected + 1);
        }}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pr-1"
        }
      />
    );
  };
  const [isCheck, setIscheck] = useState(false);

  useEffect(() => {
    handleGetlist();
  }, [params]);

  return (
    <Fragment>
      <Card>
        <Button
          onClick={() => {
            setIscheck(!isCheck);
          }}
          className="d-lg-none d-flex d-md-none text-center justify-content-center text-white"
        >
          <span className="text-center">
            {" "}
            {isCheck ? "Ẩn lọc" : "Hiển thị lọc"}
          </span>
        </Button>
        {isCheck && (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mx-0 mt-2 d-flex align-items-center justify-content-between d-lg-none d-flex d-md-none">
              <Col md="3" className="mb-1">
                <Label>Danh mục</Label>
                <Controller
                  control={control}
                  name="category_post_id"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      placeholder="Danh mục"
                      classNamePrefix="select"
                      options={
                        categoryPost?.length > 0 && [
                          {
                            value: null,
                            label: "Chọn danh mục",
                            number: 0,
                          },
                          ...categoryPost?.map((item, index) => {
                            return {
                              value: item?.id,
                              label: item?.name,
                              number: index + 1,
                            };
                          }),
                        ]
                      }
                      {...field}
                      value={selectedCategoryPost}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedCategoryPost(e);
                      }}
                    />
                  )}
                />
              </Col>
              <Col md="3" className="mb-1">
                <Label>Trạng thái</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      className="react-select"
                      placeholder="Trạng thái"
                      classNamePrefix="select"
                      options={[
                        { value: null, label: "Chọn trạng thái", number: 0 },
                        { value: "active", label: "Đã phê duyệt", number: 1 },
                        {
                          value: "deactive",
                          label: "Chờ phê duyệt",
                          number: 2,
                        },
                      ]}
                      {...field}
                      value={status}
                      onChange={(e) => {
                        field.onChange(e);
                        setStatus(e);
                      }}
                    />
                  )}
                />
              </Col>
              <Col md="3">
                {" "}
                <Row>
                  <Button.Ripple color="primary" className="mx-1" type="submit">
                    Tìm kiếm
                  </Button.Ripple>
                </Row>
              </Col>
            </Row>
          </Form>
        )}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="mx-0 my-1 align-items-center d-lg-flex d-none d-md-flex">
            <Col md="3" className="mb-1">
              <Label>Danh mục</Label>
              <Controller
                control={control}
                name="category_post_id"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    placeholder="Danh mục"
                    classNamePrefix="select"
                    options={
                      categoryPost?.length > 0 && [
                        {
                          value: null,
                          label: "Chọn danh mục",
                          number: 0,
                        },
                        ...categoryPost?.map((item, index) => {
                          return {
                            value: item?.id,
                            label: item?.name,
                            number: index + 1,
                          };
                        }),
                      ]
                    }
                    {...field}
                    value={selectedCategoryPost}
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedCategoryPost(e);
                    }}
                  />
                )}
              />
            </Col>
            <Col md="3" className="mb-1">
              <Label>Trạng thái</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    placeholder="Trạng thái"
                    classNamePrefix="select"
                    options={[
                      { value: null, label: "Chọn trạng thái", number: 0 },
                      { value: "active", label: "Đã phê duyệt", number: 1 },
                      {
                        value: "deactive",
                        label: "Chờ phê duyệt",
                        number: 2,
                      },
                    ]}
                    {...field}
                    value={status}
                    onChange={(e) => {
                      field.onChange(e);
                      setStatus(e);
                    }}
                  />
                )}
              />
            </Col>
            <Col md="3" style={{ marginTop: "6px" }}>
              {" "}
              <Row>
                <Button.Ripple color="primary" className="mx-1" type="submit">
                  Tìm kiếm
                </Button.Ripple>
              </Row>
            </Col>
          </Row>
        </Form>
        <hr></hr>
        <div className="dataTableContainer">
          <DataTable
            noHeader
            pagination
            subHeader
            responsive
            paginationServer
            columns={Columns(userData, handleGetlist)}
            sortIcon={<ChevronDown />}
            onSort={handleSort}
            className="react-dataTable table-workingprocesstemplate"
            paginationComponent={CustomPagination}
            data={data}
            progressPending={loading}
            progressComponent={<CustomLoader />}
            subHeaderComponent={
              <CustomHeader
                setParams={setParams}
                setCurrentPage={setCurrentPage}
                data={data}
                userData={userData}
              />
            }
            noDataComponent={<div className="my-5">Không có dữ liệu</div>}
            customStyles={customStyles}
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default EnventList;
