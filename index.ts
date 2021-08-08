import ResourceService from './src/service/ResourceService';

const service = ResourceService.getInstance();

service.getAllResources().then((data) => console.log(data));
