import { useState, useEffect } from "react";
import { TabContent, Nav, NavLink, TabPane, NavItem } from "reactstrap";
import { Route, useLocation, useHistory } from "react-router-dom";
import Job from "./job";
import Task from "./task";
import MyJob from "./my-job";

const JobList = () => {
  const [activeTab, setActiveTab] = useState("2");
  const [selectedId, setSelectedId] = useState(null);
  const location = useLocation();
  const history = useHistory();
  const [prevActiveTab, setPrevActiveTab] = useState("2");

  const toggle = (tab, id = null) => {
    if (activeTab !== tab) {
      setPrevActiveTab(activeTab); // Lưu lại tab trước đó
      setActiveTab(tab);
      if (id !== null) {
        setSelectedId(id);
      }
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryId = searchParams.get("id");

    if (queryId) {
      setActiveTab("1"); // Chuyển sang tab Task khi có ID
      setSelectedId(queryId);
    }
  }, [location.search]);

  useEffect(() => {
    // Xóa query id chỉ khi thoát khỏi tab Task
    if (prevActiveTab === "1" && activeTab !== "1") {
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete("id"); // Xóa id khỏi query
      history.replace({ search: searchParams.toString() }); // Cập nhật URL
    }
    setPrevActiveTab(activeTab); // Cập nhật tab trước đó
  }, [activeTab, history, location.search, prevActiveTab]);

  return (
    <>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={activeTab === "2" ? "active" : ""}
            onClick={() => toggle("2")}
          >
            Nhiệm vụ của phòng
          </NavLink>
        </NavItem>
        
        <NavItem>
          <NavLink
            className={activeTab === "1" ? "active" : ""}
            onClick={() => toggle("1")}
          >
            Tất cả các nhiệm vụ
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            className={activeTab === "0" ? "active" : ""}
            onClick={() => toggle("0")}
          >
            Công việc
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="0">
          <Route render={() => <Job toggleTab={toggle} />} />
        </TabPane>
        <TabPane tabId="1">
          <Route render={() => <Task id={selectedId} />} />
        </TabPane>
        <TabPane tabId="2">
          <Route component={MyJob} />
        </TabPane>
      </TabContent>
    </>
  );
};

export default JobList;
