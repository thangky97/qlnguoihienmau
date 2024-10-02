import { CaretDownOutlined } from "@ant-design/icons";
import { ERROR_FROM_SERVER } from "@Constants/constants";
import { IResponse } from "@Constants/models/responseInterface";
import Helpers, { Toast } from "@Helper/utils";
import MetadataService from "@Network/metaDataService";
import UserService from "@Network/userService";
import userActions from "@Store/actions/userActions";
import { useAppDispatch, useAppSelector } from "@Store/hooks";
import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import ChangePasswordModal from "./ChangePasswordModal";
export function formatPhone(data: any, code: any) {
  if (data?.trim() == "") {
    return " ";
  }
  if (data?.charAt(0) == 0) {
    return code + "" + data.substring(1, data.length);
  }
  return code + "" + data;
}
export default function ProfileSeciton() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const { t: translation, i18n } = useTranslation();
  const [listCountries, setListCountries] = useState([]);
  const [listCities, setListCities] = useState([]);
  const [form] = Form.useForm();
  const [formChangePassword] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<Number>();

  async function uploadImage(data: { imageData: any; imageFormat: string }) {
    return MetadataService.uploadFile(data).then((res: IResponse) => {
      if (res.isSuccess) {
        return res.data;
      } else {
        Toast("error", translation("unknown-error"));
        return;
      }
    });
  }

  const onChangeAvatar = (files: any) => {
    const file = files[0];
    if (!file) return;
    if (file.size > 10485760) {
      Toast("error", translation("file_notice_1"));
      return;
    }

    Helpers.convertFileToBase64(file).then(async (imageBase64: any) => {
      if (!imageBase64) return;

      const newData = imageBase64.replace(/,/gi, "").split("base64");
      if (newData[1]) {
        const url = await uploadImage({
          imageData: newData[1],
          imageFormat: file.type.split("/")[1]
        });

        if (url) {
          uploadUrl(url);
        }
      }
    });
  };

  function uploadUrl(url: string) {
    UserService.updateProfile({
      avatar: url
    }).then((res: IResponse) => {
      if (res.isSuccess) {
        dispatch({
          type: userActions.USER_UPDATE,
          payload: {
            avatar: url
          }
        });
      } else {
        Toast("error", "unknown-error");
      }
    });
  }

  async function getListCountries() {
    await MetadataService.getListCountries().then((res: IResponse) => {
      if (res.isSuccess) {
        setListCountries(res.data.data);
        let country_id = (() => {
          if (res.data.data) {
            let item = res.data.data.find(
              (item: any) => item.id === user.country_id
            ) || { name: "" };
            return item?.name || "";
          }
          return;
        })();
        form.setFieldsValue({
          country_id: country_id
        });
      }
    });
  }

  async function getListCities(id: number) {
    await MetadataService.getListCities({
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
        setListCities(res.data.data);
        let city_id = (() => {
          if (res.data.data) {
            let item = res.data.data.find(
              (item: any) => item.id === user.city_id
            ) || { name: "" };
            return item?.name || "";
          }
          return;
        })();
        form.setFieldsValue({
          city_id: city_id
        });
      }
    });
  }

  useEffect(() => {
    async function init() {
      await getListCountries();
      if (user.country_id) {
        await getListCities(user.country_id);
      }
    }

    init().then(() => {
      let initObj = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        citizen_base: user.citizen_base
      };

      if (user.phone) {
        // @ts-ignore
        // initObj.phone = user.phone.slice(1, user.phone.length)
        // @ts-ignore
        // initObj.prefix = user.phone.slice(0, 2)
        setPhoneNumber(user?.phone);
        form.setFieldsValue({
          phone: user?.phone
        });
      }
      form.setFieldsValue(initObj);
    });
  }, []);

  async function handleChangePassword(values: any) {
    if (user.username.includes("GOOGLE")) {
      Toast("success", translation("change-password-success"));
      setIsOpenModal(false);
      return;
    }
    UserService.changePassowrd({
      old_password: values.old_password,
      new_password: values.password
    }).then((res: IResponse) => {
      if (res.isSuccess) {
        Toast("success", translation("change-password-success"));
        formChangePassword.resetFields();
        setIsOpenModal(false);
      } else {
        if (res.error === ERROR_FROM_SERVER.AUTH.WRONG_PASSWORD) {
          Toast("error", translation("wrong-password"));
        } else {
          Toast("error", translation("unknown-error"));
        }
      }
    });
  }

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        defaultValue={user?.phone?.slice(0, 2)}
        suffixIcon={<CaretDownOutlined />}
      >
        {listCountries.map((item: any) => {
          return (
            <Select.Option key={item.phone_code}>
              +{item.phone_code}
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
  const onUpdateProfile = async (data: any) => {
    // if (data.prefix && data.phone) {
    //   data.phone = data.prefix + data.phone
    //   delete data.prefix
    // }
    data.phone = phoneNumber;
    if (data.city_id && parseInt(data.city_id) != data.city_id) {
      const city: any = listCities.find((item: any) => {
        return item.name == data.city_id;
      });
      data.city_id = city.id;
    } else {
      data.city_id = parseInt(data.city_id);
    }
    if (data.country_id && parseInt(data.country_id) != data.country_id) {
      const country: any = listCountries.find((item: any) => {
        return item.name == data.country_id;
      });
      data.country_id = country.id;
    } else {
      data.country_id = parseInt(data.country_id);
    }
    UserService.updateProfile({ ...data, city_id: selectedCity }).then(
      (res: IResponse) => {
        if (res.isSuccess) {
          dispatch({
            type: userActions.USER_UPDATE,
            payload: res.data
          });
          Toast("success", translation("success"));
        } else {
          if (res.error === ERROR_FROM_SERVER.AUTH.DUPLICATED_USER_EMAIL) {
            Toast("error", translation("used-email"));
          } else if (
            res.error === ERROR_FROM_SERVER.AUTH.DUPLICATED_USER_PHONE
          ) {
            Toast("error", translation("used-phone"));
          } else {
            Toast("error", translation("unknown-error"));
          }
        }
      }
    );
  };

  function handleonBlurFname() {
    let x1 = document.getElementById("fname") as HTMLInputElement;
    if (x1 && x1.value) {
      x1.value = x1.value.toString().trim();
    }
  }
  function handleonBlurLname() {
    let x2 = document.getElementById("lname") as HTMLInputElement;
    if (x2 && x2.value) {
      x2.value = x2.value.toString().trim();
    }
  }
  const handleLanguageChanged = () => {
    form.validateFields();
  };

  useEffect(() => {
    // form.resetFields()
    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [handleLanguageChanged]);
  return (
    <div className="profile-section profile-info w-full 2xl:w-3/5 xl:w-4/5 m-auto">
      <div className="border-solid border border-[#ccc] p-2 md:p-6 flex flex-col gap-3.5 md:flex-row">
        <div className="flex justify-center md:justify-start md:w-auto">
          <img
            className="rounded-full"
            src={
              user?.avatar?.trim() || require("@Assets/images/defaultAvt.png")
            }
            style={{ height: "84px", width: "84px" }}
          />
        </div>
        <div className="flex items-start flex-col py-2 gap-y-2.5 md:py-0">
          <div className="extentions mb-auto w-full">
            <button className="primary-button mb-3 w-full md:w-auto">
              <label className="cursor-pointer" htmlFor="user-avatar">
                {translation("upload-profile-picture")}
              </label>
              <input
                hidden
                type="file"
                accept="image/*"
                id="user-avatar"
                onChange={e => {
                  onChangeAvatar(e?.target?.files);
                }}
              />
            </button>
            <button
              onClick={() => {
                uploadUrl(" ");
                // message.error(translation('file-too-large'))
              }}
              className="danger-button w-full ml-0 md:ml-4 md:w-auto"
            >
              {translation("delete")}
            </button>
          </div>
          <div>{translation("upload-notication-picture")}</div>
        </div>
      </div>

      <div className="form-info border-solid border border-[#ccc] p-6 mt-6">
        <Form
          form={form}
          name="profile"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          onFinish={onUpdateProfile}
        >
          <Form.Item
            label={translation("firstname")}
            name="first_name"
            rules={[
              { required: true, message: translation("required") },
              { max: 25, message: translation("too-long", { length: 25 }) },
              () => ({
                validator(_, value) {
                  if (
                    !value ||
                    (value &&
                      (value.trim() === "" ||
                        /[!@#$%^&*(),.?":{}|<>0-9]/g.test(value)))
                  ) {
                    return Promise.reject(new Error(translation("invalid")));
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <input
              id="fname"
              value="text"
              className="c2i-input"
              placeholder={translation("enter-first-name")}
            />
          </Form.Item>

          <Form.Item
            label={translation("last_name")}
            name="last_name"
            rules={[
              { required: true, message: translation("required") },
              { max: 25, message: translation("too-long", { length: 25 }) },
              () => ({
                validator(_, value) {
                  if (
                    !value ||
                    (value &&
                      (value.trim() === "" ||
                        /[!@#$%^&*(),.?":{}|<>0-9]/g.test(value)))
                  ) {
                    return Promise.reject(new Error(translation("invalid")));
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <input
              id="lname"
              value="text"
              className="c2i-input"
              placeholder={translation("enter-last-name")}
            />
          </Form.Item>

          <Form.Item
            label={translation("citizen_base")}
            name="citizen_base"
            rules={[
              { max: 25, message: translation("too-long", { length: 25 }) },
              () => ({
                validator(_, value) {
                  if (
                    !value ||
                    (value &&
                      (value.trim() === "" ||
                        /[!@#$%^&*(),.?":{}|<>a-zA-Z]/g.test(value)))
                  ) {
                    return Promise.reject(new Error(translation("invalid")));
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <input
              id="phone"
              // value="text"
              className="c2i-input"
              type="number"
              placeholder={translation("citizen_base")}
            />
          </Form.Item>

          <Form.Item
            label={translation("email")}
            name="email"
            rules={[
              {
                type: "email",
                message: translation("invalid-email")
              },
              {
                required: true,
                message: translation("required")
              },
              {
                max: 125,
                message: translation("too-long", { length: 125 })
              }
            ]}
          >
            <input
              className="c2i-input"
              placeholder={translation("enter-email")}
            />
          </Form.Item>
          <Form.Item
            label={translation("phone")}
            name="phone"
            rules={[
              { required: true, message: translation("required") },
              {
                max: 25,
                message: translation("too-long", { length: 25 })
              },
              () => ({
                validator(_, value) {
                  if (phoneNumber && isValidPhoneNumber(phoneNumber) == true) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(translation("invalid")));
                }
              })
            ]}
          >
            <div className="">
              <PhoneInput
                placeholder={translation("Enter phone number")}
                value={phoneNumber}
                onChange={setPhoneNumber}
                defaultCountry="VN"
                className="phone-input-profile"
              />
            </div>
          </Form.Item>
          <Form.Item
            label={translation("country")}
            name="country_id"
            rules={[
              {
                required: true,
                message: translation("required")
              }
            ]}
          >
            <Select
              placeholder={translation("select-country")}
              suffixIcon={<CaretDownOutlined />}
              onChange={val => {
                getListCities(parseInt(val));
              }}
              className="bg-red-900 text-red"
              dropdownStyle={{ backgroundColor: "white" }}
            >
              {listCountries.map((item: any) => {
                return (
                  <Select.Option
                    dropdownStyle={{ backgroundColor: "white" }}
                    key={item.id}
                    className="b"
                  >
                    <span className="a">{item.name}</span>
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={translation("city")}
            name="city_id"
            rules={[{ required: true, message: translation("required") }]}
          >
            <Select
              dropdownStyle={{ backgroundColor: "white" }}
              suffixIcon={<CaretDownOutlined />}
              onChange={val => setSelectedCity(val)}
            >
              {listCities.map((item: any) => {
                return (
                  <Select.Option key={item.id} className="b">
                    <span className="a">{item.name}</span>
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label={translation("password")}>
            <div className="text-placeholder">
              {translation("change-password")}
              <span
                className="cursor-pointer text-blue"
                onClick={() => setIsOpenModal(true)}
              >
                {translation("change-password-notification")}
              </span>
            </div>
          </Form.Item>

          <div className="flex justify-end">
            <button className="primary-button" type="submit">
              {translation("update-profile")}
            </button>
          </div>
        </Form>
      </div>
      <ChangePasswordModal
        form={formChangePassword}
        visible={isOpenModal}
        setVisible={setIsOpenModal}
        onOk={handleChangePassword}
      />
    </div>
  );
}
