import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <main className='p-3 container'>
            <Outlet />
        </main>
    )
}

export default MainLayout
