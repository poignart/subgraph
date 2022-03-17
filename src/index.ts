import { Account, Transfer, Redeem, Withdrawal } from '../generated/schema';

import {
  Transfer as TransferEvent,
  Redeem as RedeemEvent,
  Withdraw as WithdrawEvent
} from '../generated/Poignart/Poignart';

import { fetchRegistry, fetchToken } from './utils';

import { events, transactions } from '@amxx/graphprotocol-utils';

export function handleTransfer(event: TransferEvent): void {
  let registry = fetchRegistry(event.address);
  if (registry != null) {
    let token = fetchToken(registry, event.params.tokenId);
    let from = new Account(event.params.from.toHex());
    let to = new Account(event.params.to.toHex());

    token.owner = to.id;

    registry.save();
    token.save();
    from.save();
    to.save();

    let ev = new Transfer(events.id(event));
    ev.transaction = transactions.log(event).id;
    ev.timestamp = event.block.timestamp;
    ev.token = token.id;
    ev.from = from.id;
    ev.to = to.id;
    ev.save();
  }
}

export function handleRedeem(event: RedeemEvent): void {
  let registry = fetchRegistry(event.address);
  if (registry != null) {
    let token = fetchToken(registry, event.params.tokenId);
    let signer = new Account(event.params.signer.toHex());
    let redeemer = new Account(event.params.redeemer.toHex());

    registry.save();
    token.save();
    signer.save();
    redeemer.save();

    let ev = new Redeem(events.id(event));
    ev.transaction = transactions.log(event).id;
    ev.timestamp = event.block.timestamp;
    ev.token = token.id;
    ev.signer = signer.id;
    ev.redeemer = redeemer.id;
    ev.save();
  }
}

export function handleWithdraw(event: WithdrawEvent): void {
  let recipient = new Account(event.params.recipient.toHex());
  recipient.save();

  let ev = new Withdrawal(events.id(event));
  ev.transaction = transactions.log(event).id;
  ev.timestamp = event.block.timestamp;
  ev.amount = event.params.value;
  ev.recipient = recipient.id;
  ev.save();
}
