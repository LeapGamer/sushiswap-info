import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Box } from 'rebass'
import styled from 'styled-components'
import Link from '../components/Link'
import { Text } from 'rebass'
import { AutoRow, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import PairList from '../components/PairList'
import TopTokenList from '../components/TokenList'
import TxnList from '../components/TxnList'
import GlobalChart from '../components/GlobalChart'
import Search from '../components/Search'
import GlobalStats from '../components/GlobalStats'

// added these as fork from GlobalStats and PairList
import SushiStats from '../components/SushiStats'
import PoolList from '../components/PoolList'

import { useGlobalData, useGlobalTransactions } from '../contexts/GlobalData'
import { useAllPairData } from '../contexts/PairData'
import { useMedia } from 'react-use'
import Panel from '../components/Panel'
import { useAllTokenData } from '../contexts/TokenData'
import { formattedNum, formattedPercent } from '../utils'
import { TYPE, ThemedBackground } from '../Theme'
import { transparentize } from 'polished'
import { CustomLink } from '../components/Link'

import { PageWrapper, ContentWrapper } from '../components'

import 'feather-icons'
import TokenLogo from '../components/TokenLogo'
import Loader from '../components/LocalLoader'
import { RowFixed } from '../components/Row'
import Column from '../components/Column'
import { ButtonLight, ButtonDark } from '../components/ButtonStyled'
import TokenChart from '../components/TokenChart'
import { BasicLink } from '../components/Link'
import { getPoolLink, getSwapLink, localNumber } from '../utils'
import { useTokenData, useTokenTransactions, useTokenPairs } from '../contexts/TokenData'
import { useColor } from '../hooks'
import CopyHelper from '../components/Copy'
import { useDataForList } from '../contexts/PairData'
import Warning from '../components/Warning'
import { usePathDismissed, useSavedTokens } from '../contexts/LocalStorage'
import { Hover, StyledIcon } from '../components'
import { PlusCircle, Bookmark } from 'react-feather'
import FormattedName from '../components/FormattedName'
import { useListedTokens } from '../contexts/Application'

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

const GridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 6px;
  align-items: start;
  justify-content: space-between;
`

const DashboardWrapper = styled.div`
  width: 100%;
`

const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      grid-column: 1 / 4;
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`

const TokenDetailsLayout = styled.div`
  display: inline-grid;
  width: 100%;
  grid-template-columns: auto auto auto 1fr;
  column-gap: 30px;
  align-items: start;

  &:last-child {
    align-items: center;
    justify-items: end;
  }
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      grid-column: 1 / 4;
      margin-bottom: 1rem;
    }

    &:last-child {
      align-items: start;
      justify-items: start;
    }
  }
`

const WarningGrouping = styled.div`
  opacity: ${({ disabled }) => disabled && '0.4'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
`

function GlobalPage() {
  // get data for lists and totals
  const allPairs = useAllPairData()
  const allTokens = useAllTokenData()
  const transactions = useGlobalTransactions()
  const { totalLiquidityUSD, oneDayVolumeUSD, volumeChangeUSD, liquidityChangeUSD } = useGlobalData()

  // breakpoints
  const below800 = useMedia('(max-width: 800px)')

  // this needs to be changed to get the pool data
  const allPools = allPairs
  const sushTokenContract = "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2"
  const address = sushTokenContract

  //console.log(sushiToken)

  // scrolling refs

  useEffect(() => {
    document.querySelector('body').scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }, [])

  const {
    id,
    name,
    symbol,
    priceUSD,
    sushi_oneDayVolumeUSD,
    sushi_totalLiquidityUSD,
    sushi_volumeChangeUSD,
    oneDayVolumeUT,
    sushi_volumeChangeUT,
    priceChangeUSD,
    sushi_liquidityChangeUSD,
    oneDayTxns,
    txnChange
  } = useTokenData(address)

  useEffect(() => {
    document.querySelector('body').scrollTo(0, 0)
  }, [])

  // detect color from token
  const backgroundColor = "#077dff"

  // pairs to show in pair list
  const fetchedPairsList = useDataForList(allPairs)

  // price
  const price = priceUSD ? formattedNum(priceUSD, true) : ''
  const priceChange = priceChangeUSD ? formattedPercent(priceChangeUSD) : ''

  // volume
  const volume =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? formattedNum(oneDayVolumeUSD === 0 ? oneDayVolumeUT : oneDayVolumeUSD, true)
      : oneDayVolumeUSD === 0
      ? '$0'
      : '-'

  // mark if using untracked volume
  const [usingUtVolume, setUsingUtVolume] = useState(false)
  useEffect(() => {
    setUsingUtVolume(oneDayVolumeUSD === 0 ? true : false)
  }, [oneDayVolumeUSD])

  const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : sushi_volumeChangeUT)

  // liquidity
  const liquidity = totalLiquidityUSD ? formattedNum(totalLiquidityUSD, true) : totalLiquidityUSD === 0 ? '$0' : '-'
  const liquidityChange = formattedPercent(liquidityChangeUSD)

  // transactions
  const txnChangeFormatted = formattedPercent(txnChange)

  const below1080 = useMedia('(max-width: 1080px)')
  //const below800 = useMedia('(max-width: 800px)')
  const below600 = useMedia('(max-width: 600px)')
  const below500 = useMedia('(max-width: 500px)')

  // format for long symbol
  const LENGTH = below1080 ? 10 : 16
  const formattedSymbol = symbol?.length > LENGTH ? symbol.slice(0, LENGTH) + '...' : symbol

  //const [dismissed, markAsDismissed] = usePathDismissed(history.location.pathname)
  const dismissed = true
  const [savedTokens, addToken] = useSavedTokens()
  const listedTokens = useListedTokens()

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }, [])

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={transparentize(0.8, '#dae4ed')} />
      <ContentWrapper>
        <WarningGrouping disabled={!dismissed && listedTokens && !listedTokens.includes(address)}>
          <DashboardWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
            <RowBetween style={{ flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'flex-start' }}>
              <RowFixed style={{ flexWrap: 'wrap' }}>
                <RowFixed style={{ alignItems: 'baseline' }}>
                  <TYPE.main fontSize={below1080 ? '1.5rem' : '2rem'} fontWeight={500} style={{ margin: '0 1rem' }}>
                    <RowFixed gap="6px">
                      <FormattedName text={'🍣'} maxCharacters={16} style={{ marginRight: '6px' }} />{' '}
                      {formattedSymbol ? `${formattedSymbol}` : ''}
                    </RowFixed>
                  </TYPE.main>{' '}
                  {!below1080 && (
                    <>
                      <TYPE.main fontSize={'1.5rem'} fontWeight={500} style={{ marginRight: '1rem' }}>
                        {price} ea
                      </TYPE.main>
                      {priceChange}
                    </>
                  )}
                </RowFixed>
              </RowFixed>
              
              <RowFixed ml={below500 ? '0' : '2.5rem'} mt={below500 ? '1rem' : '0'}>
                <Link
                  style={{ width: 'fit-content' }}
                  color={backgroundColor}
                  external
                  href={'https://etherscan.io/address/' + address}
                >

                  <ButtonLight mt={'1rem'} color={backgroundColor}>
                     ({address.slice(0, 8) + '...' + address.slice(36, 42)}) View on Etherscan ↗
                  </ButtonLight>
                </Link>
              </RowFixed>
            </RowBetween>
            <AutoColumn style={{ marginBottom: '60px' }} gap="24px">
              {below800 && ( // mobile card
                <Box mb={20}>
                  <Panel>
                    <Box>
                      <AutoColumn gap="36px">
                        <AutoColumn gap="20px">
                          <RowBetween>
                            <TYPE.main>🍣 Volume (24hrs)</TYPE.main>
                            <div />
                          </RowBetween>
                          <RowBetween align="flex-end">
                            <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
                              {formattedNum(oneDayVolumeUSD, true)}
                            </TYPE.main>
                            <TYPE.main fontSize={12}>{formattedPercent(volumeChangeUSD)}</TYPE.main>
                          </RowBetween>
                        </AutoColumn>
                        <AutoColumn gap="20px">
                          <RowBetween>
                            <TYPE.main>🍣 Liquidity</TYPE.main>
                            <div />
                          </RowBetween>
                          <RowBetween align="flex-end">
                            <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
                              {formattedNum(totalLiquidityUSD, true)}
                            </TYPE.main>
                            <TYPE.main fontSize={12}>{formattedPercent(liquidityChangeUSD)}</TYPE.main>
                          </RowBetween>
                        </AutoColumn>
                      </AutoColumn>
                    </Box>
                  </Panel>
                </Box>
              )}
              {!below800 && (
                <GridRow>
                  <Panel style={{ height: '100%', minHeight: '300px' }}>
                    <GlobalChart display="liquidity" />
                  </Panel>
                  <Panel style={{ height: '100%' }}>
                    <GlobalChart display="volume" />
                  </Panel>
                </GridRow>
              )}
              {below800 && (
                <AutoColumn style={{ marginTop: '6px' }} gap="24px">
                  <Panel style={{ height: '100%', minHeight: '300px' }}>
                    <GlobalChart display="liquidity" />
                  </Panel>
                </AutoColumn>
              )}
            </AutoColumn>
            <AutoColumn style={{ marginTop: '26px' }} gap="24px">
              <PoolList pairs={allPools}/>
            </AutoColumn>
            
            <>
              <PanelWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
                {below1080 && price && (
                  <Panel>
                    <AutoColumn gap="20px">
                      <RowBetween>
                        <TYPE.main>Price</TYPE.main>
                        <div />
                      </RowBetween>
                      <RowBetween align="flex-end">
                        {' '}
                        <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                          {price}
                        </TYPE.main>
                        <TYPE.main>{priceChange}</TYPE.main>
                      </RowBetween>
                    </AutoColumn>
                  </Panel>
                )}
                <Panel>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>🍣 Liquidity</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                        {liquidity}
                      </TYPE.main>
                      <TYPE.main>{liquidityChange}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
                <Panel>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>🍣 Volume (24hrs) {usingUtVolume && '(Untracked)'}</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                        {volume}
                      </TYPE.main>
                      <TYPE.main>{volumeChange}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>

                <Panel>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>🍣 Transactions (24hrs)</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                        {oneDayTxns ? localNumber(oneDayTxns) : oneDayTxns === 0 ? 0 : '-'}
                      </TYPE.main>
                      <TYPE.main>{txnChangeFormatted}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
                <Panel style={{ gridColumn: below1080 ? '1' : '2/4', gridRow: below1080 ? '' : '1/4' }}>
                  <TokenChart address={address} color={backgroundColor} base={priceUSD} />
                </Panel>
              </PanelWrapper>
            </>

            
            <RowBetween mt={40} mb={'1rem'}>
              <TYPE.main fontSize={'1.125rem'}>🍣 Transactions</TYPE.main> <div />
            </RowBetween>
            <Panel rounded>
              {transactions ? <TxnList color={backgroundColor} transactions={transactions} /> : <Loader />}
            </Panel>
            <>
              
       
            </>
          </DashboardWrapper>
        </WarningGrouping>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(GlobalPage)
