/*global gapi*/
/*global fetch*/
/*global AbortController*/
import './App.css';
import React from 'react';
import ReactTable from 'react-table';
import ServerControls from './ServerControls';
import CPUControl from './CPUControl';
import RAMControl from './RAMControl';
import StartDialog from './StartDialog';
import 'react-table/react-table.css';
import { login, signOut, getVMs, getVM, getMachineTypesForProject } from './computeEngineAPI.js';
import { isNumber } from './genericFunctions.js';

//CONSTANTS
let TORNADO_PATH = "/marxan-server/";
let GCP_PROJECT = "marxan-web";
let GCP_REGION = "us-central1";
let GCP_ZONE = "us-central1-a";
// let GCP_PROJECT = "geeimageserver";
// let GCP_REGION = "europe-west6";
// let GCP_ZONE = "europe-west6-a";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loginText: "Sign in", loginTitle: 'Click to sign in', marxanServers: [], clickedServer: {}, loggedIn: false, vms: [], serversLoaded: false, machineTypes: [], startDialogOpen: false, machineType: '', timeout: 60, invalidLogin: false, failedToStartServer: false, failedToSetMachineType: false };
    this.initialiseServers(window.MARXAN_SERVERS);
    this.authenticated = false;
  }
  toggleLoginState() {
    if (this.state.loggedIn){
      signOut().then(()=>{
        this.setState({ loggedIn: false, loginText: 'Sign in', loginTitle: 'Signed in as ' });
      });
    }else{
      login().then((basicProfile) => {
        //set the state
        this.setState({ loggedIn: true, loginText: 'Sign out', loginTitle: 'Signed in as:' + basicProfile.getName() + " (" + basicProfile.getEmail() + ")" });
        //get the VMs
        this._getVMs();
        //get an array of the machine types available for the project
        getMachineTypesForProject(GCP_PROJECT, GCP_REGION, GCP_ZONE).then((machineTypes) => {
          //filter the machine types for c2 types (compute-optimised) and n1 (general purpose)
          // machineTypes = machineTypes.filter(mt => (mt.name.substr(0, 3) === 'c2-' || mt.name.substr(0, 3) === 'n1-'));
          //filter the machine types for n1 (general purpose)
          machineTypes = machineTypes.filter(mt => (mt.name.substr(0, 3) === 'n1-'));
          //filter the machine types for available ones only
          machineTypes = machineTypes.filter(mt => (mt.available));
          //sort by the description
          this.sortObjectArray(machineTypes, 'guestCpus');
          this.setState({ machineTypes: machineTypes });
        });
      });
    }
  }
  //gets a list of VMs for the project and zone
  _getVMs() {
    //get the VMs
    getVMs(GCP_PROJECT, GCP_ZONE).then((_vms) => {
      //if the initial state of any of the VMs is STOPPING, PROVISIONING,STAGING,REPAIRING then start polling as they will change
      let dynamicStatuses = new Set(['STOPPING', 'PROVISIONING','STAGING','REPAIRING']);
      _vms.forEach(_vm=>{
        if (dynamicStatuses.has(_vm.status)) this.pollServer(_vm);
      });
      this.setState({ vms: _vms });
    });
  }
  //gets data for a single VM
  _getVM(server) {
    getVM(GCP_PROJECT, GCP_ZONE, server.name).then((_vm) => {
      //get the matching marxan server from the VM
      let marxanserver = this.getMarxanServerForVM(server.name);
      //see if the servers status has changed
      if (this.vmConfig.status !== _vm.status) {
        //if the server has stopped or started, then stop polling and remove any timeouts
        if (_vm.status === 'TERMINATED' || _vm.status === 'RUNNING') {
          clearInterval(this.vm_timer);
          this.timer = undefined;
          //update the marxan servers shutdowntime
          this.updateMarxanServerShutdowntime(marxanserver, undefined);
          //if the server has started, then poll to see when the marxan-server has started
          if (_vm.status === 'RUNNING') this.pollMarxanServer(server);
        }
        //if the server is stopping then set the server as offline
        if (_vm.status === 'STOPPING') {
          //update the state
          this.updateMarxanServerStatus(marxanserver, true);
        }
        //if the server is stopping after a provisioninf status, then the start failed
        if (this.vmConfig.status ==="PROVISIONING" && _vm.status === "STOPPING"){
          this.setState({failedToStartServer: true});
        }
        //update the state
        let _vms = this.state.vms;
        _vms.map(item => {
          let _obj = (item.name === server.name) ? Object.assign(item, { status: _vm.status }) : item;
          return _obj;
        });
        this.setState({ vms: _vms });
        //save the current configuration to a local variable
        this.vmConfig = _vm;
      }

    });
  }
  //sorts an object array by the passed sort field
  sortObjectArray(arr, sortField) {
    arr.sort((a, b) => {
      if (isNumber(a[sortField])) {
        if ((a[sortField] < b[sortField]))
          return -1;
        if (a[sortField] > b[sortField])
          return 1;
        return 0;
      }
      else {
        if ((a[sortField].toLowerCase() < b[sortField].toLowerCase()) || (a.type === "local"))
          return -1;
        if (a[sortField].toLowerCase() > b[sortField].toLowerCase())
          return 1;
        return 0;
      }
    });
  }
  //starts polling the server to check for an updated status
  pollServer(server) {
    //cancel any polling to marxan if it is happening
    if (this.timer) this.clearMarxanPolling();
    //get the initial server configuration
    this.vmConfig = server;
    this._getVM(server);
    //start polling the server at regular intervals
    this.vm_timer = setInterval(() => {
      this._getVM(server);
    }, 1000);
  }
  //starts polling the marxan server to check to see when it is online/offline
  pollMarxanServer(server) {
    //get the corresponding marxanserver instance
    let marxanserver = this.getMarxanServerForVM(server.name);
    //set the offline property to undefined - this will show the loader
    this.updateMarxanServerStatus(marxanserver, undefined);
    //poll the server to see if it is ready
    this.timer = setInterval(async () => {
      let _marxanserver = await this.getServerCapabilities(marxanserver);
      //if the _marxanserver is online then update state, stop polling and set it to shutdown 
      if (!_marxanserver.offline) {
        this.clearMarxanPolling();
        //update the state
        this.updateMarxanServerStatus(marxanserver, false);
        //authenticate to the marxan-server
        if (!this.authenticated) {
          await this.authenticate(marxanserver);
          //authenticated - now set up the shutdown
          await this.setupShutdown(marxanserver, server);
        }
      }
    }, 1000);
  }
  clearMarxanPolling() {
    clearInterval(this.timer);
    this.timeout = undefined;
  }
  //authenticates to the marxan server - if successful sets a cookie to be able to call shutdown
  async authenticate(marxanserver) {
    try{
      let response = await fetch(marxanserver.endpoint + "validateUser?user=" + this.state.username + "&password=" + this.state.password);
      if (!response.ok) {
        throw Error("fetch returned a 404 or 500 error: " + response.statusText);
      }
      const json = await response.json();
      if (json.hasOwnProperty('error')){
        alert(json.error);
        this.setState({ invalidLogin: true });
      }else{
        this.authenticated = true;
      }
    }catch(error){
      this.setState({ invalidLogin: true });
      console.log("fetch failed with: " + error);
    }
  }
  //calls shutdown on the marxan server
  async setupShutdown(marxanserver, server){
    //get the time now
    let d = new Date();
    //get the shutdown time
    let miliSecondsTimeout = Number(this.state.timeout)*60000;
    let shutdowntime = new Date(d.getTime() + miliSecondsTimeout).toString();
    //update the marxan servers shutdowntime
    this.updateMarxanServerShutdowntime(marxanserver, shutdowntime);
    //set the shutdown timer
    await this.callShutdown(marxanserver, this.state.timeout);
    //configure a callback to start polling the server just before it is stopped
    setTimeout(() => {
      this.pollServer(server);
    }, miliSecondsTimeout - 1000);
  }
  //makes the API call to shutdown the marxan-server
  async callShutdown(marxanserver, timeout){
    try{
      const controller = new AbortController();
      const signal = controller.signal;   
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(marxanserver.endpoint + "shutdown?delay=" + timeout, {credentials:"include", signal: signal });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw Error("fetch returned a 404 or 500 error: " + response.statusText);
      }
      const json = await response.json();
      if (json.hasOwnProperty('error')){
        alert(json.error + '\nUnable to shutdown automatically. Please do it manually.');
      }
    }catch(error){
      console.log("fetch failed with: " + error);
    }
  }
  //get marxan server for the VM
  getMarxanServerForVM(instanceName) {
    let matching_marxanservers = this.state.marxanServers.filter((item) => (item.instanceName === instanceName));
    let retVal = (matching_marxanservers.length) ? matching_marxanservers[0] : undefined;
    return retVal;
  }
  //get VM for the marxan server
  getVMForMarxanServer(server) {
    if (server.hasOwnProperty('instanceName')) {
      //iterate through the VM instances to see if we can get a matching one for the marxan server
      let matching_vms = this.state.vms.filter((item) => (item.name === server.instanceName));
      //if we have a matching server then return it
      if (matching_vms.length) {
        return matching_vms[0];
      }
      else {
        return null;
      }
    }
    else {
      return null;
    }
  }
  //updates the status of the passed marxan server - status is true/false (offline)
  updateMarxanServerStatus(marxanserver, status) {
    //update the state
    let _marxanservers = this.state.marxanServers;
    _marxanservers.map(item => {
      let _obj = (item.name === marxanserver.name) ? Object.assign(item, { offline: status }) : item;
      return _obj;
    });
    this.setState({ marxanServers: _marxanservers });
  }
  updateMarxanServerShutdowntime(marxanserver, shutdowntime){
    let _marxanservers = this.state.marxanServers;
    _marxanservers.map(item => {
      let _obj = (item.name === marxanserver.name) ? Object.assign(item, { shutdowntime: shutdowntime }) : item;
      return _obj;
    });
    //set the state
    this.setState({marxanServers: _marxanservers});
  }
  //prompts the user to select a machine type and then starts it
  configureServer(server) {
    //get the current machine type
    let machineType = this.getMachineType(server);
    machineType = (machineType) ? machineType : { name: '' };
    //show the machine types dialog
    this.setState({failedToStartServer: false, failedToSetMachineType: false, startDialogOpen: true, machineType: machineType.name, clickedServer: server});
  }
  hideStartDialog() {
    this.setState({ startDialogOpen: false });
  }
  onChangeMachineType(event) {
    this.setState({ machineType: event.target.value });
  }
  //sets the machine type to the passed value and starts the VM
  setMachineType() {
    //setMachineType requires the full url - so get this from the machineTypes array
    let _mt = this.state.machineTypes.filter(_mt => (_mt.name === this.state.machineType));
    if (_mt.length) {
      let fullMachineType = _mt[0].selfLink;
      return gapi.client.compute.instances.setMachineType({ "project": GCP_PROJECT, "zone": GCP_ZONE, 'instance': this.state.clickedServer.name, 'resource': { 'machineType': fullMachineType } }).then((response) => {
        //update the state with the new machine type
        let _vms = this.state.vms;
        _vms.map(item => {
          let _obj = (item.name === this.state.clickedServer.name) ? Object.assign(item, { machineType: fullMachineType }) : item;
          return _obj;
        });
        this.setState({ vms: _vms});
        //start the VM
        this.startVM(this.state.clickedServer);
      },((err)=>{ 
        this.setState({failedToSetMachineType: true}); 
        console.log(err);
      }));
    }
  }
  //sets the timeout for how long the server will be running until it shuts down
  setTimeout(minutes) {
    this.setState({ timeout: minutes });
  }
  setUserPassword(username, password) {
    this.setState({ username: username, password: password, invalidLogin: false });
  }
  //starts a VM
  startVM(server) {
    return gapi.client.compute.instances.start({ "project": GCP_PROJECT, "zone": GCP_ZONE, 'instance': server.name }).then((response) => {
        console.log("Start requested");
        //poll the server
        this.pollServer(server);
      },
      function(err) { console.error("Execute error", err); });
  }
  async stopVM(marxanserver, server) {
    //update the marxan servers shutdowntime
    this.updateMarxanServerShutdowntime(marxanserver, undefined);
    await this.callShutdown(marxanserver, 0);
    return gapi.client.compute.instances.stop({ "project": GCP_PROJECT, "zone": GCP_ZONE, 'instance': server.name }).then((response) => {
        console.log("Stop requested");
        //poll the server
        this.pollServer(server);
      },
      function(err) { console.error("Execute error", err); });
  }
  renderControls(row) {
    //get the VM machine for this server
    let vm = this.getVMForMarxanServer(row.original);
    //the server has a VM name so we can add the controls
    if (vm) {
      return <ServerControls server={vm} startServer={this.configureServer.bind(this, vm)} stopServer={this.stopVM.bind(this,row.original, vm)}/>;
    }
    else {
      return null;
    }
  }
  renderWithTitle(attribute, row){
    return <div title={row.original[attribute]}>{row.original[attribute]}</div>;        
  }
  renderStatus(row) {
    return (row.original.offline === undefined) ? "Starting" : (row.original.offline) ? "Offline" : "Available";
  }
  renderCPUs(row) {
    //get the VM machine for this server
    let vm = this.getVMForMarxanServer(row.original);
    //the server has a VM name so we can add the controls
    let machineType = (vm) ? this.getMachineType(vm) : null;
    return <CPUControl machineType={machineType} marxanserver={row.original}/>;
  }
  renderRAM(row) {
    //get the VM machine for this server
    let vm = this.getVMForMarxanServer(row.original);
    //the server has a VM then we can get the machine type
    let machineType = (vm) ? this.getMachineType(vm) : null;
    return <RAMControl machineType={machineType} marxanserver={row.original}/>;
  }
  renderSpace(row){
    return <div title={row.original.disk_space} style={{textAlign:'center'}}>{row.original.disk_space}</div>;        
  }
  renderShutdownTime(row){
    //get the local time
    let local_time = (row.original.shutdowntime !== undefined) ? new Date(Date.parse(row.original.shutdowntime)).toLocaleString() : '';
    //if there is not a shutdown time and the server is online then set to never
    if (local_time === '' && row.original.offline === false) local_time = "Never";
    return <div>{local_time}</div>;
  }
  renderLink(row){
    return (row.original.offline === false) ? <div><a href={'https://app.marxanweb.org/?server=' + row.original.name} target="_app" rel="noopener noreferrer" title='Open hosted service in the Marxan Web app'>open</a></div> : "";  
  }
  //gets the machine type for the VM
  getMachineType(vm) {
    let machineTypes = this.state.machineTypes.filter(item => item.selfLink === vm.machineType);
    return (machineTypes.length) ? machineTypes[0] : null;
  }
  //initialises the servers by requesting their capabilities
  initialiseServers(marxanServers) {
    return new Promise((resolve, reject) => {
      //get all the server capabilities - when all the servers have responded, finalise the marxanServers array
      this.getAllServerCapabilities(marxanServers).then((server) => {
        //sort the servers by the name 
        this.sortObjectArray(marxanServers, 'name');
        this.setState({ marxanServers: marxanServers, serversLoaded: true }, () => {
          resolve("ServerData retrieved");
        });
      });
    });
  }
  //gets the capabilities of all servers
  async getAllServerCapabilities(marxanServers) {
    let promises = await marxanServers.map(async server=>{
      await this.getServerCapabilities(server);
    });
    await Promise.all(promises);
  }

  //gets the capabilities of the server by making a request to the getServerData method
  async getServerCapabilities(server) {
    //get the endpoint for all http/https requests
    let endpoint = server.protocol + "//" + server.host + ":" + server.port + TORNADO_PATH;
    //set the default properties for the server - by default the server is offline, has no guest access and CORS is not enabled
    server = Object.assign(server, { endpoint: endpoint, offline: true, guestUserEnabled: false });
    //poll the server to make sure tornado is running
    try{
      const controller = new AbortController();
      const signal = controller.signal;   
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(endpoint + "getServerData", { signal });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw Error("fetch returned a 404 or 500 error: " + response.statusText);
      }
      const json = await response.json();
      if (json.hasOwnProperty('info')) {
        //set the flags for the server capabilities
        server = Object.assign(server, { offline: false, machine: json.serverData.MACHINE, client_version: json.serverData.MARXAN_CLIENT_VERSION, server_version: json.serverData.MARXAN_SERVER_VERSION, node: json.serverData.NODE, processor: json.serverData.PROCESSOR, processor_count: json.serverData.PROCESSOR_COUNT, ram: json.serverData.RAM, release: json.serverData.RELEASE, system: json.serverData.SYSTEM, version: json.serverData.VERSION, wdpa_version: json.serverData.WDPA_VERSION, planning_grid_units_limit: Number(json.serverData.PLANNING_GRID_UNITS_LIMIT), disk_space: json.serverData.DISK_FREE_SPACE, shutdowntime:json.serverData.SHUTDOWNTIME });
        //if the server defines its own name then set it 
        if (json.serverData.SERVER_NAME !== "") {
          server = Object.assign(server, { name: json.serverData.SERVER_NAME });
        }
        //if the server defines its own description then set it 
        if (json.serverData.SERVER_DESCRIPTION !== "") {
          server = Object.assign(server, { description: json.serverData.SERVER_DESCRIPTION });
        }
      }
    }catch(error){
      console.log("fetch failed with: " + error);
    }
    return server;
  }
  render() {
    let tableCols = [
      { Header: 'marxan-server', width: 100, headerStyle: { 'textAlign': 'left' }, Cell: this.renderStatus.bind(this) },
      { Header: 'Name', width: 200, headerStyle: { 'textAlign': 'left' }, Cell: this.renderWithTitle.bind(this, 'name') },
      // { Header: 'Host', width: 158, headerStyle: { 'textAlign': 'left' }, Cell: this.renderWithTitle.bind(this, 'host') },
      { Header: 'Description', headerStyle: { 'textAlign': 'left' }, Cell: this.renderWithTitle.bind(this, 'description') },
      { Header: 'CPUs', width: 50, headerStyle: { 'textAlign': 'center' }, Cell: this.renderCPUs.bind(this) },
      { Header: 'RAM', width: 50, headerStyle: { 'textAlign': 'center' }, Cell: this.renderRAM.bind(this) },
      { Header: 'Space', width: 55, headerStyle: { 'textAlign': 'center' }, Cell: this.renderSpace.bind(this) },
      { Header: 'Shutdown', width: 135, headerStyle: { 'textAlign': 'left' }, style: { borderRight: '0px' }, Cell: this.renderShutdownTime.bind(this) }
    ];
    //add the controls column to the table if the user is logged in
    if (this.state.loggedIn) tableCols.unshift({ Header: 'VM', accessor: 'controlsEnabled', width: 30, headerStyle: { 'textAlign': 'left' }, style: { borderRight: '0px' }, Cell: this.renderControls.bind(this) });
    //add the link column if there are any servers online
    let online_servers = this.state.marxanServers.filter(item=>item.offline===false);
    if (online_servers.length) tableCols.push({ Header: '', width: 35, headerStyle: { 'textAlign': 'left' }, Cell: this.renderLink.bind(this) });
    //add a 
    return (
      <div className={'mainbody'}>
      <div className={'mainbodycontent'}>
          <div className={'title'}>Marxan Web Systematic Conservation Planning</div>
          <div className={'bodyText'}>Welcome to the Marxan Web Homepage. &lt;bla bla bla&gt;</div>
          <div className={'tableContainer'} style={{display: (this.state.serversLoaded) ? 'block' : 'none'}}>
            <div className={'bodyText'}>To use Marxan Web, you can either use one of the hosted services below or you can install and run it on your own local computer or within your organisation.</div>
            <div className={'h1'}>Hosted services:</div>
        		<ReactTable 
              className={'serversTable'}
              showPagination={false} 
              minRows={0}
              data={this.state.marxanServers}
              columns={tableCols}
        		/> 
        		<div className={'invalidLogin'} style={{display: (this.state.invalidLogin) ? 'block' : 'none'}}>Invalid login credentials - unable to shutdown automatically. Please do it manually.</div>
        		<div className={'invalidLogin'} style={{display: (this.state.failedToStartServer) ? 'block' : 'none'}}>Failed to start server. Stopping. Try fewer CPUs.</div>
        		<div className={'invalidLogin'} style={{display: (this.state.failedToSetMachineType) ? 'block' : 'none'}}>Failed to set the machine type. Try a different one.</div>
      		</div>
      		<div className={'h1'}>Installation:</div>
      		<div>For installation instructions, see the <a href='https://docs.marxanweb.org/admin.html' rel="noopener noreferrer" target='_blank'>Administrators Documentation</a></div>
      		<StartDialog 
      		  open={this.state.startDialogOpen} 
      		  machineTypes={this.state.machineTypes} 
      		  machineType={this.state.machineType} 
      		  onChangeMachineType={this.onChangeMachineType.bind(this)} 
      		  setMachineType={this.setMachineType.bind(this)} 
      		  hideStartDialog={this.hideStartDialog.bind(this)} 
      		  setTimeout={this.setTimeout.bind(this)} 
      		  setUserPassword={this.setUserPassword.bind(this)}
      		  marxanserverendpoint={this.state.marxanserverendpoint}
      		/>
          <div className={'loginBtn'} onClick={this.toggleLoginState.bind(this)}>
              <div className={'logodiv'}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48" class="_svg"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>        
                <div className={'logintext'} title={this.state.loginTitle}>{this.state.loginText}</div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;