/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  DataView, Timer, Button,
} from '@aragon/ui';

// import { assetDataUtils } from '@0x/order-utils';

// import BigNumber from 'bignumber.js';

import { toTokenUnitsBN } from '../../utils/number';
import { order as OrderType, option as OptionType } from '../types';
import { AskText, BidText } from './styled';
// import { SectionTitle } from '../common';
import * as zeroXUtil from '../../utils/0x';

function MyOrders({
  asks, bids, option, user, quoteAsset,
}) {
  const [myOrdersPage, setMyOrdersPage] = useState(0);
  const userAsks = asks
    // .slice(4, 5)
    .filter((o) => o.order.makerAddress === user.toLowerCase())
    .map((o) => {
      // eslint-disable-next-line no-param-reassign
      o.type = 'Ask';
      return o;
    });
  const userBids = bids
    .filter((o) => o.order.makerAddress === user.toLowerCase())
    .map((o) => {
      // eslint-disable-next-line no-param-reassign
      o.type = 'Bid';
      return o;
    });

  return (
    <>
      <DataView
        entriesPerPage={4}
        page={myOrdersPage}
        onPageChange={setMyOrdersPage}
        fields={['digest', 'type', 'price', 'amount', 'filled', 'expiration', '']}
        entries={userAsks.concat(userBids)}
        renderEntry={(order) => [// call, put, callDetail, putDetail, strikePrice
          order.metaData.orderHash.slice(2, 8),
          order.type === 'Ask' ? <AskText>{order.type}</AskText> : <BidText>{order.type}</BidText>,
          order.type === 'Ask'
            ? zeroXUtil.getAskPrice(order, option.decimals, quoteAsset.decimals).toFixed(6)
            : zeroXUtil.getBidPrice(order, quoteAsset.decimals, option.decimals).toFixed(6),
          order.type === 'Ask'
            ? toTokenUnitsBN(order.order.makerAssetAmount, option.decimals).toFixed(3)
            : toTokenUnitsBN(order.order.takerAssetAmount, option.decimals).toFixed(3),
          `${zeroXUtil.getOrderFillRatio(order)}%`,
          <Timer end={new Date(order.order.expirationTimeSeconds * 1000)} />,
          <Button onClick={() => {}}>Cancel Order</Button>,
        ]}
      />
    </>
  );
}

MyOrders.propTypes = {
  asks: PropTypes.arrayOf(OrderType).isRequired,
  bids: PropTypes.arrayOf(OrderType).isRequired,
  user: PropTypes.string.isRequired,
  option: OptionType.isRequired,
  quoteAsset: PropTypes.shape({
    decimals: PropTypes.number.isRequired,
    addr: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
  }).isRequired,
};

export default MyOrders;
