import React from 'react';

let TIMEOUTS = [{ text: '1 hour', minutes: "60" }, { text: '2 hours', minutes: "120" }, { text: '3 hours', minutes: "180" }, { text: '4 hours', minutes: "240" }, { text: '5 hours', minutes: "300" }, { text: '6 hours', minutes: "360" }, { text: '7 hours', minutes: "420" }, { text: '8 hours', minutes: "480" }];

class StartDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { timeout: "60", username: '', password: ''};
    }
    startServer() {
        this.props.setUserPassword(this.state.username, this.state.password);
        this.props.setMachineType();
        this.props.setTimeout(this.state.timeout);
        this.props.hideStartDialog();
    }
    onCancel(e) {
        this.props.hideStartDialog();
    }
    setTimeout(e) {
        this.setState({ timeout: e.target.value });
    }
    changeUser(e) {
        this.setState({ username: e.target.value });
    }
    changePassword(e) {
        this.setState({ password: e.target.value });
    }
    render() {
        let machinetype_options = this.props.machineTypes.map(mt => {
            return <option value={mt.name} key={mt.name}>{mt.description}</option>;
        });
        let timeout_options = TIMEOUTS.map(timeout => {
            return <option value={timeout.minutes} key={timeout.text}>{timeout.text}</option>;
        });
        return (
            <div className='dialog' style={{display: (this.props.open) ? 'block' : 'none'}}>
			    <div className='dialoginner'>
    			    <div className={'heading'}>Choose a machine type:</div>
    			    <select className={'toppad10'} onChange={this.props.onChangeMachineType.bind(this)} value={this.props.machineType}>{machinetype_options}</select>
    			    <div className={'heading'}>Choose a timeout:</div>
    			    <select className={'toppad10'} onChange={this.setTimeout.bind(this)} value={this.state.timeout}>{timeout_options}</select>
    			    <div className={'heading'}>Username:</div>
    			    <input type="text" onChange={this.changeUser.bind(this)}/>
    			    <div className={'heading'}>Password:</div>
    			    <input type="password" onChange={this.changePassword.bind(this)}/>
    			    <div className={'toppad20'}>
    			        <button type="button" onClick={this.onCancel.bind(this)}>Cancel</button>
    			        <button type="button" onClick={this.startServer.bind(this)}>OK</button>
    			    </div>
			    </div>
			</div>
        );
    }
}

export default StartDialog;
