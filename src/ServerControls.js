import React from 'react';

class ServerControls extends React.Component {
    startServer(){
        this.props.startServer(this.props.server);
    }
    stopServer(){
        this.props.stopServer(this.props.server);
    }
	render() {
	    let control;
	    switch (this.props.server.status) {
	        case 'TERMINATED':
	            control = <div onClick={this.startServer.bind(this)}>Start</div>;
	            break;
	        case 'STOPPING':
	        	control = <div>Stopping</div>;
	        	break;
	        default:
	            control = <div onClick={this.stopServer.bind(this)}>Stop</div>;
	            break;
	    }
	    return(
            <div>{control}</div>
        );
	}
}

export default ServerControls;