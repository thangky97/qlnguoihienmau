import { Link, useLocation } from "react-router-dom";
import { Card, CardBody, CardHeader, Row, Col, Button } from "reactstrap";
const TemplateResetPassword = () => {
  const {state} = useLocation()
  return (
    <>
      {/* <h2 className="text-center">
        salesystem
      </h2> */}
      <Row
        className="justify-content-center"
        style={{ height: "100vh", background: "#e0e0e0" }}
      >
        <Col sm={5} className="justify-content-center my-5">
          <Card style={{ background: "#ffffff" }} className="p-3">
            <CardHeader>
              <h2 style={{ fontWeight: 800, color: "#000000" }}>
                <span style={{color:"green"}}>Đăng ký thành công</span>
              </h2>
            </CardHeader>
            <CardBody>
              <tr>
                <td>
                  <table>
                    <tbody>
                      <tr></tr>
                      <tr>
                        <td>
                          <table style={{ color: "#626262" }}>
                            <tbody>
                              <tr>
                                <td>
                                  <p>
                                   Đăng ký thành công với <span style={{ fontWeight: 800 }}>{state?.email}</span>
                                  </p>
                                  <p>
                                    Vui lòng kiểm tra email và xác nhận email
                                  </p>
                                  <table>
                                    <tbody>
                                      <tr></tr>
                                    </tbody>
                                  </table>
                                  <p>
                                    Nếu bạn không có ý định hủy kích hoạt tài
                                    khoản của mình hoặc cần sự trợ giúp của
                                    chúng tôi để giữ tài khoản, vui lòng liên hệ
                                    với chúng tôi tại
                                    <a href="mailto: salesystem.me@gmail.com">
                                      {" "}
                                      salesystem.me@gmail.com
                                    </a>
                                    
                                  </p>
                                  <table>
                                    <tbody>
                                      <tr>
                                        <td>
                                          <div>‌</div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <p>
                                    Không chắc tại sao bạn lại nhận được email
                                    này?
                                    <br></br>
                                    <a href="mailto: salesystem.me@gmail.com">
                                      {" "}
                                      Xin vui lòng cho chúng tôi biết.
                                    </a>
                                    .
                                  </p>
                                  <p>
                                    Cảm ơn, <br></br>salesystem
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td></td>
                              </tr>
                              <tr>
                                <td></td>
                              </tr>
                            </tbody>
                            <p className="text-center mt-2">
              <Link to="/login">
               <Button color="primary">
               Quay lại đăng nhập
               </Button>
              </Link>
            </p>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default TemplateResetPassword;
