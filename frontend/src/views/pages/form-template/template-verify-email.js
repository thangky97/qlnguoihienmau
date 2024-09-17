import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card, CardBody, CardHeader, Row, Col, Button } from "reactstrap";
import { isUserLoggedIn } from "@utils";
import { useSkin } from "@hooks/useSkin";
import { ChevronLeft } from "react-feather";
import { Link, Redirect, useHistory } from "react-router-dom";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import Service from "@services/request";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SCHEMA_FORGOT_PASSWORD } from "../../../constants/validation";
import { getHomeRouteForLoggedInUser, isObjEmpty } from "@utils";
import { FORGOT_PASSWORD, VERIFY_EMAIL } from "../../../constants/api";

const TemplateResetPassword = () => {
  const { search } = useLocation();

  const sp = new URLSearchParams(search);


  const [isAuth,setIsAuth]=useState();
  useEffect(()=>{
    Service.send({
      method: VERIFY_EMAIL.method,
      path: VERIFY_EMAIL.path,
      data:{
        token:sp.get("token")
      },
    })
      .then((result) => {
        setIsAuth(true)
      })
      .catch(()=>{
        setIsAuth(false)
      })
  },[])
  return (
    <>
      
      <Row
        className="justify-content-center"
        style={{ height: "100vh", background: "#e0e0e0" }}
      >
        <Col sm={5} className="justify-content-center my-5">
          <Card style={{ background: "#ffffff" }} className="p-3">
            <CardHeader>
              <h2 style={{ fontWeight: 800, color: "#000000" }}>
                <span style={!isAuth?{color:"red"}:{color:"green"}}>{isAuth?"Xác thực email thành công":"Xác thực email thất bại"}</span>
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
                                    Cảm ơn, <br></br>FUSAMATE
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
