import { Badge, Card, CardBody, Col, Input, Row } from "reactstrap";
import Button from "reactstrap/lib/Button";
import classnames from "classnames";
import { Fragment, useState } from "react";
import "@styles/react/apps/app-tour.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "./style.scss";

import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import StatisticDeparmentTask from "./StatisticDeparmentTask";
import { endOfMonth, startOfMonth } from "date-fns";

const Pos = () => {
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));

  const {
    control,
    formState: { errors },
  } = useForm();

  const [isCheck, setIscheck] = useState(false);

  return (
    <div className="app-user-list">
      <Fragment>
        <Card>
          <Button
            onClick={() => {
              setIscheck(!isCheck);
            }}
            className="d-lg-none d-flex d-md-none text-center justify-content-center text-white"
          >
            <span className="text-center">
              {isCheck ? "Ẩn lọc" : "Hiển thị lọc"}
            </span>
          </Button>
          {isCheck && (
            <Row className="mx-0 mt-2 d-flex align-items-center d-lg-none d-md-none">
              <Col sm="4" className="mt-1">
                <Controller
                  control={control}
                  name="startDate"
                  className={classnames({
                    "is-invalid": errors["startDate"],
                  })}
                  render={({ field }) => (
                    <DatePicker
                      className="datepicker"
                      onChange={(date) => {
                        field.onChange(date);
                        setStartDate(date); // Update state with the new start date
                      }}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      selected={startDate}
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
              <Col sm="4" className="mt-1">
                <Controller
                  control={control}
                  name="endDate"
                  className={classnames({
                    "is-invalid": errors["endDate"],
                  })}
                  render={({ field }) => (
                    <DatePicker
                      className="datepicker"
                      onChange={(date) => {
                        field.onChange(date);
                        setEndDate(date); // Update state with the new end date
                      }}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      selected={endDate}
                      selectsEnd
                      minDate={startDate} // Prevent selecting a date before the start date
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
          )}
          <CardBody>
            <Row className="align-items-center d-lg-flex d-none d-md-flex">
              <Col sm="4" className="mt-1 d-flex flex-column">
                <Controller
                  control={control}
                  name="startDate"
                  className={classnames({
                    "is-invalid": errors["startDate"],
                  })}
                  render={({ field }) => (
                    <DatePicker
                      className="datepicker"
                      onChange={(date) => {
                        field.onChange(date);
                        setStartDate(date); // Update state with the new start date
                      }}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      selected={startDate}
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
                    "is-invalid": errors["endDate"],
                  })}
                  render={({ field }) => (
                    <DatePicker
                      className="datepicker"
                      onChange={(date) => {
                        field.onChange(date);
                        setEndDate(date); // Update state with the new end date
                      }}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      selected={endDate}
                      selectsEnd
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

            {/* Pass the updated startDate and endDate to StatisticDeparmentTask */}
            <StatisticDeparmentTask startDate={startDate} endDate={endDate} />
          </CardBody>
        </Card>
      </Fragment>
    </div>
  );
};

export default Pos;
