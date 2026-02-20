import { getHyperscalerConfiguration, SupportedHyperscalers, TotoMicroservice, TotoMicroserviceConfiguration } from 'totoms';
import { ControllerConfig } from "./Config";
import { SayHello } from './dlg/ExampleDelegate';

const config: TotoMicroserviceConfiguration = {
    serviceName: "toto-agents-api",
    basePath: '/totoagents',
    environment: {
        hyperscaler: process.env.HYPERSCALER as SupportedHyperscalers || "gcp",
        hyperscalerConfiguration: getHyperscalerConfiguration()
    },
    customConfiguration: ControllerConfig,
    apiConfiguration: {
        apiEndpoints: [
            { method: 'GET', path: '/hello', delegate: SayHello }
        ],
        apiOptions: { noCorrelationId: true }
    }, 
};

TotoMicroservice.init(config).then(microservice => {
    microservice.start();
});