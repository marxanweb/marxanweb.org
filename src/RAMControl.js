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
