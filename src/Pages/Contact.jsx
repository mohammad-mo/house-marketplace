import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"

const Contact = () => 
{
    const [message, setMessage] = useState('')
    const [landlord, setLandlord] = useState(null)
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams()

    const params = useParams()

    useEffect(() =>
    {
        const getLandlord = async () =>
        {
            const docRef = doc(db, 'users', params.landlordId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists())
            {
                setLandlord(docSnap.data())
            }
            else
            {
                toast.error('Could not get landlord data')
            }
        }

        getLandlord()
    }, [params.landlordId])

    const onChange = (e) =>
    {
        setMessage(e.target.value)
    }

    return (
        <div className="m-4 lg:m-12">
            <header className="my-8">
                <p className="text-3xl font-semibold">Contact Landlord</p>
            </header>

            {landlord !== null && (
                <main>
                    <div className="mt-8 flex items-center">
                        <p className="font-semibold text-xl">{landlord?.name}</p>
                    </div>

                    <form className="mt-2">
                        <div className="mt-8 flex flex-col mb-16">
                            <label htmlFor="message" className="label font-semibold">Message</label>
                            <textarea name="message" id="message" className="textarea textarea-primary" value={message} onChange={onChange}></textarea>
                        </div>

                        <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                            <button type="button" className="cursor-pointer bg-green-500 rounded-2xl py-3 px-8 text-white font-semibold text-xl w-[80%] my-12 mx-auto flex justify-center items-center">Send Message</button>
                        </a>
                    </form>
                </main>
            )}
        </div>
    )
}
 
export default Contact