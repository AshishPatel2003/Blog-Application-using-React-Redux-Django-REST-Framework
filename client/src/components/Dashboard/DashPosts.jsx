import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DashPosts() {
	const { currentUser, accessToken } = useSelector((state) => state.user);
	const [userPosts, setUserPosts] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [page, setPage] = useState(1);
	const [showModal, setShowModal] = useState(false);
	const [deletePostId, setDeletePostId] = useState(false);
	const limit = 3;

	useEffect(() => {
		console.log(userPosts);
	}, [userPosts]);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await fetch(
					import.meta.env.VITE_SERVER_URL +
						`/api/posts?page=${page}&limit=${limit}&user_id=${currentUser.id}`
				);
				const data = await res.json();
				if (res.ok) {
					setUserPosts(data.data.all_posts);
					if (data.data.all_posts.length < limit) {
						setShowMore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		fetchPosts();
	}, [currentUser.id]);

	const handleShowMore = async () => {
		const startIndex = page + 1;

		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER_URL +
					`/api/posts?page=${startIndex}&limit=${limit}&user_id=${currentUser.id}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + accessToken.access,
					},
				}
			);

			const data = await res.json();

			if (res.ok) {
				setUserPosts((prev) => [...prev, ...data.data.all_posts]);
				if (data.data.all_posts.length < limit) {
					setShowMore(false);
				}
				console.log(startIndex);
				setPage(startIndex);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeletePost = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER_URL +
					`/api/user/${currentUser.id}/post/${deletePostId}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + accessToken.access,
					},
				}
			);

			const data = await res.json();
			console.log(data);
			if (res.ok) {
				setUserPosts((posts) => posts.filter((post) => post.id !== deletePostId));
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-300">
			{currentUser.is_admin && userPosts?.length > 0 ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Date Updated</Table.HeadCell>
							<Table.HeadCell>Post Image</Table.HeadCell>
							<Table.HeadCell>Post Title</Table.HeadCell>
							<Table.HeadCell>Category</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
							<Table.HeadCell>
								<span>Edit</span>
							</Table.HeadCell>
						</Table.Head>
						<Table.Body className="divide-y">
							{userPosts.map((post) => (
								// eslint-disable-next-line react/jsx-key
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={post.id}>
									<Table.Cell>
										{new Date(
											post.updated_at
										).toLocaleDateString()}
									</Table.Cell>
									<Table.Cell>
										<Link to={`/post/${post.slug}`}>
											<img
												src={post.image}
												alt={post.title}
												className="w-20 h-10 object-cover bg-gray-500"
											/>
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Link
											to={`/post/${post.slug}`}
											className="font-medium text-gray-900 dark:text-white"
										>
											{post.title}
										</Link>
									</Table.Cell>
									<Table.Cell>{post.category}</Table.Cell>
									<Table.Cell>
										<span
											className="font-medium text-red-500 hover:underline cursor-pointer"
											onClick={() => {
												setDeletePostId(post.id);
												setShowModal(true);
											}}
										>
											Delete
										</span>
									</Table.Cell>
									<Table.Cell>
										<Link
											className="text-teal-500 hover:underline"
											to={`/update-post/${post.id}`}
										>
											<span>Edit</span>
										</Link>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
					{showMore && (
						<button
							className="w-full text-teal-500 self-center text-sm py-7"
							onClick={handleShowMore}
						>
							Show More
						</button>
					)}
				</>
			) : (
				<p>You have no posts yet!</p>
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
								onClick={handleDeletePost}
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

export default DashPosts;
