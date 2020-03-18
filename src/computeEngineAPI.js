/*global gapi*/
module.exports = {
	login: function() {
		return new Promise((resolve, reject) => {
			//get the OAuth2 client library
			module.exports.loadOAuth2Client().then(() => {
				//authenticate the user
				module.exports.authenticate().then(() => {
					//load the Compute API
					module.exports.loadClient().then(() => {
						resolve();
					});
				});
			});
		});
	},
	loadOAuth2Client: function() {
		return new Promise((resolve, reject) => {
			gapi.load("client:auth2", function() {
				gapi.auth2.init({ client_id: "525442053161-ua4flmb201fv8m2tek8ijhuobohur4vs.apps.googleusercontent.com" }); //for a.cottam
				// gapi.auth2.init({ client_id: "956491209288-m1fj9h3udhiviuj0hdvajrp8o7pn13g8.apps.googleusercontent.com" }); //for marxancloud
				resolve();
			});
		});
	},
	authenticate: function() {
		return gapi.auth2.getAuthInstance()
			.signIn({ scope: "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/compute https://www.googleapis.com/auth/compute.readonly" })
			.then(function() { console.log("Sign-in successful"); },
				function(err) { console.error("Error signing in", err); });
	},
	loadClient: function() {
		return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/compute/v1/rest")
			.then(function() { console.log("GAPI client loaded for API"); },
				function(err) { console.error("Error loading GAPI client for API", err); });
	},
	//gets the VM instances for the project/zone
	getVMs: function(project, zone) {
		return new Promise((resolve, reject) => {
			gapi.client.compute.instances.list({ "project": project, "zone": zone }).then((response) => {
				//add the project and zone to each vm
				let _vms = response.result.items.map(item => Object.assign(item, { project: project, zone: zone }));
				resolve(_vms);
			}, (err) => reject(err));
		});
	},
	//gets data for a single VM
	getVM: function(project, zone, resourceId) {
		return new Promise((resolve, reject) => {
			gapi.client.compute.instances.get({ "project": project, "zone": zone, 'instance': resourceId }).then((response) => {
				resolve(response.result);
			}, (err) => reject(err));
		});
	},
	//gets the machine type details for the machine type
	getMachineTypesForProject: function(project, zone) {
		return new Promise((resolve, reject) => {
			gapi.client.compute.machineTypes.list({ "project": project, "zone": zone }).then((response) => {
				resolve(response.result.items);
			}, (err) => reject(err));
		});
	},
	//gets the machine type details for the machine type
	getMachineType: function(project, zone, machineType) {
		return new Promise((resolve, reject) => {
			gapi.client.compute.machineTypes.get({ "project": project, "zone": zone, 'machineType': machineType }).then((response) => {
				resolve(response.result);
			}, (err) => reject(err));
		});
	}
};
