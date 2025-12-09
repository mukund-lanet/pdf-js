import config from "mcr-common/src/expresshelper/config/index";
import eventBus from "mcr-common/src/expresshelper_common/helper/EventBus";
import { getMcrServiceNameByDevOpsName, MCR_SERVICES } from "mcr-common/src/expresshelper_common/helper/McrCommonServiceList";
import { McrServiceMeta } from "mcr-common/src/expresshelper_common/helper/McrServiceMeta";
enum VAR_MAPPING{
    msprefix = "CRM_MS_PREFIX",
    microServiceNameDevOps = "CRM_API_MCR_DEVOPS_NAME",
}
const EnvVars = Array.from(new Set(Object.values(VAR_MAPPING)));

const getVarByEnv = (envVar)=>{
    return Object.keys(VAR_MAPPING).filter((key)=>VAR_MAPPING[key]==envVar)
}

const runtimeOverrides: Record<string, any> = {};
const childConfig:any = {
    mongoConn: process.env.CRM_MONGO_DB_CONN_STRING_TEMPLATE?.replace("{{dbname}}", process.env.CRM_MONGO_DB_NAME),
};
EnvVars.forEach((env)=>{
    const vars = getVarByEnv(env);
    vars?.forEach((v)=>{
        childConfig[v] = process.env[env];
    })
})
// Define the runtime proxy that dynamically checks for overrides
const runtimeConfigProxy = new Proxy({...config, ...childConfig}, {
    get(target, prop: string) {
        return prop in runtimeOverrides ? runtimeOverrides[prop] : target[prop];
    }
});

// Listen for the event when mcrServiceMeta becomes available
eventBus.on(getMcrServiceNameByDevOpsName(MCR_SERVICES.MCR_ENVELOPE_SERVICE)+"_emit", (meta: McrServiceMeta) => {
    meta?.envs?.forEach(({ key, value }) => {
        if(key == "CRM_MONGO_DB_NAME"){
            runtimeOverrides["mongoConn"] =  process.env.CRM_MONGO_DB_CONN_STRING_TEMPLATE?.replace("{{dbname}}", value)
        }
        const vars = getVarByEnv(key);
        vars?.forEach((v)=>{
            runtimeOverrides[v] = value;
        })
    });
});

// Export the proxy config
export default runtimeConfigProxy;