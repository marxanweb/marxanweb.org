/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/www.marxanweb.org
 * (see https://github.com/marxanweb/www.marxanweb.org).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from 'react';

class RAMControl extends React.Component {
	render() {
		let control = (this.props.machineType) ?
			<div style={{textAlign:'center'}}>{(Number(this.props.machineType.memoryMb)/1000).toFixed(1)} Gb</div> :
			<div style={{textAlign:'center'}}>{this.props.marxanserver.ram}</div>;
		return (
			control
		);
	}
}

export default RAMControl;
