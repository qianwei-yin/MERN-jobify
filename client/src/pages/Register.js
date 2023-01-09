import { useEffect, useState } from 'react';
import { FormRow, Logo, Alert } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';

const initialState = {
	name: '',
	email: '',
	password: '',
	isMember: true,
};

const Register = () => {
	const navigate = useNavigate();
	const [values, setValues] = useState(initialState);
	const { user, isLoading, showAlert, displayAlert, setupUser } = useAppContext();

	function handleChange(e) {
		setValues({ ...values, [e.target.name]: e.target.value });
	}

	function onSubmit(e) {
		e.preventDefault();
		const { name, email, password, isMember } = values;
		if (!email || !password || (!isMember && !name)) {
			displayAlert('danger', 'Please provide all values!');
			return;
		}
		const currentUser = { name, email, password };
		if (isMember) {
			setupUser({ currentUser, endPoint: 'login', alertText: 'Login successful! Redirecting...' });
		} else {
			setupUser({ currentUser, endPoint: 'register', alertText: 'User created! Redirecting...' });
		}
	}

	function toggleMember() {
		setValues({ ...values, isMember: !values.isMember });
	}

	useEffect(() => {
		if (user) {
			setTimeout(() => {
				navigate('/');
			}, 3000);
		}
	}, [user, navigate]);

	return (
		<Wrapper className="full-page">
			<form className="form" onSubmit={onSubmit}>
				<Logo />
				<h3>{values.isMember ? 'Login' : 'Register'}</h3>
				{showAlert && <Alert />}
				{values.isMember || <FormRow type="text" name="name" value={values.name} handleChange={handleChange} />}
				<FormRow type="email" name="email" value={values.email} handleChange={handleChange} />
				<FormRow type="password" name="password" value={values.password} handleChange={handleChange} />
				<button className="btn btn-block" type="submit" onClick={displayAlert} disabled={isLoading}>
					submit
				</button>

				<button
					type="button"
					className="btn btn-block btn-hipster"
					disabled={isLoading}
					onClick={() => {
						setupUser({
							currentUser: { email: 'testUser@test.com', password: 'secret' },
							endPoint: 'login',
							alertText: 'Login Successful! Redirecting...',
						});
					}}
				>
					{isLoading ? 'loading...' : 'demo app / read only'}
				</button>

				<p>
					{values.isMember ? 'Not a member yet?' : 'Already a member?'}
					<button type="button" onClick={toggleMember} className="member-btn">
						{values.isMember ? 'Register' : 'Login'}
					</button>
				</p>
			</form>
		</Wrapper>
	);
};

export default Register;
