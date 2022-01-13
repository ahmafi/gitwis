// SPDX-FileCopyrightText: 2021 Amir Hossein Mafi <amir77mafi@gmail.com>
// SPDX-License-Identifier: LGPL-3.0-or-later

import { createGlobalStyle } from 'styled-components';

// workaround: prettier doesn't format global style
// replace "createGlobalStyle" with "css" to get formatting
const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    font-family: 'roboto';
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  // https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html
  ul[role='list'],
  ol[role='list'] {
    list-style: none;
  }

  #root {
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.background};
  }
`;

export default GlobalStyle;
