import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import OAuth from "../Components/OAuth"

const SignIn = () => 
{
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { email, password } = formData

    const navigate = useNavigate()

    const onChange = (e) =>
    {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = async (e) =>
    {
        e.preventDefault()

        try
        {
            const auth = getAuth()

            const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
            if (userCredential.user)
            {
                navigate('/')
            }
        }
        catch(err)
        {
            toast.error('Bad User Credentials')
        }
    }

    return (
      <>
        <div className="m-4 lg:m-12">
          <header className="my-8">
            <p className="text-3xl font-extrabold">Welcome Back!</p>
          </header>
          <main>
            <form onSubmit={onSubmit}>
              <input
                autoFocus
                type="email"
                className="input w-full mb-4 rounded-2xl shadow-md"
                placeholder="Email"
                id="email"
                value={email}
                onChange={onChange}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input w-full mb-8 rounded-2xl shadow-md"
                  placeholder="Password"
                  id="password"
                  value={password}
                  onChange={onChange}
                />
                <img
                  src={visibilityIcon}
                  alt="show password icon"
                  className="cursor-pointer absolute -top-0.5 right-0.5 p-4"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              </div>
              <Link to='/forgot-password' className="block cursor-pointer text-green-500 font-semibold text-right">Forgot Password</Link>
              <div className="flex justify-between items-center mt-12">
                  <p className="text-2xl font-bold cursor-pointer">Sign In</p>
                  <button className="flex justify-center items-center w-12 h-12 rounded-3xl bg-green-500 cursor-pointer">
                      <ArrowRightIcon fill="#fff" width='34px' height='34px' />
                  </button>
              </div>
            </form>
            <OAuth />
            <Link to='/sign-up' className="block mt-20 text-green-500 font-semibold text-center mb-28">Sign Up Insted</Link>
          </main>
        </div>
      </>
    )
}
 
export default SignIn