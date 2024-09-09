import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from '../404/page';

type Props = {
  onClicks: () => void;
}
const DetailPage = ({ onClicks }: Props) => {
  
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()

  const [quantity, setQuantity] = useState<number>(1)
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [attribute, setAttribute] = useState<any>({});
  const [variant, setVariant] = useState<any>({});
  console.log('attribute',attribute);

  console.log(variant);
  

  const [todo, setTodo] = useState(false)
  const { productId } = useParams()

  const [userId, setUserId] = useState()

  if (quantity <= 0) setQuantity(1)
  // Load dau trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lấy sản phẩm theo id
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', productId],
    queryFn: () => {
      return axios.get(`http://localhost:8080/api/products/${productId}`)
    }
  })


  // Tự động chọn size đầu tiên của màu được chọn
  useEffect(() => {
    if (attribute) {
      const colorData = data?.data.attributes.find((color: any) => color._id === attribute._id);
      if (colorData) {
        const availableSize = colorData.variants.find((size: any) => size.stock > 0);
        if (availableSize) {
          setVariant(availableSize);
        } else {
          setVariant('');
        }
      }
    }
  }, [attribute.color, data]);

  // Tự động chọn màu
  useEffect(() => {
    if (data?.data.attributes?.[0]) {
      const attribute = data.data.attributes[0];
      attribute && setAttribute(attribute);
    }
  }, [data]);

  const user = localStorage.getItem("user")
  useEffect(() => {
    if (user) {
      const { data } = JSON.parse(user)
      const userId = data.id
      setUserId(userId)

    }
  })

  // Sử lý trạng thái thêm giỏ hàng
  const { mutate } = useMutation({
    mutationFn: async (cart: any) => {
      try {
        // console.log(cart);
        
        if (user) {
          await axios.post(`http://localhost:8080/api/carts/add-to-cart`, { ...cart, userId });
        } else {
          onClicks()
          throw new Error("")
        }
      } catch (error) {
        throw new Error("Them vao gio hang that bai")
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Them vao gio hang thanh cong",
      }),
        queryClient.invalidateQueries({
          queryKey: ['carts', userId],
        })
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: error.message,
      })
    }

  })

  // Lấy thông tin sản phẩm để lưu vào giỏ hàng
  const { _id: variantId, price, size: sizeDetail, slug, status, discount } = variant
  
  const { _id: attributeId, color: colorDetail, images } = attribute

  
  const name = data?.data.name
  const color  = colorDetail?.color
  const size = sizeDetail?.name
  // console.log(size);
  


  // Submit thêm thông tin vào giỏ hàng
  const onSubmitCart = () => {
    mutate({ productId,variantId, attributeId, price, size, slug, status, discount, color, images, name, quantity } as any)
  }

  const onSubmit = () => {
    // localStorage.setItem("buy", JSON.stringify({ attribute, variant, quantity }))
  }

  // Dot của slide
  const handleThumbnailClick = (index: any) => {
    setCurrentIndex(index);
  };

  // Button Next và Prev của slide
  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % data?.data.attributes[0].images.length);
  };
  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + data?.data.attributes[0].images.length) % data?.data.attributes[0].images.length);
  };






  if (isLoading) return <ErrorPage />
  if (isError) return <div>{error.message}</div>

  return (
    <>
      {contextHolder}
      <main >
        <div className="lg:mt-[34px]">
          <div className="pc:px-[48px] lg:flex lg:flex-wrap">
            <div className="lg:w-[55%] lg:px-[5%] lg:mb-[30px] lg:flex lg:gap-4 lg:h-screen">
              <div className="relative lg:w-[86%] lg:order-2">
                <div className="">
                  <div className="w-[100%] relative">
                    {data?.data.attributes.map((item: any) => (
                      <div key={item._id} className={`${attribute._id === item._id ? "" : "hidden"}`}>
                        {item.images.map((value: any, index: any) => (
                          <div
                            key={index}
                            className={`${index === currentIndex ? "" : "hidden"} pt-[124%] bg-cover bg-no-repeat bg-center`}
                            style={{ backgroundImage: `url(${value})` }}
                          >
                            <div className="absolute top-[50%] translate-y-[-50%] text-black flex w-[100%] justify-between">
                              <button
                                className="w-[40px] h-[40px] flex justify-center items-center"
                                onClick={handlePrev}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="30"
                                  height="30"
                                  viewBox="0 0 24 46"
                                  fill="none"
                                >
                                  <path
                                    d="M22.5 43.8335L1.66666 23.0002L22.5 2.16683"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="square"
                                  ></path>
                                </svg>
                              </button>
                              <button
                                className="w-[40px] h-[40px] flex justify-center items-center"
                                onClick={handleNext}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="30"
                                  height="30"
                                  viewBox="0 0 24 46"
                                  fill="none"
                                >
                                  <path
                                    d="M1.66675 2.1665L22.5001 22.9998L1.66675 43.8332"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="square"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-[15px] left-[50%] translate-x-[-50%] lg:hidden">
                  {data?.data.attributes[0].images.map((_: any, dotIndex: any) => (
                    <button
                      key={dotIndex}
                      className={`w-[8px] h-[8px] rounded-[50%] border-[1px] mx-[3.5px] ${dotIndex === currentIndex ? 'bg-black border-transparent' : 'bg-white border-[#bcbcbc]'}`}
                      onClick={() => handleThumbnailClick(dotIndex)}
                    >
                    </button>
                  ))}
                </div>
              </div>

              {data?.data.attributes.map((item: any) => (
                <div
                  key={item._id}
                  className={`${attribute._id === item._id ? "lg:flex" : "lg:hidden"} hidden lg:w-[14%] lg:flex-col lg:overflow-auto lg:order-1 lg:gap-4 lg:pr-[8px] lg:h-[96%] scrollbar`}
                >
                  {item.images.map((value: any, index: any) => (
                    <div
                      key={index}
                      className={`pt-[120%] bg-cover bg-no-repeat bg-center cursor-pointer relative ${index === currentIndex ? 'border-[#bcbcbc] border-[1px]' : ''}`} // Apply the custom border class
                      style={{ backgroundImage: `url(${value})` }}
                      onClick={() => handleThumbnailClick(index)}
                    ></div>
                  ))}
                </div>
              ))}
            </div>


            <div className="lg:w-[45%] lg:pl-[44px] lg:sticky lg:top-0 h-fit">
              <div className="mt-[20px] lg:mt-0">

                <div className="flex justify-between px-[20px] lg:px-0">

                  <div className="">
                    <h1 className='text-[18px] mb-[8px] font-[500] leading-6'>{name}</h1>

                    {data?.data.attributes.map((item: any) => (
                      <div className={`${item._id === attribute._id ? "flex" : "hidden"} h-[12px] overflow-hidden`}>
                        {item.variants.map((value: any, index: any) => (
                          <p key={index + 1} className={`${value._id === variant._id ? "flex" : "hidden"} text-[12px] leading-3 font-[500]`}>
                            Mã sản phẩm: <span> {value.slug}</span>
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="flex">
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"> <path d="M21.6969 8.01054C22.1594 8.80179 23.018 9.33333 24.0006 9.33333C25.4734 9.33333 26.6673 8.13943 26.6673 6.66667C26.6673 5.19391 25.4734 4 24.0006 4C22.5279 4 21.334 5.19391 21.334 6.66667C21.334 7.15674 21.4662 7.61594 21.6969 8.01054ZM21.6969 8.01054L10.3044 14.6561M10.3044 14.6561C9.84187 13.8649 8.98334 13.3333 8.00065 13.3333C6.52789 13.3333 5.33398 14.5272 5.33398 16C5.33398 17.4728 6.52789 18.6667 8.00065 18.6667C8.98334 18.6667 9.84187 18.1351 10.3044 17.3439M10.3044 14.6561C10.5351 15.0507 10.6673 15.5099 10.6673 16C10.6673 16.4901 10.5351 16.9493 10.3044 17.3439M10.3044 17.3439L21.6969 23.9895M21.6969 23.9895C22.1594 23.1982 23.018 22.6667 24.0006 22.6667C25.4734 22.6667 26.6673 23.8606 26.6673 25.3333C26.6673 26.8061 25.4734 28 24.0006 28C22.5279 28 21.334 26.8061 21.334 25.3333C21.334 24.8433 21.4662 24.3841 21.6969 23.9895Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg>
                    </a>
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"> <g clip-path="url(#wishlist-svg)"> <path d="M15.7232 25.5459L7.37014 17.1929C5.20995 15.0327 5.20995 11.5303 7.37014 9.37014C9.53033 7.20995 13.0327 7.20995 15.1929 9.37014L15.7232 9.90047L16.2535 9.37014C18.4137 7.20995 21.9161 7.20995 24.0763 9.37014C26.2365 11.5303 26.2365 15.0327 24.0763 17.1929L15.7232 25.5459Z" stroke="black" stroke-width="1.5" stroke-linecap="round"></path> </g> <defs> <clipPath id="wishlist-svg"> <rect width="32" height="32" fill="white"></rect> </clipPath> </defs> </svg>
                    </a>
                  </div>

                </div>

                {
                  data?.data.attributes.map((item: any, index: any) => (
                    <div key={index + 1} className={`${item._id === attribute._id ? "flex" : "hidden"} tab_price px-[20px] my-[18px] h-[25px] overflow-hidden *:text-[20px] font-[500] lg:px-0`}>
                      {item.variants.map((value: any, index: any) => (
                        <span className={`${value._id === variant._id ? "flex" : "hidden"}`} key={index + 1}>{new Intl.NumberFormat('vi-VN').format(value.price)} VND</span>
                      ))}
                    </div>
                  ))
                }

                <div className="flex justify-start gap-3 px-[20px] mb-[20px] lg:px-0">
                  {
                    data?.data.attributes.map((item: any, index: any) => (
                      <>
                        <input
                          className='hidden'
                          type="radio"
                          id={item._id}
                          name="options"
                          value="1"
                          onChange={() => setAttribute(item)}
                        />
                        <label htmlFor={item._id} key={index + 1} className={`${attribute._id === item._id ? "border-black" : ""} after relative w-[42px] h-[42px] rounded-[50%] border-[1px] border-solid flex justify-center text-center`}>
                          <div className="w-[40px] h-[40px] rounded-[50%] border-[5px] border-solid border-white" style={{ backgroundImage: `url('${item.color?.color}')` }}></div>
                        </label>
                      </>
                    ))
                  }
                </div>
              </div>

              <div className="px-[20px] lg:px-0">
                <div className="flex justify-between mb-[25px]">
                  <h4 className='text-[16px] font-[500]'>Chọn kích thước</h4>
                  <span onClick={() => setTodo(!todo)} className='cursor-pointer flex items-center text-[14px] font-[500]'>
                    <svg className='mr-[5px]' xmlns="http://www.w3.org/2000/svg" width="20" height="9" viewBox="0 0 20 9" fill="none"> <rect x="0.5" y="0.5" width="19" height="8" rx="0.5" stroke="black"></rect> <rect x="3.5" y="4" width="1" height="4" fill="black"></rect> <rect x="6.5" y="6" width="1" height="2" fill="black"></rect> <rect x="12.5" y="6" width="1" height="2" fill="black"></rect> <rect x="9.5" y="4" width="1" height="4" fill="black"></rect> <rect x="15.5" y="4" width="1" height="4" fill="black"></rect> </svg>
                    Hướng dẫn kích thước
                  </span>
                </div>

                <div className="">
                  {
                    data?.data.attributes.map((item: any, index: any) => (

                      <div key={index + 1} className={`${item._id === attribute._id ? "flex" : "hidden"} flex-wrap *:text-[14px] *:justify-center *:items-center *:rounded-[18px] *:mb-[8px] *:mr-[8px] *:px-[16px] *:py-[7.5px] *:cursor-pointer *:min-w-[65px] *:border-[#E8E8E8] *:border-[1px] *:border-solid *:font-[500]`}>
                        {item.variants.map((value: any, index: any) => (
                          <>
                            <input
                              className='hidden'
                              type="radio"
                              id={value._id}
                              name="options1"
                              value="1"
                              onChange={() => setVariant(value)}
                            />

                            {value.stock === 0 ?
                              <label htmlFor={value._id} key={index + 1} className="flex pointer-events-none bg-[#F8F8F8] text-[#D0D0D0]">{value.size?.name}</label> :
                              <label htmlFor={value._id} key={index + 1} className={`flex ${variant._id === value._id ? "bg-black text-white" : "bg-white text-black"}`}>{value.size?.name}</label>
                            }
                          </>
                        ))}
                      </div>
                    ))
                  }
                </div>

                <div className="my-[24px]">
                  <div className="border-[#E8E8E8] border-[1px] border-solid h-[48px] w-full flex justify-between *:justify-center">
                    <button onClick={() => setQuantity(quantity - 1)} className='flex items-center w-[48px]'>-</button>
                    <input className='pointer-events-none bg-transparent outline-none border-none w-[calc(100%-96px)] flex text-center text-[14.5px] font-[500]' min={1} max={10} type="number" value={quantity} name="" id="" />
                    <button onClick={() => setQuantity(quantity + 1)} className='flex items-center w-[48px]'>+</button>
                  </div>
                </div>

                <div className="*:h-[56px] *:w-[50%] flex fixed bottom-0 w-[100%] left-0 z-10 lg:static">
                  <button onClick={() => { onSubmitCart() }} className='text-white bg-black'>THÊM VÀO GIỎ</button>
                  <button onClick={() => { onSubmit() }} className='text-white bg-[#b01722]'>MUA NGAY</button>
                </div>

                <div className="p-[12px] my-[10px] bg-[#fafafa] border-[1px] border-[dfdfdf] border-solid rounded-[4px]">
                  <b className='font-[700] text-[15px] leading-7'>MLB Chào bạn mới</b>
                  <br />
                  <p className='font-[500] text-[14px] leading-7'>Nhận ngay ưu đãi 5% khi đăng ký thành viên và mua đơn hàng nguyên giá đầu tiên tại website*</p>
                  <p className='font-[500] text-[14px] leading-7'>Nhập mã: MLBWELCOME</p>
                  <p className='font-[500] text-[14px] leading-7'> Ưu đãi không áp dụng cùng với các CTKM khác</p>
                </div>

              </div>
            </div>

            <div className="lg:w-[55%] px-[15px] lg:px-0">
              <div className="*:text-[14px] *:font-[600] *:py-[13px] *:px-[15px] overflow-x-auto whitespace-nowrap scrollbar flex ">
                <div className="border-b-[3px] border-[black]">THÔNG TIN SẢN PHẨM</div>
                <div className="">HƯỚNG DẪN BẢO QUẢN</div>
                <div className="">TÌM TẠI CỬA HÀNG</div>
                <div className="">CHÍNH SÁCH ĐỔI TRẢ</div>
              </div>

              <div className="lg:pt-[20px]">
                <p>Varsity Soccer Jersey thuộc bộ sưu tập Varsity
                  như bản tuyên ngôn cho phong cách thời trang cá
                  tính, thời thượng. Nổi bật với kỹ thuật in độc
                  đáo trên nền chất liệu đặc biệt với những đường
                  kẻ sọc màu tương phản, Varsity Soccer Jersey sẵn
                  sàng thay bạn khẳng định phong cách thời trang của
                  mình.</p>
                <p>
                  Thương hiệu: MLB&nbsp;
                  <br />
                  Xuất xứ: Hàn Quốc&nbsp;
                  <br />
                  Giới tính: Unisex&nbsp;
                  <br />
                  Kiểu dáng: Áo thun
                  <br />
                  Màu sắc: Blue, Red, Silver
                  <br />
                  Chất liệu: 35% Cotton, 65% Polyester
                  <br />
                  Hoạ tiết: Trơn một màu
                  <br />
                  Thiết kế:
                </p>
                <ul>
                  <li>Bo viền cổ áo với các đường kẻ sọc màu tương phản</li>
                  <li>Thiết kế chữ số in lớn nổi bật ở mặt trước</li>
                  <li>Chất vải cao cấp, thoáng mát và co giãn thoải mái</li>
                  <li>Đường may tỉ mỉ, chắc chắn</li>
                  <li>Màu sắc hiện đại, trẻ trung dễ dàng phối với nhiều trang phục và phụ kiện khác</li>
                </ul>
                <p>Logo: Chi tiết logo được in ở mặt sau áo<br />
                  Phom áo: Over fit rộng thoải mái
                  <br />
                  Thích hợp mặc trong các dịp: Đi chơi, đi làm,....
                  <br />
                  Xu hướng theo mùa: Sử dụng được tất cả các mùa trong năm
                </p>
              </div>

            </div>

          </div>




          <div className="">
            <div className="mt-[48px]">
              <div className="px-[15px] pc:px-[48px]">
                <h3 className='text-[20px] mb-[20px] font-[700]'>Có thể bạn cũng thích</h3>
                <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar lg:gap-4">

                  <div className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                    <div className="absolute top-[16px] right-[16px]">
                      <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                        <div className="w-[24px] h-[24px]">
                          <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                      <div className="text-white text-[18px] font-[700]">1</div>
                    </div>
                    <div className="">
                      <picture>
                        <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
                      </picture>
                    </div>
                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                      <div className="">
                        <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
                        <div className="text-[14px] font-[700]">
                          <span className=''>1.090.000</span><sup className='underline'>đ</sup>
                        </div>
                      </div>
                      <div className="flex gap-1 justify-start mt-[18px]">
                        <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                        <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                    <div className="absolute top-[16px] right-[16px]">
                      <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                        <div className="w-[24px] h-[24px]">
                          <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                      <div className="text-white text-[18px] font-[700]">1</div>
                    </div>
                    <div className="">
                      <picture>
                        <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
                      </picture>
                    </div>
                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                      <div className="">
                        <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
                        <div className="text-[14px] font-[700]">
                          <span className=''>1.090.000</span><sup className='underline'>đ</sup>
                        </div>
                      </div>
                      <div className="flex gap-1 justify-start mt-[18px]">
                        <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                        <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                    <div className="absolute top-[16px] right-[16px]">
                      <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                        <div className="w-[24px] h-[24px]">
                          <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                      <div className="text-white text-[18px] font-[700]">1</div>
                    </div>
                    <div className="">
                      <picture>
                        <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
                      </picture>
                    </div>
                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                      <div className="">
                        <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
                        <div className="text-[14px] font-[700]">
                          <span className=''>1.090.000</span><sup className='underline'>đ</sup>
                        </div>
                      </div>
                      <div className="flex gap-1 justify-start mt-[18px]">
                        <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                        <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                    <div className="absolute top-[16px] right-[16px]">
                      <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                        <div className="w-[24px] h-[24px]">
                          <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                      <div className="text-white text-[18px] font-[700]">1</div>
                    </div>
                    <div className="">
                      <picture>
                        <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
                      </picture>
                    </div>
                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                      <div className="">
                        <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
                        <div className="text-[14px] font-[700]">
                          <span className=''>1.090.000</span><sup className='underline'>đ</sup>
                        </div>
                      </div>
                      <div className="flex gap-1 justify-start mt-[18px]">
                        <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                        <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                    <div className="absolute top-[16px] right-[16px]">
                      <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                        <div className="w-[24px] h-[24px]">
                          <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                      <div className="text-white text-[18px] font-[700]">1</div>
                    </div>
                    <div className="">
                      <picture>
                        <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
                      </picture>
                    </div>
                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                      <div className="">
                        <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
                        <div className="text-[14px] font-[700]">
                          <span className=''>1.090.000</span><sup className='underline'>đ</sup>
                        </div>
                      </div>
                      <div className="flex gap-1 justify-start mt-[18px]">
                        <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                        <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                    <div className="absolute top-[16px] right-[16px]">
                      <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                        <div className="w-[24px] h-[24px]">
                          <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                      <div className="text-white text-[18px] font-[700]">1</div>
                    </div>
                    <div className="">
                      <picture>
                        <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
                      </picture>
                    </div>
                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                      <div className="">
                        <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
                        <div className="text-[14px] font-[700]">
                          <span className=''>1.090.000</span><sup className='underline'>đ</sup>
                        </div>
                      </div>
                      <div className="flex gap-1 justify-start mt-[18px]">
                        <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                        <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="px-[15px] mt-[48px] pc:px-[48px]">
                <h3 className='text-[20px] mb-[20px] font-[700]'>Sản phẩm đã xem</h3>
                <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar lg:gap-4">

                  <div className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                    <div className="absolute top-[16px] right-[16px]">
                      <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                        <div className="w-[24px] h-[24px]">
                          <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                      <div className="text-white text-[18px] font-[700]">1</div>
                    </div>
                    <div className="">
                      <picture>
                        <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
                      </picture>
                    </div>
                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                      <div className="">
                        <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
                        <div className="text-[14px] font-[700]">
                          <span className=''>1.090.000</span><sup className='underline'>đ</sup>
                        </div>
                      </div>
                      <div className="flex gap-1 justify-start mt-[18px]">
                        <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                        <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                    <div className="absolute top-[16px] right-[16px]">
                      <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                        <div className="w-[24px] h-[24px]">
                          <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                      <div className="text-white text-[18px] font-[700]">1</div>
                    </div>
                    <div className="">
                      <picture>
                        <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
                      </picture>
                    </div>
                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                      <div className="">
                        <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
                        <div className="text-[14px] font-[700]">
                          <span className=''>1.090.000</span><sup className='underline'>đ</sup>
                        </div>
                      </div>
                      <div className="flex gap-1 justify-start mt-[18px]">
                        <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                        <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                    <div className="absolute top-[16px] right-[16px]">
                      <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                        <div className="w-[24px] h-[24px]">
                          <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                      <div className="text-white text-[18px] font-[700]">1</div>
                    </div>
                    <div className="">
                      <picture>
                        <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
                      </picture>
                    </div>
                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                      <div className="">
                        <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
                        <div className="text-[14px] font-[700]">
                          <span className=''>1.090.000</span><sup className='underline'>đ</sup>
                        </div>
                      </div>
                      <div className="flex gap-1 justify-start mt-[18px]">
                        <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                        <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                    <div className="absolute top-[16px] right-[16px]">
                      <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                        <div className="w-[24px] h-[24px]">
                          <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                      <div className="text-white text-[18px] font-[700]">1</div>
                    </div>
                    <div className="">
                      <picture>
                        <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
                      </picture>
                    </div>
                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                      <div className="">
                        <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
                        <div className="text-[14px] font-[700]">
                          <span className=''>1.090.000</span><sup className='underline'>đ</sup>
                        </div>
                      </div>
                      <div className="flex gap-1 justify-start mt-[18px]">
                        <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                        <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                    <div className="absolute top-[16px] right-[16px]">
                      <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                        <div className="w-[24px] h-[24px]">
                          <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                      <div className="text-white text-[18px] font-[700]">1</div>
                    </div>
                    <div className="">
                      <picture>
                        <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
                      </picture>
                    </div>
                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                      <div className="">
                        <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
                        <div className="text-[14px] font-[700]">
                          <span className=''>1.090.000</span><sup className='underline'>đ</sup>
                        </div>
                      </div>
                      <div className="flex gap-1 justify-start mt-[18px]">
                        <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                        <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-[38.8%] basis-[38.8%] shrink-0 relative relatives lg:max-w-[19.157%] lg:basis-[19.157%]">
                    <div className="absolute top-[16px] right-[16px]">
                      <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                        <div className="w-[24px] h-[24px]">
                          <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-black h-[30px] w-[30px] top-0 left-0 z-1 flex items-center justify-center">
                      <div className="text-white text-[18px] font-[700]">1</div>
                    </div>
                    <div className="">
                      <picture>
                        <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://product.hstatic.net/200000642007/product/50ivs_3atsv2143_1_bc24aeae61864aac8fd717a2e5837448_34181f53e68d4b439b1bc95d333cbd79_grande.jpg')", }}></div>
                      </picture>
                    </div>
                    <div className="w-[100%] text-wrap px-[8px] pt-[10px]">
                      <div className="">
                        <h4 className='description2 mb-[5px] text-[14px] font-[600]'>MLB - Áo thun cổ tròn tay ngắn Varsity Number Overfit</h4>
                        <div className="text-[14px] font-[700]">
                          <span className=''>1.090.000</span><sup className='underline'>đ</sup>
                        </div>
                      </div>
                      <div className="flex gap-1 justify-start mt-[18px]">
                        <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                        <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>



          </div>
        </div>
        <div className={`${todo ? "" : "hidden"} fixed w-full h-full top-0 left-0 bg-black z-10 bg-opacity-[0.5] flex justify-center items-center`}>
          <div className="max-w-[900px] p-[16px] rounded-[7px] bg-white">
            <div className="float-right cursor-pointer" onClick={() => { setTodo(!todo) }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
            <img className='' src="https://file.hstatic.net/1000284478/file/mlb_new_ao_unisex_-_desktop_9701027a890a4e1d885ae36d5ce8ece7.jpg" alt="" />
          </div>
        </div>

      </main>

    </>
  )
}

export default DetailPage