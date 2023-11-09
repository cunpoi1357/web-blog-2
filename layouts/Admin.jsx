import Base from '@layouts/Baseof'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { authService } from 'service/auth'

function AdminLayout({ children }) {
    const { register, handleSubmit } = useForm()
    const [isLogged, setIsLogged] = useState(false)
    const onSubmit = async data => {
        toast.promise(
            async () => authService.login(data.username, data.password),
            {
                success: {
                    render({ data }) {
                        localStorage.setItem('accessToken', data.token)
                        setIsLogged(true)
                        return 'Đăng nhập thành công'
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

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear()
        }
        toast.info('Đã đăng xuất!')
        setIsLogged(false)
    }

    useEffect(() => {
        let accessToken
        if (typeof window !== 'undefined') {
            accessToken = localStorage.getItem('accessToken') || ''
        }
        setIsLogged(!!accessToken)
    }, [])
    return (
        <Base title='Trang quản trị'>
            <section className='section'>
                <div className='container'>
                    {isLogged ? (
                        <>
                            <div className='flex justify-between gap-4 rounded-lg border border-emerald-600 p-4'>
                                <Link
                                    href='/admin/post/new'
                                    className=' transition-colors hover:text-emerald-600 hover:underline'
                                >
                                    Thêm bài viết mới
                                </Link>
                                <div className='flex gap-4'>
                                    <Link
                                        href='/admin/change-password'
                                        className='transition-colors hover:text-emerald-600 hover:underline'
                                    >
                                        Đổi mật khẩu
                                    </Link>
                                    <button
                                        className='transition-colors hover:text-emerald-600 hover:underline'
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                            {children}
                        </>
                    ) : (
                        <div className='space-y-4 p-6 sm:p-8 md:space-y-6'>
                            <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
                                Đăng nhập tài khoản quản trị
                            </h1>
                            <form
                                className='space-y-4 md:space-y-6'
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <div>
                                    <label
                                        htmlFor='username'
                                        className='mb-2 block text-sm font-medium text-gray-900'
                                    >
                                        Tên đăng nhập
                                    </label>
                                    <input
                                        type='text'
                                        name='username'
                                        id='username'
                                        className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm'
                                        placeholder='username'
                                        required
                                        {...register('username')}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor='password'
                                        className='mb-2 block text-sm font-medium text-gray-900 '
                                    >
                                        Mật khẩu
                                    </label>
                                    <input
                                        type='password'
                                        name='password'
                                        id='password'
                                        placeholder='••••••••'
                                        className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm'
                                        required
                                        {...register('password')}
                                    />
                                </div>
                                <button
                                    type='submit'
                                    className='hover:bg-primary-700 focus:ring-primary-300 w-full rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4'
                                >
                                    Đăng nhập
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </Base>
    )
}

export default AdminLayout
