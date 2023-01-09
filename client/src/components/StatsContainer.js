import { useAppContext } from '../context/appContext';
import StatsItem from './StatsItem';
import { FaSuitcaseRolling, FaCalendarCheck, FaBug, FaCheck } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/StatsContainer';

const StatsContainer = () => {
	const { stats } = useAppContext();

	const defaultStats = [
		{
			title: 'accepted applications',
			count: stats.accepted,
			icon: <FaCheck />,
			color: '#22c55e',
			bcg: '#86efac',
		},
		{
			title: 'pending applications',
			count: stats.pending,
			icon: <FaSuitcaseRolling />,
			color: '#e9b949',
			bcg: '#fcefc7',
		},
		{
			title: 'interviews scheduled',
			count: stats.interview,
			icon: <FaCalendarCheck />,
			color: '#647acb',
			bcg: '#e0e8f9',
		},
		{
			title: 'jobs declined',
			count: stats.declined,
			icon: <FaBug />,
			color: '#d66a6a',
			bcg: '#ffeeee',
		},
	];

	return (
		<Wrapper>
			{defaultStats.map((item, index) => {
				return <StatsItem key={index} {...item} />;
			})}
		</Wrapper>
	);
};

export default StatsContainer;
