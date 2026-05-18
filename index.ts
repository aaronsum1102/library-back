import ResourceService from './src/service/ResourceService.js';

const service = ResourceService.getInstance();

service.getAllResources().then((data) => console.log(data));
