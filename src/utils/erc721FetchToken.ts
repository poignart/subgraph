import { Address, BigInt } from '@graphprotocol/graph-ts';

import { TokenRegistry, Token } from '../../generated/schema';

import { Poignart } from '../../generated/Poignart/Poignart';

export function fetchToken(registry: TokenRegistry, id: BigInt): Token {
  let tokenid = registry.id.concat('-').concat(id.toHex());

  let token = Token.load(tokenid);
  if (token == null) {
    token = new Token(tokenid);
    token.registry = registry.id;
    token.identifier = id;

    let erc721 = Poignart.bind(Address.fromString(registry.id));
    let try_tokenURI = erc721.try_tokenURI(id);
    token.uri = try_tokenURI.reverted ? '' : try_tokenURI.value;
  }

  return token as Token;
}
