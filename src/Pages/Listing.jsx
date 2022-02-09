import React, { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper"
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { getDoc, doc } from "firebase/firestore"
import { getAuth } from 'firebase/auth'
import { db } from "../firebase.config"
import Spinner from "../Components/Spninner"
import ShareIcon from '../assets/svg/shareIcon.svg'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

const Listing = () => 
{
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)

    const params = useParams()
    const navigate = useNavigate()
    const auth = getAuth()

    useEffect(() => 
    {
        const fetchListing = async () => 
        {
          const docRef = doc(db, 'listings', params.listingId)
          const docSnap = await getDoc(docRef)
    
          if (docSnap.exists()) {
            setListing(docSnap.data())
            setLoading(false)
          }
        }
    
        fetchListing()
      }, [navigate, params.listingId])
    
      if (loading) 
      {
        return <Spinner />
      }
    
    return (
      <main>
        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {React.Children.toArray(listing.imageUrls.map((url, index) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[index]}) center no-repeat`,
                  backgroundSize: 'cover'
                }}
                className="swiperSlideDiv"
              ></div>
            </SwiperSlide>
          )))}
        </Swiper>

        <div
          className="cursor-pointer fixed top-[15px] right-[5%] z-10 bg-white rounded-3xl w-12 h-12 flex justify-center items-center"
          onClick={() => 
            {
              navigator.clipboard.writeText(window.location.href)
              setShareLinkCopied(true)
              setTimeout(() =>
             {
              setShareLinkCopied(false)
            }, 2000)
          }}
        >
          <img src={ShareIcon} alt="share icon" />
        </div>

        {shareLinkCopied && <p className="fixed top-[80px] right-[5%] z-10 bg-white rounded-3xl py-2 px-4 font-semibold">Link Copied!</p>}

        <div className="m-4 lg:m-12">
          <p className="font-semibold text-2xl mb-2">
            {listing.name} - $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
          <p className="mt-0 font-semibold mb-2">{listing.address}</p>
          <p className="py-1 px-2 bg-green-500 text-white rounded-3xl inline font-semibold text-sm mr-2">
            For {listing.type === "rent" ? "Rent" : "Sale"}
          </p>
          {listing.offer && (
            <p className="py-1 px-2 bg-slate-900 text-white rounded-3xl inline font-semibold text-sm">
              ${listing.regularPrice - listing.discountedPrice} discount
            </p>
          )}

          <ul className="mt-2 p-0 list-none">
            <li className="my-1 mx-0 font-medium opacity-80">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : "1 Bedroom"}
            </li>
            <li className="my-1 mx-0 font-medium opacity-80">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : "1 Bathroom"}
            </li>
            <li className="my-1 mx-0 font-medium opacity-80">{listing.parking && "Parking Spot"}</li>
            <li className="my-1 mx-0 font-medium opacity-80">{listing.furnished && "Furnished"}</li>
          </ul>

          {auth.currentUser?.uid !== listing.userRef && (
            <Link
              to={`/contact/${listing.userRef}?listingName=${listing.name}`}
              className="cursor-pointer bg-green-500 rounded-2xl py-3 px-8 text-white font-semibold text-xl w-[80%] my-12 mx-auto flex justify-center items-center"
            >
              Contact Landlord
            </Link>
          )}
        </div>
      </main>
    );
}
 
export default Listing