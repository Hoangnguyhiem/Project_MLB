import { useQueries, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Props = {}

const ProductAddPage: React.FC = () => {

    const [attributes, setAttributes] = useState<any[]>([
        { color: '', image: '', sizes: [{ size: '', price: '', stock: '', slug: '', discount: '' }] },
    ]);

    const [selectedSize, setSelectedSize] = useState<{ attrIndex: number; sizeIndex: number } | null>(null);

    const handleAddAttribute = () => {
        setAttributes([...attributes, { color: '', image: '', sizes: [{ size: '', price: '', stock: '', slug: '', discount: '' }] }]);
    };

    const handleAddSize = (index: number) => {
        const newAttributes = [...attributes];
        newAttributes[index].sizes.push({ size: '', price: '', stock: '', slug: '', discount: '' });
        setAttributes(newAttributes);
    };

    const handleAttributeChange = (index: number, field: string, value: string) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = value;
        setAttributes(newAttributes);
    };

    const handleSizeChange = (attrIndex: number, sizeIndex: number, field: string, value: string) => {
        const newAttributes = [...attributes];
        newAttributes[attrIndex].sizes[sizeIndex][field] = value;
        setAttributes(newAttributes);
    };

    const handleSizeSelection = (attrIndex: number, sizeIndex: number, size: string) => {
        const newAttributes = [...attributes];
        newAttributes[attrIndex].sizes[sizeIndex].size = size;
        setAttributes(newAttributes);
        setSelectedSize({ attrIndex, sizeIndex });
    };

    const { register, handleSubmit, formState: { errors } } = useForm<any>();

    const onSubmit = (data: any) => {
        console.log('Product Data:', { ...data, attributes });
    };

    const [sizeId, setSizeId] = useState<any>(null);

    const { data: categoriesSize } = useQuery({
        queryKey: ['categories-size'],
        queryFn: async () => axios.get('http://localhost:8080/api/categories-size'),
    });

    const { data: sizes } = useQuery({
        queryKey: ['sizes'],
        queryFn: async () => axios.get('http://localhost:8080/api/sizes'),
    });


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="">
            <h2 className="font-[600] mb-[30px] text-[20px]">Add New Product</h2>
            {/* Product Basic Information */}
            <div className="">
                <div className="mb-3">
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Tạo tên danh mục</label>
                    <input
                        {...register("name", { required: false })}
                        type="text"
                        placeholder="Product Name"
                        className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Tạo tên danh mục</label>
                    <textarea
                        {...register("description", { required: false })}
                        placeholder="Product Description"
                        className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Tạo tên danh mục</label>
                    <input
                        {...register("design", { required: false })}
                        type="text"
                        placeholder="Design"
                        className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Tạo tên danh mục</label>
                    <input
                        {...register("material", { required: false })}
                        type="text"
                        placeholder="Material"
                        className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                    />
                </div>
            </div>

            {/* Attributes */}
            {attributes.map((attribute: any, index: any) => (
                <div key={index} className="mb-6">
                    <h3 className="">Attribute {index + 1}</h3>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-3">
                            <div className="mb-3">
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Tạo tên danh mục</label>
                                <input
                                    type="file"
                                    value={attribute.color}
                                    onChange={(e) => handleAttributeChange(index, 'color', e.target.value)}
                                    placeholder="Color"
                                    className="w-full border border-gray-300 p-[8px_10px] rounded-md"

                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Tạo tên danh mục</label>
                                <input
                                    type="file"
                                    multiple
                                    value={attribute.image}
                                    onChange={(e) => handleAttributeChange(index, 'image', e.target.value)}
                                    placeholder="Image URL"
                                    className="w-full border border-gray-300 p-[8px_10px] rounded-md"

                                />
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="col-span-9">
                            {attribute.sizes.map((size: any, sizeIndex: any) => (
                                <div key={sizeIndex} className="grid grid-cols-5 gap-2">
                                    {/* <div className="mb-3">
                                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Size</label>
                                        <input
                                            type="text"
                                            value={size.size}
                                            onChange={(e) => handleSizeChange(index, sizeIndex, 'size', e.target.value)}
                                            placeholder="Size"
                                            className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                
                                        />
                                    </div> */}
                                    <div className="mb-3">
                                        <label htmlFor="productSize" className="block text-sm font-medium text-gray-700 mb-[2px]">Size</label>
                                        {selectedSize?.attrIndex === index && selectedSize?.sizeIndex === sizeIndex ? (
                                            <div className="relative p-[8px_10px] border border-gray-300 rounded-md">
                                                {size.size}
                                                <span onClick={() => setSelectedSize(null)} className="absolute top-0 left-0 w-[100%] h-[100%] cursor-pointer bg-transparent"></span>
                                            </div>
                                        ) : (
                                            <div className="absolute border border-gray-300 p-[8px_10px] rounded-md bg-white">
                                                <div className="flex">
                                                    {categoriesSize?.data.map((item: any) => (
                                                        <div key={item._id} onClick={() => setSizeId(item._id)} className={`${sizeId === item._id ? "text-red-500 border-b-orange-500 border-b-[1px]" : ""} px-[5px] cursor-pointer font-[500] hover:text-red-500 hover:border-b-orange-500 hover:border-b-[1px]`}>
                                                            {item.name}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="grid grid-cols-5">
                                                    {sizes?.data?.map((item: any) => (
                                                        <div key={item._id}>
                                                            <label
                                                                htmlFor="productSize"
                                                                className={`${sizeId === item.categoryId ? "" : "hidden"} cursor-pointer hover:text-red-500 px-[5px] col-span-1 mt-[10px]`}
                                                                onClick={() => handleSizeSelection(index, sizeIndex, item.size)}
                                                            >
                                                                {item.size}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Price</label>
                                        <input
                                            type="number"
                                            value={size.price}
                                            onChange={(e) => handleSizeChange(index, sizeIndex, 'price', e.target.value)}
                                            placeholder="Price"
                                            className="w-full border border-gray-300 p-[8px_10px] rounded-md"

                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Số lượng</label>
                                        <input
                                            type="number"
                                            value={size.stock}
                                            onChange={(e) => handleSizeChange(index, sizeIndex, 'stock', e.target.value)}
                                            placeholder="Stock"
                                            className="w-full border border-gray-300 p-[8px_10px] rounded-md"

                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Mã</label>
                                        <input
                                            type="text"
                                            value={size.slug}
                                            onChange={(e) => handleSizeChange(index, sizeIndex, 'slug', e.target.value)}
                                            placeholder="Slug"
                                            className="w-full border border-gray-300 p-[8px_10px] rounded-md"

                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Giảm giá</label>
                                        <input
                                            type="number"
                                            value={size.discount}
                                            onChange={(e) => handleSizeChange(index, sizeIndex, 'discount', e.target.value)}
                                            placeholder="Discount"
                                            className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                                        />
                                    </div>

                                </div>
                            ))}



                            <button
                                type="button"
                                onClick={() => handleAddSize(index)}
                                className="mt-[50px]"
                            >
                                Add Size
                            </button>

                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddAttribute}
                className=""
            >
                Add Attribute
            </button>

            <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
                Submit
            </button>
        </form>
    );
}

export default ProductAddPage