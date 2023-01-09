import Wrapper from '../assets/wrappers/SmallSidebar';
import { useAppContext } from '../context/appContext';
import { FaTimes } from 'react-icons/fa';
import NavLinks from './NavLinks';
import Logo from './Logo';

const SmallSidebar = () => {
	const { showSidebar, toggleSidebar } = useAppContext();

	return (
		<Wrapper>
			<div className={`${showSidebar ? 'show-sidebar' : null} sidebar-container`}>
				<div className="content">
					<button className="close-btn" type="button" onClick={toggleSidebar}>
						<FaTimes />
					</button>

					<header>
						<Logo />
					</header>

					<NavLinks toggleSidebar={toggleSidebar} />
				</div>
			</div>
		</Wrapper>
	);
};

export default SmallSidebar;
