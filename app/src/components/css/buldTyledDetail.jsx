import styled from "styled-components";

export const BuildCardContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
  padding: 2rem;
`;

export const BuildTitle = styled.h2`
  text-align: center;
  color: #2d3748;
  margin-bottom: 2rem;
`;

export const BuildTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
`;

export const BuildTh = styled.th`
  background: #f7fafc;
  color: #333;
  padding: 10px;
  border-bottom: 2px solid #e2e8f0;
  text-align: left;
`;

export const BuildTd = styled.td`
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
`;

export const BuildError = styled.div`
  color: #e53e3e;
  text-align: center;
  margin-top: 2rem;
`;

export const BuildLink = styled.a`
  color: #3182ce;
  text-decoration: underline;
  &:hover {
    color: #2b6cb0;
  }
`;