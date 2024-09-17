// import React from 'react';
// import { Table, Badge } from 'reactstrap';
// import { Link } from 'react-router-dom';


// const TaskTable = ({ tableData, isAuthUpdate, isAuthDelete, userData, handleDeleteWorkingprocesstemplate }) => {
//   // Find the maximum number of tasks for proper row rendering
//   const maxTasks = Math.max(...tableData.map(dept => dept.tasks.length), 0);

//   return (
//     <div style={{ overflowX: 'auto' }}>
//       <Table bordered responsive>
//         <thead>
//           <tr>
//             {tableData.map((dept, index) => (
//               <th key={index} className="department-column" colSpan={2}>
//                 {dept.department}
//               </th>
//             ))}
//           </tr>
//           <tr>
//             {tableData.map((dept, deptIndex) => (
//               <React.Fragment key={deptIndex}>
//                 <th className="content-column">Nội dung</th>
//                 <th className="deadline-column">Deadline</th>
//               </React.Fragment>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {Array.from({ length: maxTasks }).map((_, taskIndex) => (
//             <tr key={taskIndex}>
//               {tableData.map((dept, deptIndex) => {
//                 const task = dept.tasks[taskIndex];
//                 return (
//                   <React.Fragment key={deptIndex}>
//                     <td className="content-cell">
//                       {task?.content}
//                       <div className="badge-container">
//                         {isAuthUpdate && task?.id && (
//                           <Badge color="primary" className="badge">
//                             <Link to={`/apps/category/workingprocesstemplate/edit/${task.id}`}>
//                               Cập nhật
//                             </Link>
//                           </Badge>
//                         )}
//                         &nbsp;
//                         {isAuthDelete && task?.id && userData?.role === 'ADMIN' && (
//                           <Badge
//                             style={{ width: '80px', display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}
//                             onClick={() => handleDeleteWorkingprocesstemplate(task.id)}
//                             color="danger"
//                             className="badge"
//                           >
//                             Xoá
//                           </Badge>
//                         )}
//                       </div>
//                     </td>
//                     <td className="deadline-cell">
//                       {task?.deadline}
//                     </td>
//                   </React.Fragment>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };

// export default TaskTable;

import React from 'react';
import { Table, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import './TaskTable.scss'; // Assuming you are using a separate CSS file
import { ROLES_APP } from '../../../../../../constants/app';

const TaskTable = ({ tableData, isAuthUpdate, isAuthDelete, userData, handleDeleteWorkingprocesstemplate }) => {
  // Create a mapping of sequences to tasks
  const tasksBySequence = {};

  tableData.forEach((dept) => {
    dept.tasks.forEach((task) => {
      if (!tasksBySequence[task.sequence]) {
        tasksBySequence[task.sequence] = [];
      }
      tasksBySequence[task.sequence].push({
        ...task,
        department: dept.department,
      });
    });
  });

  const sequences = Object.keys(tasksBySequence).sort((a, b) => a - b);

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table bordered responsive>
        <thead>
          <tr>
            {tableData.map((dept, index) => (
              <th key={index} className="department-column" colSpan={2}>
                {dept.department}
              </th>
            ))}
          </tr>
          <tr>
            {tableData.map((dept, deptIndex) => (
              <React.Fragment key={deptIndex}>
                <th className="content-column">Nội dung</th>
                <th className="deadline-column">Deadline</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {sequences.map((sequence) => (
            <tr key={sequence}>
              {tableData.map((dept, deptIndex) => {
                const task = tasksBySequence[sequence]?.find((task) => task.department === dept.department);
                return (
                  <React.Fragment key={deptIndex}>
                    <td className="content-cell">
                      <div className="task-content">
                        {task?.content || ''}
                        <div className="badge-container">
                          {isAuthUpdate && task?.id && (
                            <Badge color="primary" className="badge">
                              <Link to={`/apps/category/workingprocesstemplate/edit/${task.id}`}>
                                Cập nhật
                              </Link>
                            </Badge>
                          )}
                          &nbsp;
                          {(isAuthDelete || userData?.role === ROLES_APP.COMPANYADMIN || userData?.role === ROLES_APP.ADMIN) && task?.id && (
                            <Badge
                              style={{ width: '80px', display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}
                              onClick={() => handleDeleteWorkingprocesstemplate(task.id)}
                              color="danger"
                              className="badge"
                            >
                              Xoá
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="deadline-cell">
                      {task?.deadline || ''}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TaskTable;


