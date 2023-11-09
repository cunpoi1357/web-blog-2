import AdminLayout from '@layouts/Admin'
import React, { useState } from 'react'
import Markdown from 'react-markdown'
import dynamic from 'next/dynamic'
import remarkFrontmatter from 'remark-frontmatter'
import 'react-markdown-editor-lite/lib/index.css'
import { toast } from 'react-toastify'
import { postService } from '../../../../service/post'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false
})
function NewPost() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [content, setContent] = useState(`---
title: "Tiêu đề bài viết"
description: "Mô tải bài viết"
image: "/images/posts/05.jpg"
date: 2021-01-25
draft: false
authors: ["Tác giả"]
tags: ["Tags"]
categories: ["Categories"]
---
`)

    const handleNewPost = () =>
        toast.promise(async () => await postService.addNew(content), {
            success: {
                render() {
                    queryClient.invalidateQueries({
                        queryKey: ['posts']
                    })
                    router.push('/admin')
                    return 'Tạo bài viết mới thành công'
                }
            },
            error: 'Tạo bài viết mới thất bại',
            pending: 'Đang tạo bài viết'
        })
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
                    Tạo
                </button>
            </div>
        </AdminLayout>
    )
}

export default NewPost
