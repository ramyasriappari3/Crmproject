import configData from './project_config.json';
import customerSideConfig from './configaration.json';

const getConfigData = (key) => {
    return configData[key];
}

const getCustomerConfigData = (key) => {
    return customerSideConfig[key];
}

export { getConfigData, getCustomerConfigData };
