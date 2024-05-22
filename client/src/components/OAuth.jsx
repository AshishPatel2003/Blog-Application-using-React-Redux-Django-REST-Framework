import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai"
import { app } from "../firebase"
import { setAccessToken, signInSuccess } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () => {
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({prompt: "select_account"})
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            console.log(resultsFromGoogle)
            const res = await fetch(import.meta.env.VITE_SERVER_URL +"/api/user/google", {
                method: "POST",
                headers: {
                   'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: resultsFromGoogle.user.displayName.split(' ').splice(0, resultsFromGoogle.user.displayName.split(' ').length - 1).join(' '),
                    last_name: resultsFromGoogle.user.displayName.split(' ')[1],
                    email: resultsFromGoogle.user.email,
                    password: Math.random().toString(36).slice(-8),
                    photoURL: resultsFromGoogle.user.photoURL
                })
            })
            const data = await res.json();
            console.log(data)
            if (data.type == "success") {
                dispatch(signInSuccess(data.user))
                dispatch(setAccessToken(data.token))
                navigate("/")
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Button type="button" gradientDuoTone={"pinkToOrange"} outline onClick={handleGoogleClick} >
            <AiFillGoogleCircle className="w-6 h-6 mr-2" />
            <div className="flex items-center">
                Continue with Google
            </div>
        </Button>
    )
}

export default OAuth