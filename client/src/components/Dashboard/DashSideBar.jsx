import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { signOut } from "../../redux/user/userSlice";

// eslint-disable-next-line react/prop-types
function DashSideBar({ tab }) {
	const dispatch = useDispatch();
	return (
		<Sidebar className="w-full md:w-56">
			<Sidebar.Items>
				<Sidebar.ItemGroup>
					<Link to={"/dashboard?tab=profile"}>
						<Sidebar.Item
							active={tab === "profile"}
							icon={HiUser}
							label={"User"}
							labelColor={"dark"}
							as={"div"}
						>
							Profile
						</Sidebar.Item>
					</Link>
					<Link to={"/dashboard?tab=signout"}>
						<Sidebar.Item
							active={tab === "signout"}
							icon={HiArrowSmRight}
							labelColor={"dark"}
							as={"div"}
							onClick={() => {dispatch(signOut())}}
							className="cursor-pointer"
						>
							Sign out
						</Sidebar.Item>
					</Link>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
}

export default DashSideBar;
