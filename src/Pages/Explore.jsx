import { Link } from "react-router-dom"
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import Slider from "../Components/Slider"

const Explore = () => 
{
    return (
        <div className="m-4 lg:m-12">
            <header className="my-8">
                <p className="text-3xl font-semibold">Explore</p>
            </header>
            <main>
                <Slider />
                <p className="font-bold mt-12 mb-4">Categories</p>
                <div className="flex flex-col justify-between sm:flex-row">
                    <Link to='/category/rent' className="w-full sm:w-[48%] mb-4 sm:mb-0">
                        <img src={rentCategoryImage} alt="rent" className="min-h[115px] h-[35vw] w-full rounded-3xl object-cover my-0 mx-auto sm:h-[15vw]" />
                        <p className="font-medium text-left mt-4">Places for rent</p>
                    </Link>
                    <Link to='/category/sale' className="w-full sm:w-[48%]">
                        <img src={sellCategoryImage} alt="sale" className="min-h[115px] h-[35vw] w-full rounded-3xl object-cover my-0 mx-auto sm:h-[15vw]" />
                        <p className="font-medium text-left mt-4">Places for sale</p>
                    </Link>
                </div>
            </main>
        </div>
    )
}
 
export default Explore