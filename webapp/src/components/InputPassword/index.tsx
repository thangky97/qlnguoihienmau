import { EyeOutlined } from '@ant-design/icons'
import { Form } from 'antd'
import { useState } from 'react'
import { EyeOff } from 'react-feather'
import { useTranslation } from 'react-i18next'

function InputPassword({ id, validate }: { id: string, validate?: any }) {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const { t: translation } = useTranslation()

  return (

    <Form.Item
      name={id}
      rules={[
        { required: true, message: translation('required') },
        { min: 8, message: translation('too-short', { length: 8 }) },
        { pattern: /^((?! ).)*$/g, message: translation('invalid-password') },
        (validate || (() => ({})))
      ]}
    >
      <span className='c2i-input-password'>
        <input type={isShowPassword ? "text" : "password"} className='infor' placeholder={translation('enter-password')} />
        <span
          className='icon'
          onClick={() => {
            setIsShowPassword(!isShowPassword)
          }}
        >
          {
            isShowPassword ? (
              <EyeOutlined />
            ) : (
              <EyeOff />
            )
          }
        </span>
      </span>
    </Form.Item>
  )
}

export default InputPassword