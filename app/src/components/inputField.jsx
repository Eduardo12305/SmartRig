
import styled from "styled-components";

const StyledInput = styled.input`
background-color: #fff;
color: black;
`
const InputField = ({ id, label, value, onChange, placeholder, required, type = "text" }) => {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <StyledInput
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
