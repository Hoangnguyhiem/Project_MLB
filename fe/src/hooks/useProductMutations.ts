import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import apiService from '../services/apiService';
import { useState } from 'react';

// Tạo kiểu dữ liệu cho product
interface ProductData {
    name: string;
    price: number;
    // Các trường khác tùy vào cấu trúc sản phẩm của bạn
}
// const [userId, setUserId] = useState()


export const useProductMutations = () => {
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    const updateProductMutation = useMutation({
        mutationFn: async (productData: any) => {
            try {
                // Gọi API update sản phẩm
                const response = await apiService.updateProduct(productData);
                return response;
            } catch (error) {
                throw new Error('Thao tác cập nhật không thành công');
            }
        },
        onSuccess: () => {
            message.open({
                type: 'success',
                content: 'Cập nhật sản phẩm thành công',
            }),
            queryClient.invalidateQueries({
                queryKey: ['carts'],
            })
        },
        onError: (error) => {
            messageApi.open({
                type: 'error',
                content: error.message,
            });
        },
    });
    const deleteProductMutation = useMutation({
        mutationFn: async (productData: any) => {
            try {
                // Gọi API update sản phẩm
                const response = await apiService.deleteProduct(productData);
                return response;
            } catch (error) {
                throw new Error('Thao tác xóa không thành công');
            }
        },
        onSuccess: () => {
            message.open({
                type: 'success',
                content: 'Xóa sản phẩm thành công',
            }),
            queryClient.invalidateQueries({
                queryKey: ['carts']
            })
        },
        onError: (error) => {
            messageApi.open({
                type: 'error',
                content: error.message,
            });
        },
    });



    return { contextHolder, updateProductMutation, deleteProductMutation };
};
