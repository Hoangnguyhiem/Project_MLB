import { useEffect, useState } from "react";
import { Link } from "react-router-dom"


type Props = {
  closes: boolean;
  onClick: () => void;
}

const NotificationPage = ({ closes, onClick }: Props) => {


  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const { data } = JSON.parse(user)
      setUserid(data.id)
    }
  })
  const [userId, setUserid] = useState()

  return (
    <main className={`${closes ? "" : "hidden"} ${ userId ? "hidden" : "" }`}>
      <div className="fixed z-20 top-0 left-0 w-full h-[100%] text-center bg-black bg-opacity-[0.5]">
        <div className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] max-w-[430px] min-w-[300px] bg-white p-[20px] rounded-[10px]">

          <div className="mb-[30px]">
            <div onClick={onClick} className="flex justify-end w-[100%] cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className='text-[24px] font-[700] text-center mb-[24px]'>THÔNG BÁO</h1>
            <div className="text-[14px] font-[500]">
              Vui lòng <Link to={`/signin`} className="underline font-[700] hover:text-[#BB9244]">ĐĂNG NHẬP</Link> để có trải nghiệm các chức năng tốt hơn.
              <br />
              <p className="mt-[10px]">Nếu bạn chưa có tài khoản vui lòng nhấn nút đăng kí để có thêm sản phẩm vào giỏ hàng và 1 số chức năng khác...</p>
            </div>
          </div>
          <div className="flex flex-col w-[100%] text-[16px] mt-[30px]">
            <Link to={`/signup`} type="submit" className='px-[32px] py-[12px] bg-black text-white rounded-[4px]'>{'->'} ĐĂNG KÝ NGAY</Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default NotificationPage