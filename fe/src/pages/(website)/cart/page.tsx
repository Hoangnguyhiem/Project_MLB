import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import axios from 'axios'

import { Link } from 'lucide-react'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'



const CartPage = () => {

    const [messageApi, contextHolder] = message.useMessage()
    const { userId } = useParams()


    const { data: carts } = useQuery({
        queryKey: ['carts', userId],
        queryFn: () => {
            return axios.get(`http://localhost:8080/api/carts/${userId}`)
        }
    })
    console.log(carts);

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: async (colorId: string) => {
            try {

                axios.post(`http://localhost:8080/api/carts/remove`, { userId, colorId })
            } catch (error) {
                throw new Error(`Có lỗi xảy ra, xin thử lại sau`)
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: 'success',
                content: 'Xóa thành công',
            }),
                queryClient.invalidateQueries({
                    queryKey: ['carts', userId],
                }),
                queryClient.refetchQueries({
                    queryKey: ['carts', userId],
                })
        },
        onError: (error) => {
            messageApi.open({
                type: 'error',
                content: error.message,
            })
        }
    })

    return (
        <main>
            {contextHolder}
            <div className="lg:max-w-[1270px] lg:mx-auto lg:px-[15px] lg:mt-[40px]">
                <div className="w-[100%] mb-[16px] hidden lg:flex">
                    <div className="*:text-[12px] *:font-[500] hidden lg:block">
                        <span className='text-[#787878]'>DANH MUC {'>'} </span>
                        <span className='text-[#787878]'>TRANG CHU {'>'} </span>
                        <span>QUAN AO</span>
                    </div>
                </div>

                <div className="lg:flex lg:flex-wrap lg:items-start ">
                    <div className="lg:w-[70%]">



                        <div className="px-[20px] py-[14px] mb-[24px] flex items-center border-t-[1px] border-b-[1px] border-t-[#E8E8E8] border-b[#E8E8E8] mt-[2px] lg:border-t-0">
                            <input className='mr-[8px] w-[20px] h-[20px]' type="checkbox" />
                            <span className='text-[14px] font-[600]'>Chọn tất cả</span>
                        </div>


                        {carts?.data?.cartData.products?.length > 0 ? (
                            carts?.data.cartData.products.map((cart: any, index: any) => (
                                <div key={index + 1} className="px-[20px]">
                                    <div className="flex flex-wrap items-center justify-between mt-[24px] lg:justify-between lg:flex-nowrap">
                                        <div className='flex items-start w-[100%]'>
                                            <div className="w-[120px]">
                                                <input className='absolute w-[20px] h-[20px]' type="checkbox" />
                                                <div className="pt-[123.5%] bg-cover bg-center bg-no-repeat"
                                                    style={{ backgroundImage: `url(${cart.image[0]})` }}
                                                ></div>
                                            </div>

                                            <div className='w-[calc(100%-120px)]'>
                                                <div className="pl-[16px]">
                                                    <div className="leading-5">
                                                        <a href="#" className='text-black hover:underline text-[14px] font-[600] w-[100%]'>
                                                            {cart.name}
                                                        </a>
                                                    </div>
                                                    <div className='text-[12px] text-black font-[500] my-[4px]'>43BKS / {cart.size} / {cart.slug}</div>
                                                    <div className='text-[12px] text-black font-[500]'>Số lượng: {cart.quantity}</div>
                                                    <div className='mt-[24px] *:text-[16px] font-[700]'>
                                                        <span>{new Intl.NumberFormat('vi-VN').format(cart.price)} VND</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="lg:hidden">
                                                <a href="">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M13.9998 6L5.99988 14" stroke="black" strokeLinecap="square" strokeLinejoin="round"></path>
                                                        <path d="M6 6L13.9999 14" stroke="black" strokeLinecap="square" strokeLinejoin="round"></path>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex justify-center items-center mt-[20px] w-[100%] lg:w-[156.5px] lg:flex-wrap *:font-[500] lg:mt-0">
                                            <a href="" className='w-[100%] text-center border border-[#E8E8E8] rounded-[3px] text-[14px] py-[6px] px-[8px]'>Thay đổi tùy chọn</a>
                                            <button onClick={() => { mutate(cart.colorId) }} className='hidden w-full text-center border border-[#E8E8E8] rounded-[3px] text-[14px] py-[6px] px-[8px] mt-[8px] lg:block'>Xóa</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-[100%] py-[60px] flex flex-col items-center">
                                <div className="icon-empty-cart">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"> <path d="M21.27 31.67C21.76 31.67 22.19 31.48 22.57 31.1C22.95 30.72 23.14 30.29 23.14 29.8C23.14 29.31 22.95 28.88 22.57 28.5C22.19 28.12 21.76 27.93 21.27 27.93C20.74 27.93 20.29 28.12 19.94 28.5C19.58 28.88 19.41 29.31 19.41 29.8C19.41 30.29 19.59 30.72 19.94 31.1C20.3 31.48 20.74 31.67 21.27 31.67ZM32.27 31.67C32.76 31.67 33.19 31.48 33.57 31.1C33.95 30.72 34.14 30.29 34.14 29.8C34.14 29.31 33.95 28.88 33.57 28.5C33.19 28.12 32.76 27.93 32.27 27.93C31.78 27.93 31.35 28.12 30.97 28.5C30.59 28.88 30.4 29.31 30.4 29.8C30.4 30.29 30.59 30.72 30.97 31.1C31.35 31.48 31.78 31.67 32.27 31.67ZM43.14 31.67C43.63 31.67 44.06 31.48 44.44 31.1C44.82 30.72 45.01 30.29 45.01 29.8C45.01 29.31 44.82 28.88 44.44 28.5C44.06 28.12 43.63 27.93 43.14 27.93C42.65 27.93 42.22 28.12 41.84 28.5C41.46 28.88 41.27 29.31 41.27 29.8C41.27 30.29 41.46 30.72 41.84 31.1C42.22 31.48 42.65 31.67 43.14 31.67ZM9 55.2V15.6C9 14.58 9.34 13.72 10.03 13.03C10.72 12.34 11.58 12 12.6 12H51.8C52.82 12 53.68 12.34 54.37 13.03C55.06 13.72 55.4 14.57 55.4 15.6V44.13C55.4 45.15 55.06 46.01 54.37 46.7C53.68 47.39 52.83 47.73 51.8 47.73H16.47L9 55.2ZM10.47 51.6L15.8 46.27H51.8C52.42 46.27 52.93 46.07 53.33 45.67C53.73 45.27 53.93 44.76 53.93 44.14V15.6C53.93 14.98 53.73 14.47 53.33 14.07C52.93 13.67 52.42 13.47 51.8 13.47H12.6C11.98 13.47 11.47 13.67 11.07 14.07C10.67 14.47 10.47 14.98 10.47 15.6V51.6Z" fill="#D0D0D0"></path> <path opacity="0.05" d="M51.8 42.2696H15.8L10.47 47.5996V51.5996L15.8 46.2696H51.8C52.42 46.2696 52.93 46.0696 53.33 45.6696C53.73 45.2696 53.93 44.7596 53.93 44.1396V40.1396C53.93 40.7596 53.73 41.2696 53.33 41.6696C52.93 42.0696 52.42 42.2696 51.8 42.2696Z" fill="black"></path> </svg>
                                </div>
                                <p className='my-[24px] text-[16px] font-[500]'>Không có sản phẩm nào trong giỏ hàng</p>
                                <a className='text-[16px] font-[500] border-[1px] px-[32px] py-[12px] hover:text-[#BB9244] rounded-[4px]' href="">Tiếp tục mua hàng</a>
                            </div>
                        )}


                    </div>

                    <div className='mt-[32px] lg:w-[30%] lg:pl-[32px] lg:mt-0 lg:sticky top-0'>
                        <div className='p-[20px] border-t-[8px] border-t-[#F8F8F8] border-b-[8px] border-b-[#F8F8F8] lg:border-[#E8E8E8] lg:border-[2px] lg:rounded-[8px_8px_0_0] lg:py-[20px] lg:px-[24px]'>
                            <h2 className='font-[700] text-[18px] mb-[20px]'>THÔNG TIN ĐƠN HÀNG</h2>
                            <div className='flex justify-between text-[14px] font-[500]'>
                                <span className=''>Tạm tính</span>
                                <span>{new Intl.NumberFormat('vi-VN').format(carts?.data?.totalPrice)} VND</span>
                            </div>
                            <div className='flex justify-between mt-[12px] text-[14px] font-[500]'>
                                <span>Phí vận chuyển</span>
                                <span>-</span>
                            </div>
                            <div className='flex justify-between pt-[16px] mt-[16px]  border-t-[2px] border-t-black *:text-[16px] *:font-[700]'>
                                <span>Tổng đơn hàng</span>
                                <span>{new Intl.NumberFormat('vi-VN').format(carts?.data?.totalPrice)} VND</span>

                            </div>

                        </div>
                        <button className='bg-black text-white text-[16px] font-[600] w-full fixed bottom-0 h-[56px] -tracking-wide lg:static lg:rounded-[0_0_8px_8px]'>
                            THANH TOÁN
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CartPage
