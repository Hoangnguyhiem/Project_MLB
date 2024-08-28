

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Outlet } from 'react-router-dom'

type Props = {
    closes: boolean;
    onClicks: () => void;
  }

const Layout = ({closes, onClicks}: Props) => {
    return (
        <div className=''>
            <Header onClicks={onClicks}/>
            <Outlet />
            <Footer closes={closes} onClick={onClicks} />
        </div>
    )
}

export default Layout
