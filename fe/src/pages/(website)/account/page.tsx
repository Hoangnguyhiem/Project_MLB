import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { Outlet } from 'react-router-dom';

type Props = {}

const AccountPage = (props: Props) => {

    return (
        <main className='px-[15px] lg:py-[64px]'>
            <div className="py-[24px] lg:mx-[125px] lg:flex max-w-[1270px] lg:py-0">

                <div className="lg:order-2 lg:w-[80%] lg:pl-[32px]">
                    <Outlet />
                </div>

                <div className="mt-[40px] lg:order-1 lg:w-[20%]">
                    <h2 className='text-[16px] font-[700] pb-[12px] mb-[20px] border-b-[1px] border-b-black lg:border-0 lg:text-[32px] lg:mb-[32px]'>Tài khoản</h2>
                    <ul className='mb-[8px] text-[16px] font-[500]'>Thông tin mua hàng</ul>
                    <ul className='mb-[8px] text-[16px] font-[500]'>Thông tin hoạt động</ul>
                    <ul className='mb-[8px] text-[16px] font-[500]'>Cài đặt tài khoản</ul>
                </div>
            </div>


        </main>
    )
}

export default AccountPage