import React from 'react';
import PropTypes from 'prop-types';

import { ReactEasyCrudContext } from './Context';

function ProviderEasyCrud({ client, type, children, localize }) {
  return (
    <ReactEasyCrudContext.Provider value={{ client, type, localize }}>
      {children}
    </ReactEasyCrudContext.Provider>
  );
}

ProviderEasyCrud.propTypes = {
  localize: PropTypes.string,
  type: PropTypes.oneOf(['rest', 'graphql']).isRequired,
  children: PropTypes.element.isRequired,
  client: PropTypes.any.isRequired,
};

export default ProviderEasyCrud;
