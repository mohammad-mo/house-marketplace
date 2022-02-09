import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase.config"
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper"
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import Spinner from "./Spninner"
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])


const Slider = () => 
{
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(() =>
    {
        const fetchListings = async () =>
        {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
            const querySnap = await getDocs(q)

            const listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings(listings)
            setLoading(false)
        }

        fetchListings()
    }, [])

    if (loading)
    {
        return <Spinner />
    }

    // Removes the space in slider if don't have a listing
    if (!listings.length === 0)
    {
        return <></>
    }

    return listings && (
        <>
            <p className="font-bold mb-4">Recommended</p>
            <Swiper slidesPerView={1} pagination={{clickable: true}} >
                {listings.map(({data, id}) => (
                    <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                        <div style={{
                            background: `url(${data.imageUrls[0]}) center no-repeat`,
                            backgroundSize: 'cover'
                        }} 
                        className="relative w-full h-full">
                            <p className="slider-title text-white absolute top-[90px] left-0 font-medium max-w-[90%] text-xl bg-black bg-opacity-80 p-2 lg:text-3xl">{data.name}</p>
                            <p className="text-slate-900 absolute top-[150px] left-[11px] font-semibold max-w-[90%] bg-white py-1 px-2 rounded-2xl lg:text-xl lg:top-[160px]">
                                ${data.discountedPrice ?? data.regularPrice}
                                {' '}
                                {data.type === 'rent' && '/ month'}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}
 
export default Slider