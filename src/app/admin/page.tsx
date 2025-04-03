'use client';

import Admin from '@/api/admin';
import ActionButton from '@/components/ActionButton';
import Input from '@/components/ui/fields/Input';
import { Helper } from '@/utils';

import { Form, Formik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

const AdminLogin = () => {
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const initialValues = {
        username: '',
        password: '',
    };

    const submithandler = async (values: any) => {
        setLoading(true);

        const payload = {
            username: values.username,
            password: values.password,
        };

        try {
            const res = await Admin.login(payload);

            Helper.saveUser(res);
            if (res?.token) {
                router.push('/admin/dashboard');
            }
        } catch (err) {
            console.error('Login Error:', err);
        }

        setLoading(false);
    };

    // useEffect(() => {
    //     const user = Helper.getUser();
    //     console.log(user, 'user data');
    //     if (user?.token) {
    //        router.replace('/admin/dashboard');
    //     }
    // }, []);

    return (
        <>
            <div className=''>
                <nav className='py-4  bg-white shadow-md '>
                    <div className='custom-container flex justify-between items-center'>
                        <div className='relative w-32 md:w-50 h-auto min-h-8 cursor-pointer'>
                            <Image
                                src='/images/logo.png'
                                alt='logo'
                                width={200}
                                height={50}
                                className='object-contain'
                            />
                        </div>
                        <div>Visit Website</div>
                    </div>
                </nav>
                <div className='mx-auto p-12 rounded-2xl max-w-100 bg-white shadow-md mt-32 '>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={submithandler}
                    >
                        {({ handleSubmit }) => (
                            <Form onSubmit={handleSubmit} className='form'>
                                <Input
                                    label='Username'
                                    name='username'
                                    type='text'
                                    placeholder='Enter your username'
                                />
                                <Input
                                    label='Password'
                                    name='password'
                                    type='password'
                                    placeholder='Enter your password'
                                />
                                <ActionButton
                                    loading={loading}
                                    classname='w-full'
                                >
                                    Login
                                </ActionButton>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;
