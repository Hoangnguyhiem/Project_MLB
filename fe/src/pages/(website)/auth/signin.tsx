import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import axios from 'axios'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

type Props = {}
interface TAuth {
  _id?: string,
  name?: string,
  password: string,
  confirmPassword?: string
  email: string,
  date?: string
}

const Signin = (props: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TAuth>()
  const navigater = useNavigate()


  const [messageApi, contextHodlder] = message.useMessage()
  const { mutate } = useMutation({
    mutationFn: async (singin: TAuth) => {
      try {
        const {data}= await axios.post(`http://localhost:8080/api/auth/signin`, singin)
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // localStorage.setItem("user", JSON.stringify(user))
      } catch (error) {
        throw new Error('Đăng nhập thất bại')
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: 'success',
        content: 'Đăng nhập thành công',
      }),
      setTimeout(() => {
          navigater(`/`)
      }, 1000)
    },
    onError: (error) => {
      messageApi.open({
        type: 'error',
        content: error.message,
      })
    }
  })

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit: SubmitHandler<TAuth> = (data) => {
    mutate(data)
  }
  return (
    <main>
      {contextHodlder}
      <div className="px-[15px]">
        <div className="my-[24px] max-w-[430px]  mx-auto lg:my-[60px]">

          <div className="mb-[30px]">
            <h1 className='text-[24px] font-[700] text-center mb-[24px]'>ĐĂNG NHẬP</h1>
            <div className="text-[14px] font-[500]">
              Đăng ký thành viên và nhận ngay ưu đãi 10% cho đơn hàng đầu tiên
              <br />
              Nhập mã:
              <b>MLBWELCOME</b>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} action="">
            <div className="">
              <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
                <label className='mb-[8px] font-[500]' htmlFor="">EMAIL</label>
                <input {...register('email', { required: true })} className='border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px]' type="text" placeholder='Email' />
              </div>

              <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
                <label className='mb-[8px] font-[500]' htmlFor="">MẬT KHẨU</label>
                <input {...register('password', { required: true })} className=' border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px]' type="text" placeholder='Mật khẩu' />
              </div>

              <div className="flex flex-col w-[100%] text-[16px] mt-[24px]">
                <button type="submit" className='px-[32px] py-[12px] bg-black text-white rounded-[4px]'>ĐĂNG NHẬP</button>
              </div>

              <div className="mt-[16px]">
                <div className="flex justify-center items-center *:text-[14px] *:text-[#787878] *:font-[500]">
                  <a href="">Quên mật khẩu?</a>
                  <span className='mx-[10px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="2" height="10" viewBox="0 0 2 10" fill="none"> <rect x="0.5" width="1" height="10" fill="#D0D0D0"></rect> </svg>
                  </span>
                  <a href="">Đăng ký</a>
                </div>
              </div>
            </div>
          </form>

          <div className="flex justify-evenly my-[32px] *:text-[14px] *:text-[#787878]">
            <button>
              <div className="mb-[5px] flex justify-center items-center">
                <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRcJCBNNt1a5beIvBpfZ_vM82U1B3AHdou0Pi50225Ng5dtIE_R" alt="" width={40} height={40} />
              </div>
              <span>DĂNG NHẬP GOOGLE</span>
            </button>
            <button>
              <div className="mb-[5px] flex justify-center items-center">
                <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTFPNc3va29d6z1y9PQDmou5b5VlkC7t2u0swQfnJBKsE3Im2wF" alt="" width={40} height={40} />
              </div>
              <span>ĐĂNG NHẬP FACEBOOK</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Signin