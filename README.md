# react-dialog
> A react dialog based on HTML dialog.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install -S @jswork/react-dialog
```

## usage
1. import css
  ```scss
  @import "~@jswork/react-dialog/dist/style.css";

  // or use sass
  @import "~@jswork/react-dialog/dist/style.scss";

  // customize your styles:
  $react-dialog-options: ()
  ```
2. import js
  ```js
  import React from 'react';
  import ReactDialog from '../../src/main';
  import styled from 'styled-components';

  const Container = styled.div`
      width: 80%;
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
        <ReactDialog visible={visible}>
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

  ```

## preview
- https://afeiship.github.io/react-dialog/

## license
Code released under [the MIT license](https://github.com/afeiship/react-dialog/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/react-dialog
[version-url]: https://npmjs.org/package/@jswork/react-dialog

[license-image]: https://img.shields.io/npm/l/@jswork/react-dialog
[license-url]: https://github.com/afeiship/react-dialog/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/react-dialog
[size-url]: https://github.com/afeiship/react-dialog/blob/master/dist/react-dialog.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/react-dialog
[download-url]: https://www.npmjs.com/package/@jswork/react-dialog
