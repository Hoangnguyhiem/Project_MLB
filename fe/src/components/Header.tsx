import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
type Props = {
  onClicks: () => void;
}

const Header = ({ onClicks }: Props) => {

  const [openCategories, setOpenCategories] = useState<boolean>(false); // State để theo dõi danh mục đang mở

  const [openMenu, setOpenMenu] = useState(null); // State để theo dõi danh mục đang mở
  const [openMenu1, setOpenMenu1] = useState(null); // State để theo dõi danh mục đang mở

  const toggleMenu = (collectionId: any) => {
    setOpenMenu(openMenu === collectionId ? null : collectionId);
  };
  const toggleMenu1 = (collectionId: any) => {
    setOpenMenu1(openMenu1 === collectionId ? null : collectionId);
  };

  // Lấy danh all danh muc
  const { data: collections } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      return axios.get('http://localhost:8080/api/collections')
    },
  })

  // Hàm chỉ viết hoa chữ cái đầu
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const token = localStorage.getItem('accessToken');
  // Lấy thông tin giỏ hàng
  const { data: carts } = useQuery({
    queryKey: ['carts'],
    queryFn: () => {
        return axios.get(`http://localhost:8080/api/carts`, {
            headers: {
                Authorization: `Bearer ${token}`, // Truyền token vào header
              },
        })
    }
})


  return (
    <>
      <div className="bg-black h-[42px] text-center flex">
        <span className='text-white justify-center flex m-auto text-[11px] font-[600] lg:text-[14px]'>Ưu đãi 5% cho dơnd hàng đầu tiên* | Nhập mã: MLBWELCOM</span>
      </div>
      <header className='py-[8px] h-[57px] sticky top-0 z-10 bg-white lg:h-[64px] mt-[0.1px]'>
        <div className="flex text-center justify-center h-[100%] px-[15px] pc:px-[48px]">
          <div className="flex">
            <div onClick={() => setOpenCategories(!openCategories)} className="flex items-center lg:hidden">
              <div className='w-[40px] h-[40px] flex justify-center items-center'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="10" y="4" width="12" height="1" rx="0.5" fill="#000"></rect> <rect x="6" y="11" width="12" height="1" rx="0.5" fill="#000"></rect> <rect x="2" y="18" width="12" height="1" rx="0.5" fill="#000"></rect> </svg>
              </div>
            </div>
            <div className="flex items-center">
              <Link to={`/`} className='lg:hidden w-[84px] h-[40px] flex justify-center items-center text-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="69.53" height="24" viewBox="0 0 84 24" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M27.6027 0L17.7745 10.585L14.1671 0H6.94734V0.005L5.41862 0L6.33686 2.365L1.14528 19.9L0 24H7.24501L10.6203 12.505L13.1177 18.435H17.8199L23.8036 12.505L20.4283 24H27.7742L34.8224 0H27.6027ZM75.8708 7.25C75.5933 8.195 74.67 9.205 72.6519 9.205H68.0758L69.2261 5.295H73.8022C75.8153 5.295 76.1483 6.305 75.8708 7.25ZM73.5499 16.585C73.2573 17.595 72.2583 18.71 70.2402 18.71H65.2908L66.5269 14.495H71.4814C73.4944 14.495 73.8526 15.575 73.555 16.585H73.5499ZM83.1208 7.04C84.3317 2.895 82.031 0 75.8203 0H61.86L62.7884 2.2L57.1831 21.68L54.7714 24H69.4078C74.7356 24 79.5336 23.5 80.8807 18.915C81.8696 15.545 80.8858 12.69 79.8464 12.08C80.916 11.575 82.3186 9.77 83.1208 7.04ZM41.1896 18.74H51.3709H51.376C51.418 18.7175 51.4112 18.7212 51.3897 18.733C51.2824 18.7916 50.8087 19.0503 54.2568 17.225L52.1984 23.995H30.6853L32.9961 21.69L38.7527 2.32L37.7891 0H46.694L41.1896 18.74Z" fill="black"></path> </svg>
              </Link>
              <Link to={`/`} className='hidden lg:flex w-[84px] h-[40px] justify-center items-center text-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="84" height="24" viewBox="0 0 84 24" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M27.6027 0L17.7745 10.585L14.1671 0H6.94734V0.005L5.41862 0L6.33686 2.365L1.14528 19.9L0 24H7.24501L10.6203 12.505L13.1177 18.435H17.8199L23.8036 12.505L20.4283 24H27.7742L34.8224 0H27.6027ZM75.8708 7.25C75.5933 8.195 74.67 9.205 72.6519 9.205H68.0758L69.2261 5.295H73.8022C75.8153 5.295 76.1483 6.305 75.8708 7.25ZM73.5499 16.585C73.2573 17.595 72.2583 18.71 70.2402 18.71H65.2908L66.5269 14.495H71.4814C73.4944 14.495 73.8526 15.575 73.555 16.585H73.5499ZM83.1208 7.04C84.3317 2.895 82.031 0 75.8203 0H61.86L62.7884 2.2L57.1831 21.68L54.7714 24H69.4078C74.7356 24 79.5336 23.5 80.8807 18.915C81.8696 15.545 80.8858 12.69 79.8464 12.08C80.916 11.575 82.3186 9.77 83.1208 7.04ZM41.1896 18.74H51.3709H51.376C51.418 18.7175 51.4112 18.7212 51.3897 18.733C51.2824 18.7916 50.8087 19.0503 54.2568 17.225L52.1984 23.995H30.6853L32.9961 21.69L38.7527 2.32L37.7891 0H46.694L41.1896 18.74Z" fill="black"></path> </svg>
              </Link>
            </div>
          </div>

          <div className={`${openCategories ? "" : "hidden lg:block"} fixed top-0 left-0 bg-white w-[100%] h-[100%] z-20 lg:static lg:items-center lg:ml-[30px]`}>
            <div onClick={() => setOpenCategories(!openCategories)} className="lg:hidden p-[19px_20px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none"><path d="M3 10L18.1667 10" stroke="black" stroke-width="1.2" stroke-linecap="square"></path><path d="M10 1.83325L1.83334 9.99992L10 18.1666" stroke="black" stroke-width="1.2" stroke-linecap="square"></path></svg>
            </div>
            <nav className="overflow-y-auto h-full lg:h-auto lg:overflow-hidden">
              <ul className="px-[20px] lg:flex text-[14px] font-[500] lg:text-[17px] lg:font-[700]">

                {collections?.data.map((collection: any) => (
                  <li key={collection._id} className="group mb-[10px] lg:m-0">
                    <h4 className="flex justify-between items-center w-[100%] py-[10px] lg:py-0">
                      <Link onClick={() => setOpenCategories(!openCategories)} to={`collections/${collection._id}`} className="w-full flex h-full lg:h-auto hover:text-[#BB9244] lg:hover:border-b-[1px] lg:hover:border-b-black lg:py-[15px] lg:px-[18px]"> {collection.name}</Link>
                      <span onClick={() => toggleMenu(collection._id)} className="lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </span>
                    </h4>

                    {collection.name == "GIẢM GIÁ" ? "" : (
                      <div className={`${openMenu === collection._id ? 'block lg:hidden' : 'hidden'
                        } lg:group-hover:block lg:hidden lg:absolute lg:py-[30px] lg:w-[100%] lg:top-[100%] lg:bg-white lg:left-0 lg:z-10`}>
                        <div className="lg:flex lg:justify-center lg:max-w-[1200px] lg:m-[0_auto]">
                          <ul className={` p-[15px_0px_15px_15px] ml-[15px] mt-[15px] lg:p-0 lg:m-0 lg:flex lg:min-w-[700px] lg:*:text-[14px]`}>
                            {collection.subcategoriesId.map((collection: any, index: any) => (
                              <li key={collection._id} className={`${index == 0 ? "" : "lg:pl-[40px]"} lg:block lg:text-left`}>
                                <h4 className="flex justify-between items-center w-[100%] py-[10px] lg:py-0">
                                  <Link onClick={() => setOpenCategories(!openCategories)} to={`collections/${collection._id}`} className="w-full flex lg:mb-[12px]">
                                    {collection.name}
                                  </Link>
                                  <span onClick={() => toggleMenu1(collection._id)} className="lg:hidden">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                  </span>
                                </h4>
                                <ul className={`${openMenu1 === collection._id ? 'block lg:hidden' : 'hidden'} p-[15px_0px_15px_15px] ml-[15px] mt-[15px] lg:p-0 lg:m-0 lg:block lg:*:font-[500] lg:*:text-[#787878]`}>

                                  {collection.subcategoriesId.map((collection: any) => (
                                    <li key={collection._id} className="flex py-[10px] lg:p-0 lg:mt-[4px]">
                                      <Link onClick={() => setOpenCategories(!openCategories)} to={`collections/${collection._id}`} className="w-full flex">
                                        {capitalizeFirstLetter(collection.name)}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </li>

                            ))}
                          </ul>
                          <div className="banner-submenu hidden lg:block pl-[45px] ml-[45px] mx-w-[355px] border-l-[1px] border-l-[#eeeeee]">
                            <img className="" alt="QUẦN ÁO|APPAREL" width="309" height="309" src={collection.image} />
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="ml-auto grid grid-cols-3 grid-rows-1 lg:grid-cols-4">
            <div className="flex items-center">
              <a href="" className='w-[40px] h-[40px] flex justify-center items-center text-center'>
                <img className=" ls-is-cached lazyloaded" src="https://file.hstatic.net/200000642007/file/icon-search_f3577f42c6314038a0636c20100bd8d9.svg" data-src="https://file.hstatic.net/200000642007/file/icon-search_f3577f42c6314038a0636c20100bd8d9.svg" alt="Icon search" width={24} height={24} />
              </a>
            </div>
            <Link to={`/carts`} className="relative flex items-center col-start-3 lg:col-start-2">
              <div 
                onClick={carts ? undefined : onClicks} className='w-[40px] h-[40px] flex justify-center items-center text-center'>
                <img className=" ls-is-cached lazyloaded" src="https://file.hstatic.net/200000642007/file/icon-cart_d075fce117f74a07ae7f149d8943fc33.svg" data-src="https://file.hstatic.net/200000642007/file/icon-cart_d075fce117f74a07ae7f149d8943fc33.svg" alt="Icon cart" width={24} height={24} />
              </div>
              <div className={`${carts ? "" : "hidden"} absolute w-[13px] h-[13px] text-[9px] rounded-[100%] top-[10px] right-[5px] bg-black text-white flex items-center justify-center`}>{carts?.data.totalQuantity ? carts?.data.totalQuantity : 0}</div>
            </Link>
            <Link to={`/account/wishlist`} className="items-center hidden lg:flex col-start-2 row-start-1 lg:col-start-3">
              <a href="" className='w-[40px] h-[40px] flex justify-center items-center text-center'>
                <img className=" ls-is-cached lazyloaded" src="	https://file.hstatic.net/200000642007/file/icon-wishlist_86d7262a56ae455fa531e6867655996d.svg" data-src="	https://file.hstatic.net/200000642007/file/icon-wishlist_86d7262a56ae455fa531e6867655996d.svg" alt="Icon cart" width={24} height={24} />
              </a>
            </Link>
            <Link to={`/account`} className="flex items-center col-start-2 row-start-1 lg:col-start-4">
              <a href="" className='w-[40px] h-[40px] flex justify-center items-center text-center'>
                <img className=" ls-is-cached lazyloaded" src="https://file.hstatic.net/200000642007/file/icon-account_5d386c88832c4872b857c0da62a81bbc.svg" data-src="https://file.hstatic.net/200000642007/file/icon-account_5d386c88832c4872b857c0da62a81bbc.svg" alt="Icon account" width={24} height={24} />
              </a>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
