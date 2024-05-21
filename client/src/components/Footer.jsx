import { Footer } from "flowbite-react";
import {
	BsDribbble,
	BsFacebook,
	BsGithub,
	BsInstagram,
	BsTwitter,
} from "react-icons/bs";
import { Link } from "react-router-dom";

function FooterComponent() {
	return (
		<Footer
			container
			className="border border-t-8 border-teal-500 dark:text-white"
		>
			<div className="w-full max-w-7xl mx-auto">
				<div className="grid w-full justify-between sm:flex md:grid-cols-1">
					<div className="mt-5">
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
					</div>
					<div className=" grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6 mt-5">
						<div>
							<Footer.Title title="About" />
							<Footer.LinkGroup col>
								<Footer.Link
									target="_blank"
									href=""
									rel="noopener noreferrer"
								>
									100js Project
								</Footer.Link>
								<Footer.Link
									target="_blank"
									href=""
									rel="noopener noreferrer"
								>
									100js Project
								</Footer.Link>
								<Footer.Link
									target="_blank"
									href=""
									rel="noopener noreferrer"
								>
									100js Project
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title="Follow Us" />
							<Footer.LinkGroup col>
								<Footer.Link
									target="_blank"
									href=""
									rel="noopener noreferrer"
								>
									Github
								</Footer.Link>
								<Footer.Link
									target="_blank"
									href=""
									rel="noopener noreferrer"
								>
									100js Project
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title="Follow Us" />
							<Footer.LinkGroup col>
								<Footer.Link
									target="_blank"
									href=""
									rel="noopener noreferrer"
								>
									Privacy Policy
								</Footer.Link>
								<Footer.Link
									target="_blank"
									href=""
									rel="noopener noreferrer"
								>
									Terms & Conditions
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
					</div>
				</div>
				<Footer.Divider />
				<div className="w-full sm:flex  sm:items-center sm:justify-between">
					<Footer.Copyright
						href="/"
						by="Ashish's Blog"
						year={new Date().getFullYear()}
					/>
					<div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
						<Footer.Icon href="/" icon={BsFacebook} />
						<Footer.Icon href="/" icon={BsInstagram} />
						<Footer.Icon href="/" icon={BsTwitter} />
						<Footer.Icon href="/" icon={BsGithub} />
						<Footer.Icon href="/" icon={BsDribbble} />
					</div>
				</div>
			</div>
		</Footer>
	);
}

export default FooterComponent;
