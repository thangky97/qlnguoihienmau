import { Form } from 'antd';
import { Link } from 'react-router-dom';
import { ROUTES } from "@Constants/route";
import LoginService from '@Network/loginService';
import { IResponse } from '@Constants/models/responseInterface';
import { Toast } from '@Helper/utils';
import { useTranslation } from 'react-i18next';
import { ERROR_FROM_SERVER } from '@Constants/constants';

const Forgot = () => {
    const { t: translation } = useTranslation();

    const onFinish = (values: any) => {
        LoginService.forgotPassword(values)
            .then((res: IResponse) => {
                if (res.isSuccess) {
                    Toast('success', translation('check-mail-success'))
                } else {
                    if (res.error === ERROR_FROM_SERVER.AUTH.USER_NOT_FOUND) {
                        Toast('error', translation("not-found-email"))
                    } else {
                        Toast('error', translation('unknown-error'))
                    }
                }
            })
    }

    return (
        <div className="flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 w-full xl:w-[427px] sm:px-5" style={{ marginTop: "-7rem" }}>
            <div className='forgot-title'>{translation('forgot-password')}</div>
            <Form onFinish={onFinish} className='forgot-detail'>
                <div className='user-forgot'>
                    <label>{translation('email')}</label>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                pattern: /^((?! ).)*$/g, 
                                message: translation('invalid-email'),
                            },
                            {
                                required: true,
                                message: translation('required'),
                            }
                        ]}
                    >
                        <input className='infor-forgot' placeholder={translation('enter-email')} />
                    </Form.Item>
                </div>

                <Form.Item >

                    <div className='button-forgot'>

                        <button className='primary-button w-full' type="submit">
                            {translation('submit')}
                        </button>
                    </div>

                </Form.Item>
                <div className='forgot-note'>
                    {translation('not-having-account')}&nbsp;&nbsp;<Link className='create-acc' to={ROUTES.SETUP}>{translation('register-title')}</Link>
                </div>
            </Form>
        </div>
    )
};


export default Forgot;
