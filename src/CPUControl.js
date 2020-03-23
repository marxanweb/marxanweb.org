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
