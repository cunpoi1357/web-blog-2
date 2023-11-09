import AdminLayout from '@layouts/Admin'
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import dynamic from 'next/dynamic'
import remarkFrontmatter from 'remark-frontmatter'
import 'react-markdown-editor-lite/lib/index.css'
import { toast } from 'react-toastify'
import { postService } from '../../../../service/post'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false
})

function EditPost() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const [content, setContent] = useState('')

    const { data } = useQuery({
        queryFn: async () => await postService.getOne(router.query.slug),
        queryKey: ['post', router.query.slug],
        enabled: !!router.query.slug
    })

    const handleNewPost = () =>
        toast.promise(
            async () => await postService.update(router.query.slug, content),
            {
                success: {
                    render() {
                        queryClient.invalidateQueries({
                            queryKey: ['posts']
                        })
                        queryClient.invalidateQueries({
                            queryKey: ['post', router.query.slug]
                        })
                        router.push('/admin')
                        return 'Tạo bài viết mới thành công'
                    }
                },
                error: 'Tạo bài viết mới thất bại',
                pending: 'Đang tạo bài viết'
            }
        )

    useEffect(() => data && setContent(data.postData), [data])
    return (
        <AdminLayout>
            <MdEditor
                style={{ height: '500px' }}
                on
                renderHTML={content => (
                    <Markdown remarkPlugins={[remarkFrontmatter]}>
                        {content}
                    </Markdown>
                )}
                onChange={data => setContent(data.text)}
                value={content}
            />

            <div className='flex justify-end gap-2'>
                <Link
                    href='/admin'
                    className='transition-colors hover:text-emerald-600 hover:underline'
                >
                    Trở về
                </Link>
                <button
                    className='transition-colors hover:text-emerald-600 hover:underline'
                    onClick={handleNewPost}
                >
                    Cập nhật
                </button>
            </div>
        </AdminLayout>
    )
}

export default EditPost
