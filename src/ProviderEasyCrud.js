import React from 'react';
import PropTypes from 'prop-types';

import { ReactEasyCrudContext } from './Context';

function ProviderEasyCrud({ client, type, children }) {
  return (
    <ReactEasyCrudContext.Provider value={{ client, type }}>
      {children}
    </ReactEasyCrudContext.Provider>
  );
}

ProviderEasyCrud.propTypes = {
  type: PropTypes.oneOf(['rest', 'graphql']).isRequired,
  children: PropTypes.element.isRequired,
  client: PropTypes.any.isRequired,
};

export default ProviderEasyCrud;
