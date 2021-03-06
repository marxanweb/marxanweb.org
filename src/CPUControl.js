/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/www.marxanweb.org
 * (see https://github.com/marxanweb/www.marxanweb.org).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from 'react';

class CPUControl extends React.Component {
	render() {
		let control = (this.props.machineType) ?
			<div style={{textAlign:'center'}}>{this.props.machineType.guestCpus}</div> :
			<div style={{textAlign:'center'}}>{this.props.marxanserver.processor_count}</div>;
		return (
			control
		);
	}
}

export default CPUControl;
