(this["webpackJsonpwww.marxanweb.org"]=this["webpackJsonpwww.marxanweb.org"]||[]).push([[0],{14:function(e,t){e.exports={isNumber:function(e){return/^\d+$/.test(e)}}},16:function(e,t,n){e.exports=n(27)},21:function(e,t,n){},22:function(e,t,n){},27:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),i=n(13),s=n.n(i),o=(n(21),n(3)),l=n(4),c=n(6),u=n(5),h=n(7),m=(n(22),n(15)),v=n(9),p=n.n(v),d=function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(l.a)(t,[{key:"startServer",value:function(){this.props.startServer()}},{key:"stopServer",value:function(){this.props.stopServer()}},{key:"render",value:function(){var e;switch(this.props.server.status){case"PROVISIONING":e=r.a.createElement("div",{className:"serverStatusIconContainer",title:"The server is being provisioned"},r.a.createElement("img",{className:"p6n-icon-status-working",src:p.a,alt:"The server is being stopped"}));break;case"STAGING":e=r.a.createElement("div",{className:"serverStatusIconContainer",title:"The server is being staged"},r.a.createElement("img",{className:"p6n-icon-status-working",src:p.a,alt:"The server is being stopped"}));break;case"RUNNING":e=r.a.createElement("div",{className:"serverStatusIconContainer",title:"The server is running. Click to stop.",onClick:this.stopServer.bind(this)},r.a.createElement("svg",{viewBox:"0 0 14 14"},"    ",r.a.createElement("path",{fill:"#00C752",d:"M5.50183983,10.4944805 L5.50367966,10.4963203         L12.8482451,3.15175489         C13.5762779,4.25592793 14,5.57848014 14,7         C14,10.866 10.866,14 7,14 C3.134,14 0,10.866 0,7         C0,3.134 3.134,0 7,0         C8.67832535,0 10.218695,0.590646458 11.4245848,1.57541523         L11.4245848,1.57541523 L5.50183983,7.49816017         L3.50183983,5.49816017 L2.00183983,6.99816017         L5.5,10.4963203 L5.50183983,10.4944805 Z"}),"  "));break;case"STOPPING":e=r.a.createElement("div",{className:"serverStatusIconContainer",title:"The server is being stopped"},r.a.createElement("img",{className:"p6n-icon-status-working",src:p.a,alt:"The server is being stopped"}));break;case"REPAIRING":e=r.a.createElement("div",{className:"serverStatusIconContainer",title:"The server is being repaired"},r.a.createElement("img",{className:"p6n-icon-status-working",src:p.a,alt:"The server is being stopped"}));break;case"TERMINATED":e=r.a.createElement("div",{className:"serverStatusIconContainer",title:"The server is stopped. Click to start.",onClick:this.startServer.bind(this)},r.a.createElement("svg",{viewBox:"0 0 14 14"},"    ",r.a.createElement("path",{fill:"#A9A9A9",d:"M7,14 C10.8659932,14 14,10.8659932 14,7         C14,3.13400675 10.8659932,0 7,0         C3.13400675,0 0,3.13400675 0,7         C0,10.8659932 3.13400675,14 7,14 Z         M4,4.99077797 C4,4.44358641 4.45097518,4 4.99077797,4         L9.00922203,4 C9.55641359,4 10,4.45097518 10,4.99077797         L10,9.00922203 C10,9.55641359 9.54902482,10 9.00922203,10         L4.99077797,10 C4.44358641,10 4,9.54902482 4,9.00922203         L4,4.99077797 Z"}),"  "))}return r.a.createElement("div",null,e)}}]),t}(r.a.Component),g=function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return this.props.machineType?r.a.createElement("div",{style:{textAlign:"center"}},this.props.machineType.guestCpus):r.a.createElement("div",{style:{textAlign:"center"}},this.props.marxanserver.processor_count)}}]),t}(r.a.Component),f=function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return this.props.machineType?r.a.createElement("div",{style:{textAlign:"center"}},(Number(this.props.machineType.memoryMb)/1e3).toFixed(1)," Gb"):r.a.createElement("div",{style:{textAlign:"center"}},this.props.marxanserver.ram)}}]),t}(r.a.Component),S=[{text:"2 minutes",minutes:"2"},{text:"1 hour",minutes:"60"},{text:"2 hours",minutes:"120"},{text:"3 hours",minutes:"180"},{text:"4 hours",minutes:"240"},{text:"5 hours",minutes:"300"},{text:"6 hours",minutes:"360"},{text:"7 hours",minutes:"420"},{text:"8 hours",minutes:"480"}],y=function(e){function t(e){var n;return Object(o.a)(this,t),(n=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={timeout:"60",username:"",password:""},n}return Object(h.a)(t,e),Object(l.a)(t,[{key:"startServer",value:function(){this.props.setUserPassword(this.state.username,this.state.password),this.props.setMachineType(),this.props.setTimeout(this.state.timeout),this.props.hideStartDialog()}},{key:"onCancel",value:function(e){this.props.hideStartDialog()}},{key:"setTimeout",value:function(e){this.setState({timeout:e.target.value})}},{key:"changeUser",value:function(e){this.setState({username:e.target.value})}},{key:"changePassword",value:function(e){this.setState({password:e.target.value})}},{key:"render",value:function(){var e=this.props.machineTypes.map((function(e){return r.a.createElement("option",{value:e.name,key:e.name},e.description)})),t=S.map((function(e){return r.a.createElement("option",{value:e.minutes,key:e.text},e.text)}));return r.a.createElement("div",{className:"dialog",style:{display:this.props.open?"block":"none"}},r.a.createElement("div",{className:"dialoginner"},r.a.createElement("div",{className:"h1"},"Start a hosted service"),r.a.createElement("div",{className:"heading"},"Choose a machine type:"),r.a.createElement("select",{className:"toppad10",onChange:this.props.onChangeMachineType.bind(this),value:this.props.machineType},e),r.a.createElement("div",{className:"heading"},"Choose a timeout:"),r.a.createElement("select",{className:"toppad10",onChange:this.setTimeout.bind(this),value:this.state.timeout},t),r.a.createElement("div",{className:"heading"},"Username:"),r.a.createElement("input",{type:"text",onChange:this.changeUser.bind(this)}),r.a.createElement("div",{className:"heading"},"Password:"),r.a.createElement("input",{type:"password",onChange:this.changePassword.bind(this)}),r.a.createElement("div",{className:"toppad20"},r.a.createElement("button",{type:"button",onClick:this.onCancel.bind(this)},"Cancel"),r.a.createElement("button",{type:"button",onClick:this.startServer.bind(this)},"OK"))))}}]),t}(r.a.Component),b=(n(26),n(10)),w=n.n(b),E=n(8),T=n(14),x="us-central1-a",C=function(e){function t(e){var n;return Object(o.a)(this,t),(n=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={loginText:"Sign in",loginTitle:"Click to sign in",marxanServers:[],clickedServer:{},loggedIn:!1,vms:[],serversLoaded:!1,machineTypes:[],startDialogOpen:!1,machineType:"",timeout:60,invalidLogin:!1,failedToStartServer:!1,failedToSetMachineType:!1},n.initialiseServers(window.MARXAN_SERVERS),n}return Object(h.a)(t,e),Object(l.a)(t,[{key:"toggleLoginState",value:function(){var e=this;this.state.loggedIn?Object(E.signOut)().then((function(){e.setState({loggedIn:!1,loginText:"Sign in",loginTitle:"Signed in as "})})):Object(E.login)().then((function(t){e.setState({loggedIn:!0,loginText:"Sign out",loginTitle:"Signed in as:"+t.getName()+" ("+t.getEmail()+")"}),e._getVMs(),Object(E.getMachineTypesForProject)("marxan-web","us-central1",x).then((function(t){t=(t=t.filter((function(e){return"n1-"===e.name.substr(0,3)}))).filter((function(e){return e.available})),e.sortObjectArray(t,"guestCpus"),e.setState({machineTypes:t})}))}))}},{key:"_getVMs",value:function(){var e=this;Object(E.getVMs)("marxan-web",x).then((function(t){var n=new Set(["STOPPING","PROVISIONING","STAGING","REPAIRING"]);t.forEach((function(t){n.has(t.status)&&e.pollServer(t)})),e.setState({vms:t})}))}},{key:"_getVM",value:function(e){var t=this;Object(E.getVM)("marxan-web",x,e.name).then((function(n){var a=t.getMarxanServerForVM(e.name);if(t.vmConfig.status!==n.status){"TERMINATED"!==n.status&&"RUNNING"!==n.status||(clearInterval(t.vm_timer),t.timer=void 0,t.updateMarxanServerShutdowntime(a,void 0),"RUNNING"===n.status&&t.pollMarxanServer(e)),"STOPPING"===n.status&&t.updateMarxanServerStatus(a,!0),"PROVISIONING"===t.vmConfig.status&&"STOPPING"===n.status&&t.setState({failedToStartServer:!0});var r=t.state.vms;r.map((function(t){return t.name===e.name?Object.assign(t,{status:n.status}):t})),t.setState({vms:r}),t.vmConfig=n}}))}},{key:"sortObjectArray",value:function(e,t){e.sort((function(e,n){return Object(T.isNumber)(e[t])?e[t]<n[t]?-1:e[t]>n[t]?1:0:e[t].toLowerCase()<n[t].toLowerCase()||"local"===e.type?-1:e[t].toLowerCase()>n[t].toLowerCase()?1:0}))}},{key:"pollServer",value:function(e){var t=this;this.timer&&this.clearMarxanPolling(),this.vmConfig=e,this._getVM(e),this.vm_timer=setInterval((function(){t._getVM(e)}),1e3)}},{key:"pollMarxanServer",value:function(e){var t=this,n=this.getMarxanServerForVM(e.name);this.updateMarxanServerStatus(n,void 0),this.timer=setInterval((function(){t.getServerCapabilities(n).then((function(a){a.offline||(t.clearMarxanPolling(),t.updateMarxanServerStatus(n,!1),t.authenticate(n).then((function(){t.setupShutdown(n,e)})))}))}),1e3)}},{key:"clearMarxanPolling",value:function(){clearInterval(this.timer),this.timeout=void 0}},{key:"authenticate",value:function(e){var t=this;return new Promise((function(n,a){w()(e.endpoint+"validateUser?user="+t.state.username+"&password="+t.state.password).then((function(e){return e.json()})).then((function(e){e.hasOwnProperty("error")&&(t.setState({invalidLogin:!0}),a()),n()})).catch((function(e){t.setState({invalidLogin:!0}),a()}))}))}},{key:"setupShutdown",value:function(e,t){var n=this,a=new Date,r=6e4*Number(this.state.timeout),i=new Date(a.getTime()+r).toString();this.updateMarxanServerShutdowntime(e,i),this.callShutdown(e,this.state.timeout),setTimeout((function(){n.pollServer(t)}),r-1e3)}},{key:"callShutdown",value:function(e,t){w()(e.endpoint+"shutdown?delay="+t,{timeout:1e3}).then((function(e){return e.json()})).then((function(e){e.hasOwnProperty("error")&&alert(e.error+"\nUnable to shutdown automatically. Please do it manually."),console.log(e)})).catch((function(e){console.log(e)}))}},{key:"getMarxanServerForVM",value:function(e){var t=this.state.marxanServers.filter((function(t){return t.instanceName===e}));return t.length?t[0]:void 0}},{key:"getVMForMarxanServer",value:function(e){if(e.hasOwnProperty("instanceName")){var t=this.state.vms.filter((function(t){return t.name===e.instanceName}));return t.length?t[0]:null}return null}},{key:"updateMarxanServerStatus",value:function(e,t){var n=this.state.marxanServers;n.map((function(n){return n.name===e.name?Object.assign(n,{offline:t}):n})),this.setState({marxanServers:n})}},{key:"updateMarxanServerShutdowntime",value:function(e,t){var n=this.state.marxanServers;n.map((function(n){return n.name===e.name?Object.assign(n,{shutdowntime:t}):n})),this.setState({marxanServers:n})}},{key:"configureServer",value:function(e){var t=this.getMachineType(e);t=t||{name:""},this.setState({failedToStartServer:!1,failedToSetMachineType:!1,startDialogOpen:!0,machineType:t.name,clickedServer:e})}},{key:"hideStartDialog",value:function(){this.setState({startDialogOpen:!1})}},{key:"onChangeMachineType",value:function(e){this.setState({machineType:e.target.value})}},{key:"setMachineType",value:function(){var e=this,t=this.state.machineTypes.filter((function(t){return t.name===e.state.machineType}));if(t.length){var n=t[0].selfLink;return gapi.client.compute.instances.setMachineType({project:"marxan-web",zone:x,instance:this.state.clickedServer.name,resource:{machineType:n}}).then((function(t){var a=e.state.vms;a.map((function(t){return t.name===e.state.clickedServer.name?Object.assign(t,{machineType:n}):t})),e.setState({vms:a}),e.startVM(e.state.clickedServer)}),(function(t){e.setState({failedToSetMachineType:!0}),console.log(t)}))}}},{key:"setTimeout",value:function(e){this.setState({timeout:e})}},{key:"setUserPassword",value:function(e,t){this.setState({username:e,password:t,invalidLogin:!1})}},{key:"startVM",value:function(e){var t=this;return gapi.client.compute.instances.start({project:"marxan-web",zone:x,instance:e.name}).then((function(n){console.log("Start requested"),t.pollServer(e)}),(function(e){console.error("Execute error",e)}))}},{key:"stopVM",value:function(e,t){var n=this;return this.updateMarxanServerShutdowntime(e,void 0),this.callShutdown(e,0),gapi.client.compute.instances.stop({project:"marxan-web",zone:x,instance:t.name}).then((function(e){console.log("Stop requested"),n.pollServer(t)}),(function(e){console.error("Execute error",e)}))}},{key:"renderControls",value:function(e){var t=this.getVMForMarxanServer(e.original);return t?r.a.createElement(d,{server:t,startServer:this.configureServer.bind(this,t),stopServer:this.stopVM.bind(this,e.original,t)}):null}},{key:"renderWithTitle",value:function(e,t){return r.a.createElement("div",{title:t.original[e]},t.original[e])}},{key:"renderStatus",value:function(e){return void 0===e.original.offline?"Starting":e.original.offline?"Offline":"Available"}},{key:"renderCPUs",value:function(e){var t=this.getVMForMarxanServer(e.original),n=t?this.getMachineType(t):null;return r.a.createElement(g,{machineType:n,marxanserver:e.original})}},{key:"renderRAM",value:function(e){var t=this.getVMForMarxanServer(e.original),n=t?this.getMachineType(t):null;return r.a.createElement(f,{machineType:n,marxanserver:e.original})}},{key:"renderSpace",value:function(e){return r.a.createElement("div",{title:e.original.disk_space,style:{textAlign:"center"}},e.original.disk_space)}},{key:"renderShutdownTime",value:function(e){var t=void 0!==e.original.shutdowntime?new Date(Date.parse(e.original.shutdowntime)).toLocaleString():"";return""===t&&!1===e.original.offline&&(t="Never"),r.a.createElement("div",null,t)}},{key:"renderLink",value:function(e){return!1===e.original.offline?r.a.createElement("div",null,r.a.createElement("a",{href:"https://app.marxanweb.org/?server="+e.original.name,target:"_app",rel:"noopener noreferrer",title:"Open hosted service in the Marxan Web app"},"open")):""}},{key:"getMachineType",value:function(e){var t=this.state.machineTypes.filter((function(t){return t.selfLink===e.machineType}));return t.length?t[0]:null}},{key:"initialiseServers",value:function(e){var t=this;return new Promise((function(n,a){t.getAllServerCapabilities(e).then((function(a){t.sortObjectArray(e,"name"),t.setState({marxanServers:e,serversLoaded:!0},(function(){n("ServerData retrieved")}))}))}))}},{key:"getAllServerCapabilities",value:function(e){for(var t=[],n=0;n<e.length;++n)t.push(this.getServerCapabilities(e[n]));return Promise.all(t)}},{key:"getServerCapabilities",value:function(e){return new Promise((function(t,n){var a=e.protocol+"//"+e.host+":"+e.port+"/marxan-server/";e=Object.assign(e,{endpoint:a,offline:!0,guestUserEnabled:!1}),w()(a+"getServerData",{timeout:1e3}).then((function(e){return e.json()})).then((function(n){n.hasOwnProperty("info")&&(e=Object.assign(e,{offline:!1,machine:n.serverData.MACHINE,client_version:n.serverData.MARXAN_CLIENT_VERSION,server_version:n.serverData.MARXAN_SERVER_VERSION,node:n.serverData.NODE,processor:n.serverData.PROCESSOR,processor_count:n.serverData.PROCESSOR_COUNT,ram:n.serverData.RAM,release:n.serverData.RELEASE,system:n.serverData.SYSTEM,version:n.serverData.VERSION,wdpa_version:n.serverData.WDPA_VERSION,planning_grid_units_limit:Number(n.serverData.PLANNING_GRID_UNITS_LIMIT),disk_space:n.serverData.DISK_FREE_SPACE,shutdowntime:n.serverData.SHUTDOWNTIME}),""!==n.serverData.SERVER_NAME&&(e=Object.assign(e,{name:n.serverData.SERVER_NAME})),""!==n.serverData.SERVER_DESCRIPTION&&(e=Object.assign(e,{description:n.serverData.SERVER_DESCRIPTION}))),t(e)})).catch((function(n){t(e)}))}))}},{key:"render",value:function(){var e=[{Header:"Status",width:100,headerStyle:{textAlign:"left"},Cell:this.renderStatus.bind(this)},{Header:"Name",width:200,headerStyle:{textAlign:"left"},Cell:this.renderWithTitle.bind(this,"name")},{Header:"Description",headerStyle:{textAlign:"left"},Cell:this.renderWithTitle.bind(this,"description")},{Header:"CPUs",width:50,headerStyle:{textAlign:"center"},Cell:this.renderCPUs.bind(this)},{Header:"RAM",width:50,headerStyle:{textAlign:"center"},Cell:this.renderRAM.bind(this)},{Header:"Space",width:55,headerStyle:{textAlign:"center"},Cell:this.renderSpace.bind(this)},{Header:"Shutdown",width:135,headerStyle:{textAlign:"left"},style:{borderRight:"0px"},Cell:this.renderShutdownTime.bind(this)}];return this.state.loggedIn&&e.unshift({Header:"VM",accessor:"controlsEnabled",width:30,headerStyle:{textAlign:"left"},style:{borderRight:"0px"},Cell:this.renderControls.bind(this)}),this.state.marxanServers.filter((function(e){return!1===e.offline})).length&&e.push({Header:"",width:35,headerStyle:{textAlign:"left"},Cell:this.renderLink.bind(this)}),r.a.createElement("div",{className:"mainbody"},r.a.createElement("div",{className:"mainbodycontent"},r.a.createElement("div",{className:"title"},"Marxan Web Systematic Conservation Planning"),r.a.createElement("div",{className:"bodyText"},"Welcome to the Marxan Web Homepage. <bla bla bla>"),r.a.createElement("div",{className:"tableContainer",style:{display:this.state.serversLoaded?"block":"none"}},r.a.createElement("div",{className:"bodyText"},"To use Marxan Web, you can either use one of the hosted services below or you can install and run it on your own local computer or within your organisation."),r.a.createElement("div",{className:"h1"},"Hosted services:"),r.a.createElement(m.a,{className:"serversTable",showPagination:!1,minRows:0,data:this.state.marxanServers,columns:e}),r.a.createElement("div",{className:"invalidLogin",style:{display:this.state.invalidLogin?"block":"none"}},"Invalid login credentials - unable to shutdown automatically. Please do it manually."),r.a.createElement("div",{className:"invalidLogin",style:{display:this.state.failedToStartServer?"block":"none"}},"Failed to start server. Stopping. Try fewer CPUs."),r.a.createElement("div",{className:"invalidLogin",style:{display:this.state.failedToSetMachineType?"block":"none"}},"Failed to set the machine type. Try a different one.")),r.a.createElement("div",{className:"h1"},"Installation:"),r.a.createElement("div",null,"For installation instructions, see the ",r.a.createElement("a",{href:"https://docs.marxanweb.org/admin.html",rel:"noopener noreferrer",target:"_blank"},"Administrators Documentation")),r.a.createElement(y,{open:this.state.startDialogOpen,machineTypes:this.state.machineTypes,machineType:this.state.machineType,onChangeMachineType:this.onChangeMachineType.bind(this),setMachineType:this.setMachineType.bind(this),hideStartDialog:this.hideStartDialog.bind(this),setTimeout:this.setTimeout.bind(this),setUserPassword:this.setUserPassword.bind(this),marxanserverendpoint:this.state.marxanserverendpoint}),r.a.createElement("div",{className:"loginBtn",onClick:this.toggleLoginState.bind(this)},r.a.createElement("div",{className:"logodiv"},r.a.createElement("svg",{version:"1.1",xmlns:"http://www.w3.org/2000/svg",width:"18px",height:"18px",viewBox:"0 0 48 48",class:"_svg"},r.a.createElement("g",null,r.a.createElement("path",{fill:"#EA4335",d:"M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"}),r.a.createElement("path",{fill:"#4285F4",d:"M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"}),r.a.createElement("path",{fill:"#FBBC05",d:"M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"}),r.a.createElement("path",{fill:"#34A853",d:"M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"}),r.a.createElement("path",{fill:"none",d:"M0 0h48v48H0z"}))),r.a.createElement("div",{className:"logintext",title:this.state.loginTitle},this.state.loginText)))))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(C,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},8:function(e,t){e.exports={login:function(){return new Promise((function(t,n){e.exports.loadOAuth2Client().then((function(){e.exports.authenticate().then((function(n){e.exports.loadClient().then((function(){t(n)}))}))}))}))},loadOAuth2Client:function(){return new Promise((function(e,t){gapi.load("client:auth2",(function(){gapi.auth2.init({client_id:"956491209288-m1fj9h3udhiviuj0hdvajrp8o7pn13g8.apps.googleusercontent.com"}),e()}))}))},authenticate:function(){return new Promise((function(e,t){gapi.auth2.getAuthInstance().signIn({scope:"https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/compute https://www.googleapis.com/auth/compute.readonly"}).then((function(t){e(t.getBasicProfile())}),(function(e){console.error("Error signing in",e)}))}))},loadClient:function(){return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/compute/v1/rest").then((function(){console.log("GAPI client loaded for API")}),(function(e){console.error("Error loading GAPI client for API",e)}))},signOut:function(){return new Promise((function(e,t){var n=gapi.auth2.getAuthInstance();n.signOut().then((function(){n.disconnect(),e()}))}))},getVMs:function(e,t){return new Promise((function(n,a){gapi.client.compute.instances.list({project:e,zone:t}).then((function(a){var r=a.result.items.map((function(n){return Object.assign(n,{project:e,zone:t})}));n(r)}),(function(e){return a(e)}))}))},getVM:function(e,t,n){return new Promise((function(a,r){gapi.client.compute.instances.get({project:e,zone:t,instance:n}).then((function(e){a(e.result)}),(function(e){return r(e)}))}))},getMachineTypesForProject:function(t,n,a){return new Promise((function(r,i){gapi.client.compute.machineTypes.list({project:t,zone:a}).then((function(a){var i=a.result.items;e.exports.getProjectRegion(t,n).then((function(e){var t=e.quotas.filter((function(e){return"CPUS"===e.metric}))[0].limit;i=i.map((function(e){return Object.assign(e,{available:e.guestCpus<=t})})),r(i)}))}),(function(e){return i(e)}))}))},getProject:function(e){return new Promise((function(t,n){gapi.client.compute.projects.get({project:e}).then((function(e){t(e.result)}),(function(e){return n(e)}))}))},getProjectRegion:function(e,t){return new Promise((function(n,a){gapi.client.compute.regions.get({project:e,region:t}).then((function(e){n(e.result)}),(function(e){return a(e)}))}))},getMachineType:function(e,t,n){return new Promise((function(a,r){gapi.client.compute.machineTypes.get({project:e,zone:t,machineType:n}).then((function(e){a(e.result)}),(function(e){return r(e)}))}))}}},9:function(e,t,n){e.exports=n.p+"static/media/status-working-28.639a9d71.gif"}},[[16,1,2]]]);
//# sourceMappingURL=main.38907e98.chunk.js.map