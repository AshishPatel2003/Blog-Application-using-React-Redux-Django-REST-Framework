import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function UpdatePost() {
	const { currentUser, accessToken } = useSelector((state) => state.user);

	const [file, setFile] = useState(null);
	const [imageUploadProgress, setImageUploadProgress] = useState(0);
	const [imageUploadError, setImageUploadError] = useState(null);
	const [formData, setFormData] = useState({});
	const [publishError, setPublishError] = useState(null);
	const { postId } = useParams();

	const navigate = useNavigate();

	useEffect(() => {
		try {
			const fetchPost = async () => {
				const res = await fetch(
					import.meta.env.VITE_SERVER_URL +
						`/api/posts?post_id=${postId}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer " + accessToken.access,
						},
					}
				);
				const resJson = await res.json();

				if (!res.ok) {
					setPublishError(resJson.message);
					console.log(resJson);
				} else {
					setFormData(resJson.data.all_posts[0]);
					setPublishError(null);
				}
			};
			fetchPost();
		} catch (error) {
			console.log(error);
		}
	}, [postId]);

	const handleUploadImage = async () => {
		try {
			if (!file) {
				setImageUploadError("Please Select an Image");
				return;
			}
			const storage = getStorage(app);
			const fileName = new Date().getTime() + "-" + file.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setImageUploadProgress(progress.toFixed(0));
				},
				(error) => {
					console.log(error);
					setImageUploadError("Image upload failed");
					setImageUploadProgress(null);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(
						(downloadURL) => {
							setImageUploadProgress(null);
							setImageUploadError(null);
							setFormData({ ...formData, image: downloadURL });
						}
					);
				}
			);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(formData)
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER_URL +
					`/api/user/${currentUser.id}/post/${postId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + accessToken.access,
					},
					body: JSON.stringify(formData),
				}
			);
			const data = await res.json();
			console.log(data);
			if (!res.ok) {
				setPublishError(data.message);
				return;
			}
			if (res.ok) {
				setPublishError(null);
				navigate("/dashboard?tab=posts");
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="p-3 max-w-3xl mx-auto min-h-screen">
			<h1 className="text-center text-3xl my-7 font-semibold">
				{" "}
				Update Post
			</h1>
			<form
				action=""
				className="flex flex-col gap-4"
				onSubmit={handleSubmit}
			>
				<div className="flex flex-col gap-4 sm:flex-row justify-between">
					<TextInput
						type="text"
						placeholder="Title"
						required
						id="title"
						className="flex-1"
						value={formData.title}
						onChange={(e) => {
							setFormData({ ...formData, title: e.target.value });
						}}
					/>
					<Select
						value={formData.category}
						onChange={(e) => {
							setFormData({
								...formData,
								category: e.target.value,
							});
						}}
					>
						<option value={"uncategorized"}>
							Select a category
						</option>
						<option value="javascript">Javascript</option>
						<option value="reactjs">React.js</option>
						<option value="nextjs">Next.js</option>
					</Select>
				</div>
				<div className="flex gap-r items-center justify-between border-4 border-teal-500 border-dotted p-3">
					<FileInput
						type="file"
						accept="image/*"
						onChange={(e) => setFile(e.target.files[0])}
					/>
					<Button
						type="button"
						gradientDuoTone={"purpleToBlue"}
						size={"sm"}
						outline
						onClick={handleUploadImage}
					>
						{imageUploadProgress ? (
							<div className="w-16 h-16">
								<CircularProgressbar
									value={imageUploadProgress}
									text={`${imageUploadProgress || 0}`}
								/>
							</div>
						) : (
							"Upload Image"
						)}
					</Button>
				</div>
				{imageUploadError && (
					<Alert color={"failure"}>{imageUploadError}</Alert>
				)}
				{formData.image && (
					<img
						src={formData.image}
						alt="upload"
						className="w-full h-72 object-cover"
					/>
				)}
				<ReactQuill
					theme="snow"
					placeholder="Write something..."
					className="h-72 mb-12"
                    value={formData.content}
					onChange={(e) => {
						if (formData?.title) {
							setFormData({
								...formData,
								content: e
							});
						}
					}}
				/>
				<Button type="submit" gradientDuoTone={"purpleToPink"}>
					Update Post
				</Button>
				{publishError && (
					<Alert color={"failure"} className="mt-5">
						{publishError}
					</Alert>
				)}
			</form>
		</div>
	);
}

export default UpdatePost;
