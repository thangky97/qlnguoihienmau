import ExtensionsHeader from "@components/extensions-header";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { Fragment, useState } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody, Col, Row, TabContent, TabPane } from "reactstrap";
import PasswordTabContent from "./PasswordTabContent";
import InfoTabContent from "./InfoTabContent";
import Tabs from "./Tabs";
import { ROLES_APP } from "../../../constants/app";
import { getUserData } from "../../../utility/Utils";
import { useSelector } from "react-redux";

const AccountSettings = (intl) => {
  const [activeTab, setActiveTab] = useState("3");
  const userData = useSelector((state)=>state?.auth?.userData)

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Fragment>
      <ExtensionsHeader title="Cài đặt" />

      <Row>
        <Col className="mb-2 mb-md-0" md="3">
          <Tabs activeTab={activeTab} toggleTab={toggleTab} />
        </Col>
        <Col md="9">
          <Card>
            <CardBody>
              <TabContent activeTab={activeTab}>
                {userData?.role != ROLES_APP.CUSTOMER && (
                  <TabPane tabId="2">
                    <PasswordTabContent />
                  </TabPane>
                )}

                <TabPane tabId="3">
                  <InfoTabContent />
                </TabPane>
                {/* <TabPane tabId='1'>
                    <GeneralTabContent data={data.general} />
                  </TabPane>
                 
                
                {/* <TabPane tabId='4'>
                    <SocialTabContent data={data.social} />
                  </TabPane>
                  <TabPane tabId='5'>
                    <NotificationsTabContent data={data.notification} />
                  </TabPane> */}
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default injectIntl(AccountSettings);
