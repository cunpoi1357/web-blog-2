import Base from '@layouts/Baseof'
import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { authService } from 'service/auth'

function ChangePassword() {
    const { register, handleSubmit } = useForm()
    const router = useRouter()

    const onSubmit = async data => {
        toast.promise(
            async () =>
                authService.changePassword(data.oldPassword, data.newPassword),
            {
                success: {
                    render({ data }) {
                        localStorage.setItem('accessToken', data.token)
                        router.push('/admin')
                        return 'Đổi mật khẩu thành công'
                    }
                },
                error: {
                    render({ data }) {
                        return data.response.data.error
                    }
                }
            }
        )
    }
    return (
        <Base title='Trang quản trị'>
            <section className='section'>
                <div className='container'>
                    <div className='space-y-4 p-6 sm:p-8 md:space-y-6'>
                        <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
                            Đổi mật khẩu
                        </h1>
                        <form
                            className='space-y-4 md:space-y-6'
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div>
                                <label
                                    htmlFor='oldPassword'
                                    className='mb-2 block text-sm font-medium text-gray-900 '
                                >
                                    Mật khẩu cũ
                                </label>
                                <input
                                    type='password'
                                    name='oldPassword'
                                    id='oldPassword'
                                    placeholder='••••••••'
                                    className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm'
                                    required
                                    {...register('oldPassword')}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='newPassword'
                                    className='mb-2 block text-sm font-medium text-gray-900 '
                                >
                                    Mật khẩu mớI
                                </label>
                                <input
                                    type='password'
                                    name='newPassword'
                                    id='newPassword'
                                    placeholder='••••••••'
                                    className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm'
                                    required
                                    {...register('newPassword')}
                                />
                            </div>
                            <button
                                type='submit'
                                className='hover:bg-primary-700 focus:ring-primary-300 w-full rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4'
                            >
                                Đổi mật khẩu
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </Base>
    )
}

export default ChangePassword
