import React from 'react';
import PropTypes from 'prop-types';

import { ReactEasyCrudContext } from './Context';

function ProviderEasyCrud({ client, children }) {
  return (
    <ReactEasyCrudContext.Provider value={{ client }}>
      {children}
    </ReactEasyCrudContext.Provider>
  );
}

ProviderEasyCrud.propTypes = {
  children: PropTypes.element.isRequired,
  client: PropTypes.any.isRequired,
};

export default ProviderEasyCrud;
