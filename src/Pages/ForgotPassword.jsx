import { useState } from "react"
import { Link } from "react-router-dom"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { toast } from "react-toastify"
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

const ForgotPassword = () => 
{
    const [email, setEmail] = useState('')

    const onChange = (e) => setEmail(e.target.value)

    const onSubmit = async (e) =>
    {
        e.preventDefault()

        try
        {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)
            toast.success('Email was sent')
        }
        catch(err)
        {
            toast.error('Could not send reset email')
        }
    }

    return (
        <div className="m-4 lg:m-12">
            <header className="my-8">
                <p className="text-3xl font-extrabold">Forgot Password</p>
            </header>

                <main>
                    <form onSubmit={onSubmit}>
                        <input autoFocus type="email" className="input w-full mb-8 rounded-2xl shadow-md" placeholder="Email" value={email} onChange={onChange}/>
                        <Link className="block cursor-pointer text-green-500 font-semibold text-right" to='/sign-in'>
                            Sign IN
                        </Link>
                        <div className="flex justify-between items-center mt-12">
                            <div className="text-2xl font-bold cursor-pointer">Send Reset Link</div>
                            <button className="flex justify-center items-center w-12 h-12 rounded-3xl bg-green-500 cursor-pointer">
                                <ArrowRightIcon fill='#fff' width='34px' height='34px' />
                            </button>
                        </div>
                    </form>
                </main>
        </div>
    )
}
 
export default ForgotPassword