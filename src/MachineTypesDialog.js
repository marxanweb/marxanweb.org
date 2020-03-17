import React from 'react';
class MachineTypesDialog extends React.Component {
    onClick(e){
        this.props.setMachineType();
        this.props.hideMachineTypesDialog();
    }
    onCancel(e){
        this.props.hideMachineTypesDialog();
    }
    render() {
        let options = this.props.machineTypes.map(mt=>{
            return <option value={mt.name} key={mt.name}>{mt.description}</option>;
        });
        
        return (
            <div className='dialog' style={{display: (this.props.open) ? 'block' : 'none'}}>
			    <div className='dialoginner'>
    			    <div>Choose a machine type:</div>
    			    <select className={'selectMT'} onChange={this.props.onChangeMachineType.bind(this)} value={this.props.machineType}>{options}</select>
    			    <div className={'selectMT'}>
    			        <button type="button" onClick={this.onCancel.bind(this)}>Cancel</button>
    			        <button type="button" onClick={this.onClick.bind(this)}>OK</button>
    			    </div>
			    </div>
			</div>
        );
    }
}

export default MachineTypesDialog;
