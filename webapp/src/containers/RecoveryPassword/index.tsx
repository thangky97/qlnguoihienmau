import { Form } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import UserService from '@Network/userService'
import { IResponse } from '@Constants/models/responseInterface';
import { Toast } from '@Helper/utils';
import { useEffect } from 'react';
import { ROUTES } from '@Constants/route';
import InputPassword from '@Components/InputPassword';

const RecoveryPassword = () => {
    const navigate = useNavigate()
    const searchQuery = useLocation().search
    const token = searchQuery.split('=')[1]
    const [form] = Form.useForm();
    const { t: translation } = useTranslation();

    const onFinish = (values: any) => {
        UserService.updateUserInfo({
            password: values.password
            // @ts-ignore
        }, token).then((res: IResponse) => {
            if (res.isSuccess) {
                Toast('success', translation('change-password-success'))
                setTimeout(() => {
                    navigate(ROUTES.LOGIN)
                }, 500)
                form.resetFields();
            } else {

                Toast('error', translation('unknown-error'))
            }
        })
    }

    useEffect(() => {
        if (!token) {
            setTimeout(() => {
                navigate(ROUTES.LOGIN)
            }, 500)
        }
    }, [])

    return (
        <div className="flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12 w-full xl:w-[427px] sm:px-5" style={{ marginTop: "-7rem" }}>
            <div className='new-title'>{translation('set-new-password')}</div>
            <Form onFinish={onFinish} className='new-detail'>
                <div className='pass-new'>
                    <label>{translation('new-password')}</label>
                    <InputPassword
                        id='password'
                    />
                </div>

                <div>
                    <div className='pass-confirm'>
                        <label>{translation('enter-confirm-password')}</label>
                    </div>
                    <InputPassword
                        id='confirm'
                        validate={({ getFieldValue }: any) => ({
                            validator(_: any, value: any) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(translation("password-dont-match")));
                            },
                        })}
                    />
                </div>

                <Form.Item >
                    <div className='button-new'>
                        <button className='primary-button w-full' type="submit">
                            {translation('change-password')}
                        </button>
                    </div>
                </Form.Item>

            </Form>
        </div>
    );
};

export default RecoveryPassword;
