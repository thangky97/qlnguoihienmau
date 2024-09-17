import { yupResolver } from "@hookform/resolvers/yup";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { isObjEmpty, selectThemeColors } from "@utils";
import { useEffect, useState } from "react";
import Select from "react-select";
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
import WorkingprocesstemplateService from "@services/WorkingprocesstemplateService";
import classnames from "classnames";
import { Controller, useController, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { SCHEMA_ADD_WORKING_PROCESS_TEMPLATE } from "../../../../../../constants/validation";
import JobfieldService from "@services/JobfieldService";
import DepartmentService from "@services/DepartmentService";
import { any, number } from "prop-types";
const statusObject = {
  ACTIVE: { value: "active", label: "Đang hoạt động", number: 1 },
  DEACTIVE: { value: "deactive", label: "Ngừng hoạt động", number: 2 },
};

const schema = yup.object(SCHEMA_ADD_WORKING_PROCESS_TEMPLATE).required();

const WorkingProcessTemplateTab = ({ initial }) => {
  const [disable, setDisable] = useState(false);
  const [department, setDepartment] = useState([]);
  const [jobfield, setJobfield] = useState([]);

  const [loading, setLoading] = useState();
  const [selectedjobfieldid, setSelectedJobFieldId] = useState();
  const [prevtasktemplates, setPrevTaskTemplates] = useState([]);


  const fetchPrevTasks = async () => {        
      setLoading(true);
      const result =
        await WorkingprocesstemplateService.getListWorkingprocesstemplate({
          filter: { jobfield_id: initial?.jobfield?.id },
          sort: { by: "sequence", type: "ASC" },
          page: { page: 1, limit: 10000000000 },
        });

      if (result.isSuccess) {
        // setPrevTaskTemplates(result?.data.list);
        setPrevTaskTemplates(result?.data.list.filter((task) => task.id !== initial?.id));
      }
      setLoading(false);        

      // Kiểm tra và gán giá trị mặc định cho sequence
      let matchedTask = prevtasktemplates.find(
        (task) => task?.id === initial?.prev_task_id
      );
      // console.log(matchedTask);
  };  

  

  // Sử dụng Nullish Coalescing để gán giá trị mặc định
  // const sequence = matchedTask?.sequence ?? "N/A"; // Nếu sequence là undefined hoặc null, gán "N/A"

  const initialValues = {
    ...initial,
    status: statusObject[initial?.status],
    department_id: {
      value: initial?.departmentld?.id,
      label: `${initial?.departmentld?.code} - ${initial?.departmentld?.name}`,
    },
    jobfield_id: {
      value: initial?.jobfield?.id,
      label: `${initial?.jobfield?.code} - ${initial?.jobfield?.name}`,
    },

    // prev_task: {
    //   value: initial?.prev_task_id || 0,
    //   label:
    //       matchedTask?.sequence && matchedTask?.departmentId?.name && matchedTask?.name
    //       ? `${matchedTask?.sequence} - Phòng: ${matchedTask?.departmentId.name} - ${matchedTask.name}`
    //       : "", // Return an empty string if any value is null or undefined
    //   number: matchedTask?.id || 0     
    // },
    
  };

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: "all",
  });
  const history = useHistory();

  const { field: jobfieldField } = useController({
    name: "jobfield_id",
    control,
    defaultValue: null, // Set default value if needed
  });

  useEffect(() => {
    (async () => {
      const { data } = await JobfieldService.getList({
        filter: {},
        sort: { by: "id", type: "desc" },
        page: { page: 1, limit: 10000000000 },
      });
      (async () => {
        const { data } = await DepartmentService.getAllDepartment({
          status: "ACTIVE",
        });
        setDepartment(data);
      })();
      setJobfield(data?.list);
    })();
    
  }, []);

  // In the mount function:
useEffect(() => {
  (async () => {
    fetchPrevTasks(); // Assuming this fetches and sets prevtasktemplates correctly

    // init selected task
    const selected_prev_task = await WorkingprocesstemplateService.detailWorkingprocesstemplate(initial?.prev_task_id);
    // const matchedTask: any; 
    console.log(selected_prev_task);
    if(selected_prev_task.isSuccess){
      const matchedTask =  selected_prev_task.data ;  

      if (matchedTask) {
        setValue("prev_task", {
          value: matchedTask.id,
          label: `${matchedTask.sequence} - Phòng: ${
            matchedTask?.departmentld?.name || "N/A"
          } - ${matchedTask?.name || "N/A"}`,
          number: matchedTask.id,
        });
      } else {
        setValue("prev_task", {
          value: 0,
          label: "",
          number: 0,
        });
      }
    }

    // const matchedTask = initial?.prev_task_id
    //   ? prevtasktemplates.find(task => task.id === initial.prev_task_id)
    //   : null;
    
  })();
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
          // setPrevTaskTemplates(result?.data.list);
          setPrevTaskTemplates(result?.data.list.filter((task) => task.id !== initial?.id));
        }
        setLoading(false);
      }
    };

    fetchPrevTasks();
  }, [selectedjobfieldid]);

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      setDisable(true);
      const result =
        await WorkingprocesstemplateService.updateWorkingprocesstemplate({
          id: initial.id,
          jobfield_id: parseInt(values.jobfield_id && values.jobfield_id.value),
          sequence: parseInt(values?.sequence),
          name: values?.name,
          department_id: parseInt(
            values.department_id && values.department_id.value
          ),
          limitdays: parseFloat(values?.limitdays),
          status: values.status.value,
          prev_task_id: parseInt(values?.prev_task.value || 0),
        });

      if (result.isSuccess) {
        setDisable(false);
        reset();

        toast.success("Sửa thành công");
        history.push("/apps/category/workingprocesstemplate/list");
      } else {
        setDisable(false);
      }
    }
  };

  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

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
              Trình tự: <span className="text-danger">*</span>
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
              Bắt đầu sau: (Thứ tự - Tên phòng - Nhiệm vụ )
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
                  options={[
                    {
                      value: 0,
                      label: "Chọn nhiệm vụ phía trước",
                      number: 0,
                    },
                    ...(prevtasktemplates || []).map((item) => ({
                      value: item.id,
                      label: item.sequence && item.departmentld?.name && item.name
                        ? `${item.sequence} - Phòng: ${item.departmentld.name} - ${item.name}`
                        : "",
                      number: item.id || 0,
                    })),
                  ]}               
                  value={
                    field.value || { value: 0, label: "Chọn nhiệm vụ phía trước", number: 0 } // Default to blank option
                  }
                  onChange={(selectedOption) => {
                    // Additional logic, if needed
                    console.log("Selected Option:", selectedOption);
                    console.log("Current Field Value:", field.value);
                    field.onChange(selectedOption); // Update the field value                                        
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
              Số ngày hoàn thành: <span className="text-danger">*</span>
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
              "Sửa"
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
export default WorkingProcessTemplateTab;
