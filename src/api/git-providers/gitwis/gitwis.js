// SPDX-FileCopyrightText: 2021 Amir Hossein Mafi <amir77mafi@gmail.com>
// SPDX-License-Identifier: LGPL-3.0-or-later

import Files from './getDirectory.gql';
import { print } from 'graphql';

export const getDirectory = async (path) => {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: print(Files),
      variables: {
        path,
      },
    }),
  });
  const responseJSON = await response.json();
  return responseJSON.data.files;
};
