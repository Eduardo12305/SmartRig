import styled from "styled-components";

export const StyledHomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2rem;
  background-color: #f8f9fa; /* Light background for better contrast */
  margin-top: 50px;
`;

export const StyledHomeTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  margin-bottom: 0rem;
  padding-bottom: 0rem;
`;

export const StyledHomeTitle = styled.h3`
  font-size: 1.5rem;
  color: #333; /* Darker text for better readability */
  text-align: center;
  font-family: Arial, sans-serif;
  margin-left: 100px;
`;
