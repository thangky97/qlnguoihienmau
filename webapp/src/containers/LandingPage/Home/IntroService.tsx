import BlueTicket from "@Assets/icons/blue_tick.svg";
import { ROUTES } from "@Constants/route";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Button, Modal, Form, Input } from "antd";
import { useState } from "react";
import LandingService from "@Network/landingService";
import { useAppSelector } from "@Store/hooks";

import { Toast } from "@Helper/utils";
import { IResponse } from "@Constants/models";
function IntroService(props: any) {
  const data = JSON.parse(props.data || "{}");

  return (
    data && (
      <section
        id="service"
        className="intro_container flex justify-items-center flex-col pt-16 intro_with_media"
      >
        <div className="text-4xl font-bold" style={{ lineHeight: "130%" }}>
          {data && data?.header_service}
        </div>
        <div className="description text-center text-base md:w-1/2">
          {data && data?.short_header_service}
        </div>
        <div className="grid grid-cols-2 gap-x-4 custom-grid-cols-1">
          {/* {services.map(item => {
          return (
            <ServiceItem key={item.name} {...item} translate={translate} />
          );
        })} */}

          <ServiceItem data={data} />
        </div>
      </section>
    )
  );
}

function ServiceItem(data: any) {
  const { t: translation, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const user = useAppSelector(state => state.user);
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    // setConfirmLoading(true);
    // form.validateFields().then(values => {
    //   LandingService.getContactUs({
    //     message: values.message,
    //     fullname: values.fullname,
    //     email: values.email,
    //     phone: values.phone,
    //     company: values.companyInstltute || "Do not have"
    //   }).then((res: IResponse) => {
    //     if (res.isSuccess) {
    //       Toast("success", translation("success"));
    //       form.resetFields();
    //       setOpen(false);
    //       setConfirmLoading(false);
    //     } else {
    //       Toast("error", translation("unknown-error"));
    //       setOpen(false);
    //       setConfirmLoading(false);
    //     }
    //   });
    // });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      {data?.data?.data?.length > 0 &&
        data?.data?.data?.map((item: any, index: any) => (
          <div className="service-bg" key={index}>
            <div className="name">{item?.title_service}</div>
            <ul>
              <li
                className="description h-[60px] desc desc-number desc-around"
                style={{ font: "14px" }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: data && item?.content_service + ""
                  }}
                ></span>
              </li>
              {item?.feature_service
                ?.split(";")
                ?.map((item: string, index: any) => {
                  return (
                    <li className="description" key={index}>
                      <img src={BlueTicket} />
                      {item}
                    </li>
                  );
                })}
            </ul>

            <Button type="primary" onClick={showModal} className="btn-whites">
              {translation("contact")}
            </Button>
            <Modal
              open={open}
              title={translation("contact")}
              okText={translation("submit")}
              cancelText={translation("cancel")}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <Form form={form} layout="vertical" className="custom-form">
                <Form.Item
                  label={translation("fullname")}
                  name="fullname"
                  className="custom-input"
                  rules={[{ required: true, message: translation("required") }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={translation("companyInstitute")}
                  name="companyInstltute"
                  className="custom-input"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={translation("phone")}
                  name="phone"
                  className="custom-input"
                  rules={[
                    { required: true, message: translation("required") },
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: translation("phone-validate")
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={translation("email")}
                  name="email"
                  className="custom-input"
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
                  <Input />
                </Form.Item>
                <Form.Item
                  label={translation("message")}
                  name="message"
                  className="custom-input"
                  rules={[
                    {
                      required: true,
                      message: translation("required_message")
                    },
                    {
                      max: 201,
                      message: translation("too-long", { length: 200 })
                    }
                  ]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        ))}
    </>
  );
}

export default IntroService;
