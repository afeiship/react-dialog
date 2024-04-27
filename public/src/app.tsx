import React from 'react';
import ReactDialog from '../../src/main';
import styled from 'styled-components';

const Container = styled.div`
    width: 80%;
    height: 80vh;
    border: 1px solid #ccc;
    position: relative;
    margin: 30px auto 0;

    nav {
        position: fixed;
        z-index: 100;
    }
`;

export default () => {
  const [visible, setVisible] = React.useState(false);

  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };
  return (
    <Container>
      <button onClick={handleOpen}>Open</button>
      <ReactDialog visible={visible} withBackdrop keepMounted>
        <ul>
          <li>道可道，非常道；名可名，非常名。</li>
          <li>无名，天地之始，有名，万物之母。</li>
          <li>故常无欲，以观其妙，常有欲，以观其徼。</li>
          <li>此两者，同出而异名，同谓之玄，玄之又玄，众妙之门。</li>
        </ul>
        <nav>
          <button onClick={handleClose}>Close</button>
        </nav>
      </ReactDialog>
    </Container>
  );
};
