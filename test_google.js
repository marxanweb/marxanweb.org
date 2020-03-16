'use strict';

async function main() {
  // [START gce_list_vms]
  const Compute = require('@google-cloud/compute');
  const compute = new Compute();
  async function listVMs() {
    const vms = await compute.getVMs({
      maxResults: 10,
    });
    console.log(`Found ${vms.length} VMs!`);
    vms.forEach(vm => console.log(vm));
  }
  listVMs();
  // [END gce_list_vms]
}
main().catch(console.error);