import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOut } from "../redux/user/userSlice";

function Header() {

	const path = useLocation().pathname;
	const dispatch = useDispatch();

	const { currentUser } = useSelector(state => state.user)
	const { theme } = useSelector(state => state.theme)

	return (
		<Navbar className="border-b-2">
			<Link
				to={"/"}
				className="self-center text-sm sm:text-xl font-semibold dark:text-white"
			>
				One&nbsp;
				<span className="px-2 py-1 bg-gradient-to-r text-white from-indigo-500 via-purple-500 to-pink-500 rounded-lg">
					4
				</span>
				&nbsp;All
			</Link>
			<form action="">
				<TextInput
					type="text"
					placeholder="Search..."
					rightIcon={AiOutlineSearch}
					className="hidden lg:inline"
				/>
			</form>
			<Button className="w-12  h-10 lg:hidden" color={"gray"} pill>
				<AiOutlineSearch />
			</Button>
			<div className="flex gap-2 md:order-2">
				<Button
					color={"gray"}
					pill
					className="w-12 h-10 hidden sm:inline"
					onClick={() => dispatch(toggleTheme())}
				>
					{theme == 'light' ? (<FaSun />) : (<FaMoon />)}
				</Button>
				{currentUser ? (
					<Dropdown arrowIcon={false} inline label={
						<Avatar alt="user" rounded img={currentUser?.photoURL} />
					}>
						<Dropdown.Header>
							<span className="block text-sm">
								@{currentUser.first_name}
							</span>
							<span className="block text-sm font-medium truncate">
								{currentUser.email}
							</span>
						</Dropdown.Header>
						<Link to={"/dashboard?tab=profile"}>
							<Dropdown.Item>Profile</Dropdown.Item>
						</Link>
						<Dropdown.Divider />
						<Dropdown.Item onClick={() => {dispatch(signOut())}}>Sign out</Dropdown.Item>
					</Dropdown>
				) : (
					<Link to={"/sign-in"} >
						<Button gradientDuoTone={"purpleToBlue"} outline >
							Sign In
						</Button>
					</Link>
				)}
				<Navbar.Toggle />
			</div>
			<Navbar.Collapse>
				<Navbar.Link active={path === "/"} as={'div'}>
					<Link to={"/"}>Home</Link>
				</Navbar.Link>
				<Navbar.Link active={path === "/about"} as={'div'}>
					<Link to={"/about"}>About</Link>
				</Navbar.Link>
				<Navbar.Link active={path === "/projects "} as={'div'}>
					<Link to={"/projects"}>Projects</Link>
				</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	);
}

export default Header;
