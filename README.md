# react-easy-crud

> React easy CRUD

[![NPM](https://img.shields.io/npm/v/react-easy-crud.svg)](https://www.npmjs.com/package/react-easy-crud) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-easy-crud
```

## Usage

```jsx
import React from 'react'

import { ProviderEasyCrud } from 'react-easy-crud'
import client from './client'; // client of apollo-client or axios

function App() {
  return (
    <ProviderEasyCrud type='graphql' client={client}>
      <MyApp />
    </ProviderEasyCrud>
  )
}
```

## License

MIT © [miguelcast](https://github.com/miguelcast)
