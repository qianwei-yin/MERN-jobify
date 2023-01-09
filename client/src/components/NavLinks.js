import sidebarLinks from '../utils/sidebarLinks';
import { NavLink } from 'react-router-dom';

const NavLinks = ({ toggleSidebar }) => {
	return (
		<div className="nav-links">
			{sidebarLinks.map((link) => {
				const { id, text, path, icon } = link;
				return (
					<NavLink
						className={({ isActive }) => `${isActive ? 'active' : null} nav-link`}
						key={id}
						to={path}
						onClick={toggleSidebar}
					>
						<span className="icon">{icon}</span>
						{text}
					</NavLink>
				);
			})}
		</div>
	);
};

export default NavLinks;
