export const functionsData = {
    "base": {
        "sendZKP": {
            "address_ref": "verifier",
            "contract_abi": {
                "inputs": [
                    { "internalType": "uint[2]", "name": "_pA", "type": "uint256[2]" },
                    { "internalType": "uint[2][2]", "name": "_pB", "type": "uint256[2][2]" },
                    { "internalType": "uint[2]", "name": "_pC", "type": "uint256[2]" },
                    { "internalType": "uint[4]", "name": "_pubSignals", "type": "uint256[4]" }
                ],
                "name": "updateDataWithProof",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        },
        "load_variables_evm": {
            "contract_address": ["0xe5988aE525561dEeAe441c00A4D9eE6Ee0E2152E"],
            "contract_abi": {
                "inputs": [
                    { "internalType": "string", "name": "header", "type": "string" },
                    { "internalType": "string", "name": "name", "type": "string" },
                    { "internalType": "bytes", "name": "data", "type": "bytes" }
                ],
                "name": "adminAddVariable",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        },
        "approve_withdrawal": {
            "contract_address": ["0xEa855DEea617416C99e2fb8e0dcAd1784F93a6f3"],
            "contract_abi": {
                "inputs": [
                    { "internalType": "uint256[2]", "name": "_pA", "type": "uint256[2]" },
                    { "internalType": "uint256[2][2]", "name": "_pB", "type": "uint256[2][2]" },
                    { "internalType": "uint256[2]", "name": "_pC", "type": "uint256[2]" },
                    { "internalType": "uint256[8]", "name": "_pubSignals", "type": "uint256[8]" }
                ],
                "name": "processZkWithdraw",
                "outputs": [],
                "stateMutability": "external",
                "type": "function"
            }
        }
    },
    "sui": {
        "sendZKP": {
            "package": "0x3ce575fedefcfb1cbbb42d807f42d1e471c37d2d5e20c42ee62112bcd7fc7059",
            "module_name": "QIARA_ZKV1",
            "function_name": "verifyZK",
            "args": ["object", "vector<u8>", "vector<u8>"]
        },
        "approve_withdrawal": {
            "package": "0x04186739c6cd75db9c075fa3e438b305e0aa255d2960dd90cc9deadf5a1b0e74",
            "module_name": "QiaraDelegatorV1",
            "function_name": "verifyZK",
            "args": ["object", "object", "object", "raw", "raw"]
        },
        "approve_withdrawal_test": {
            "package": "0xcf180e76f7472aa08fc9af076216594d799384135c24d8be86857042e4f63850",
            "module_name": "awd",
            "function_name": "verifyZK",
            "args": ["raw", "raw"]
        },
        "approve_withdrawal_test1": {
            "package": "0xcf180e76f7472aa08fc9af076216594d799384135c24d8be86857042e4f63850",
            "module_name": "awd",
            "function_name": "verifyZK_type",
            "args": ["raw", "raw"]
        },
        "load_variables_sui_friend": {
            "package": "0x34a858b1f8674083d94f4edf41e5dc25d9c8ca946c1cd88f95745abb1042dfa7",
            "module_name": "QiaraVariablesV1",
            "function_name": "friend_add_variable",
            "args": ["object", "string", "string", "any", "object", "vector<u8>", "vector<u8>"]
        },
        "load_variables_sui": {
            "package": "0x34a858b1f8674083d94f4edf41e5dc25d9c8ca946c1cd88f95745abb1042dfa7",
            "module_name": "QiaraVariablesV1",
            "function_name": "admin_add_variable",
            "args": ["object", "object", "string", "string", "vector<u8>"]
        },
        "Withdraw": {
            "address_ref": "main",
            "function_name": "request_exit",
            "args": ["bytes", "u256", "u256", "uint32"]
        },
        "VerifyProof": {
            "address_ref": "main",
            "function_name": "verify",
            "args": ["u256", "pB", "u256"]
        }
    },
    "supra": { 
        "getSupportedTokens": {
            "address_ref": "main",
            "module_name": "QiaraProviderTypesV1",
            "function_name": "return_all_providers",
            "args": []
        },
        "getSharedStorages": {
            "address_ref": "main",
            "module_name": "QiaraSharedV1",
            "function_name": "return_shared_storages",
            "args": []
        },
        "getRanks": {
            "address_ref": "main",
            "module_name": "QiaraRanksV1",
            "function_name": "return_multiple_shared_rank",
            "args": []
        },
        "getSharedAssetsOverview": {
            "address_ref": "main",
            "module_name": "QiaraMarginV1",
            "function_name": "get_user_total_usd",
            "args": []
        },
        "getSharedAssets": {
            "address_ref": "main",
            "module_name": "QiaraMarginV1",
            "function_name": "get_user_all_balances",
            "args": []
        },
        "getTokensPrices": {
            "address_ref": "main",
            "module_name": "QiaraOracleV1",
            "function_name": "viewPriceMulti",
            "args": []
        },
        "getTokensMetadata": {
            "address_ref": "main",
            "module_name": "QiaraTokensMetadataV1",
            "function_name": "get_all_metadata",
            "args": []
        },
        "create_shared_wallet": {
            "address_ref": "main",
            "module_name": "QiaraSharedV1",
            "function_name": "create_shared_wallet",
            "args": []
        },
        "deposit": {
            "address_ref": "main",
            "module_name": "QiaraVaultsV3",
            "function_name": "deposit",
            "args": []
        },
        "withdraw": {
            "address_ref": "main",
            "module_name": "QiaraVaultsV3",
            "function_name": "withdraw",
            "args": []
        },
        "stake": {
            "address_ref": "main",
            "module_name": "QiaraVaultsV3",
            "function_name": "stake",
            "args": []
        },
        "unstake": {
            "address_ref": "main",
            "module_name": "QiaraVaultsV3",
            "function_name": "unstake",
            "args": []
        },
        "getVaults": {
            "address_ref": "main",
            "module_name": "QiaraLiquidityV2",
            "function_name": "return_vaults",
            "args": []
        },
        "getMarkets": {
            "address_ref": "main",
            "module_name": "QiaraPerpsV2",
            "function_name": "get_all_markets",
            "args": []
        },
        "getUserPositions": {
            "address_ref": "main",
            "module_name": "QiaraPerpsV2",
            "function_name": "get_positions",
            "args": []
        },
        "getSimpleListTokens": {
            "address_ref": "main",
            "module_name": "QiaraTokenTypesV1",
            "function_name": "return_full_nick_names_list",
            "args": []
        },
        "getGas": {
            "address_ref": "main",
            "module_name": "QiaraGasV3",
            "function_name": "return_gas",
            "args": []
        },
        "getHeadersVariables": {
            "address_ref": "main_new",
            "module_name": "QiaraStorageV1",
            "function_name": "viewHeaders",
            "args": []
        },
        "getHeadersFunctions": {
            "address_ref": "main_new",
            "module_name": "QiaraFunctionsV1",
            "function_name": "viewHeaders",
            "args": []
        },
        "getHeadersCapabilities": {
            "address_ref": "main_new",
            "module_name": "QiaraCapabilitiesV1",
            "function_name": "viewHeaders",
            "args": []
        },
        "getHeadersDataVariables": {
            "address_ref": "main_new",
            "module_name": "QiaraStorageV1",
            "function_name": "viewConstants",
            "args": []
        },
        "getHeadersDataFunctions": {
            "address_ref": "main_new",
            "module_name": "QiaraFunctionsV1",
            "function_name": "viewFunctions",
            "args": []
        },
        "getHeadersDataCapabilities": {
            "address_ref": "main_new",
            "module_name": "QiaraCapabilitiesV1",
            "function_name": "viewCapabilities",
            "args": []
        },
    }
};