import { Modal, Form, Select, Empty } from "antd";
import { useTranslation } from "react-i18next";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { CaretDownOutlined } from "@ant-design/icons";
import { useAppSelector } from "@Store/hooks";
import MetadataService from "@Network/metaDataService";
import { IResponse } from "@Constants/models/responseInterface";

const ModalAddIntersection: FC<{
  isMyservice: boolean;
  visible: boolean;
  disabledAddIntersection: boolean
  title: string;
  setVisible: Dispatch<SetStateAction<boolean>>;
  onSubmit: (values: any) => void;
  initialValues?: any;
  form: any;
  setSelectedValue?: (values: any) => void;
  onlyValue?: "local" | "cloud";
}> = ({
  visible,
  setVisible,
  title,
  onSubmit,
  initialValues,
  form,
  onlyValue,
  disabledAddIntersection
}) => {
    const { t: translation } = useTranslation();
    const user = useAppSelector(state => state.user);
    const [selectedCity, setSelectedCity] = useState<any>(null);

    type City = {
      code: String;
      country_id: Number;
      id: Number;
      is_deleted: Number;
      name: String;
    };

    const [city, setCity] = useState<City[]>([]);
    const [country, setCountry] = useState([]);
    const [country_id, setCountry_id] = useState<Number>();
    const [city_id, setCity_id] = useState<Number>();

    const [listCities, setListCities] = useState<City[]>([]);
    const [listCountries, setListCountries] = useState([]);
    const [paramsFilter, setParamsFilter] = useState({
      filter: {
        // "City_ID": 0,
        // "Country_ID": 0
      },
      skip: 0,
      limit: 20,
      order: {
        key: "createdAt",
        value: "DESC"
      }
    });
    function initialFormValues(values = {}) {
      if (visible && initialValues) {
        form.setFieldsValue({
          ...initialValues
        });
      } else {
        form.resetFields();
      }
      form.setFieldsValue({
        payment_method: "paypal",
        ...values
      });
    }

    // Intersection_name: Joi.string().max(200).required(),
    // Note: Joi.string().max(200),
    // Status: Joi.number().valid(0, 1).default(0),
    // CreateDateTime: Joi.date().iso().required(),
    // Country_ID: Joi.number().required(),
    // City_ID: Joi.number().required(),
    // Last_Update_By: Joi.number(),
    // Service_Mapping_ID: Joi.number().required()

    function resetPrice() {
      let discount_percent = document.getElementById("discount_percent");
      let totalEl = document.getElementById("total");
      let discountEl = document.getElementById("discount");

      if (discount_percent) {
        discount_percent.innerHTML = "";
      }
      if (totalEl) {
        totalEl.innerHTML = "";
      }
      if (discountEl) {
        discountEl.innerHTML = "";
      }
    }

    useEffect(() => {
      if (visible) {
        let updateobj = {};
        if (onlyValue) {
          updateobj = {
            service_type: onlyValue
          };
        }
        initialFormValues(updateobj);
      } else {
        resetPrice();
        form.resetFields();
      }
    }, [visible]);

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
          // form.setFieldsValue({
          //   country_id: country_id
          // });
          // getListCities(country_id)
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
          value: "DESC",
        }

      }).then((res: IResponse) => {
        if (res.isSuccess || res.data?.data?.length > 0) {


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

          // form.setFieldsValue({
          //   city_id: city_id
          // });
        }
        else {
          setListCities([]);
        }
      });
    }
    useEffect(() => {
      getListCountries()
    }, [])

    return (
      <Modal
        title={title}
        visible={visible}
        style={{ top: 20 }}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          form.submit();
        }}
        footer={
          <div className="flex flex-col-reverse gap-4 lg:flex-row lg:justify-end lg:gap-8">
            <button
              onClick={() => {
                setVisible(false);
                form.resetFields();
              }
              }
              className="text-blue w-full lg:w-auto"
              style={{ color: "#037ddc" }}

            >
              {translation("cancel")}
            </button>
            <button
              className="primary-button py-2.5 px-10 w-full lg:w-auto"
              onClick={() => form.submit()}
              disabled={disabledAddIntersection}
            >
              {translation("add")}
            </button>
          </div>
        }
      >
        <Form
          form={form}
          onFinish={onSubmit}
          initialValues={initialValues}
          name="addcard"
          onFinishFailed={err => {
            if (onlyValue) {
              form.setFieldsValue({
                service_type: onlyValue
              });
              form.submit();
            }
          }}
          layout="vertical"
        >
          <Form.Item
            name="Intersection_name"
            label={translation("Intersection Name")}
            rules={[
              { required: true, message: translation("required") },
              { max: 201, message: translation("too-long", { length: 200 }) },
              () => ({
                validator(_, value) {
                  if (
                    !value ||
                    (value &&
                      (value === "" ||
                        /[-;!'@#$%^&*(),.?/":{}~+_=|<>\\]/g.test(value)))
                  ) {
                    return Promise.reject(new Error(translation("invalid")));
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <input className="c2i-input mt-2.5 capitalize"
              onBlur={() => {
                form.setFieldsValue({
                  // @ts-ignore
                  Intersection_name: form.getFieldValue("Intersection_name")?.trim() || ""
                });
              }} />

          </Form.Item>
{/* 
          <Form.Item
            name="note"
            label={translation("note")}
            rules={[
              { required: true, message: translation("required") },
              { max: 201, message: translation("too-long", { length: 200 }) }
            ]}
          >
            <textarea
              className="c2i-input"
              id="note"
              rows={6}
              onBlur={() => {
                form.setFieldsValue({
                  // @ts-ignore
                  note: form.getFieldValue("note")?.trim() || ""
                });
              }}
            />
          </Form.Item> */}


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

              onSelect={(value: number) => {
                // setCountry_id(val);
                getListCities(value);
                form.setFieldsValue({
                  "city_id": null
                });
                // if (val == 0) {

                setSelectedCity(null)

                //   setCity_id(0)
                // }
                // else {
                //   setCountry_id(0)
                //   setCity_id(0)
                // }

              }}
            >
              {/* <Select.Option value="0">{translation("select-country")}</Select.Option> */}
              {listCountries?.length > 0 ? (
                listCountries.map((item: any) => {
                  return (

                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })
              ) : (
                <Empty />
              )}



            </Select>
          </Form.Item>
          <Form.Item

            label={translation("city")}
            name="city_id"
            rules={[{ required: true, message: translation("required") }]}
          >
            <Select
              placeholder={translation("select-city")}
              suffixIcon={<CaretDownOutlined />}
              value={selectedCity}
              id="select-city"
              onChange={(value: number) => setSelectedCity(value)}
            // onSelect={(value: number) => setSelectedCity(value)}

            >
              {listCities?.length > 0 ?
                listCities.map((item: any) => {
                  return <Select.Option key={item.id} value={item.id} >
                    {item.name}
                  </Select.Option>;
                }) : (
                  <Empty />
                )}
            </Select>
          </Form.Item>

          <Form.Item name="status" label={translation("status")}>
            <Select
              suffixIcon={<CaretDownOutlined />}
              size="large"
              className="w-auto"
              defaultValue={"0"}
            >
              <Select.Option value="0">
                <span className="text-sm">{translation("deactive")}</span>
              </Select.Option>
              <Select.Option value="1">
                <span className="text-sm">{translation("active")}</span>
              </Select.Option>
            </Select>
          </Form.Item>

        </Form>
      </Modal>
    );
  };

export default ModalAddIntersection;
