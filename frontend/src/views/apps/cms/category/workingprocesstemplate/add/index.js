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

// ** Store & Actions

import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_ADD_WORKING_PROCESS_TEMPLATE } from "../../../../../../constants/validation";
import WorkingprocesstemplateService from "../../../../../../services/WorkingprocesstemplateService";
import { useSelector } from "react-redux";
import JobfieldService from "@services/JobfieldService";
import DepartmentService from "@services/DepartmentService";

const schema = yup.object(SCHEMA_ADD_WORKING_PROCESS_TEMPLATE).required();

const AddWorkingProcessTemplate = ({ param }) => {
  const userData = useSelector((state) => state?.auth?.userData);

  // ** States
  const [jobfield, setJobfield] = useState([]);
  const [department, setDepartment] = useState([]);

  const [disable, setDisable] = useState(false);
  const history = useHistory();

  const [loading, setLoading] = useState();
  const [selectedjobfieldid, setSelectedJobFieldId] = useState();

  const [prevtasktemplates, setPrevTaskTemplates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await JobfieldService.getList({
        filter: {},
        sort: { by: "id", type: "desc" },
        page: { page: 1, limit: 10000000000 },
      });
      setJobfield(data?.list);
    };

    const fetchDepartments = async () => {
      const { data } = await DepartmentService.getAllDepartment({
        status: "ACTIVE",
      });
      setDepartment(data);
    };

    fetchData();
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchPrevTasks = async () => {
      if (selectedjobfieldid) {
        setLoading(true);
        const result =
          await WorkingprocesstemplateService.getListWorkingprocesstemplate({
            filter: { jobfield_id: selectedjobfieldid },
            sort: { by: "sequence", type: "ASC" },
            page: { page: 1, limit: 10000000000 },
          });

        if (result.isSuccess) {
          setPrevTaskTemplates(result?.data.list);
        }
        setLoading(false);
      }
    };

    fetchPrevTasks();
  }, [selectedjobfieldid]);

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      status: {
        value: "ACTIVE",
        label: "Hoạt động",
        number: 1,
      },
    },
  });

  const { field: jobfieldField } = useController({
    name: "jobfield_id",
    control,
    defaultValue: null, // Set default value if needed
  });

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      setDisable(true);
      const result =
        await WorkingprocesstemplateService.addWorkingprocesstemplate({
          name: values.name && values.name,
          jobfield_id: parseInt(values.jobfield_id && values.jobfield_id.value),
          department_id: parseInt(
            values.department_id && values.department_id.value
          ),
          sequence: parseInt(values.sequence),
          limitdays: parseFloat(values.limitdays),
          status: values.status.value,
          prev_task_id: values.prev_task
            ? parseInt(values.prev_task.value)
            : 0,
        });

      if (result.isSuccess) {
        setDisable(false);

        reset();
        toast.success("Thêm thành công");
        history.push("/apps/category/workingprocesstemplate/list");
      } else {
        setDisable(false);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col md="2" className="mb-2">
          <FormGroup>
            <Label>
              Lĩnh vực: <span className="text-danger">*</span>
            </Label>
            <Select
              theme={selectThemeColors}
              isClearable={false}
              className="react-select"
              classNamePrefix="select"
              placeholder="Chọn lĩnh vực"
              styles={{
                control: (base) => ({
                  ...base,
                  border: errors.jobfield_id ? "1px solid red" : "",
                }),
              }}
              options={
                jobfield?.length > 0
                  ? jobfield.map((item) => ({
                      value: item.id,
                      label: `${item.code} - ${item.name}`,
                    }))
                  : []
              }
              value={jobfieldField.value}
              onChange={(selectedOption) => {
                jobfieldField.onChange(selectedOption); // Cập nhật giá trị vào form
                setSelectedJobFieldId(selectedOption?.value); // Cập nhật state
              }}
            />
            <small className="text-danger">
              {errors?.jobfield_id && errors.jobfield_id.message}
            </small>
          </FormGroup>
        </Col>

        <Col md="4" className="mb-2">
          <FormGroup>
            <Label>
              Phòng ban: <span className="text-danger">*</span>
            </Label>
            <Controller
              control={control}
              name="department_id"
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Chọn phòng ban"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: errors.department_id?.message
                        ? "1px solid red"
                        : "",
                    }),
                  }}
                  options={
                    department?.length > 0
                      ? department?.map((item, index) => {
                          return {
                            value: item?.id,
                            label: `${item?.code} - ${item?.name}`,
                            number: index + 1,
                          };
                        })
                      : []
                  }
                  value={field.value}
                  // onChange={field.onChange}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.department_id && errors.department_id.message}
            </small>
          </FormGroup>
        </Col>

        {/* <Col md="4" className="mb-2">
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
                    { value: "active", label: "Hoạt động", number: 1 },
                    { value: "deactive", label: "Ngừng hoạt động", number: 2 },
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
        </Col> */}

        <Col sm="3">
          <FormGroup>
            <Label for="name">
              Tên nhiệm vụ: <span className="text-danger">*</span>
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

        <Col sm="2">
          <FormGroup>
            <Label for="sequence">
              Thứ tự: <span className="text-danger">*</span>
            </Label>
            <Controller
              name="sequence"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  className={classnames({
                    "is-invalid": errors["sequence"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.sequence && errors.sequence.message}
            </small>
          </FormGroup>
        </Col>

        <Col md="4" className="mb-2">
          <FormGroup>
            <Label>
              Bắt đầu sau nhiệm vụ: (Thứ tự - Tên phòng - Nhiệm vụ )
            </Label>
            <Controller
              control={control}
              name="prev_task"
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Chọn nhiệm vụ"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: errors.prev_task?.message ? "1px solid red" : "",
                    }),
                  }}
                  options={
                    (prevtasktemplates || [])?.length > 0
                      ? prevtasktemplates.map((item, index) => ({
                          value: item.id,
                          label: `${item.sequence} - Phòng: ${
                            item.departmentld?.name || "N/A"
                          } - ${item.name}`,
                          number: index + 1,
                        }))
                      : []
                  }
                  value={field.value}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption); // Update the field value
                    // Additional logic, if needed
                    console.log("Selected Task ID:", selectedOption?.value);
                  }}
                  {...field}
                />
              )}
            />

            <small className="text-danger">
              {errors?.prev_task && errors.prev_task.message}
            </small>
          </FormGroup>
        </Col>

        <Col sm="2">
          <FormGroup>
            <Label for="limitdays">
              Số ngày phải hoàn thành: <span className="text-danger">*</span>
            </Label>
            <Controller
              name="limitdays"
              control={control}
              render={({ field }) => (
                <Input
                  className={classnames({
                    "is-invalid": errors["limitdays"],
                  })}
                  {...field}
                />
              )}
            />
            <small className="text-danger">
              {errors?.limitdays && errors.limitdays.message}
            </small>
          </FormGroup>
        </Col>
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
              history.push("/apps/category/workingprocesstemplate/list");
            }}
          >
            Huỷ
          </Button.Ripple>
        </FormGroup>
      </Row>
    </Form>
  );
};

export default AddWorkingProcessTemplate;
