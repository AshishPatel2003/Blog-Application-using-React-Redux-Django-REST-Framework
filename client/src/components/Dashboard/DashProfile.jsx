import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
	deleteFailure,
	deleteStart,
	deleteSuccess,
	signOut,
	updateFailure,
	updateStart,
	updateSuccess,
} from "../../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashProfile() {
	const { currentUser, accessToken } = useSelector((state) => state.user);
	const [imageFile, setImageFile] = useState(null);
	const [imageFileUploadProgress, setImageFileUploadProgress] =
		useState(null);
	const [imageFileUploadError, setImageFileUploadError] = useState("");
	const [imageFileURL, setImageFileURL] = useState(null);
	const [formData, setFormData] = useState({});
	const [updateSuccessMessage, setUpdateSuccessMessage] = useState(null);
	const [imageFileUploadStatus, setImageFileUploadStatus] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const filePickerRef = useRef();
	const dispatch = useDispatch();

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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageFile]);

	const uploadImage = async () => {
		console.log("uploading IMage");
		const storage = getStorage(app);
		const fileName = new Date().getTime() + imageFile.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, imageFile);
		setImageFileUploadError(null);
		setImageFileUploadStatus(true);
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
				setImageFileUploadProgress(null);
				setImageFileURL(null);
				setImageFileUploadStatus(false);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setImageFileURL(downloadURL);
					setFormData({ ...formData, photoURL: downloadURL });
					setImageFileUploadStatus(false);
				});
			}
		);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleUpdateSubmit = async (e) => {
		e.preventDefault();
		console.log(typeof accessToken)
		console.log(accessToken)
		if (Object.keys(formData).length == 0) {
			return;
		}
		if (imageFileUploadStatus) {
			console.log("Uploading Image");
			return;
		}
		try {
			dispatch(updateStart());
			const res = await fetch(
				import.meta.env.VITE_SERVER_URL +
					`/api/user/${currentUser.id}/update`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + accessToken.access,
					},
					body: JSON.stringify(formData),
				}
			);
			const data = await res.json();
			if (data.type == "success") {
				console.log(data.message);
				dispatch(updateSuccess(data.user));
				setUpdateSuccessMessage(data.message);
			} else {
				dispatch(updateFailure());
				console.log(data.message);
			}
		} catch (error) {
			dispatch(updateFailure(error.message));
			console.log(error);
		}
		console.log(formData);
	};

	const handleDeleteUser = async () => {
		setShowModal(false);
		try {
			dispatch(deleteStart());
			const res = await fetch(
				import.meta.env.VITE_SERVER_URL +
					`/api/user/${currentUser.id}/delete`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + accessToken.access,
					},
				}
			);
			const data = await res.json();
			if (data.type == "success") {
				dispatch(deleteSuccess());
			} else {
				dispatch(deleteFailure());
			}
		} catch (error) {
			dispatch(deleteFailure());
		}
	};

	return (
		<div className="mx-w-lg mx-auto p-3 w-full">
			<h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
			<form className="flex flex-col gap-4" onSubmit={handleUpdateSubmit}>
				<input
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					ref={filePickerRef}
					hidden
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
								root: {
									width: "100%",
									height: "100%",
									position: "absolute",
									top: 0,
									left: 0,
								},
								path: {
									stroke: `rgba(62,152, 199, ${
										imageFileUploadProgress / 100
									})`,
								},
							}}
						/>
					)}
					<img
						src={imageFileURL || currentUser.photoURL}
						alt="User"
						className={`rounded-full w-full h-full border-4 border-[lightgray] object-cover ${
							imageFileUploadProgress &&
							imageFileUploadProgress < 100 &&
							"opacity-60"
						}`}
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
					onChange={handleChange}
				/>
				<TextInput
					type="text"
					id="last_name"
					placeholder="Last Name"
					defaultValue={currentUser.last_name}
					onChange={handleChange}
				/>
				<TextInput
					type="text"
					id="email"
					placeholder="Email"
					defaultValue={currentUser.email}
					onChange={handleChange}
				/>
				<TextInput
					type="password"
					id="password"
					placeholder="********"
					onChange={handleChange}
				/>
				<Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
					Update
				</Button>
			</form>
			<div className="flex justify-between text-red-500 mt-5">
				<span
					className="cursor-pointer"
					onClick={() => setShowModal(true)}
				>
					Delete Account
				</span>
				<span className="cursor-pointer" onClick={() => {dispatch(signOut())}}>Sign Out</span>
			</div>
			{updateSuccessMessage && (
				<Alert color={"success"} className="my-5">{updateSuccessMessage}</Alert>
			)}
			<Modal
				show={showModal}
				onClose={() => setShowModal(false)}
				popup
				size={"md"}
			>
				<Modal.Header />
				<Modal.Body>
					<div className="text-center">
						<HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto" />
						<h3 className="my-4 text-gray-500 dark:text-gray-400">
							Are you Sure you want to delete this Account?
						</h3>
						<div className="flex justify-center gap-4">
							<Button
								color={"failure"}
								onClick={handleDeleteUser}
							>
								Yes, I&apos;m sure
							</Button>
							<Button
								color={"gray"}
								onClick={() => setShowModal(false)}
							>
								Cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}

export default DashProfile;
