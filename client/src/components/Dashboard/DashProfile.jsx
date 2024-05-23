import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { app } from "../../firebase";
import {
	CircularProgressbar,
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function DashProfile() {
	const { currentUser } = useSelector((state) => state.user);
	const [imageFile, setImageFile] = useState(null);
	const [imageFileUploadProgress, setImageFileUploadProgress] =
		useState(null);
	const [imageFileUploadError, setImageFileUploadError] = useState("");
	const [imageFileURL, setImageFileURL] = useState(null);
	const filePickerRef = useRef();

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImageFileURL(URL.createObjectURL(file));
		}
	};

	useEffect(() => {
		if (imageFile) {
			uploadImage();
		}
	}, [imageFile]);

	const uploadImage = async () => {
		console.log("uploading IMage");
		const storage = getStorage(app);
		const fileName = new Date().getTime() + imageFile.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, imageFile);
    setImageFileUploadError(null)
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setImageFileUploadProgress(progress.toFixed(0));
				console.log("Progress: " + progress);
			},
			(error) => {
				console.log(error.message);
				setImageFileUploadError(
					"Couldn't Upload Image (File must be less than 2mb)"
				);
        setImageFileUploadProgress(null)
        setImageFileURL(null)
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setImageFileURL(downloadURL);
				});
			}
		);
	};

	return (
		<div className="mx-w-lg mx-auto p-3 w-full">
			<h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
			<form className="flex flex-col gap-4">
				<input
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					ref={filePickerRef}
				/>
				<div
					className="relative w-32 h-32 self-center cursor-pointer shadow-md rounded-full"
					onClick={() => filePickerRef.current.click()}
				>
					{imageFileUploadProgress && (
						<CircularProgressbar
							value={imageFileUploadProgress || 0}
							text={`${imageFileUploadProgress}%`}
							strokeWidth={5}
              styles={{
                root:{
                  width: "100%",
                  height: '100%',
                  position: "absolute",
                  top: 0,
                  left: 0,

                },
                path: {
                  stroke: `rgba(62,152, 199, ${imageFileUploadProgress / 100})`
                }
              }}
						/>
					)}
					<img
						src={imageFileURL || currentUser.photoURL}
						alt="User"
						className={`rounded-full w-full h-full border-4 border-[lightgray] object-cover ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60' }`}
					/>
				</div>
				{imageFileUploadError && (
					<Alert color={"failure"}>{imageFileUploadError}</Alert>
				)}
				<TextInput
					type="text"
					id="first_name"
					placeholder="First Name"
					defaultValue={currentUser.first_name}
				/>
				<TextInput
					type="text"
					id="last_name"
					placeholder="Last Name"
					defaultValue={currentUser.last_name}
				/>
				<TextInput
					type="text"
					id="email"
					placeholder="Email"
					defaultValue={currentUser.email}
				/>
				<Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
					Update
				</Button>
			</form>
			<div className="flex justify-between text-red-500 mt-5">
				<span className="cursor-pointer">Delete Account</span>
				<span className="cursor-pointer">Sign Out</span>
			</div>
		</div>
	);
}

export default DashProfile;
