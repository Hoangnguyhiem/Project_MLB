import CategoryAddPage from "@/pages/(dashboard)/category/add/page";
import DashboardPage from "@/pages/(dashboard)/dashboard/page";
import LayoutAdmin from "@/pages/(dashboard)/layout";
import ProductAddPage from "@/pages/(dashboard)/product/add/page";
import ProductManagementPage from "@/pages/(dashboard)/product/page";
import ErrorPage from "@/pages/(website)/404/page";
import Signin from "@/pages/(website)/auth/signin";
import Signup from "@/pages/(website)/auth/signup";
import CartPage from "@/pages/(website)/cart/page";
import DetailPage from "@/pages/(website)/detail/page";
import HomePage from "@/pages/(website)/home/page";
import LayoutWebsite from "@/pages/(website)/layout";
import ListPage from "@/pages/(website)/list/page";
import PayPage from "@/pages/(website)/pay/page";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";


const Router = () => {
    const [closes, setCloses] = useState<boolean>(false)
    const toggleColor = () => {
        setCloses(!closes);
    };
    return (
        // ĐĂNG NHẬP ĐỂ THÊM VÀO GIỎ HÀNG
        // tài khoản: lhoanganh814@gmail.com
        // mật khẩu : HoanganhDz2004
        <>
            <Routes>
                <Route path="/" element={<LayoutWebsite closes={closes} onClicks={toggleColor} />}>
                    <Route index element={<HomePage />} />
                    <Route path="collections/:id" element={<ListPage />} />
                    <Route path="products/:productId" element={<DetailPage onClicks={toggleColor} />} />
                    <Route path="products/pay" element={<PayPage />} />
                    <Route path="carts/:userId" element={<CartPage />} />
                    {/* <Route path="error" element={<ErrorPage />} /> */}
                </Route>
                <Route path="signin" element={<Signin />} />
                <Route path="signup" element={<Signup />} />

                {/* <Route path="error" element={<ErrorPage />}/> */}
                <Route path="admin" element={<LayoutAdmin />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="products" element={<ProductManagementPage />} />
                    <Route path="products/add" element={<ProductAddPage />} />
                    <Route path="categories/add" element={<CategoryAddPage />} />
                </Route>
                <Route path="**" element={<ErrorPage />} />
            </Routes>
        </>
    );
};

export default Router;
