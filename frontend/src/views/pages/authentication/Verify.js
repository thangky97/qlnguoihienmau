import React from "react";
import { CardTitle, Col, Row, Button } from "reactstrap";
import { useSkin } from "@hooks/useSkin";
import { useHistory } from "react-router-dom";

const ThankYouBuyCloud = () => {
  const [skin] = useSkin();
  const history = useHistory();

  const illustration =
      skin === "dark"
        ? "forgot-password-v2-dark.svg"
        : "forgot-password-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default;

  const handleBackToLogin = () => {
    history.push("/login");
  };

  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner m-0">
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login V2" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
          style={{ background: "#fff" }}
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <div className="">
              <CardTitle tag="h2" className="font-weight-bold mb-1">
                Xác thực tài khoản
              </CardTitle>
              <p>Tài khoản của bạn hiện đang được xác minh.</p>
              <p>Vui lòng chờ xác nhận từ quản trị viên.</p>
            </div>
            <Button
              type="submit"
              color="primary"
              block
              onClick={handleBackToLogin}
            >
              Quay lại
            </Button>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default ThankYouBuyCloud;
