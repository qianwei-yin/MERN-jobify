import logo from '../assets/images/logo.svg';
import { Link } from 'react-router-dom';

const Logo = () => {
	return (
		<Link to="/">
			<img src={logo} alt="jobify" className="logo" />
		</Link>
	);
};

export default Logo;
