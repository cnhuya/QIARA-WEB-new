export const eventsConfig = {
    "base": {
        "vault": {
            "contract_addresses": ["0x55ff17009aCE37E77b430adc7EdE94087ed4E6f3"],
            "contract_abi": [
                "event Vault(string name, (string name, string typeName, bytes value)[] aux)"
            ]
        }
    },
    "monad": {
        "vault": {
            "contract_addresses": ["0x05Bb45134bf13B7Fe6B98e923de8421BDA682D7B"],
            "contract_abi": [
                "event Vault(string name, (string name, string typeName, bytes value)[] aux)"
            ]
        }
    },
    "sui": {
        "vault": {
            "event": "0x1c962b248e0bc5d3add749b476e092ca19a4efd943ed6962b8a91418d8d9ed3e::QiaraEventsV2::VaultEvent"
        }
    },
    "supra": {
        "consensus": {
            "event": "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraEventV2::ConsensusEvent"
        },
        "crosschain": {
            "event": "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraEventV2::CrosschainEvent"
        },
        "validate": {
            "event": "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraEventV2::ValidationEvent"
        },
        "shared": {
            "event": "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraEventV2::SharedStorageEvent"
        },
        "market": {
            "event": "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraEventV2::MarketEvent"
        },
        "perps": {
            "event": "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraEventV2::PerpsEvent"
        },
        "automated": {
            "event": "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraEventV2::AutomatedEvent"
        },
        "governance": {
            "event": "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraEventV2::GovernanceEvent"
        },
     //   "historical": {
     //       "event": "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraEventV2::HistoricalEvent"
     //   },
    }

    /*      "governance": {
            "event": "0xc536f11396d0510d90b021cbae973ab1f71155e8ff32c9d544bfb48212b11ac9::QiaraEventV15::GovernanceEvent"
        },  */
};