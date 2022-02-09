import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from "react-toastify"
import googleIcon from '../assets/svg/googleIcon.svg'

const OAuth = () => 
{
    const navigate = useNavigate()
    const location = useLocation()

    const onGoogleClick = async () =>
    {
        try
        {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            // Check for user
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            // If user doesn't exist, create user
            if (!docSnap.exists())
            {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/')
        }
        catch(err)
        {
            toast.error('Could not authorize with Google')
        }
    }

    return (
        <div className="flex flex-col items-center mt-16">
            <p>Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} with</p>
            <button className="flex justify-center items-center p-3 m-6 w-12 h-12 bg-white rounded-3xl shadow-md cursor-pointer" onClick={onGoogleClick}>
                <img className="w-full" src={googleIcon} alt="google icon" />
            </button>
        </div>
    )
}
 
export default OAuth