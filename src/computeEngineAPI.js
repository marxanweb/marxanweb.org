//this is a light wrapper around the Google API Client Library for JavaScript (https://github.com/google/google-api-javascript-client)
/*global gapi*/
module.exports = {
	login: function() {
		return new Promise((resolve, reject) => {
			//get the OAuth2 client library
			module.exports.loadOAuth2Client().then(() => {
				//authenticate the user
				module.exports.authenticate().then((basicProfile) => {
					//load the Compute API
					module.exports.loadClient().then(() => {
						resolve(basicProfile);
					});
				});
			});
		});
	},
	loadOAuth2Client: function() {
		return new Promise((resolve, reject) => {
			gapi.load("client:auth2", function() {
				// gapi.auth2.init({ client_id: "525442053161-ua4flmb201fv8m2tek8ijhuobohur4vs.apps.googleusercontent.com" }); //for a.cottam
				gapi.auth2.init({ client_id: "956491209288-m1fj9h3udhiviuj0hdvajrp8o7pn13g8.apps.googleusercontent.com" }); //for marxancloud
				resolve();
			});
		});
	},
	authenticate: function() {
		return new Promise((resolve, reject) => {
			gapi.auth2.getAuthInstance()
				.signIn({ scope: "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/compute https://www.googleapis.com/auth/compute.readonly" })
				.then((userData)=>{ resolve(userData.getBasicProfile()) },
					function(err) { console.error("Error signing in", err); });
		});
	},
	loadClient: function() {
		return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/compute/v1/rest")
			.then(function() { console.log("GAPI client loaded for API"); },
				function(err) { console.error("Error loading GAPI client for API", err); });
	},
	//signs out
	signOut: function() {
		return new Promise((resolve, reject) => {
			var auth2 = gapi.auth2.getAuthInstance();
			auth2.signOut().then(() => {
				auth2.disconnect();
				resolve();
			});
		});
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
	getMachineTypesForProject: function(project, region, zone) {
		return new Promise((resolve, reject) => {
			gapi.client.compute.machineTypes.list({ "project": project, "zone": zone }).then((response) => {
				let machineTypes = response.result.items;
				//not all machine types will be available - it will depend of whether you are on a free trial and other factors - but the quota can be retrieved
				module.exports.getProjectRegion(project, region).then((projectData) => {
					//get the CPU quota
					let cpu_quota = projectData.quotas.filter(item => item.metric === 'CPUS')[0].limit;
					//add an attribute to all the machine types
					machineTypes = machineTypes.map(item => {
						return Object.assign(item, { available: item.guestCpus <= cpu_quota });
					});
					resolve(machineTypes);
				});
			}, (err) => reject(err));
		});
	},
	//gets the project and its quotas
	getProject: function(project) {
		return new Promise((resolve, reject) => {
			gapi.client.compute.projects.get({ "project": project }).then((response) => {
				resolve(response.result);
			}, (err) => reject(err));
		});
	},
	//gets the project in the region and its quotas
	getProjectRegion: function(project, region) {
		return new Promise((resolve, reject) => {
			gapi.client.compute.regions.get({ "project": project, "region": region }).then((response) => {
				resolve(response.result);
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
