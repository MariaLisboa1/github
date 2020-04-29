import styled from 'styled-components';

const Container = styled.div`
  max-width: 700px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 80px auto;

  h1 {
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      margin-right: 10px;
    }
  }

  @media (min-width: 481px) and (max-width: 767px) {
    max-width: 400px;
  }

  @media (min-width: 320px) and (max-width: 480px) {
    max-width: 320px;
  }
`;

export default Container;
