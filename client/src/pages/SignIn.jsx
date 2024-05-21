import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
	const [formData, setFormData] = useState({});
	const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

	const handleForm = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
    setLoading(true);
		if (
			!formData.email ||
			!formData.password
		) {
			setErrorMessage("All Field are required...");
      setLoading(false)
		} else {
			try {
				const res = await fetch(
					import.meta.env.VITE_SERVER_URL + "/api/user/login",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(formData),
					}
				);
				const data = await res.json();
				console.log(data);
				if (data.type && data.type == "success") {
					console.log(data);
          navigate('/')
				} else if (data.type == "error") {
					setErrorMessage(data.message);
				} else {
					for (let i in data) {
						for (let j of data[i]) {
							setErrorMessage(j);
							console.log(j);
						}
						break;
					}
				}
        setLoading(false);
			} catch (error) {
				console.error(error);
        setLoading(false);
			}
		}
    setTimeout(()=>{
      console.log("5sec")
      setErrorMessage("");
    }, 5000)
	};

	return (
		<div className="min-h-screen mt-20">
			<div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
				<div className="flex-1">
					<Link
						to={"/"}
						className="font-bold dark:text-dark text-4xl"
					>
						One&nbsp;
						<span className="px-2 py-1 bg-gradient-to-r text-white from-indigo-500 via-purple-500 to-pink-500 rounded-lg">
							4
						</span>
						&nbsp;All
					</Link>
					<p className="text-sm mt-5">
						{" "}
						This is Blog Project. Sign In with Email or Google
					</p>
				</div>
				<div className="flex-1">
					<form
						className="flex flex-col gap-4"
						onSubmit={handleSubmit}
					>
						<div className="">
							<Label className="dark:text-dark" value="Email" />
							<TextInput
								type="text"
								placeholder="example@example.com"
								id="email"
								onChange={handleForm}
							/>
						</div>
						<div className="">
							<Label
								className="dark:text-dark"
								value="Password"
							/>
							<TextInput
								type="password"
								placeholder="*******"
								id="password"
								onChange={handleForm}
							/>
						</div>
						<Button gradientDuoTone={"purpleToPink"} disabled={loading} type="submit">
              {
                loading ? <>
                <Spinner />
                <span className="pl-3">Loading... </span>
                </> : 
							'Sign UP'
              }
						</Button>
					</form>
					<div className="flex gap-2 text-sm mt-5">
						<span>Don&apos;t have an Account?</span>
						<Link to="/sign-in" className="text-blue-500">
							Sign Up
						</Link>
					</div>
					{errorMessage && (
						<Alert className="mt-5" color={"failure"}>
							{errorMessage}
						</Alert>
					)}
				</div>
			</div>
		</div>
	);
}

export default SignIn;
