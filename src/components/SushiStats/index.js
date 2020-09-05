import React, { useState } from 'react'
import styled from 'styled-components'
import { RowFixed, RowBetween } from '../Row'
import { useMedia } from 'react-use'
import { useGlobalData, useEthPrice } from '../../contexts/GlobalData'
import { formattedNum, localNumber } from '../../utils'
import { useAllTokenData } from '../../contexts/TokenData'

import UniPrice from '../UniPrice'
import { TYPE } from '../../Theme'

const Header = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
`

const Medium = styled.span`
  font-weight: 500;
`

export default function SushiStats(sushiTokenRow) {
  const below1295 = useMedia('(max-width: 1295px)')
  const below1180 = useMedia('(max-width: 1180px)')
  const below1024 = useMedia('(max-width: 1024px)')
  const below400 = useMedia('(max-width: 400px)')
  const below816 = useMedia('(max-width: 816px)')

  const [showPriceCard, setShowPriceCard] = useState(false)

  const { oneDayVolumeUSD, oneDayTxns, pairCount } = useGlobalData()
  const [ethPrice] = useEthPrice()
  const formattedEthPrice = ethPrice ? formattedNum(ethPrice, true) : '-'
  const oneDayFees = oneDayVolumeUSD ? formattedNum(oneDayVolumeUSD * 0.003, true) : ''

  // get sushi token info from all tokens list
  //const allTokens = useAllTokenData()
  //const sushTokenConntract = "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2"
  //const sushiTokenRow = allTokens[sushTokenConntract]
  //const sushiToken = Object.entries(sushiTokenRow)

  //console.log(formattedTokens)
  const sushiToken = sushiTokenRow.sushiToken

  // this data needs to be found
  const percentUniswap = 76.45
  const totalValueLocked = 1.54
  let sushiPrice = 0
  const poolCount = 11

  if(typeof sushiToken != 'undefined') {
    console.log(sushiToken)
    sushiPrice = sushiToken.priceUSD ? formattedNum(sushiToken.priceUSD, true) : '-'
  }

  return (
    <Header>
      <RowBetween style={{ padding: below816 ? '0.5rem' : '.5rem' }}>
        <RowFixed>
          {!below400 && (
            <TYPE.main
              mr={'1rem'}
              onMouseEnter={() => {
                setShowPriceCard(true)
              }}
              onMouseLeave={() => {
                setShowPriceCard(false)
              }}
              style={{ position: 'relative' }}
            >
              🍣 Price: <Medium>{sushiPrice}</Medium>
              {showPriceCard && <UniPrice />}

              
            </TYPE.main>
          )}

          {!below1180 && (
            <TYPE.main mr={'1rem'}>
              Total Value Locked (TVL): <Medium>{totalValueLocked}</Medium>&nbsp;
            </TYPE.main>
          )}
          {!below1024 && (
            <TYPE.main mr={'1rem'}>
              Pools: <Medium>{localNumber(poolCount)}</Medium>
            </TYPE.main>
          )}
          {!below1295 && (
            <TYPE.main mr={'1rem'}>
              <Medium>{localNumber(percentUniswap)}</Medium>% of Uniswap 
            </TYPE.main>
          )}
        </RowFixed>
      </RowBetween>
    </Header>
  )
}
