// SPDX-FileCopyrightText: 2021 Amir Hossein Mafi <amir77mafi@gmail.com>
// SPDX-License-Identifier: LGPL-3.0-or-later

import React from 'react';
import FilesList from './features/files/FilesList';
import GlobalStyle from './styles/Global';
import { ThemeProvider } from 'styled-components';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const darkTheme = {
  colors: {
    background: '#202124',
    el1: '#303134',
    primary: '#81d4fa',
    primaryLight: '#b2fef7',
    primaryDark: '#4ba3c7',
    secondary: '',
    secondaryLight: '',
    secondaryDark: '',
    text: {
      background: '#bdc1c6',
      el1: '#e8eaed',
      el1Dark: '#444',
      primary: '#000',
      primaryLight: '#000',
      primaryDark: '#000',
      secondary: '#000',
      secondaryLight: '#000',
      secondaryDark: '#000',
    },
    hover: {
      el1: '#404144',
    },
  },
};

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <FilesList />
    </ThemeProvider>
  );
}
