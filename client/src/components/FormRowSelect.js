const FormRowSelect = ({ name, value, handleChange, labelText, options }) => {
	return (
		<div className="form-row">
			<label htmlFor={name} className="form-label">
				{labelText || name}
			</label>

			<select name={name} value={value} onChange={handleChange} className="form-select">
				{options.map((op, index) => {
					return (
						<option value={op} key={index}>
							{op}
						</option>
					);
				})}
			</select>
		</div>
	);
};

export default FormRowSelect;
