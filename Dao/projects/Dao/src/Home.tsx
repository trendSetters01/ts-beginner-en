// src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import DaoCreateApplication from './components/DaoCreateApplication'
import { DaoClient } from './contracts/DaoClient'

interface HomeProps {
  DAOtypedClient: DaoClient
}

const Home: React.FC<HomeProps> = ({ DAOtypedClient }) => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [proposal, setProposal] = useState<string>('This is a Phantom Pals Proposal')
  const { activeAddress } = useWallet()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal)
  }

  return (
    <div className="hero min-h-screen bg-black">
      <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-auto">
        <div className="max-w-md">
          <h1 className="text-4xl">
            Welcome to <div className="font-bold py-3">Phantom Pals DAO</div>
          </h1>

          <div className="grid">
            <button data-test-id="connect-wallet" className="btn m-2" onClick={toggleWalletModal}>
              Wallet Connection
            </button>
            <div className="divider" />
            <DaoCreateApplication
              buttonClass="btn m-2"
              buttonLoadingNode={<span className="loading loading-spinner" />}
              buttonNode="Create DAO"
              typedClient={DAOtypedClient}
              // proposal={proposal}
            />
          </div>

          <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
        </div>
      </div>
    </div>
  )
}

export default Home
