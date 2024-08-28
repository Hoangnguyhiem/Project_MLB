import React, { useState } from 'react';

const SizeBlock = () => (
    <div className="grid grid-cols-4 gap-2">
        <div className="mb-3 col-span-1">
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-[2px]">Thêm size</label>
            <select id="size" className='w-full border border-gray-300 p-[8px_10px] rounded-md'>
                <option value="">S</option>
                <option value="">X</option>
                <option value="">XL</option>
            </select>
        </div>
        <div className="mb-3">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-[2px]">Giá</label>
            <input
                type="text"
                id="price"
                className="w-full border border-gray-300 p-[7px_10px] rounded-md"
            />
        </div>
        <div className="mb-3">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-[2px]">Số lượng</label>
            <input
                type="text"
                id="quantity"
                className="w-full border border-gray-300 p-[7px_10px] rounded-md"
            />
        </div>
        <div className="mb-3">
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-[2px]">Giảm giá</label>
            <input
                type="text"
                id="discount"
                className="w-full border border-gray-300 p-[7px_10px] rounded-md"
            />
        </div>
    </div>
);