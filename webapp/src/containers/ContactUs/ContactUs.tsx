import { useEffect, useState } from "react";
import LandingService from "@Network/landingService";
import { Form } from "antd";
import { IResponse } from "@Constants/models/responseInterface";
import { useTranslation } from "react-i18next";
import { Toast } from "@Helper/utils";

export default function ContactUsSection() {
  const { t: translation, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [disable, setDisable] = useState<boolean>();

  const handleLanguageChanged = () => {
    form.validateFields();
  };

  useEffect(() => {
    form.resetFields();
    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [handleLanguageChanged]);

  const onSendContactUs = async (data: any) => {
    // setDisable(true);
    // LandingService.getContactUs({
    //   message: data.description,
    //   fullname: data.fullname,
    //   phone: data.phone || "Do not have",
    //   email: data.email,
    //   company: data.companyInstltute || "Do not have"
    // }).then((res: IResponse) => {
    //   if (res.isSuccess) {
    //     Toast("success", translation("success"));
    //     form.resetFields();
    //     setDisable(false);
    //   } else {
    //     Toast("error", translation("unknown-error"));
    //     setDisable(false);
    //   }
    // });
  };
  return (
    <div className="profile-section-contact w-full 2xl:w-2/4 xl:w-4/5 mx-auto">
      <div className="border-solid border-box p-6 mt-6 text-center d-block">
        <Form
          form={form}
          name="profile profile-contact"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          autoComplete="off"
          onFinish={onSendContactUs}
        >
          <Form.Item
            label={translation("fullname")}
            name="fullname"
            rules={[{ required: true, message: translation("required") }]}
          >
            <input
              className="c2i-input"
              placeholder={translation("enter-fullname")}
            />
          </Form.Item>

          <Form.Item
            label={translation("phone")}
            name="phone"
            rules={[
              { required: true, message: translation("required") },
              {
                pattern: /^[0-9]{10,11}$/,
                message: translation("phone-validate")
              }
            ]}
          >
            <input
              className="c2i-input"
              placeholder={translation("enter-phone")}
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
            name="description"
            label={translation("message")}
            rules={[
              { required: true, message: translation("required") },
              { max: 201, message: translation("too-long", { length: 200 }) }
            ]}
          >
            <textarea
              className="c2i-input"
              id="description"
              rows={6}
              onBlur={() => {
                form.setFieldsValue({
                  // @ts-ignore
                  note: form.getFieldValue("description")?.trim() || ""
                });
              }}
            />
          </Form.Item>

          <div className="flex justify-end" style={{ width: "79%" }}>
            <button className="primary-button" type="submit" disabled={disable}>
              {translation("submit")}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
