/*global gapi*/
import './App.css';
import React from 'react';
import ReactTable from 'react-table';
import ServerControls from './ServerControls';
import CPUControl from './CPUControl';
import RAMControl from './RAMControl';
import MachineTypesDialog from './MachineTypesDialog';
import 'react-table/react-table.css';
import fetchJsonp from 'fetch-jsonp';
import { login, getVMs, getVM, getMachineTypesForProject } from './computeEngineAPI.js';
import { isNumber} from './genericFunctions.js';

//CONSTANTS
let TORNADO_PATH = "/marxan-server/";
let GCP_PROJECT = "marxan-web";
let GCP_ZONE = "us-central1-a";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { marxanServers: [], clickedServer: {}, loggedIn: false, vms: [], serversLoaded: false, machineTypes: [], machineTypesDialogOpen: false, machineType: '' };
    this.initialiseServers(window.MARXAN_SERVERS);
  }
  _login() {
    login().then(() => {
      //set the state
      this.setState({ loggedIn: true });
      //get the VMs
      this._getVMs();
      //get an array of the machine types available for the project
      getMachineTypesForProject(GCP_PROJECT, GCP_ZONE).then((machineTypes)=>{
        //filter the machine types for c2 types (compute-optimised) and n1 (general purpose)
        machineTypes = machineTypes.filter(mt=>(mt.name.substr(0,3) === 'c2-'||mt.name.substr(0,3) === 'n1-'));
        //sort by the description
        this.sortObjectArray(machineTypes, 'guestCpus');
        this.setState({ machineTypes: machineTypes });
      });
    });
  }
  //gets a list of VMs for the project and zone
  _getVMs(){
    //get the VMs
    getVMs(GCP_PROJECT, GCP_ZONE).then((_vms) => {
      this.setState({ vms: _vms });
    });
  }
  //gets data for a single VM
  _getVM(server) {
    getVM(GCP_PROJECT, GCP_ZONE, server.name).then((_vm) => {
      //see if the servers status has changed
      if (this.vmConfig.status !== _vm.status) {
        //if the server has stopped or started, then stop polling
        if (_vm.status === 'TERMINATED' || _vm.status === 'RUNNING') {
          clearInterval(this.vm_timer);
          this.timer = undefined;
          //if the server has started, then poll to see when the marxan-server has started
          if (_vm.status === 'RUNNING') this.pollMarxanServer(server);
        }
        //if the server is stopping then set the server as offline
        if (_vm.status === 'STOPPING') this.setOffline(server);
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
  sortObjectArray(arr, sortField){
    arr.sort((a, b) => {
      if (isNumber(a[sortField])){
        if ((a[sortField] < b[sortField]))
          return -1;
        if (a[sortField] > b[sortField])
          return 1;
        return 0;
      }else{
        if ((a[sortField].toLowerCase() < b[sortField].toLowerCase()) || (a.type === "local"))
          return -1;
        if (a[sortField].toLowerCase() > b[sortField].toLowerCase())
          return 1;
        return 0;
      }
    });
  }
  //sets the marxanserver as offline
  setOffline(server) {
    //get the matching marxan server from the VM
    let marxanserver = this.getMarxanServerForVM(server.name);
    //update the state
    this.updateMarxanServerStatus(marxanserver, true);
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
    //poll the server to see if it is ready
    this.timer = setInterval(() => {
      this.getServerCapabilities(marxanserver).then((server) => {
        //if the server is online then update state and stop polling
        if (!server.offline) {
          this.clearMarxanPolling();
          //update the state
          this.updateMarxanServerStatus(server, false);
        }
      });
    }, 1000);
  }
  clearMarxanPolling(){
    clearInterval(this.timer);
    this.timeout = undefined;
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
  updateMarxanServerStatus(marxanServer, status) {
    //update the state
    let _marxanservers = this.state.marxanServers;
    _marxanservers.map(item => {
      let _obj = (item.name === marxanServer.name) ? Object.assign(item, { offline: status }) : item;
      return _obj;
    });
    this.setState({ marxanServers: _marxanservers });
  }
  //prompts the user to select a machine type and then starts it
  configureServer(server){
    //get the current machine type
    let machineType = this.getMachineType(server);
    //show the machine types dialog
    this.setState({machineTypesDialogOpen: true, machineType: machineType.name, clickedServer: server});
  }
  hideMachineTypesDialog(){
    this.setState({machineTypesDialogOpen: false});
  }
  onChangeMachineType(event){
   this.setState({machineType: event.target.value});
  }
  //sets the machine type to the passed value and starts the VM
  setMachineType(){
    //setMachineType requires the full url - so get this from the machineTypes array
    let _mt = this.state.machineTypes.filter(_mt=>(_mt.name === this.state.machineType));
    if (_mt.length){
      let fullMachineType = _mt[0].selfLink;
      return gapi.client.compute.instances.setMachineType({ "project": GCP_PROJECT, "zone": GCP_ZONE, 'instance': this.state.clickedServer.name, 'resource':{ 'machineType': fullMachineType }}).then((response) => {
          //update the state with the new machine type
          let _vms = this.state.vms;
          _vms.map(item => {
            let _obj = (item.name === this.state.clickedServer.name) ? Object.assign(item, { machineType: fullMachineType }) : item;
            return _obj;
          });
          this.setState({ vms: _vms });
          //start the VM
          this.startVM(this.state.clickedServer);
        },
        function(err) { console.error("Execute error", err); });
    }
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
  stopVM(server) {
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
      return <ServerControls server={vm} startServer={this.configureServer.bind(this)} stopServer={this.stopVM.bind(this)}/>;
    }
    else {
      return null;
    }
  }
  renderStatus(row) {
    return (row.original.offline) ? "Offline" : "Available";
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
  //gets the machine type for the VM
  getMachineType(vm){
    let machineTypes = this.state.machineTypes.filter(item=>item.selfLink === vm.machineType);
    return (machineTypes.length) ? machineTypes[0] : null;
  }
  //initialises the servers by requesting their capabilities
  initialiseServers(marxanServers) {
    return new Promise((resolve, reject) => {
      //get all the server capabilities - when all the servers have responded, finalise the marxanServer array
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
  getAllServerCapabilities(marxanServers) {
    let promiseArray = [];
    //iterate through the servers and get their capabilities
    for (var i = 0; i < marxanServers.length; ++i) {
      promiseArray.push(this.getServerCapabilities(marxanServers[i]));
    }
    //return a promise
    return Promise.all(promiseArray);
  }

  //gets the capabilities of the server by making a request to the getServerData method
  getServerCapabilities(server) {
    return new Promise((resolve, reject) => {
      //get the endpoint for all http/https requests
      let endpoint = server.protocol + "//" + server.host + ":" + server.port + TORNADO_PATH;
      //set the default properties for the server - by default the server is offline, has no guest access and CORS is not enabled
      server = Object.assign(server, { endpoint: endpoint, offline: true, guestUserEnabled: false });
      //poll the server to make sure tornado is running - this uses fetchJsonp which can catch http errors
      fetchJsonp(endpoint + "getServerData", { timeout: 1000 }).then((response) => {
        return response.json();
      }).then((json) => {
        if (json.hasOwnProperty('info')) {
          //set the flags for the server capabilities
          server = Object.assign(server, { offline: false, machine: json.serverData.MACHINE, client_version: json.serverData.MARXAN_CLIENT_VERSION, server_version: json.serverData.MARXAN_SERVER_VERSION, node: json.serverData.NODE, processor: json.serverData.PROCESSOR, processor_count: json.serverData.PROCESSOR_COUNT, ram: json.serverData.RAM, release: json.serverData.RELEASE, system: json.serverData.SYSTEM, version: json.serverData.VERSION, wdpa_version: json.serverData.WDPA_VERSION, planning_grid_units_limit: Number(json.serverData.PLANNING_GRID_UNITS_LIMIT), disk_space: json.serverData.DISK_FREE_SPACE });
          //if the server defines its own name then set it 
          if (json.serverData.SERVER_NAME !== "") {
            server = Object.assign(server, { name: json.serverData.SERVER_NAME });
          }
          //if the server defines its own description then set it 
          if (json.serverData.SERVER_DESCRIPTION !== "") {
            server = Object.assign(server, { description: json.serverData.SERVER_DESCRIPTION });
          }
        }
        //return the server capabilities
        resolve(server);
      }).catch((ex) => {
        //the server does not exist or did not respond before the timeout - return the default properties
        resolve(server);
      });
    });
  }
  render() {
    let tableCols = [
      { Header: 'Status', accessor: '', width: 105, headerStyle: { 'textAlign': 'left' }, Cell: this.renderStatus.bind(this) },
      { Header: 'Name', accessor: 'name', width: 215, headerStyle: { 'textAlign': 'left' } },
      { Header: 'Host', accessor: 'host', width: 215, headerStyle: { 'textAlign': 'left' } },
      { Header: 'Description', accessor: 'description', headerStyle: { 'textAlign': 'left' } },
      { Header: 'CPUs', accessor: '', width: 50, headerStyle: { 'textAlign': 'left' }, Cell: this.renderCPUs.bind(this) },
      { Header: 'RAM', accessor: 'ram', width: 50, headerStyle: { 'textAlign': 'left' }, Cell: this.renderRAM.bind(this)  },
      { Header: 'Space', accessor: 'disk_space', width: 50, headerStyle: { 'textAlign': 'left' } }
    ];
    //add the controls column to the table if the user is logged in
    if (this.state.loggedIn) tableCols.unshift({ Header: '', accessor: 'controlsEnabled', width: 30, headerStyle: { 'textAlign': 'left' }, style: { borderRight: '0px' }, Cell: this.renderControls.bind(this) });
    return (
      <div>
        <div>Marxan Web</div>
        <button onClick={this._login.bind(this)}>authorize and load</button>
        <div className={'tableContainer'} style={{display: (this.state.serversLoaded) ? 'block' : 'none'}}>
      		<ReactTable 
            className={'serversTable'}
            showPagination={false} 
            minRows={0}
            data={this.state.marxanServers}
            columns={tableCols}
      		/> 
    		</div>
    		<MachineTypesDialog open={this.state.machineTypesDialogOpen} machineTypes={this.state.machineTypes} machineType={this.state.machineType} onChangeMachineType={this.onChangeMachineType.bind(this)} setMachineType={this.setMachineType.bind(this)} hideMachineTypesDialog={this.hideMachineTypesDialog.bind(this)}/>
      </div>
    );
  }
}

export default App;
