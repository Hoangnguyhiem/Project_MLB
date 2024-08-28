import { theme } from 'antd';
import { Outlet } from "react-router-dom";
import Aside from './aside';

type Props = {}


const LayoutAdmin = () => {
    return (
        <div className='flex w-[100%]'>
            <Aside />
            <div className="w-[calc(100%-200px)] h-[100%] p-[30px_20px] bg-slate-100">
                <div className="bg-white w-[100%] rounded-[10px] p-[20px_15px]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default LayoutAdmin;
