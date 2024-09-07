import { getAllProducts } from '@/services/product'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorPage from '../../404/page'
import axios from 'axios'

type Props = {}

const ProductsList = (props: Props) => {

    const { id } = useParams()
    const [selectedColors, setSelectedColors] = useState<{ [key: number]: any }>({});

    // Load dau trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Query lấy tất cả các sản phẩm theo danh mục
    const { data: products, isLoading, isError, error } = useQuery({
        queryKey: ['collections', id],
        queryFn: async () => {
            return axios.get(`http://localhost:8080/api/collections/${id}`)
        },
    })
    
    const handleColorChange = (productIndex: number, item: any) => {
        setSelectedColors((prevColors) => ({
            ...prevColors,
            [productIndex]: item
        }));
    };

    if (isLoading) return <ErrorPage />
    if (isError) return <div>{error.message}</div>
    if (products?.data.length <= 0) return (<div>Dell co san pham nao</div>)

    return (
        
        <div className="grid grid-cols-4 lg:grid-cols-12 lg:px-[15px] lg:gap-2 pc:px-[48px]">
            {products?.data?.products.map((product: any, index: number) => {
                const selectedColor = selectedColors[index] || product.attributes[0]; // Sử dụng màu mặc định nếu chưa chọn
                return (
                    <div key={index} className="mb-[30px] col-span-2 relative lg:col-span-3 lg:mb-[40px]">
                        <div className="absolute top-[16px] right-[16px]">
                            <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                <div className="w-[24px] h-[24px]">
                                    <img src="https:file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                </div>
                            </div>
                        </div>
                        <Link to={`/products/${product._id}`} className="">
                            <picture>
                                <div className="pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${selectedColor?.images[0]})` }}></div>
                            </picture>
                        </Link>
                        <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                            <div className="">
                                <Link to={`/products/${product._id}`}>
                                    <h4 className='description2 mb-[5px] text-[14px] font-[600] cursor-pointer hover:text-[#BB9244] lg:text-[16px]'>{product.name}</h4>
                                </Link>
                                {product.attributes.map((item: any, itemIndex: number) => (
                                    <div key={itemIndex} className={`${itemIndex === 0 ? "flex" : "hidden"} text-[14px] font-[700]`}>
                                        {item.variants.map((value: any, sizeIndex: number) => (
                                            <span key={sizeIndex} className={`${sizeIndex === 0 ? "flex" : "hidden"}`}>{new Intl.NumberFormat('vi-VN').format(value.price)} VND</span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-1 justify-start mt-[18px]">
                                {product.attributes.map((item: any, colorIndex: number) => (
                                    <React.Fragment key={colorIndex}>
                                        <input
                                            className='hidden'
                                            type="radio"
                                            id={`${product.name}-${colorIndex}`}
                                            name={`options-${index}`}
                                            value="1"
                                            onChange={() => handleColorChange(index, item)}
                                        />
                                        <label htmlFor={`${product.name}-${colorIndex}`} className="w-[12px] h-[12px] cursor-pointer">
                                            <img src={item.color.color} className="w-[12px] h-[12px] rounded-[100%]" alt={item.color.color} />
                                        </label>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ProductsList
