import { useAppContext } from '../context/appContext';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import Wrapper from '../assets/wrappers/PageBtnContainer';

const PageBtnContainer = () => {
	const { page, numOfPages, changePage } = useAppContext();

	const pages = Array.from({ length: numOfPages }, (_, index) => {
		return index + 1;
	});

	function prevPage() {
		let newPage = page - 1;
		if (newPage < 1) return;
		changePage(newPage);
	}

	function nextPage() {
		let newPage = page + 1;
		if (newPage > numOfPages) return;
		changePage(newPage);
	}

	return (
		<Wrapper>
			<button className="prev-btn" onClick={prevPage}>
				<HiChevronDoubleLeft />
				prev
			</button>

			<div className="btn-container">
				{pages.map((item) => {
					return (
						<button
							type="button"
							key={item}
							className={`${page === item ? 'active' : null} pageBtn`}
							onClick={() => changePage(item)}
						>
							{item}
						</button>
					);
				})}
			</div>

			<button className="next-btn" onClick={nextPage}>
				next
				<HiChevronDoubleRight />
			</button>
		</Wrapper>
	);
};

export default PageBtnContainer;
