import { useNavigate, useLocation } from 'react-router-dom'
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'

const Navbar = () => 
{
    const navigate = useNavigate()
    const location = useLocation()

    const pathMatchRoute = (route) =>
    {
        if (route === location.pathname) return true
    }

    return (
        <footer className='fixed left-0 right-0 bottom-0 h-20 z-50 flex justify-center items-center bg-white'>
            <nav className="w-full overflow-hidden">
                <ul className="m-0 p-0 flex justify-evenly items-center">
                    <li className="cursor-pointer flex flex-col items-center" onClick={() => navigate('/')}>
                        <ExploreIcon className={pathMatchRoute('/') ? 'fill-gray-900' : 'fill-gray-400'} width='36px' height='36px' />
                        <p className={pathMatchRoute('/') ? 'mt-1 text-xs font-semibold text-gray-900' : 'mt-1 text-xs font-semibold text-gray-400'}>Explore</p>
                    </li>
                    <li className="cursor-pointer flex flex-col items-center" onClick={() => navigate('/offers')}>
                        <OfferIcon className={pathMatchRoute('/offers') ? 'fill-gray-900' : 'fill-gray-400'} width='36px' height='36px' />
                        <p className={pathMatchRoute('/offers') ? 'mt-1 text-xs font-semibold text-gray-900' : 'mt-1 text-xs font-semibold text-gray-400'}>Offers</p>
                    </li>
                    <li className="cursor-pointer flex flex-col items-center" onClick={() => navigate('/profile')}>
                        <PersonOutlineIcon className={pathMatchRoute('/profile') ? 'fill-gray-900' : 'fill-gray-400'} width='36px' height='36px' />
                        <p className={pathMatchRoute('/profile') ? 'mt-1 text-xs font-semibold text-gray-900' : 'mt-1 text-xs font-semibold text-gray-400'}>Profile</p>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}
 
export default Navbar