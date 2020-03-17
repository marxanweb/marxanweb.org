import React from 'react';

class RAMControl extends React.Component {
	render() {
		let control = (this.props.machineType) ?
			<div>{(Number(this.props.machineType.memoryMb)/1000).toFixed(1)} Gb</div> :
			<div>{this.props.marxanserver.ram}</div>;
		return (
			control
		);
	}
}

export default RAMControl;
