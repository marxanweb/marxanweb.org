/*global gapi*/
import './App.css';
import React from 'react';
import ReactTable from 'react-table';
import ServerControls from './ServerControls';
import 'react-table/react-table.css';
import fetchJsonp from 'fetch-jsonp';

//CONSTANTS
let TORNADO_PATH = "/marxan-server/";
let GCP_PROJECT = "marxan-web";
let GCP_ZONE = "us-central1-a";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {marxanServers: [], loggedIn: false, VM_instances:[]};
    this.initialiseServers(window.MARXAN_SERVERS);
  }
  login() {
    return new Promise((resolve, reject) => {
      //get the OAuth2 client library
      this.loadOAuth2Client().then(() => {
        //authenticate the user
        this.authenticate().then(() => {
          //load the Compute API
          this.loadClient().then(()=>{
            resolve();
            //set the state
            this.setState({loggedIn: true});
            //get the list of instances
            this.getVMs();
          });
        });
      });
    });
  }
  loadOAuth2Client() {
    return new Promise((resolve, reject) => {
      gapi.load("client:auth2", function() {
        gapi.auth2.init({ client_id: "956491209288-m1fj9h3udhiviuj0hdvajrp8o7pn13g8.apps.googleusercontent.com" });
        resolve();
      });
    });
  }
  authenticate() {
    return gapi.auth2.getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/compute https://www.googleapis.com/auth/compute.readonly" })
      .then(function() { console.log("Sign-in successful"); },
        function(err) { console.error("Error signing in", err); });
  }
  loadClient() {
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/compute/v1/rest")
      .then(function() { console.log("GAPI client loaded for API"); },
        function(err) { console.error("Error loading GAPI client for API", err); });
  }
  //gets a list of VMs
  getVMs() {
    return gapi.client.compute.instances.list({"project": GCP_PROJECT,"zone": GCP_ZONE}).then((response) =>{
          this.setState({VM_instances: response.result.items});
        },
        function(err) { console.error("Execute error", err); });
  }
  //gets data for a single VM
  getVM(server) {
    return gapi.client.compute.instances.get({"project": GCP_PROJECT,"zone": GCP_ZONE,'instance': server.name}).then((response) =>{
        //see if the servers status has changed
        if (this.serverStatus !== response.result.status){
          //PROVISIONING,STAGING,RUNNING,STOPPING,REPAIRING,TERMINATED
          //if the server has stopper or started, then stop polling
          if (response.result.status === 'TERMINATED' || response.result.status === 'RUNNING'){
            clearInterval(this.timer);
            this.timer = undefined;
          }
          //update the state
          let _VM_instances = this.state.VM_instances;
          _VM_instances.map(item=>{
            let _obj = (item.name === server.name) ? Object.assign(item, {status: response.result.status}) : item;
            return _obj;
          });
          this.setState({VM_instances:_VM_instances});
          //save the current status to a local variable
          this.serverStatus = response.result.status;
        }
      },
      function(err) { console.error("Execute error", err); });
  }
  pollServer(server){
    //set the initial server status
    this.serverStatus = server.status;
    //start polling the server at regular intervals
		this.timer = setInterval(() => {
		  this.getVM(server);
		},1000);
  }
  //starts a VM
  startVM(server){
    return gapi.client.compute.instances.start({"project": GCP_PROJECT,"zone": GCP_ZONE,'instance': server.name}).then((response) =>{
          console.log("Start requested");
          //poll the server
          this.pollServer(server);
        },
      function(err) { console.error("Execute error", err); });
  }
  stopVM(server){
    return gapi.client.compute.instances.stop({"project": GCP_PROJECT,"zone": GCP_ZONE,'instance': server.name}).then((response) =>{
          console.log("Stop requested");
          //poll the server
          this.pollServer(server);
        },
      function(err) { console.error("Execute error", err); });
  }
  renderStatus(row){
    return (row.original.offline) ? "Offline" : "Available";
  }
  renderControls(row){
    //the server has a VM name so we can add the controls
    if (row.original.hasOwnProperty('instanceName')){
      //get the instance name
      let instance_name = row.original.instanceName;
      //iterate through the VM instances to see if we can get a matching VM
      let matching_vms = this.state.VM_instances.filter((item)=>(item.name === instance_name));
      //if we have a matching server then we can control the server through the API
      if (matching_vms.length){
        return <ServerControls server={matching_vms[0]} startServer={this.startVM.bind(this)} stopServer={this.stopVM.bind(this)}/>;
      }else{
        return null;
      }
    }else{
      return null;
    }
  }
  //initialises the servers by requesting their capabilities and then filtering the list of available servers
  initialiseServers(marxanServers){
    return new Promise((resolve, reject) => {
      //get a list of server hosts from the marxan.js registry
      let hosts = marxanServers.map((server) => {
        return server.host;  
      });
      //add the current domain - this may be a local/local network install
      let name = (window.location.hostname === "localhost") ? "localhost" : window.location.hostname;
      marxanServers.push(({name: name, protocol: window.location.protocol, host: window.location.hostname, port: 80, description:'Local machine', type:'local', }));
      //get all the server capabilities - when all the servers have responded, finalise the marxanServer array
      this.getAllServerCapabilities(marxanServers).then((server) => {
        //remove the current domain if either the marxan server is not installed, or it is already in the list of servers from the marxan registry
        marxanServers = marxanServers.filter((item) => {
          return (item.type==="remote" || (item.type==="local" && !item.offline && hosts.indexOf(item.host) === -1) || (item.host === 'localhost'));
        });
        //sort the servers by the name 
        marxanServers.sort((a, b) => {
          if ((a.name.toLowerCase() < b.name.toLowerCase())||(a.type === "local"))
            return -1;
          if (a.name.toLowerCase() > b.name.toLowerCase())
            return 1;
          return 0;
        });
        this.setState({marxanServers: marxanServers}, ()=>{
          resolve("ServerData retrieved");
        });
      });
    });
  }  
  //gets the capabilities of all servers
  getAllServerCapabilities(marxanServers){
    let promiseArray = [];
    //iterate through the servers and get their capabilities
    for (var i = 0; i < marxanServers.length; ++i) {
      promiseArray.push(this.getServerCapabilities(marxanServers[i]));
    }
    //return a promise
    return Promise.all(promiseArray);
  }

  //gets the capabilities of the server by making a request to the getServerData method
  getServerCapabilities(server){
    return new Promise((resolve, reject) => {
      //get the endpoint for all http/https requests
      let endpoint = server.protocol + "//" + server.host + ":" + server.port + TORNADO_PATH;
      //get the WebService endpoint
      let websocketEndpoint = (server.protocol ==='http:') ? "ws://" + server.host + ":" + server.port + TORNADO_PATH : "wss://" + server.host + ":" + server.port + TORNADO_PATH;
      //set the default properties for the server - by default the server is offline, has no guest access and CORS is not enabled
      server = Object.assign(server, {endpoint: endpoint, websocketEndpoint: websocketEndpoint, offline: true, guestUserEnabled: false, corsEnabled: false});
      //poll the server to make sure tornado is running - this uses fetchJsonp which can catch http errors
      fetchJsonp(endpoint + "getServerData",{timeout: 1000}).then((response) => {
        return response.json();
      }).then((json) => {
        if (json.hasOwnProperty('info')){
          //see if CORS is enabled from this domain - either the domain has been added as an allowable domain on the server, or the client and server are on the same machine
          let corsEnabled = ((json.serverData.PERMITTED_DOMAINS.indexOf(window.location.hostname)>-1)||(server.host === window.location.hostname)) ? true : false;
          //set the flags for the server capabilities
          server = Object.assign(server, {guestUserEnabled: json.serverData.ENABLE_GUEST_USER, corsEnabled: corsEnabled, offline: false, machine: json.serverData.MACHINE, client_version: json.serverData.MARXAN_CLIENT_VERSION, server_version: json.serverData.MARXAN_SERVER_VERSION, node: json.serverData.NODE, processor: json.serverData.PROCESSOR, processor_count: json.serverData.PROCESSOR_COUNT,ram: json.serverData.RAM, release: json.serverData.RELEASE, system:json.serverData.SYSTEM, version: json.serverData.VERSION, wdpa_version: json.serverData.WDPA_VERSION, planning_grid_units_limit: Number(json.serverData.PLANNING_GRID_UNITS_LIMIT), disk_space: json.serverData.DISK_FREE_SPACE});
          //if the server defines its own name then set it 
          if(json.serverData.SERVER_NAME!=="") {
            server = Object.assign(server, {name:json.serverData.SERVER_NAME});
          }
          //if the server defines its own description then set it 
          if(json.serverData.SERVER_DESCRIPTION!=="") {
            server = Object.assign(server, {description:json.serverData.SERVER_DESCRIPTION});
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
      let tableCols = (this.state.loggedIn) ? 
      [
          { Header: 'Controls', accessor: 'controlsEnabled',headerStyle: { 'textAlign': 'left' },Cell: this.renderControls.bind(this)}, 
          { Header: 'Status', accessor: '',headerStyle: { 'textAlign': 'left' },Cell: this.renderStatus.bind(this)}, 
          { Header: 'Name', accessor: 'name',headerStyle: { 'textAlign': 'left' }}, 
          { Header: 'Host', accessor: 'host',headerStyle: { 'textAlign': 'left' }}, 
          { Header: 'Description', accessor: 'description',headerStyle: { 'textAlign': 'left' }}]
      :
      [
          { Header: 'Status', accessor: '',headerStyle: { 'textAlign': 'left' },Cell: this.renderStatus.bind(this)}, 
          { Header: 'Name', accessor: 'name',headerStyle: { 'textAlign': 'left' }}, 
          { Header: 'Host', accessor: 'host',headerStyle: { 'textAlign': 'left' }}, 
          { Header: 'Description', accessor: 'description',headerStyle: { 'textAlign': 'left' }}]
      ;
    return (
      <div>
        <div>Marxan Web</div>
        <button onClick={this.login.bind(this)}>authorize and load</button>
    		<ReactTable 
          className={'serversTable'}
          showPagination={false} 
          minRows={0}
          data={window.MARXAN_SERVERS}
          columns={tableCols}
    		/> 
  </div>
    );
  }
}

export default App;
