import { useState, useEffect, useRef } from "react"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from '../firebase.config'
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid'
import { toast } from "react-toastify"
import Spinner from '../Components/Spninner'

const CreateListing = () => 
{
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    })

    const {type, name, bedrooms, bathrooms, parking, furnished, address, offer, regularPrice, discountedPrice, images} = formData

    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    useEffect(() =>
    {
        if(isMounted)
        {
            onAuthStateChanged(auth, (user) =>
            {
                if (user)
                {
                    setFormData({...formData, userRef: user.uid})
                }
                else
                {
                    navigate('/sign-in')
                }
            })
        }

        return () =>
        {
            isMounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted])

    const onSubmit = async (e) =>
    {
        e.preventDefault()

        setLoading(true)

        if (discountedPrice >= regularPrice)
        {
            setLoading(false)
            toast.error('Discounted price need to be less than regular price')
            return
        }
        
        if (images.length > 6)
        {
            setLoading(false)
            toast.error('Max 6 images')
            return
        }

        // Store images in firebase
        const storeImage = async (image) =>
        {
            return new Promise((resolve, reject) =>
            {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

                const storageRef = ref(storage, 'images/' + fileName)

                const uploadTask = uploadBytesResumable(storageRef, image)

                uploadTask.on('state_changed', 
                (snapshot) => 
                {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  console.log('Upload is ' + progress + '% done')
                  switch (snapshot.state) 
                  {
                    case 'paused':
                      console.log('Upload is paused')
                      break
                    case 'running':
                      console.log('Upload is running')
                      break
                    default:
                      break
                  }
                }, 
                (err) => 
                {
                    reject(err)
                }, 
                () => 
                {
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
                  {
                    resolve(downloadURL)
                  })
                })
            })
        }

        const imageUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => 
        {
            setLoading(false)
            toast.error('Images not uploaded')
            return
        })

        const formDataCopy = {
          ...formData,
          imageUrls,
          timestamp: serverTimestamp()
        }

        delete formDataCopy.images
        !formDataCopy.offer && delete formDataCopy.discountedPrice

        const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
        setLoading(false)

        toast.success('Listing Saved')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    const onMutate = (e) =>
    {
        let boolean = null

        if (e.target.value === 'true')
        {
            boolean = true
        }
        if (e.target.value === 'false')
        {
            boolean = false
        }

        // Files
        if (e.target.files)
        {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }

        // Text/Booleans/Numbers
        if(!e.target.files)
        {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }

    if (loading)
    {
        <Spinner />
    }

    return (
      <div className="m-4 lg:m-12">
        <header className="my-8">
          <p className="text-3xl font-semibold">Create a Listing</p>
        </header>

        <main>
          <form onSubmit={onSubmit}>
            <label className="label font-semibold">Sell / Rent</label>
            <div className="flex">
              <button
                type="button"
                className={type === "sale" ? "py-3 px-12 bg-green-500 text-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center" : "py-3 px-12 bg-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center"}
                id="type"
                value="sale"
                onClick={onMutate}
              >
                Sell
              </button>
              <button
                type="button"
                className={type === "rent" ? "py-3 px-12 bg-green-500 text-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center" : "py-3 px-12 bg-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center"}
                id="type"
                value="rent"
                onClick={onMutate}
              >
                Rent
              </button>
            </div>

            <label className="label font-semibold">Name</label>
            <input
              type="text"
              className="input w-72 mb-4 rounded-2xl shadow-md"
              id="name"
              value={name}
              onChange={onMutate}
              maxLength="32"
              minLength="10"
              required
            />

            <div className="flex">
              <div className="mr-4">
                <label className="label font-semibold">Bedrooms</label>
                <input
                  className="input w-20 mb-4 rounded-2xl shadow-md"
                  type="number"
                  id="bedrooms"
                  value={bedrooms}
                  onChange={onMutate}
                  min="1"
                  max="50"
                  required
                />
              </div>
              <div>
                <label className="label font-semibold">Bathrooms</label>
                <input
                  className="input w-20 mb-4 rounded-2xl shadow-md"
                  type="number"
                  id="bathrooms"
                  value={bathrooms}
                  onChange={onMutate}
                  min="1"
                  max="50"
                  required
                />
              </div>
            </div>

            <label className="label font-semibold">Parking spot</label>
            <div className="flex">
              <button
                className={parking ? "py-3 px-12 bg-green-500 text-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center" : "py-3 px-12 bg-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center"}
                type="button"
                id="parking"
                value={true}
                onClick={onMutate}
                min="1"
                max="50"
              >
                Yes
              </button>
              <button
                className={
                  !parking && parking !== null
                    ? "py-3 px-12 bg-green-500 text-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center" 
                    : "py-3 px-12 bg-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center"
                }
                type="button"
                id="parking"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>

            <label className="label font-semibold">Furnished</label>
            <div className="flex">
              <button
                className={furnished ? "py-3 px-12 bg-green-500 text-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center" : "py-3 px-12 bg-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center"}
                type="button"
                id="furnished"
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                className={
                  !furnished && furnished !== null
                    ? "py-3 px-12 bg-green-500 text-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center" 
                    : "py-3 px-12 bg-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center"
                }
                type="button"
                id="furnished"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>

            <label className="label font-semibold">Address</label>
            <textarea
              className="textarea w-72"
              type="text"
              id="address"
              value={address}
              onChange={onMutate}
              required
            />

            <label className="label font-semibold">Offer</label>
            <div className="flex">
              <button
                className={offer ? "py-3 px-12 bg-green-500 text-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center" : "py-3 px-12 bg-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center"}
                type="button"
                id="offer"
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                className={
                  !offer && offer !== null ? "py-3 px-12 bg-green-500 text-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center" : "py-3 px-12 bg-white font-semibold rounded-2xl text-base mt-2 mr-2 flex justify-center items-center"
                }
                type="button"
                id="offer"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>
            <label className="label font-semibold">Regular Price</label>
            <div className="flex items-center mb-4">
              <input
                className="input w-36 rounded-2xl shadow-md"
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required
              />
              {type === "rent" && <p className="ml-4 font-semibold">$ / Month</p>}
            </div>

            {offer && (
              <>
                <label className="label font-semibold">Discounted Price</label>
                <input
                  className="input w-36 rounded-2xl shadow-md"
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onMutate}
                  min="50"
                  max="750000000"
                  required={offer}
                />
              </>
            )}

            <label className="label font-semibold">Images</label>
            <p className="text-sm opacity-80 mb-4">
              The first image will be the cover (max 6).
            </p>
            <div className="w-full bg-white p-4 rounded-2xl">
              <input
                className="formInputFile"
                type="file"
                id="images"
                onChange={onMutate}
                max="6"
                accept=".jpg,.png,.jpeg"
                multiple
                required
              />
            </div>
            <button type="submit" className="cursor-pointer bg-green-500 rounded-2xl py-3 px-8 text-white font-semibold text-xl w-[80%] my-12 mx-auto flex justify-center items-center">
              Create Listing
            </button>
          </form>
        </main>
      </div>
    )
}
 
export default CreateListing