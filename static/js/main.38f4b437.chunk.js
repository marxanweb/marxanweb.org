(this["webpackJsonpwww.marxanweb.org"]=this["webpackJsonpwww.marxanweb.org"]||[]).push([[0],{14:function(e,t){e.exports={isNumber:function(e){return/^\d+$/.test(e)}}},16:function(e,t,n){e.exports=n(27)},21:function(e,t,n){},22:function(e,t,n){},27:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),i=n(13),s=n.n(i),o=(n(21),n(3)),c=n(4),l=n(6),u=n(5),h=n(7),m=(n(22),n(15)),p=n(8),v=n.n(p),d=function(e){function t(){return Object(o.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(c.a)(t,[{key:"startServer",value:function(){this.props.startServer(this.props.server)}},{key:"stopServer",value:function(){this.props.stopServer(this.props.server)}},{key:"render",value:function(){var e;switch(this.props.server.status){case"PROVISIONING":e=r.a.createElement("div",{className:"serverStatusIconContainer",title:"The server is being provisioned"},r.a.createElement("img",{className:"p6n-icon-status-working",src:v.a,alt:"The server is being stopped"}));break;case"STAGING":e=r.a.createElement("div",{className:"serverStatusIconContainer",title:"The server is being staged"},r.a.createElement("img",{className:"p6n-icon-status-working",src:v.a,alt:"The server is being stopped"}));break;case"RUNNING":e=r.a.createElement("div",{className:"serverStatusIconContainer",title:"The server is running. Click to stop.",onClick:this.stopServer.bind(this)},r.a.createElement("svg",{viewBox:"0 0 14 14"},"    ",r.a.createElement("path",{fill:"#00C752",d:"M5.50183983,10.4944805 L5.50367966,10.4963203         L12.8482451,3.15175489         C13.5762779,4.25592793 14,5.57848014 14,7         C14,10.866 10.866,14 7,14 C3.134,14 0,10.866 0,7         C0,3.134 3.134,0 7,0         C8.67832535,0 10.218695,0.590646458 11.4245848,1.57541523         L11.4245848,1.57541523 L5.50183983,7.49816017         L3.50183983,5.49816017 L2.00183983,6.99816017         L5.5,10.4963203 L5.50183983,10.4944805 Z"}),"  "));break;case"STOPPING":e=r.a.createElement("div",{className:"serverStatusIconContainer",title:"The server is being stopped"},r.a.createElement("img",{className:"p6n-icon-status-working",src:v.a,alt:"The server is being stopped"}));break;case"REPAIRING":e=r.a.createElement("div",{className:"serverStatusIconContainer",title:"The server is being repaired"},r.a.createElement("img",{className:"p6n-icon-status-working",src:v.a,alt:"The server is being stopped"}));break;case"TERMINATED":e=r.a.createElement("div",{className:"serverStatusIconContainer",title:"The server is stopped. Click to start.",onClick:this.startServer.bind(this)},r.a.createElement("svg",{viewBox:"0 0 14 14"},"    ",r.a.createElement("path",{fill:"#A9A9A9",d:"M7,14 C10.8659932,14 14,10.8659932 14,7         C14,3.13400675 10.8659932,0 7,0         C3.13400675,0 0,3.13400675 0,7         C0,10.8659932 3.13400675,14 7,14 Z         M4,4.99077797 C4,4.44358641 4.45097518,4 4.99077797,4         L9.00922203,4 C9.55641359,4 10,4.45097518 10,4.99077797         L10,9.00922203 C10,9.55641359 9.54902482,10 9.00922203,10         L4.99077797,10 C4.44358641,10 4,9.54902482 4,9.00922203         L4,4.99077797 Z"}),"  "))}return r.a.createElement("div",null,e)}}]),t}(r.a.Component),f=function(e){function t(){return Object(o.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return this.props.machineType?r.a.createElement("div",null,this.props.machineType.guestCpus):r.a.createElement("div",null,this.props.marxanserver.processor_count)}}]),t}(r.a.Component),g=function(e){function t(){return Object(o.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return this.props.machineType?r.a.createElement("div",null,(Number(this.props.machineType.memoryMb)/1e3).toFixed(1)," Gb"):r.a.createElement("div",null,this.props.marxanserver.ram)}}]),t}(r.a.Component),S=[{text:"1 hour",minutes:"60"},{text:"2 hours",minutes:"120"},{text:"3 hours",minutes:"180"},{text:"4 hours",minutes:"240"},{text:"5 hours",minutes:"300"},{text:"6 hours",minutes:"360"},{text:"7 hours",minutes:"420"},{text:"8 hours",minutes:"480"}],y=function(e){function t(e){var n;return Object(o.a)(this,t),(n=Object(l.a)(this,Object(u.a)(t).call(this,e))).state={timeout:"60",username:"",password:""},n}return Object(h.a)(t,e),Object(c.a)(t,[{key:"startServer",value:function(){this.props.setUserPassword(this.state.username,this.state.password),this.props.setMachineType(),this.props.setTimeout(this.state.timeout),this.props.hideStartDialog()}},{key:"onCancel",value:function(e){this.props.hideStartDialog()}},{key:"setTimeout",value:function(e){this.setState({timeout:e.target.value})}},{key:"changeUser",value:function(e){this.setState({username:e.target.value})}},{key:"changePassword",value:function(e){this.setState({password:e.target.value})}},{key:"render",value:function(){var e=this.props.machineTypes.map((function(e){return r.a.createElement("option",{value:e.name,key:e.name},e.description)})),t=S.map((function(e){return r.a.createElement("option",{value:e.minutes,key:e.text},e.text)}));return r.a.createElement("div",{className:"dialog",style:{display:this.props.open?"block":"none"}},r.a.createElement("div",{className:"dialoginner"},r.a.createElement("div",{className:"heading"},"Choose a machine type:"),r.a.createElement("select",{className:"toppad10",onChange:this.props.onChangeMachineType.bind(this),value:this.props.machineType},e),r.a.createElement("div",{className:"heading"},"Choose a timeout:"),r.a.createElement("select",{className:"toppad10",onChange:this.setTimeout.bind(this),value:this.state.timeout},t),r.a.createElement("div",{className:"heading"},"Username:"),r.a.createElement("input",{type:"text",onChange:this.changeUser.bind(this)}),r.a.createElement("div",{className:"heading"},"Password:"),r.a.createElement("input",{type:"password",onChange:this.changePassword.bind(this)}),r.a.createElement("div",{className:"toppad20"},r.a.createElement("button",{type:"button",onClick:this.onCancel.bind(this)},"Cancel"),r.a.createElement("button",{type:"button",onClick:this.startServer.bind(this)},"OK"))))}}]),t}(r.a.Component),b=(n(26),n(10)),w=n.n(b),E=n(9),T=n(14),C="us-central1-a",k=function(e){function t(e){var n;return Object(o.a)(this,t),(n=Object(l.a)(this,Object(u.a)(t).call(this,e))).state={marxanServers:[],clickedServer:{},loggedIn:!1,vms:[],serversLoaded:!1,machineTypes:[],startDialogOpen:!1,machineType:"",timeout:60,invalidLogin:!1,failedToStartServer:!1,failedToSetMachineType:!1},n.initialiseServers(window.MARXAN_SERVERS),n}return Object(h.a)(t,e),Object(c.a)(t,[{key:"_login",value:function(){var e=this;Object(E.login)().then((function(){e.setState({loggedIn:!0}),e._getVMs(),Object(E.getMachineTypesForProject)("marxan-web","us-central1",C).then((function(t){t=t.filter((function(e){return e.available})),e.sortObjectArray(t,"guestCpus"),e.setState({machineTypes:t})}))}))}},{key:"_getVMs",value:function(){var e=this;Object(E.getVMs)("marxan-web",C).then((function(t){e.setState({vms:t})}))}},{key:"_getVM",value:function(e){var t=this;Object(E.getVM)("marxan-web",C,e.name).then((function(n){if(t.vmConfig.status!==n.status){"TERMINATED"!==n.status&&"RUNNING"!==n.status||(clearInterval(t.vm_timer),t.timer=void 0,"RUNNING"===n.status&&t.pollMarxanServer(e)),"STOPPING"===n.status&&t.setOffline(e),"PROVISIONING"===t.vmConfig.status&&"STOPPING"===n.status&&t.setState({failedToStartServer:!0});var a=t.state.vms;a.map((function(t){return t.name===e.name?Object.assign(t,{status:n.status}):t})),t.setState({vms:a}),t.vmConfig=n}}))}},{key:"sortObjectArray",value:function(e,t){e.sort((function(e,n){return Object(T.isNumber)(e[t])?e[t]<n[t]?-1:e[t]>n[t]?1:0:e[t].toLowerCase()<n[t].toLowerCase()||"local"===e.type?-1:e[t].toLowerCase()>n[t].toLowerCase()?1:0}))}},{key:"setOffline",value:function(e){var t=this.getMarxanServerForVM(e.name);this.updateMarxanServerStatus(t,!0)}},{key:"pollServer",value:function(e){var t=this;this.timer&&this.clearMarxanPolling(),this.vmConfig=e,this._getVM(e),this.vm_timer=setInterval((function(){t._getVM(e)}),1e3)}},{key:"pollMarxanServer",value:function(e){var t=this,n=this.getMarxanServerForVM(e.name);this.updateMarxanServerStatus(n,void 0),this.timer=setInterval((function(){t.getServerCapabilities(n).then((function(e){e.offline||(t.clearMarxanPolling(),t.updateMarxanServerStatus(n,!1),t.authenticateMS(n).then((function(){t.setupShutdown(n)})))}))}),1e3)}},{key:"authenticateMS",value:function(e){var t=this;return new Promise((function(n,a){w()(e.endpoint+"validateUser?user="+t.state.username+"&password="+t.state.password).then((function(e){return e.json()})).then((function(e){e.hasOwnProperty("error")&&(t.setState({invalidLogin:!0}),a()),n()})).catch((function(e){t.setState({invalidLogin:!0}),a()}))}))}},{key:"setupShutdown",value:function(e){var t=new Date,n=new Date(t.getTime()+6e4*Number(this.state.timeout)).toString(),a=this.state.marxanServers;a.map((function(t){return t.name===e.name?Object.assign(t,{shutdowntime:n}):t})),this.setState({shutdown:n,marxanServers:a}),w()(e.endpoint+"shutdown?delay="+this.state.timeout,{timeout:1e3}).then((function(e){return e.json()})).then((function(e){console.log(e)})).catch((function(e){console.log(e)}))}},{key:"clearMarxanPolling",value:function(){clearInterval(this.timer),this.timeout=void 0}},{key:"getMarxanServerForVM",value:function(e){var t=this.state.marxanServers.filter((function(t){return t.instanceName===e}));return t.length?t[0]:void 0}},{key:"getVMForMarxanServer",value:function(e){if(e.hasOwnProperty("instanceName")){var t=this.state.vms.filter((function(t){return t.name===e.instanceName}));return t.length?t[0]:null}return null}},{key:"updateMarxanServerStatus",value:function(e,t){var n=this.state.marxanServers;n.map((function(n){return n.name===e.name?Object.assign(n,{offline:t}):n})),this.setState({marxanServers:n})}},{key:"configureServer",value:function(e){var t=this.getMachineType(e);t=t||{name:""},this.setState({failedToStartServer:!1,failedToSetMachineType:!1,startDialogOpen:!0,machineType:t.name,clickedServer:e})}},{key:"hideStartDialog",value:function(){this.setState({startDialogOpen:!1})}},{key:"onChangeMachineType",value:function(e){this.setState({machineType:e.target.value})}},{key:"setMachineType",value:function(){var e=this,t=this.state.machineTypes.filter((function(t){return t.name===e.state.machineType}));if(t.length){var n=t[0].selfLink;return gapi.client.compute.instances.setMachineType({project:"marxan-web",zone:C,instance:this.state.clickedServer.name,resource:{machineType:n}}).then((function(t){var a=e.state.vms;a.map((function(t){return t.name===e.state.clickedServer.name?Object.assign(t,{machineType:n}):t})),e.setState({vms:a}),e.startVM(e.state.clickedServer)}),(function(t){e.setState({failedToSetMachineType:!0}),console.log(t)}))}}},{key:"setTimeout",value:function(e){this.setState({timeout:e})}},{key:"setUserPassword",value:function(e,t){this.setState({username:e,password:t,invalidLogin:!1})}},{key:"startVM",value:function(e){var t=this;return gapi.client.compute.instances.start({project:"marxan-web",zone:C,instance:e.name}).then((function(n){console.log("Start requested"),t.pollServer(e)}),(function(e){console.error("Execute error",e)}))}},{key:"stopVM",value:function(e){var t=this;return gapi.client.compute.instances.stop({project:"marxan-web",zone:C,instance:e.name}).then((function(n){console.log("Stop requested"),t.pollServer(e)}),(function(e){console.error("Execute error",e)}))}},{key:"renderControls",value:function(e){var t=this.getVMForMarxanServer(e.original);return t?r.a.createElement(d,{server:t,startServer:this.configureServer.bind(this),stopServer:this.stopVM.bind(this)}):null}},{key:"renderStatus",value:function(e){return void 0===e.original.offline?"Starting":e.original.offline?"Offline":"Available"}},{key:"renderCPUs",value:function(e){var t=this.getVMForMarxanServer(e.original),n=t?this.getMachineType(t):null;return r.a.createElement(f,{machineType:n,marxanserver:e.original})}},{key:"renderRAM",value:function(e){var t=this.getVMForMarxanServer(e.original),n=t?this.getMachineType(t):null;return r.a.createElement(g,{machineType:n,marxanserver:e.original})}},{key:"getMachineType",value:function(e){var t=this.state.machineTypes.filter((function(t){return t.selfLink===e.machineType}));return t.length?t[0]:null}},{key:"initialiseServers",value:function(e){var t=this;return new Promise((function(n,a){t.getAllServerCapabilities(e).then((function(a){t.sortObjectArray(e,"name"),t.setState({marxanServers:e,serversLoaded:!0},(function(){n("ServerData retrieved")}))}))}))}},{key:"getAllServerCapabilities",value:function(e){for(var t=[],n=0;n<e.length;++n)t.push(this.getServerCapabilities(e[n]));return Promise.all(t)}},{key:"getServerCapabilities",value:function(e){return new Promise((function(t,n){var a=e.protocol+"//"+e.host+":"+e.port+"/marxan-server/";e=Object.assign(e,{endpoint:a,offline:!0,guestUserEnabled:!1}),w()(a+"getServerData",{timeout:1e3}).then((function(e){return e.json()})).then((function(n){n.hasOwnProperty("info")&&(e=Object.assign(e,{offline:!1,machine:n.serverData.MACHINE,client_version:n.serverData.MARXAN_CLIENT_VERSION,server_version:n.serverData.MARXAN_SERVER_VERSION,node:n.serverData.NODE,processor:n.serverData.PROCESSOR,processor_count:n.serverData.PROCESSOR_COUNT,ram:n.serverData.RAM,release:n.serverData.RELEASE,system:n.serverData.SYSTEM,version:n.serverData.VERSION,wdpa_version:n.serverData.WDPA_VERSION,planning_grid_units_limit:Number(n.serverData.PLANNING_GRID_UNITS_LIMIT),disk_space:n.serverData.DISK_FREE_SPACE}),""!==n.serverData.SERVER_NAME&&(e=Object.assign(e,{name:n.serverData.SERVER_NAME})),""!==n.serverData.SERVER_DESCRIPTION&&(e=Object.assign(e,{description:n.serverData.SERVER_DESCRIPTION}))),t(e)})).catch((function(n){t(e)}))}))}},{key:"render",value:function(){var e=[{Header:"Status",accessor:"",width:105,headerStyle:{textAlign:"left"},Cell:this.renderStatus.bind(this)},{Header:"Name",accessor:"name",width:215,headerStyle:{textAlign:"left"}},{Header:"Host",accessor:"host",width:215,headerStyle:{textAlign:"left"}},{Header:"Description",accessor:"description",headerStyle:{textAlign:"left"}},{Header:"CPUs",accessor:"",width:50,headerStyle:{textAlign:"left"},Cell:this.renderCPUs.bind(this)},{Header:"RAM",accessor:"ram",width:50,headerStyle:{textAlign:"left"},Cell:this.renderRAM.bind(this)},{Header:"Space",accessor:"disk_space",width:50,headerStyle:{textAlign:"left"}}];return this.state.loggedIn&&e.unshift({Header:"VM",accessor:"controlsEnabled",width:30,headerStyle:{textAlign:"left"},style:{borderRight:"0px"},Cell:this.renderControls.bind(this)}),this.state.shutdown&&e.push({Header:"Shutdown at",accessor:"shutdowntime",width:162,headerStyle:{textAlign:"left"},style:{borderRight:"0px"}}),r.a.createElement("div",null,r.a.createElement("div",null,"Marxan Web"),r.a.createElement("button",{onClick:this._login.bind(this)},"authorize and load"),r.a.createElement("div",{className:"tableContainer",style:{display:this.state.serversLoaded?"block":"none"}},r.a.createElement(m.a,{className:"serversTable",showPagination:!1,minRows:0,data:this.state.marxanServers,columns:e}),r.a.createElement("div",{className:"invalidLogin",style:{display:this.state.invalidLogin?"block":"none"}},"Invalid login credentials - unable to shutdown automatically. Please do it manually."),r.a.createElement("div",{className:"invalidLogin",style:{display:this.state.failedToStartServer?"block":"none"}},"Failed to start server. Stopping. Try fewer CPUs."),r.a.createElement("div",{className:"invalidLogin",style:{display:this.state.failedToSetMachineType?"block":"none"}},"Failed to set the machine type. Try a different one.")),r.a.createElement(y,{open:this.state.startDialogOpen,machineTypes:this.state.machineTypes,machineType:this.state.machineType,onChangeMachineType:this.onChangeMachineType.bind(this),setMachineType:this.setMachineType.bind(this),hideStartDialog:this.hideStartDialog.bind(this),setTimeout:this.setTimeout.bind(this),setUserPassword:this.setUserPassword.bind(this),marxanserverendpoint:this.state.marxanserverendpoint}))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},8:function(e,t,n){e.exports=n.p+"static/media/status-working-28.639a9d71.gif"},9:function(e,t){e.exports={login:function(){return new Promise((function(t,n){e.exports.loadOAuth2Client().then((function(){e.exports.authenticate().then((function(){e.exports.loadClient().then((function(){t()}))}))}))}))},loadOAuth2Client:function(){return new Promise((function(e,t){gapi.load("client:auth2",(function(){gapi.auth2.init({client_id:"956491209288-m1fj9h3udhiviuj0hdvajrp8o7pn13g8.apps.googleusercontent.com"}),e()}))}))},authenticate:function(){return gapi.auth2.getAuthInstance().signIn({scope:"https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/compute https://www.googleapis.com/auth/compute.readonly"}).then((function(){console.log("Sign-in successful")}),(function(e){console.error("Error signing in",e)}))},loadClient:function(){return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/compute/v1/rest").then((function(){console.log("GAPI client loaded for API")}),(function(e){console.error("Error loading GAPI client for API",e)}))},getVMs:function(e,t){return new Promise((function(n,a){gapi.client.compute.instances.list({project:e,zone:t}).then((function(a){var r=a.result.items.map((function(n){return Object.assign(n,{project:e,zone:t})}));n(r)}),(function(e){return a(e)}))}))},getVM:function(e,t,n){return new Promise((function(a,r){gapi.client.compute.instances.get({project:e,zone:t,instance:n}).then((function(e){a(e.result)}),(function(e){return r(e)}))}))},getMachineTypesForProject:function(t,n,a){return new Promise((function(r,i){gapi.client.compute.machineTypes.list({project:t,zone:a}).then((function(a){var i=a.result.items;e.exports.getProjectRegion(t,n).then((function(e){var t=e.quotas.filter((function(e){return"CPUS"===e.metric}))[0].limit;i=i.map((function(e){return Object.assign(e,{available:e.guestCpus<=t})})),r(i)}))}),(function(e){return i(e)}))}))},getProject:function(e){return new Promise((function(t,n){gapi.client.compute.projects.get({project:e}).then((function(e){t(e.result)}),(function(e){return n(e)}))}))},getProjectRegion:function(e,t){return new Promise((function(n,a){gapi.client.compute.regions.get({project:e,region:t}).then((function(e){n(e.result)}),(function(e){return a(e)}))}))},getMachineType:function(e,t,n){return new Promise((function(a,r){gapi.client.compute.machineTypes.get({project:e,zone:t,machineType:n}).then((function(e){a(e.result)}),(function(e){return r(e)}))}))}}}},[[16,1,2]]]);
//# sourceMappingURL=main.38f4b437.chunk.js.map