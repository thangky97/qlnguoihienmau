// ** React Import
import { yupResolver } from "@hookform/resolvers/yup";
import { selectThemeColors } from "@utils";
import { useEffect, useState } from "react";
import Select from "react-select";
import { isObjEmpty } from "@utils";

// ** Third Party Components
import classnames from "classnames";
import { Controller, useController, useForm } from "react-hook-form";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ** Store & Actions

import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_ADD_ENVENT } from "../../../../../constants/validation";
import EnventService from "../../../../../services/EnventService";
import UserService from "@services/UserService";
import CategoryPostService from "@services/CategoryPostService";
import moment from "moment";
import "./style.scss";

const schema = yup.object(SCHEMA_ADD_ENVENT).required();

const AddEnvent = ({ param }) => {
  // ** States
  const [users, setUser] = useState([]);
  const [categoryPost, setCategoryPost] = useState([]);

  const [disable, setDisable] = useState(false);
  const history = useHistory();

  const [startTimes, setStartTime] = useState("");
  const [endTimes, setEndtime] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await UserService.get_all_operator({
        status: "ACTIVE",
      });
      setUser(data);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await CategoryPostService.getAllCategoryPost({
        status: "ACTIVE",
      });
      setCategoryPost(data?.data);
    })();
  }, []);

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    watch,
    register,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      status: {
        value: "DEACTIVE",
        label: "Chờ phê duyệt",
        number: 1,
      },
    },
  });

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      setDisable(true);

      // Lấy danh sách các bác sĩ đã chọn
      const selectedDoctors = values.user_id.map((doctor) =>
        parseInt(doctor.value)
      );

      // Gửi user_id dưới dạng mảng số qua body
      const result = await EnventService.addEnvent({
        name: values.name,
        event_date: moment(values?.event_date).format("YYYY/MM/DD"),
        start_time: moment(startTimes).format("HH:mm"),
        end_time: moment(endTimes).format("HH:mm"),
        location: values.location,
        blood_count: values.blood_count,
        blood_type: values?.blood_type || null,
        category_post_id: values?.category_post_id?.value,
        content: values?.content,
        status: values.status.value,
        user_id: selectedDoctors, // Đây là mảng số
      });

      if (result.isSuccess) {
        setDisable(false);

        reset();
        toast.success("Thêm thành công");
        history.push("/apps/envent/list");
      } else {
        setDisable(false);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="3">
          <FormGroup>
            <Label for="name">
              Tên sự kiện: <span className="text-danger">*</span>
            </Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["name"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.name && errors.name.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="3" className="section">
          <FormGroup>
            <Label>
              Ngày tổ chức <span className="text-danger"> *</span>
            </Label>
            <Controller
              control={control}
              name="event_date"
              className={classnames("form-control", {
                "is-invalid": errors["event_date"],
              })}
              innerRef={register}
              render={({ field }) => (
                <DatePicker
                  name="event_date"
                  id="event_date"
                  className={
                    errors.event_date?.message
                      ? "datepicker border border-danger"
                      : "datepicker"
                  }
                  innerRef={register}
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                  dateFormat="yyyy/MM/dd"
                  selected={field.value}
                  value={field.value}
                  selectsStart
                />
              )}
            />
            <small className="text-danger pt-1">
              {errors.event_date?.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="3" className="section">
          <Label>
            {" "}
            Tg bắt đầu: <span className="text-danger">*</span>
          </Label>
          <Controller
            control={control}
            name="start_time"
            className={classnames({
              "is-invalid": errors["start_time"],
            })}
            innerRef={register}
            render={({ field }) => (
              <DatePicker
                className={
                  errors.start_time?.message
                    ? "datepicker border border-danger"
                    : "datepicker"
                }
                onChange={(date) => {
                  field.onChange(date);
                  setStartTime(date);
                }}
                selected={field.value}
                value={field.value}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            )}
          />
          <small className="text-danger pt-1">
            {errors?.start_time?.message}
          </small>
        </Col>

        <Col sm="3" className="section">
          <Label>
            {" "}
            Tg kết thúc <span className="text-danger">*</span>
          </Label>
          <Controller
            control={control}
            name="end_time"
            className={classnames({
              "is-invalid": errors["end_time"],
            })}
            innerRef={register}
            render={({ field }) => (
              <DatePicker
                className={
                  errors.end_time?.message
                    ? "datepicker border border-danger"
                    : "datepicker"
                }
                onChange={(date) => {
                  field.onChange(date);
                  setEndtime(date);
                }}
                selected={field.value}
                value={field.value}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            )}
          />
          <small className="text-danger pt-1">{errors.end_time?.message}</small>
        </Col>

        <Col sm="4">
          <FormGroup>
            <Label for="location">
              Địa điểm: <span className="text-danger">*</span>
            </Label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["location"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.location && errors.location.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="4">
          <FormGroup>
            <Label for="blood_count">
              Số lượng đơn vị máu dự kiến:{" "}
              <span className="text-danger">*</span>
            </Label>
            <Controller
              name="blood_count"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["blood_count"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.blood_count && errors.blood_count.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="4">
          <FormGroup>
            <Label for="blood_type">Nhóm máu khẩn cấp:</Label>
            <Controller
              name="blood_type"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["blood_type"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.blood_type && errors.blood_type.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="6" className="mb-2">
          <FormGroup>
            <Label>
              Bác sĩ tham gia: <span className="text-danger">*</span>
            </Label>
            <Controller
              control={control}
              name="user_id"
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Chọn bác sĩ"
                  isMulti // Cho phép chọn nhiều
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: errors.user_id?.message ? "1px solid red" : "",
                    }),
                  }}
                  options={
                    users?.length > 0
                      ? users?.map((item, index) => {
                          return {
                            value: item?.id,
                            label: `${item?.code} - ${item?.name}`,
                            number: index + 1,
                          };
                        })
                      : []
                  }
                  value={field.value}
                  onChange={(selected) => {
                    field.onChange(selected); // Lưu danh sách bác sĩ được chọn
                  }}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.user_id && errors.user_id.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="6">
          <FormGroup>
            <Label>
              Danh mục:<span className="text-danger">*</span>
            </Label>
            <Controller
              control={control}
              name="category_post_id"
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className="react-select"
                  placeholder="Chọn danh mục"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: errors.category_post_id?.message
                        ? "1px solid red"
                        : "",
                    }),
                  }}
                  options={
                    categoryPost?.length > 0
                      ? categoryPost?.map((item, index) => {
                          return {
                            value: item?.id,
                            label: `${item?.name}`,
                            number: index + 1,
                          };
                        })
                      : []
                  }
                  value={field.value}
                  onChange={field.onChange}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.category_post_id && errors.category_post_id.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="12" className="section">
          <FormGroup>
            <Label>Nội dung sự kiện</Label>
            <span className="text-danger"> *</span>
            <Controller
              name="content"
              control={control}
              render={({ field }) => <Input type="textarea" {...field} />}
            />
            <small className="text-danger">
              {errors?.content && errors.content.message}
            </small>
          </FormGroup>
        </Col>

        {userData?.role === "ADMIN" && (
          <Col sm="12" className="mb-2">
            <FormGroup>
              <Label>Trạng thái:</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    placeholder="Chọn trạng thái"
                    classNamePrefix="select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors.status?.message ? "1px solid red" : "",
                      }),
                    }}
                    options={[
                      { value: "deactive", label: "Chờ phê duyệt", number: 1 },
                      { value: "active", label: "Đã phê duyệt", number: 2 },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    {...field}
                  />
                )}
              />
              <small className="text-danger">
                {errors?.status && errors.status.message}
              </small>
            </FormGroup>
          </Col>
        )}
      </Row>
      <Row className="justify-content-end ">
        <FormGroup className="d-flex mb-0 mx-1 py-3">
          <Button.Ripple
            className="mr-1"
            color="primary"
            type="submit"
            disabled={disable}
          >
            {disable ? (
              <>
                <Spinner size="sm" />
                <span className="ml-50">Vui lòng đợi...</span>
              </>
            ) : (
              "Thêm"
            )}
          </Button.Ripple>
          <Button.Ripple
            outline
            color="secondary"
            onClick={() => {
              history.push("/apps/envent/list");
            }}
          >
            Huỷ
          </Button.Ripple>
        </FormGroup>
      </Row>
    </Form>
  );
};

export default AddEnvent;
