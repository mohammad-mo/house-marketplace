import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, updateProfile } from 'firebase/auth'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../Components/ListingItem'
import { toast } from 'react-toastify'

import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

const Profile = () => 
{
    const auth = getAuth()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)
    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email      
    })

    const { name, email } = formData

    useEffect(() =>
    {
        const fetchUserListings = async () =>
        {
            const listingsRef = collection(db, 'listings')
            const q = query(
                listingsRef, 
                where('userRef', '==', auth.currentUser.uid), 
                orderBy('timestamp', 'desc')
            )

            const querySnap = await getDocs(q)

            const listings = []

            querySnap.forEach((doc) =>
            {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
        }

        fetchUserListings()
    }, [auth.currentUser.uid])

    const onLogout = () =>
    {
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async () =>
    {
        try
        {
            if (auth.currentUser.displayName !== name)
            {
                // Update display name in firebase
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
            }

            // Update in firebase
            const useRef = doc(db, 'users', auth.currentUser.uid)
            await updateDoc(useRef, { name })
        }
        catch(err)
        {
            toast.error('Could not update profile details')
        }
    }

    const onChange = (e) =>
    {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onDelete = async (listingId) =>
    {
        if (window.confirm('Are you sure you want to delete?'))
        {
            await deleteDoc(doc(db, 'listings', listingId))
            const updatedListings = listings.filter((listing) => listing.id !== listingId)
            setListings(updatedListings)
            toast.success('Successully deleted listing')
        }
    }

    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

    return (
        <div className='m-4 lg:m-12'>
            <header className="flex justify-between items-center mb-8">
                <p className="text-3xl font-extrabold">My Profile</p>
                <button type='button' className="btn btn-sm btn-primary rounded-2xl" onClick={onLogout}>Logout</button>
            </header>
            <main>
                <div className="flex justify-between max-w-lg mb-4">
                    <p className="font-semibold">Personal Details</p>
                    <p
                        className="cursor-pointer font-semibold text-green-500"
                        onClick={() => {
                            changeDetails && onSubmit()
                            setChangeDetails((prevState) => !prevState)
                        }}    
                    >
                        {changeDetails ? 'Done' : 'Change'}
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-4 max-w-lg">
                    <form>
                        <input 
                            type="text" 
                            id='name'
                            className={!changeDetails ? 'input my-1 font-semibold text-base w-full p-1 rounded-md' : 'input my-1 font-semibold text-base w-full bg-gray-200 p-1 rounded-md outline-hidden'}
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChange}
                        />
                        <input 
                            type="text" 
                            id='email'
                            className={!changeDetails ? 'input my-1 font-semibold text-base w-full p-1 rounded-md' : 'input my-1 font-semibold text-base w-full bg-gray-200 p-1 rounded-md outline-hidden'}
                            disabled={!changeDetails}
                            value={email}
                            onChange={onChange}
                        />
                    </form>
                </div>

                <Link to='/create-listing' className='flex justify-between items-center max-w-lg bg-white rounded-2xl py-4 px-4 mt-8 font-semibold'>
                    <img src={homeIcon} alt="home icon" />
                    <p>Sell or rent your home</p>
                    <img src={arrowRight} alt="arrow right icon" />
                </Link>

                {!loading && listings?.length > 0 && (
                    <>
                        <p className="my-8 font-semibold">Your Listings</p>
                        <ul className='listingsList'>
                            {React.Children.toArray(listings.map((listing) => (
                                <ListingItem listing={listing.data} id={listing.id} onDelete={() => onDelete(listing.id)} onEdit={() => onEdit(listing.id)} />
                            )))}
                        </ul>
                    </>
                )}
            </main>
        </div>
    )
}
 
export default Profile