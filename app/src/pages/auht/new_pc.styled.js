import styled from "styled-components";

export const FormContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: flex-start;
    justify-content: flex-start;
    margin: 2rem;
`;

export const Label = styled.label`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    font-weight: 500;
`;

export const Select = styled.select`
    margin-top: 0.5rem;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
`;

export const Input = styled.input`
    margin-top: 0.5rem;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
`;

export const Button = styled.button`
    padding: 0.7rem 1.5rem;
    background: #0072e4;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 1rem;
    &:disabled {
        background: #aaa;
        cursor: not-allowed;
    }
`;

export const TableContainer = styled.div`
    min-width: 350px;
    background: #f8f8f8;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px #0001;
`;

export const ResultTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    th, td {
        border: 1px solid #ddd;
        padding: 0.5rem 1rem;
        text-align: left;
    }
    th {
        background: #0072e4;
        color: #fff;
    }
    tr:nth-child(even) {
        background: #f0f6ff;
    }
`;