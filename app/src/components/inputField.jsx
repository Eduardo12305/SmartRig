const InputField = ({ id, label, value, onChange, placeholder, required, type = "text" }) => {
    return (
        <div className="input">
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
};

export default InputField;
