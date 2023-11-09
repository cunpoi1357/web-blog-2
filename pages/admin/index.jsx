import AdminLayout from '@layouts/Admin'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'
import { postService } from '../../service/post'
import { toast } from 'react-toastify'

function AdminPage() {
    const { data } = useQuery({
        queryFn: postService.getAll,
        queryKey: ['posts']
    })
    const queryClient = useQueryClient()

    const handleDeletePost = slug =>
        toast.promise(async () => await postService.delete(slug), {
            success: {
                render() {
                    queryClient.invalidateQueries({
                        queryKey: ['posts']
                    })
                    return 'Xóa bài viết thành công'
                }
            }
        })

    return (
        <AdminLayout>
            <ul className='flex flex-col gap-6'>
                {data &&
                    data.map(item => (
                        <li
                            key={item.slug}
                            className='border-b border-b-primary'
                        >
                            <h3 className='mb-2'>
                                <Link
                                    href={`/blogs/${item.slug}`}
                                    className='block hover:text-primary'
                                >
                                    {item.title}
                                </Link>
                            </h3>
                            <p className='text-text'>
                                {item.content &&
                                    item.content.slice(0, Number(150))}
                                ...
                            </p>
                            <div className='flex justify-end gap-2'>
                                <Link
                                    href={`/admin/post/edit/${item.slug}`}
                                    className='transition-colors hover:text-emerald-600 hover:underline'
                                >
                                    Chỉnh sửa
                                </Link>
                                <button
                                    className='transition-colors hover:text-emerald-600 hover:underline'
                                    onClick={() => handleDeletePost(item.slug)}
                                >
                                    Xóa
                                </button>
                            </div>
                        </li>
                    ))}
            </ul>
        </AdminLayout>
    )
}

export default AdminPage
