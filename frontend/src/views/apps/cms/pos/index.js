import { TabContent, Nav, NavLink, TabPane, NavItem } from "reactstrap";

import { Fragment, useState } from "react";
import { Route } from "react-router-dom";
// ** Styles
import React from "react";
import "@styles/react/apps/app-tour.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "./style.scss";
import TopSale from "./top-sale";

import { Controller, useForm } from "react-hook-form";

import "react-datepicker/dist/react-datepicker.css";

import { endOfMonth, startOfMonth } from "date-fns";

import sumaryreport from "./sumaryreport";

const Pos = () => {
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setendDate] = useState(endOfMonth(new Date()));

  const [activeTab, setActiveTab] = useState("3");

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  //validate dữ liệu
  const {
    control,
    formState: { errors },
  } = useForm();

  return (
    <div className="app-user-list">
      <Nav tabs>
        <NavItem>
          <NavLink
            className={activeTab === "3" ? "active" : ""}
            onClick={() => {
              toggle("3");
            }}
          >
            Báo cáo tổng hợp
          </NavLink>
        </NavItem>
        {/* <NavItem>
          <NavLink
            className={activeTab === "1" ? "active" : ""}
            onClick={() => {
              toggle("1");
            }}
          >
            Báo cáo công việc
          </NavLink>
        </NavItem> */}
        {/* <NavItem>
          <NavLink
            className={activeTab === "2" ? "active" : ""}
            onClick={() => {
              toggle("2");
            }}
          >
            Thống kê nhiệm vụ
          </NavLink>
        </NavItem> */}
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="3">
          <Route component={sumaryreport} />
        </TabPane>
        {/* <TabPane tabId="1">
          <Fragment>
            <Card>
              <Button
                onClick={() => {
                  setIscheck(!isCheck);
                }}
                className="d-lg-none d-flex d-md-none text-center justify-content-center  text-white"
              >
                <span className="text-center">
                  {" "}
                  {isCheck ? "Ẩn lọc" : "Hiển thị lọc"}
                </span>
              </Button>
              {isCheck && (
                <CardBody className="d-lg-none d-flex d-md-none">
                  <Row style={{ width: "100%" }}>
                    <Col sm="4" className="mt-1 d-flex flex-column">
                      <Controller
                        control={control}
                        name="startDate"
                        className={classnames({
                          "is-invalid": errors["startDate"],
                        })}
                        render={() => (
                          <DatePicker
                            className="datepicker"
                            onChange={(date) => {
                              setStartDate(date);
                            }}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            selected={startDate}
                            value={startDate}
                            selectsStart
                            placeholderText="Từ ngày"
                            dateFormat="dd/MM/yyyy"
                          />
                        )}
                      />
                      <small className="text-danger pt-1">
                        {errors.startDate?.message}
                      </small>
                    </Col>
                    <Col sm="4" className="mt-1 d-flex flex-column">
                      <Controller
                        control={control}
                        name="endDate"
                        className={classnames({
                          "is-invalid": errors["startDate"],
                        })}
                        render={() => (
                          <DatePicker
                            className="datepicker"
                            onChange={(date) => {
                              setendDate(date);
                            }}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            selected={endDate}
                            value={endDate}
                            selectsStart
                            minDate={startDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Đến ngày"
                          />
                        )}
                      />
                      <small className="text-danger pt-1">
                        {errors.endDate?.message}
                      </small>
                    </Col>
                  </Row>
                </CardBody>
              )}
              <CardBody>
                <Row style={{ width: "100%" }}>
                  <Col sm="4" className="mt-1 d-flex flex-column">
                    <Controller
                      control={control}
                      name="startDate"
                      className={classnames({
                        "is-invalid": errors["startDate"],
                      })}
                      render={() => (
                        <DatePicker
                          className="datepicker"
                          onChange={(date) => {
                            setStartDate(date);
                          }}
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          selected={startDate}
                          value={startDate}
                          selectsStart
                          placeholderText="Từ ngày"
                          dateFormat="dd/MM/yyyy"
                        />
                      )}
                    />
                    <small className="text-danger pt-1">
                      {errors.startDate?.message}
                    </small>
                  </Col>
                  <Col sm="4" className="mt-1 d-flex flex-column">
                    <Controller
                      control={control}
                      name="endDate"
                      className={classnames({
                        "is-invalid": errors["startDate"],
                      })}
                      render={() => (
                        <DatePicker
                          className="datepicker"
                          onChange={(date) => {
                            setendDate(date);
                          }}
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          selected={endDate}
                          value={endDate}
                          selectsStart
                          minDate={startDate}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Đến ngày"
                        />
                      )}
                    />
                    <small className="text-danger pt-1">
                      {errors.endDate?.message}
                    </small>
                  </Col>
                </Row>

                <StatisticDeparmentJob
                  startDate={startDate}
                  endDate={endDate}
                />
              </CardBody>
            </Card>
          </Fragment>
        </TabPane> */}
        <TabPane tabId="2">
          <Route component={TopSale} />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default Pos;
