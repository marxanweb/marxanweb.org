import React from 'react';
import working from './status-working-28.gif';

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
	    	case 'PROVISIONING':
	    		control = <div className={'serverStatusIconContainer'} title={'The server is being provisioned'}><img className={"p6n-icon-status-working"} src={working} alt="The server is being stopped"/></div>;
	    		break;
	    	case 'STAGING':
	    		control = <div className={'serverStatusIconContainer'} title={'The server is being staged'}><img className={"p6n-icon-status-working"} src={working} alt="The server is being stopped"/></div>;
	    		break;
	    	case 'RUNNING':
	    		control = <div className={'serverStatusIconContainer'} title={'The server is running. Click to stop.'} onClick={this.stopServer.bind(this)}><svg viewBox="0 0 14 14">    <path fill="#00C752" d="M5.50183983,10.4944805 L5.50367966,10.4963203         L12.8482451,3.15175489         C13.5762779,4.25592793 14,5.57848014 14,7         C14,10.866 10.866,14 7,14 C3.134,14 0,10.866 0,7         C0,3.134 3.134,0 7,0         C8.67832535,0 10.218695,0.590646458 11.4245848,1.57541523         L11.4245848,1.57541523 L5.50183983,7.49816017         L3.50183983,5.49816017 L2.00183983,6.99816017         L5.5,10.4963203 L5.50183983,10.4944805 Z"></path>  </svg></div>;
	    		break;
	        case 'STOPPING':
	        	control = <div className={'serverStatusIconContainer'} title={'The server is being stopped'}><img className={"p6n-icon-status-working"} src={working} alt="The server is being stopped"/></div>;
	        	break;
	    	case 'REPAIRING':
	    		control = <div className={'serverStatusIconContainer'} title={'The server is being repaired'}><img className={"p6n-icon-status-working"} src={working} alt="The server is being stopped"/></div>;
	    		break;
	        case 'TERMINATED':
	            control = <div className={'serverStatusIconContainer'} title={'The server is stopped. Click to start.'} onClick={this.startServer.bind(this)}><svg viewBox="0 0 14 14">    <path fill="#A9A9A9" d="M7,14 C10.8659932,14 14,10.8659932 14,7         C14,3.13400675 10.8659932,0 7,0         C3.13400675,0 0,3.13400675 0,7         C0,10.8659932 3.13400675,14 7,14 Z         M4,4.99077797 C4,4.44358641 4.45097518,4 4.99077797,4         L9.00922203,4 C9.55641359,4 10,4.45097518 10,4.99077797         L10,9.00922203 C10,9.55641359 9.54902482,10 9.00922203,10         L4.99077797,10 C4.44358641,10 4,9.54902482 4,9.00922203         L4,4.99077797 Z"></path>  </svg></div>;
	            break;
	        default:
	            break;
	    }
	    return(
            <div>{control}</div>
        );
	}
}

export default ServerControls;