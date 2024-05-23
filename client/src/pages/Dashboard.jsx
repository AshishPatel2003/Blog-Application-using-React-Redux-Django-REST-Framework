import { useLocation } from "react-router-dom";
import DashSideBar from "../components/Dashboard/DashSideBar";
import { useEffect, useState } from "react";
import DashProfile from "../components/Dashboard/DashProfile";

function Dashboard() {
	const location = useLocation();
	const [tab, setTab] = useState();
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get("tab");
		if (tabFromUrl) {
      setTab(tabFromUrl)
    }
	}, [location.search]);

	return (
		<div className="min-h-screen flex flex-col md:flex-row">
			<div className="md:w-56">
				{/* SideBar Dashboard */}
				<DashSideBar tab={tab} />
			</div>
			{tab === "profile" && <DashProfile />}
		</div>
	);
}

export default Dashboard;
