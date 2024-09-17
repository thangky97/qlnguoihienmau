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
                <span style={{color:"green"}}>Đổi mật khẩu thành công</span>
              </h2>
            </CardHeader>
            <CardBody>
                
                          <table style={{ color: "#626262" }}>
                            <tbody>
                              <tr>
                                <td>
                             
                              
                                  <p>
                                   Nếu bạn có vấn đề gì 
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
                            
                          </table>
                          <p className="text-center mt-2">
              <Link to="/login">
               <Button color="primary">
               Quay lại đăng nhập
               </Button>
              </Link>
            </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default TemplateResetPassword;
