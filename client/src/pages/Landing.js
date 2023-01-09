import { Logo } from '../components';
import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import { Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const Landing = () => {
	const { user } = useAppContext();

	return (
		<>
			{user && <Navigate to="/" />}

			<Wrapper>
				<nav>
					<Logo />
				</nav>
				<div className="container page">
					<div className="info">
						<h1>
							job <span>tracking</span> app
						</h1>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates deserunt laudantium incidunt asperiores.
							Reprehenderit necessitatibus ex repudiandae natus ut eos.
						</p>
						<Link to="/register" className="btn btn-hero">
							Login / Register
						</Link>
					</div>
					<img src={main} alt="job hunt" className="img main-img" />
				</div>
			</Wrapper>
		</>
	);
};

export default Landing;
