import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Spinner from "../Components/Spninner"
import ListingItem from "../Components/ListingItem"

const Category = () => 
{
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)

    const params = useParams()

    useEffect( () =>
    {
        const fetchListings = async () =>
        {
            try
            {
                // Get reference
                const listingsRef = collection(db, 'listings')

                // Create a query
                const q = query(listingsRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), limit(10))

                // Execute query
                const querySnap = await getDocs(q)

                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)

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
            catch(err)
            {
                toast.error('Could not fetch listings')
            }
        }
        fetchListings()
    }, [params.categoryName])

    // Pagination / Load More
    const onFetchMoreListings = async () =>
        {
            try
            {
                // Get reference
                const listingsRef = collection(db, 'listings')

                // Create a query
                const q = query(listingsRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), startAfter(lastFetchedListing), limit(10))

                // Execute query
                const querySnap = await getDocs(q)

                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)

                const listings = []

                querySnap.forEach((doc) => 
                {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings((prevState) => [...prevState, ...listings])
                setLoading(false)
            }
            catch(err)
            {
                toast.error('Could not fetch listings')
            }
        }

    return (
        <div className="m-4 lg:m-12">
            <header className="flex justify-between items-center mb-8">
                <p className="text-3xl font-extrabold">
                    {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}
                </p>
            </header>
            {loading ? <Spinner /> : listings && listings.length > 0 ?
            <>
                <main>
                    <ul className="p-0">
                        {React.Children.toArray(listings.map((listing) => (
                            <ListingItem listing={listing.data} id={listing.id} />
                        )))}
                    </ul>
                </main>

                <br />
                <br />

                {lastFetchedListing && (
                     <button className="btn btn-sm flex justify-center mx-auto" onClick={onFetchMoreListings}>Load More</button>
                )}

            </> : <p>No listing for {params.categoryName}</p>}
        </div>
    )
}
 
export default Category