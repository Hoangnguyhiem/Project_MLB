import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Aside = () => {
    const [openMenus, setOpenMenus] = useState<any>({
        productMenu: false,
        categoryMenu: false,
        orderMenu: false,
    });

    const toggleMenu = (menuName: any) => {
        setOpenMenus((prevState: any) => ({
            ...prevState,
            [menuName]: !prevState[menuName],
        }));
    };

    return (
        <div className="w-[200px] h-[100%] bg-white mt-[50px]">
            <div>
                <ul>
                    {/* Product Menu */}
                    <li className='p-[10px_15px] m-[4px_5px] rounded-[8px] hover:bg-slate-200'>
                        <a href="#" className='flex items-center justify-between' onClick={() => toggleMenu('productMenu')}>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                                <span className='ml-[5px]'>SẢN PHẨM</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-4 transform transition-transform ${openMenus.productMenu ? 'rotate-180' : 'rotate-0'}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                            </svg>
                        </a>
                    </li>
                    {openMenus.productMenu && (
                        <ul>
                            <li className='m-[1px_5px] hover:bg-slate-100 rounded-[8px]'>
                                <Link to={`/admin/products/add`} className='flex justify-start pl-[50px] py-[6px]'>
                                    Thêm
                                </Link>
                            </li>
                            <li className='m-[1px_5px] hover:bg-slate-100 rounded-[8px]'>
                                <Link to={`/admin/products/add`} className='flex justify-start pl-[50px] py-[6px]'>
                                    Danh sách
                                </Link>
                            </li>
                        </ul>
                    )}

                    {/* Category Menu */}
                    <li className='p-[10px_15px] m-[4px_5px] rounded-[8px] hover:bg-slate-200'>
                        <a href="#" className='flex items-center justify-between' onClick={() => toggleMenu('categoryMenu')}>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                </svg>
                                <span className='ml-[5px]'>DANH MỤC</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-4 transform transition-transform ${openMenus.categoryMenu ? 'rotate-180' : 'rotate-0'}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                            </svg>
                        </a>
                    </li>
                    {openMenus.categoryMenu && (
                        <ul>
                            <li className='m-[1px_5px] hover:bg-slate-100 rounded-[8px]'>
                                <Link to={`/admin/categories/add`} className='flex justify-start pl-[50px] py-[6px]'>
                                    Thêm
                                </Link>
                            </li>
                            <li className='m-[1px_5px] hover:bg-slate-100 rounded-[8px]'>
                                <Link to={`/admin/products/add`} className='flex justify-start pl-[50px] py-[6px]'>
                                    Danh sách
                                </Link>
                            </li>
                        </ul>
                    )}

                    {/* Order Menu */}
                    <li className='p-[10px_15px] m-[4px_5px] rounded-[8px] hover:bg-slate-200'>
                        <a href="#" className='flex items-center justify-between' onClick={() => toggleMenu('orderMenu')}>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                </svg>
                                <span className='ml-[5px]'>ĐƠN HÀNG</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-4 transform transition-transform ${openMenus.orderMenu ? 'rotate-180' : 'rotate-0'}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                            </svg>
                        </a>
                    </li>
                    {openMenus.orderMenu && (
                        <ul>
                            <li className='pl-[45px] py-[5px] m-[1px_5px] hover:bg-slate-100 rounded-[8px]'>
                                <a href="">
                                    Thêm
                                </a>
                            </li>
                            <li className='pl-[45px] py-[5px] m-[1px_5px] hover:bg-slate-100 rounded-[8px]'>
                                <a href="">
                                    Danh sách
                                </a>
                            </li>
                        </ul>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Aside;
