import { Address } from '@graphprotocol/graph-ts';

import { TokenRegistry } from '../../generated/schema';

import { Poignart } from '../../generated/Poignart/Poignart';

export function fetchRegistry(address: Address): TokenRegistry {
  let erc721 = Poignart.bind(address);
  let id = address.toHex();

  let registry = TokenRegistry.load(id);
  if (registry == null) {
    registry = new TokenRegistry(id);
    let try_name = erc721.try_name();
    let try_symbol = erc721.try_symbol();
    let name = try_name.reverted ? '' : try_name.value;
    let symbol = try_symbol.reverted ? '' : try_symbol.value;
    registry.name = name;
    registry.symbol = symbol;
  }

  return registry as TokenRegistry;
}
