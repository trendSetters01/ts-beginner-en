// src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet'
import React, { useEffect, useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import DaoCreateApplication from './components/DaoCreateApplication'
import { DaoClient } from './contracts/DaoClient'
import algosdk from 'algosdk'

interface HomeProps {
  algodClient: algosdk.Algodv2
}

const Home: React.FC<HomeProps> = ({ algodClient }) => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appID, setAppID] = useState<number>(0)
  const [proposal, setProposal] = useState<string>('')
  const { activeAddress } = useWallet()

  const typedClient = new DaoClient(
    {
      resolveBy: 'id',
      id: appID,
    },
    algodClient,
  )

  const getProposal = async () => {
    try {
      const state = await typedClient.getGlobalState();
      setProposal(state.proposal!.asString());
    } catch (error) {
      console.warn(error);
      setProposal("Invalid App ID")
    }
  }
  useEffect(() => {
    getProposal()
  }, [appID])

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal)
  }

  return (
    <div className="hero min-h-screen bg-cover bg-center bg-gradient-to-r from-black to-purple-600">
      <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-auto border border-black shadow-lg p-4 mb-4">
        <div className="max-w-md">
          <h1 className="text-4xl">
            Welcome to <div className="font-bold py-3">Phantom Pals DAO</div>
          </h1>
          <div className="grid">
            <button data-test-id="connect-wallet" className="btn m-2" onClick={toggleWalletModal}>
              Wallet Connection
            </button>
            <div className="divider" />

            <h1 className="font-bold m-2">DAO App ID</h1>
            <input type="number"
              className="input input-bordered m-2"
              value={appID}
              onChange={(e) => setAppID(e.target.valueAsNumber || 0)} />

            {activeAddress && appID !== 0 &&
              (
                <><div className="divider" />
                  <h1 className="font-bold m-2">Proposal</h1>
                  <textarea className='textarea textarea-bordered m-2' value={proposal}
                    onChange={(e) => setProposal(e.target.value)} />
                </>
              )}
              
            {activeAddress && appID === 0 &&
              (<>
                <div className="divider" />
                <DaoCreateApplication
                  buttonClass="btn m-2"
                  buttonLoadingNode={<span className="loading loading-spinner" />}
                  buttonNode="Create DAO"
                  typedClient={typedClient}
                  setAppID={setAppID}
                />
              </>
              )}
          </div>

          <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
        </div>
      </div>
    </div>
  )
}

export default Home
