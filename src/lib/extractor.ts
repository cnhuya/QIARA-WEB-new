import { functionsData } from '../config/functions';
import { walletsData } from '../config/wallets';
import { eventsConfig } from '../config/events';
import { configData } from '../config/settings';

export function getEventsConfig() { return eventsConfig; }
export function getConfig() { return configData; }

type Chain = keyof typeof functionsData;

export function getFunctionData(chain: Chain, actionName: string) {
    const chainData = functionsData[chain]; // ✅ now typed correctly
    if (!chainData) throw new Error(`Chain ${chain} not found in config`);

    const actualKey = Object.keys(chainData).find(
        k => k.toLowerCase() === actionName.toLowerCase()
    ) as keyof typeof chainData | undefined;

    if (!actualKey) throw new Error(`Action ${actionName} not found for chain ${chain}`);
    const action = chainData[actualKey]; // ✅ no more implicit any

    const getAddressFromRef = () => {
        const ref = (action as any).address_ref;
        const addr = (walletsData as any)[chain]?.[ref];
        if (!addr) throw new Error(`Address reference "${ref}" not found in wallets.js`);
        return addr;
    };

    if (chain === "sui") {
        return {
            package: (action as any).package || getAddressFromRef(),
            module_name: (action as any).module_name,
            function_name: (action as any).function_name,
            args: (action as any).args
        };
    }

    if (chain === "supra") {
        return {
            module_address: getAddressFromRef(),
            module_name: (action as any).module_name,
            function_name: (action as any).function_name,
            args: (action as any).args
        };
    }

    return {
        contract_address: (action as any).contract_address || getAddressFromRef(),
        abi: Array.isArray((action as any).contract_abi)
            ? (action as any).contract_abi
            : [(action as any).contract_abi],
        functionName: (action as any).contract_abi?.name || null
    };
}

export function rebuild_with_separator(data: {module_address?: string;module_name?: string;function_name?: string;} | null) {
    if (!data) return '';
    return [data.module_address, data.module_name, data.function_name].filter(part => part !== '').join('::');
}