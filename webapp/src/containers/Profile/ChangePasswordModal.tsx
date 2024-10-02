import InputPassword from "@Components/InputPassword";
import { Modal, Form } from "antd";
import { useTranslation } from "react-i18next";

function ChangePasswordModal({ visible, setVisible, onOk, form }: any) {
  const { t: translation } = useTranslation();

  return (
    <Modal
      title={translation("change-password")}
      visible={visible}
      footer={null}
      onCancel={() => {
        setVisible(false);
        form.resetFields();
      }}
    >
      <Form
        onFinish={onOk}
        name="register-password"
        className="new-detail"
        form={form}
      >
        <div className="pass-new">
          <label>{translation("password")}</label>
          <Form.Item
            name="old_password"
            // rules={[
            //   { required: true, message: translation("required") },
            //   { min: 8, message: translation("too-short", { length: 8 }) },
            //   {
            //     pattern: /^((?! ).)*$/g,
            //     message: translation("invalid-password")
            //   }
            // ]}
          >
            {/* <input
              type="password"
              className="infor-new"
              placeholder={translation("enter-password")}
            /> */}
            <InputPassword id="old_password" />
          </Form.Item>
        </div>

        <div className="pass-new">
          <label>{translation("new-password")}</label>
          <Form.Item
            name="password"
            // rules={[
            //   { required: true, message: translation("required") },
            //   { min: 8, message: translation("too-short", { length: 8 }) },
            //   {
            //     pattern: /^((?! ).)*$/g,
            //     message: translation("invalid-password")
            //   }
            // ]}
          >
            <InputPassword id="password" />
          </Form.Item>
        </div>

        <div>
          <div className="pass-confirm">
            <label>{translation("password_confirmation")}</label>
          </div>
          <Form.Item
            name="password_confirmation"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(translation("password-dont-match"))
                  );
                }
              })
            ]}
          >
            <InputPassword id="password_confirmation" />
          </Form.Item>
        </div>

        <Form.Item>
          <div className="button-new">
            <button className="primary-button w-full" type="submit">
              {translation("change-password")}
            </button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ChangePasswordModal;
