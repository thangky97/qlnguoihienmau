import React from 'react';
import { Table, Badge } from 'reactstrap';
import "./TaskAssignment.scss"; // Import the CSS file

const DetailTaskAssignment = ({ tableData }) => {
  // Get all unique sequence numbers across all departments
  const allSequences = [...new Set(tableData.flatMap(dept => dept.tasks.map(task => task.sequence)))].sort((a, b) => a - b);

  return (
    <div style={{ overflowX: "auto" }}>
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
                {/* <th>Sequence</th> */}
                <th className="content-column">Nội dung</th>
                <th className="deadline-column">Deadline</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {allSequences.map((sequence, sequenceIndex) => (
            <tr key={sequenceIndex}>
              {tableData.map((dept, deptIndex) => {
                const task = dept.tasks.find(task => task.sequence === sequence);
                return (
                  <React.Fragment key={deptIndex}>
                    {/* <td>{task?.sequence || ''}</td> */}
                    <td
                      className="content-cell"
                      style={{
                        backgroundColor:
                          task?.status === "delay" ? "#F4CCCC" : "transparent",
                      }}
                    >
                      {task?.content || ''}
                      <div style={{ fontSize: "smaller", fontStyle: "italic" }}>
                        {task?.note || ''}
                      </div>
                      {task?.processingStatus && (
                        <div style={{ fontSize: "smaller", textAlign: "center" }}>
                          <Badge
                            className={getBadgeClass(task.processingStatus)}
                            style={{ display: "block", marginTop: "5px" }}
                          >
                            {task.processingStatus}
                          </Badge>
                        </div>
                      )}
                    </td>
                    <td
                      className="deadline-cell"
                      style={{
                        backgroundColor:
                          task?.status === "Quá hạn" ? "#F4CCCC" : "transparent",
                      }}
                    >
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

// Helper function to get the badge class based on the processing status
const getBadgeClass = (processingStatus) => {
  switch (processingStatus) {
    case 'Đã hoàn thành':
      return 'custom-badge-success';
    case 'Đang xử lý':
      return 'badge-warning';
    case 'Chưa xử lý':
      return 'badge-danger';
    default:
      return 'badge-secondary';
  }
};

export default DetailTaskAssignment;
