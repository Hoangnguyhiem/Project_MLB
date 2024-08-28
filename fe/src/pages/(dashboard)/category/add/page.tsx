import ErrorPage from '@/pages/(website)/404/page';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const CategoryAddPage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<any>();
    const [messageApi, contextHolder] = message.useMessage();
    const queryCient = useQueryClient();
    const [parentId, setParentId] = useState<any>("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Fetch subcategories
    const { data: subcollections, isLoading, isError, error } = useQuery({
        queryKey: ['subcollections'],
        queryFn: async () => {
            return axios.get(`http://localhost:8080/api/subcollections`);
        },
    });

    // Handle parent category selection
    const handleSelectChange = (e: any) => {
        const parentId = e.target.value;
        setParentId(parentId);
    };

    // Handle image file change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    // Add category mutation
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: any) => {
            await axios.post('http://localhost:8080/api/categories/add', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
        onSuccess: () => {
            messageApi.open({ type: 'success', content: 'Thêm danh mục thành công' });
            queryCient.invalidateQueries({ queryKey: ['subcollections'] });
        },
        onError: (error) => {
            messageApi.open({ type: 'error', content: error.message });
        },
    });

    // Handle form submission
    const onSubmit = async (data: any) => {
        mutate({ ...data, image: data.image[0] ? data.image[0] : "", parentId });
        reset();
        setImagePreview(null);
    };

    if (isLoading) return <ErrorPage />;
    if (isError) return (<div>{error.message}</div>);

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className='font-[600] mb-[30px] text-[20px]'>THÊM DANH MỤC</h2>
                <div className="mb-3">
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Tạo tên danh mục</label>
                    <input {...register("name", { required: true })} type="text" disabled={isPending} className={`${isPending ? "cursor-wait" : ""} w-full border border-gray-300 p-[8px_10px] rounded-md`} />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-[2px]">Thuộc danh mục</label>
                    <select onChange={handleSelectChange} disabled={isPending} className={`${isPending ? "cursor-wait" : ""} w-full border border-gray-300 p-[8px_10px] rounded-md`} value={parentId || ""}>
                        <option value="" disabled>Chọn danh mục</option>
                        <option value="">KHông chọn</option>
                        {subcollections?.data.map((item: any) => (
                            <option key={item._id} value={item._id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-[2px]">Tạo ảnh danh mục</label>
                    <input {...register("image")} type="file" disabled={isPending} className={`${isPending ? "cursor-wait" : ""} w-full border border-gray-300 p-[8px_10px] rounded-md`} onChange={handleImageChange} />
                    {imagePreview && (
                        <div className="mt-3">
                            <img src={imagePreview} width={100} height={100} alt="Preview" className="max-w-full h-auto rounded-md" />
                        </div>
                    )}
                </div>
                <div className="flex justify-end mt-[40px]">
                    <button className='bg-blue-500 p-[10px_20px] rounded-[5px] text-white' type='submit' disabled={isPending}>{isPending ? 'Đang xử lý...' : 'THÊM'}</button>
                </div>
            </form>
        </div>
    );
};

export default CategoryAddPage;
