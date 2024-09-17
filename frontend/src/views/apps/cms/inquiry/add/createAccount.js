import { REGEX_PHONE, REGEX_NOT_SPACE, REGEX_EMAIL } from "@constants/regex";
import { useEffect, useState } from "react";
import { Button, Col, FormGroup, Input, Label, Row, Spinner } from "reactstrap";
import { useSelector } from "react-redux";
import classnames from "classnames";

const FormCreateAccount = ({
  getInfoCreated,
  CustomerService,
  setIsCreateAccount,
}) => {
  const [disable, setDisable] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const userData = useSelector((state) => state?.auth?.userData);

  const [account, setAccount] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    company_id: null,
    branch_id: null,
    address: "",
    description: "",
  });
  const [accountErrors, setAccountErrors] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const onSubmit = async (e) => {
    setIsSubmited(true);
    e.preventDefault();
    let check = true;
    Object.keys(accountErrors).map((item) => {
      if (accountErrors[item] != "") {
        check = false;
      }
    });
    if (!check) return;

    const result = await CustomerService.addCustomer(account);
    if (result.isSuccess) {
      setDisable(false);
      setAccount({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
      setIsCreateAccount(false);
      getInfoCreated(result?.data);
    } else {
      setDisable(false);
    }
  };

  useEffect(() => {
    setAccountErrors((prev) => {
      const errors = {
        ...prev,
        name:
          account?.name?.trim() === "" ? "Vui lòng nhập tên khách hàng" : "",
        phone: "",
        email: "",
        address: "",
      };

      if (account?.phone?.trim() === "") {
        errors.phone = "Vui lòng nhập số điện thoại";
      } else if (!REGEX_PHONE.test(account?.phone)) {
        errors.phone = "Số điện thoại không hợp lệ";
      }

      // if (account?.email?.trim() === "") {
      //   errors.email = "Vui lòng nhập email";
      // } else if (!REGEX_EMAIL.test(account?.email)) {
      //   errors.email = "Email không hợp lệ";
      // }

      return errors;
    });
  }, [account]);

  return (
    <div>
      <Row>
        <Col sm="2">
          <FormGroup>
            <Label for="name">
              Tên <span className="text-danger">*</span>
            </Label>
            <Input
              className={classnames({
                "is-invalid": isSubmited && accountErrors?.name,
              })}
              type="text"
              onChange={(e) =>
                setAccount((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
            />
            <small className="text-danger">
              {isSubmited && accountErrors?.name}
            </small>
          </FormGroup>
        </Col>
        <Col sm="2">
          <FormGroup>
            <Label for="name">
              Số điện thoại <span className="text-danger">*</span>
            </Label>
            <Input
              className={classnames({
                "is-invalid": isSubmited && accountErrors?.phone,
              })}
              type="text"
              onChange={(e) =>
                setAccount((prev) => {
                  return { ...prev, phone: e.target.value };
                })
              }
            />
            <small className="text-danger">
              {isSubmited && accountErrors?.phone}
            </small>
          </FormGroup>
        </Col>
        <Col sm="2">
          <FormGroup>
            <Label for="name">Email</Label>
            <Input
              className={classnames({
                "is-invalid": isSubmited && accountErrors?.email,
              })}
              type="text"
              onChange={(e) =>
                setAccount((prev) => {
                  e.preventDefault();
                  return { ...prev, email: e.target.value };
                })
              }
            />
            <small className="text-danger">
              {isSubmited && accountErrors?.email}
            </small>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <Label for="name">Địa chỉ</Label>
            <Input
              className={classnames({
                "is-invalid": isSubmited && accountErrors?.address,
              })}
              type="text"
              onChange={(e) =>
                setAccount((prev) => {
                  e.preventDefault();
                  return { ...prev, address: e.target.value };
                })
              }
            />
            <small className="text-danger">
              {isSubmited && accountErrors?.address}
            </small>
          </FormGroup>
        </Col>
        <Col sm="2">
          <FormGroup style={{ marginTop: "10px" }}>
            <Button.Ripple
              outline
              color="primary"
              type="submit"
              disabled={disable}
              className="mt-1"
              onClick={onSubmit}
            >
              {disable ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-50">Vui lòng đợi...</span>
                </>
              ) : (
                "Tạo tài khoản"
              )}
            </Button.Ripple>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default FormCreateAccount;
