import React, { useEffect } from "react";
import { Table, Badge } from "reactstrap";
import "./workingprocesstemplate.scss"; // Import the CSS file
import "./style.scss"; // Import the CSS file
import moment from "moment";
import { Button, Card, Col, Form, Input, Label, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Fragment, useState } from "react";
import WorkingprocesstemplateService from "../../../../../../services/WorkingprocesstemplateService";
import JobfieldService from "../../../../../../services/JobfieldService";
import DepartmentService from "../../../../../../services/DepartmentService";
import { toast } from "react-toastify";

import TaskTable from "./tableTask";


import ReactPaginate from "react-paginate";
import Select from "react-select";
import { selectThemeColors } from "@utils";

import { checkauth } from "../../../../../../utility/Utils";
import { MANAGEMENT } from "../../../../../../constants/app";


const WorkingProcessTemplateList = ({}) => {
const [tableData, setTableData] = React.useState([]);
const [loading, setLoading] = useState();

const [data, setData] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [dataJob, setDataJob] = React.useState([]);
const [total, setTotal] = useState();

const [departmentData, setListDepartment] = useState();
const [selectedDepartment, setSelectedDepartment] = useState();
const [jobfieldData, setListJobfield] = useState();
const [selectedJobfield, setSelectedJobfield] = useState();


const [params, setParams] = useState({
    page: {
        page: 1,
        limit: 25,
      },
    filter: {
    },
    sort: {
        by: "sequence",
        type: "ASC",
    },
});


const {
    handleSubmit,
    control,
} = useForm();

const userData = JSON.parse(localStorage.getItem("userData"));

const auth = userData?.authorities.find(
    (item) => item.management === MANAGEMENT.WORKINGPROCESSTEMPLATE
  )?.action;
  const role = userData?.role;

  const isAuthUpdate = checkauth(role, auth, "U");
  const isAuthDelete = checkauth(role, auth, "D");
  const isAuth = checkauth(role, auth, "E");
  const isAuthimport = checkauth(role, auth, "I");
  const isAuthCreate = checkauth(role, auth, "C");



useEffect(() => {
    (async () => {
    const { data } = await JobfieldService.getList({
        filter: { status: "ACTIVE" },
        sort: { by: "id", type: "desc" },
        page: { page: 1, limit: 10000000000 },
    });
    setListJobfield(data.list);
    })();
    (async () => {
    const { data } = await DepartmentService.getAllDepartment({
        status: "ACTIVE",
    });
    setListDepartment(data);
    })();
}, []);




const onSubmit = (data) => {
    setParams((prev) => ({
        ...prev,
        filter: {
            jobfield_id: data?.jobfield_id?.value || undefined,
            department_id: data?.department_id?.value || undefined,
        },
        page: {
            ...prev.page,
            page: 1, // Reset to first page
        },
    }));
    setCurrentPage(1); // Reset current page
};

const handleGetlist = async () => {
    setLoading(true);
    const result = await WorkingprocesstemplateService.getListWorkingprocesstemplate(params);
    if (result.isSuccess) {
        const sortedList = result.data.list.sort((a, b) => {
            if (a.sequence !== b.sequence) return a.sequence - b.sequence;
            if (a.departmentId !== b.departmentId) return a.departmentId - b.departmentId;
            return a.id - b.id;
        });
        setData(sortedList);
    } else {
        // Handle error here (e.g., set an error message)
    }
    setLoading(false);
};

useEffect(() => {
    handleGetlist(); // Fetch data whenever `params` changes
}, [params]); // Dependencies: Re-run effect when `params` changes




useEffect(() => {
    console.log(data);

    if (data) {
        if(selectedJobfield!==undefined){
            const processedData = processTasks(data);
            setTableData(processedData);
        }
    }
}, [data]);


function processTasks(data) 
{
    const departments = {};
    // Loop through all items in the data
    data?.forEach((item) => {
    const departmentName = item?.departmentld?.name;
    // Ensure departmentName exists
    if (departmentName) {
        // Create department if it doesn't exist
        if (!departments[departmentName]) {
        departments[departmentName] = [];
        }
        // Add task to the corresponding department
        departments[departmentName].push({
        id: item?.id,
        content: item?.name,
        deadline: item?.limitdays,
        sequence: item?.sequence,
        prev_task_id: item?.prev_task_id,
        });
    }
    });

    // Convert the object into an array
    return Object.keys(departments).map((department) => ({
        department,
        tasks: departments[department],
    }));
}



const handleDeleteWorkingprocesstemplate = async (id) => {
    const check = window.confirm("Bạn có chắc chắn xoá không?");
    if (check) {
      await WorkingprocesstemplateService.deleteWorkingprocesstemplate(id).then(
        (res) => {
          if (res?.isSuccess) {
            toast.success("Xoá quy trình công việc mẫu thành công");
            handleGetlist();
          }
        }
      );
    }
  };


const maxTasks = Math.max(...tableData.map((dept) => dept.tasks.length));
console.log(tableData);
 // Sort tasks within each department by sequence
 tableData.forEach(dept => {
    dept.tasks.sort((a, b) => a.sequence - b.sequence);
  });

   return (
   <>
   {/* headersearch */}
   <div>
    <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mx-0 my-1 align-items-center">
            <Col lg="3" md="6" xs="12" className="mb-2">
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
            <Col lg="3" md="6" xs="12" className="mb-2">                
                <Controller
                    control={control}
                    name="department_id"
                    render={({ field }) => (
                        <Select
                            theme={selectThemeColors}
                            isClearable={false}
                            className="react-select"
                            placeholder="Phòng ban"
                            classNamePrefix="select"
                            options={
                                departmentData?.length > 0 && [
                                    {
                                        value: null,
                                        label: "Chọn phòng ban",
                                        number: 0,
                                    },
                                    ...departmentData?.map((item, index) => {
                                        return {
                                            value: item?.id,
                                            label: `${item?.code} - ${item?.name}`,
                                            number: index + 1,
                                        };
                                    }),
                                ]
                            }
                            {...field}
                            value={selectedDepartment}
                            onChange={(e) => {
                                field.onChange(e);
                                setSelectedDepartment(e);
                            }}
                        />
                    )}
                />
            </Col>
            
            <Col lg="2" md="3" xs="6" className="mb-2">  
                <Button.Ripple color="primary" type="submit">
                    Xem Quy trình công việc
                </Button.Ripple>
            </Col>
            <Col lg="2" md="3" xs="6" className="mb-2">  
                {isAuthCreate && (
                    <Link to="/apps/category/workingprocesstemplate/add">
                        <Button.Ripple color="secondary">
                            Tạo quy trình cv mẫu
                        </Button.Ripple>
                    </Link>
                )}
            </Col>
        </Row>
    </Form>
</div>


<TaskTable
    tableData={tableData}
    isAuthUpdate={isAuthUpdate}
    isAuthDelete={isAuthDelete}
    userData={userData}
    handleDeleteWorkingprocesstemplate={handleDeleteWorkingprocesstemplate}
  />

</>

  );
};

export default WorkingProcessTemplateList;
