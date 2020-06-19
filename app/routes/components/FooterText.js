import React from 'react';
import PropTypes from 'prop-types';

const FooterText = (props) => (
	<React.Fragment>
		(C) { props.year } { props.name } All Rights Reserved.
	</React.Fragment>
)
FooterText.propTypes = {
    year: PropTypes.node,
	name: PropTypes.node,
};
FooterText.defaultProps = {
    year: "2020",
    name: "Hitachi Ltd.",
};

export { FooterText };
