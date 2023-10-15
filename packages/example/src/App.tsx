import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Button from '@jswork/react-lib';
import './App.css';

function App() {
  return (
    <>
      <h1>react-lib</h1>
      <Button
        onClick={() => {
          console.log('click me');
        }}>
        Click me
      </Button>
    </>
  );
}

export default App;
