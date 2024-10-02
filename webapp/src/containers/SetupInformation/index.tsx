import { Form } from "antd";
import { useNavigate } from "react-router";
import { ROUTES } from "@Constants/route";
import { Select } from "antd";
import { ArrowRightOutlined, CaretDownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import MetaDataService from "@Network/metaDataService";
import { toast } from "react-toastify";
import RegisterService from "@Network/registerService";
import { useTranslation } from "react-i18next";
import { ICountry, ICity } from "@Constants/models/metadata";
import { IResponse } from "@Constants/models/responseInterface";
import InputPassword from "@Components/InputPassword";
import { Toast } from "@Helper/utils";
import { ERROR_FROM_SERVER } from "@Constants/constants";
import userActions from "@Store/actions/userActions";
import { useAppDispatch } from "@Store/hooks";
import { Link } from "react-router-dom";

const SetupInformation = () => {
  const [listCountry, setListCountry] = useState<ICountry[]>([]);
  const [countryId, setCountryId] = useState(0);
  const [listCity, setListCity] = useState<ICity[]>([]);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { t: translate } = useTranslation();
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    let sessionData = window.sessionStorage.getItem("register");
    sessionData = JSON.parse(sessionData || "{}");
    sessionData = {
      // @ts-ignore
      ...sessionData,
      ...values,
      username: values.username.trim(),
      first_name: values.first_name.trim(),
      email: values.email.trim(),
      last_name: values.last_name.trim(),
      citizen_base: values.citizen_base.trim(),
      password: values.password_confirmation.trim()
    };
    RegisterService.register({
      // @ts-ignore
      ...sessionData,
      password_confirmation: undefined
    }).then(res => {
      if (res.isSuccess) {
        dispatch({
          type: userActions.USER_UPDATE,
          payload: res.data
        });
        sessionStorage.removeItem("register");
        setTimeout(() => navigate(ROUTES.HOME), 500);
      } else {
        if (res.data === ERROR_FROM_SERVER.AUTH.DUPLICATED_USER) {
          Toast("error", translate("used-account"));
          setTimeout(() => {
            navigate(ROUTES.REGISTER);
          }, 500);
        } else {
          Toast("error", translate("unknown-error"));
        }
      }
    });
  };

  const checkExistingUsername = async (username: string) => {
    const res = await RegisterService.checkExisting(
      "/user/check-existing-username",
      {
        username: username
      }
    );
    return res.data.isUsed ?? true;
  };

  const checkExistingEmail = async (email: string) => {
    try {
    const res = await RegisterService.checkExisting(
      "/user/check-existing-email",
      {
        email: email
      }
    );
    return res.data.isUsed ?? true;
  } catch (error) {
    console.error(error);
    return true; // Giả sử email đã tồn tại nếu có lỗi xảy ra trong quá trình kiểm tra
  }
  };

  useEffect(() => {
    async function init() {
      let sessionData = window.sessionStorage.getItem("register");
      sessionData = JSON.parse(sessionData || "{}");
      //@ts-ignore
      if (sessionData.country_id) {
        //@ts-ignore
        await handleGetListCity(sessionData.country_id);
      }
      if (sessionData && listCity.length > 0 && listCountry.length > 0) {
        form.setFieldsValue(sessionData);
      }
    }

    init();
  }, [window.location.href, listCountry]);

  useEffect(() => {
    MetaDataService.getListCountries().then((res: IResponse) => {
      if (res.isSuccess) {
        setListCountry(res.data.data);
      } else {
        // toast.error(translate("fetch-error", { data: translate("country").toLocaleLowerCase() }))
      }
    });
  }, [countryId]);

  async function handleGetListCity(id: number) {
    form.setFieldsValue({
      city_id: null
    });
    MetaDataService.getListCities({
      filter: {
        country_id: id
      },
      skip: 0,
      limit: undefined,
      order: {
        key: "id",
        value: "DESC"
      }
    }).then((res: IResponse) => {
      if (res.isSuccess) {
        setListCity(res.data.data);
      } else {
        // toast.error(translate("fetch-error", { data: translate("city").toLocaleLowerCase() }))
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:pb-32 w-full xl:w-[427px] sm:px-5">
      <div className="setup-title text-center">{translate("register")}</div>
      <Form
        name="setup-information"
        form={form}
        onFinish={onFinish}
        className="setup-detail"
      >
        <div className="user-setup">
        <label className="name">
            {translate("register-label")}
          </label>
        <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: translate("required")
              },
              {
                min: 6,
                message: translate("too-short", { length: 6 })
              },
              {
                pattern: /^((?! ).)*$/g,
                message: translate("invalid-username")
              },
              {
                max: 50,
                message: translate("too-long", { length: 50 })
              },
              _ => ({
                async validator(_, value) {
                  if (value) {
                    const isAccountUsed = await checkExistingUsername(value);
                    if (isAccountUsed)
                      return Promise.reject(translate("used-account"));
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <input
              className="setup-infor"
              placeholder={translate("register-placeholder")}
            />
          </Form.Item>
        </div>

        <div className="user-setup">
          <label className="name">{translate("firstname")}</label>
          <Form.Item
            name="first_name"
            rules={[
              { required: true, message: translate("required") },
              { max: 25, message: translate("too-long", { length: 25 }) },
              () => ({
                validator(_, value) {
                  if (
                    !value ||
                    (value &&
                      (value.trim() === "" ||
                        /[!@#$%^&*(),.?":{}|<>0-9]/g.test(value)))
                  ) {
                    return Promise.reject(new Error(translate("invalid")));
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <input
              className="setup-infor"
              placeholder={translate("enter-first-name")}
            />
          </Form.Item>
        </div>

        <div className="user-setup">
          <label className="name">{translate("last_name")}</label>
          <Form.Item
            name="last_name"
            rules={[
              { required: true, message: translate("required") },
              { max: 25, message: translate("too-long", { length: 25 }) },
              () => ({
                validator(_, value) {
                  if (
                    !value ||
                    (value &&
                      (value.trim() === "" ||
                        /[!@#$%^&*(),.?":{}|<>0-9]/g.test(value)))
                  ) {
                    return Promise.reject(new Error(translate("invalid")));
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <input
              className="setup-infor"
              placeholder={translate("enter-last-name")}
            />
          </Form.Item>
        </div>

        <div className="user-setup">
          <label className="name">{translate("Email")}</label>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: translate("required") },
              { max: 100, message: translate("too-long", { length: 100 }) },
              { type: "email", message: translate("invalid-email") },
              _ => ({
                async validator(_, value) {
                  if (value) {
                    const isAccountEmail = await checkExistingEmail(value);
                    if (isAccountEmail)
                      return Promise.reject(translate("email-account"));
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <input
              className="setup-infor"
              placeholder={translate("enter-email")}
            />
          </Form.Item>
        </div>

        <div className="user-setup">
          <label className="name">{translate("citizen_base")}</label>
          <Form.Item
            name="citizen_base"
            rules={[
              { required: true, message: translate("required") },
              { max: 25, message: translate("too-long", { length: 25 }) },
              () => ({
                validator(_, value) {
                  if (
                    !value ||
                    (value &&
                      (value.trim() === "" ||
                        /[!@#$%^&*(),.?":{}|<>a-z]/g.test(value)))
                  ) {
                    return Promise.reject(new Error(translate("invalid")));
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <input
              className="setup-infor"
              placeholder={translate("enter-citizen")}
            />
          </Form.Item>
        </div>

        <label className="setup-label">{translate("country")}</label>
        <Form.Item
          name="country_id"
          rules={[{ required: true, message: translate("required") }]}
        >
          <Select
            placeholder={translate("select-country")}
            suffixIcon={<CaretDownOutlined />}
            onSelect={handleGetListCity}
            className="select  select-info"
            dropdownStyle={{ backgroundColor: "white" }}
          >
            {listCountry.map(item => {
              return (
                <Select.Option
                  className="w-full"
                  key={item.id}
                  value={item.id}
                >
                  <span className="w-full">{item.name}</span>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <label className="setup-label">{translate("city")}</label>
        <Form.Item
          name="city_id"
          rules={[{ required: true, message: translate("required") }]}
        >
          <Select
            className="select"
            placeholder={translate("select-city")}
            suffixIcon={<CaretDownOutlined />}
          >
            {listCity.map(item => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <div className="user-setup">
          <label className="name">{translate("password")}</label>
          <InputPassword id="password" />
        </div>

        <div>
          <div className="user-setup">
            <label className="name">{translate("password_confirmation")}</label>
          </div>
          <InputPassword
            id="password_confirmation"
            validate={({ getFieldValue }: any) => ({
              validator(_: any, value: any) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(translate("password-dont-match"))
                );
              }
            })}
          />
        </div>

        <Form.Item>
          <div className="button-setup">
            <button className="primary-button w-full" type="submit">
              {translate("register-title")}
            </button>
          </div>
        </Form.Item>

        <div className="note">
          <br></br>
          {translate("click")} <a className="next">"{translate("register-title")}"</a>{" "}
          {translate("agree")}
          <br></br>
          <a className="transaction" href="#">
            {translate("transaction-term")}
          </a>
        </div>
        <div className="text-center mt-5 flex items-center gap-2 justify-center">
          {translate("already-had-account")}
          <Link to={ROUTES.LOGIN}>{translate("login-now")}</Link>
          <ArrowRightOutlined />
        </div>

      </Form>
    </div>
  );
};

export default SetupInformation;
