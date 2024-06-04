import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

function DashUsers() {
	const { currentUser, accessToken } = useSelector((state) => state.user);
	const [users, setUsers] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [page, setPage] = useState(1);
	const [showModal, setShowModal] = useState(false);
	const [deleteUserId, setDeleteUserId] = useState(false);
	const limit = 3;

	useEffect(() => {
		console.log(users);
	}, [users]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await fetch(
					import.meta.env.VITE_SERVER_URL +
						`/api/users?page=${page}&limit=${limit}`
				);
				const data = await res.json();
				if (res.ok) {
					setUsers(data.data.all_users);
					if (data.data.all_users.length < limit) {
						setShowMore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		fetchUsers();
	}, [currentUser.id]);

	const handleShowMore = async () => {
		const startIndex = page + 1;

		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER_URL +
					`/api/users?page=${startIndex}&limit=${limit}`,
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
				setUsers((prev) => [...prev, ...data.data.all_users]);
				if (data.data.all_users.length < limit) {
					setShowMore(false);
				}
				console.log(startIndex);
				setPage(startIndex);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeleteUser = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				import.meta.env.VITE_SERVER_URL +
					`/api/user/${deleteUserId}/delete`,
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
				setUsers((users) => users.filter((user) => user.id !== deleteUserId));
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-300">
			{currentUser.is_admin && users?.length > 0 ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Date Created</Table.HeadCell>
							<Table.HeadCell>User Image</Table.HeadCell>
							<Table.HeadCell>Name</Table.HeadCell>
							<Table.HeadCell>Email</Table.HeadCell>
							<Table.HeadCell>Admin</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
						</Table.Head>
						<Table.Body className="divide-y">
							{users.map((user) => (
								// eslint-disable-next-line react/jsx-key
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={user.id}>
									<Table.Cell>
										{new Date(
											user.created_at
										).toLocaleDateString()}
									</Table.Cell>
									<Table.Cell>
											<img
												src={user.photoURL}
												alt={user.first_name}
												className="w-10 h-10  m-auto object-cover bg-gray-500 rounded-full"
											/>
									</Table.Cell>
									<Table.Cell>
											{user.first_name + " " + user.last_name}
									</Table.Cell>
									<Table.Cell>{user.email}
									</Table.Cell>
									<Table.Cell>{user.is_admin ? (<FaCheck className="text-green-500" />) : (<FaTimes className="text-red-500" />)}</Table.Cell>
									<Table.Cell>
										<span
											className="font-medium text-red-500 hover:underline cursor-pointer"
											onClick={() => {
												setDeleteUserId(user.id);
												setShowModal(true);
											}}
										>
											Delete
										</span>
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
				<p>You have no users yet!</p>
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

export default DashUsers;
