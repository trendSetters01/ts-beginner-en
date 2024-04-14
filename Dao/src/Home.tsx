// src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet'
import React, { useEffect, useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import DaoCreateApplication from './components/DaoCreateApplication'
import { DaoClient } from './contracts/DaoClient'
import algosdk from 'algosdk'
import DaoGetVotes from './components/DaoGetVotes'
import DaoRegister from './components/DaoRegister'

interface HomeProps {
  algodClient: algosdk.Algodv2
}

const Home: React.FC<HomeProps> = ({ algodClient }) => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appID, setAppID] = useState<number>(0)
  const [proposal, setProposal] = useState<string>('')
  const [registeredASA, setRegisteredASA] = useState<number>(0)
  const { activeAddress } = useWallet()

  const typedClient = new DaoClient(
    {
      resolveBy: 'id',
      id: appID,
    },
    algodClient,
  )

  const getState = async () => {
    try {
      const state = await typedClient.getGlobalState();
      setProposal(state.proposal!.asString());
      setRegisteredASA(state.registeredASA!.asNumber() || 0);
    } catch (error) {
      console.warn(error);
      setProposal("Invalid App ID")
    }
  }
  useEffect(() => {
    getState()
  }, [appID])

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal)
  }

  return (
    <div className="hero min-h-screen bg-cover bg-center">
      <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-1)">
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

            {activeAddress &&
              // appID === 0 
              // &&
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
            {activeAddress &&
              // appID === 0 
              // &&
              (<div>
                <div className="divider" />
                <DaoRegister
                  buttonClass="btn m-2"
                  buttonLoadingNode={<span className="loading loading-spinner" />}
                  buttonNode="Register to Vote"
                  typedClient={typedClient}
                  registeredASA={registeredASA}
                  algodClient={algodClient}
                />
                {/* <div className="divider" />
                <DaoGetVotes
                  buttonClass="btn m-2"
                  buttonLoadingNode={<span className="loading loading-spinner" />}
                  buttonNode="Call getVotes"
                  typedClient={typedClient} inFavor={false} /> */}
              </div>
              )}
            {activeAddress &&
              // appID === 0 
              // &&
              (<div>
                <div className="divider" />
                <div className="flex w-full">
                  <div className="grid h-20 flex-grow card rounded-box place-items-center">
                    <DaoGetVotes
                      buttonClass="btn m-2"
                      buttonLoadingNode={<span className="loading loading-spinner" />}
                      buttonNode="Vote For"
                      typedClient={typedClient}
                      inFavor={true}
                    />
                  </div>
                  <div className="divider divider-horizontal">OR</div>
                  <div className="grid h-20 flex-grow card rounded-box place-items-center">
                    <DaoGetVotes
                      buttonClass="btn m-2"
                      buttonLoadingNode={<span className="loading loading-spinner" />}
                      buttonNode="Vote Against"
                      typedClient={typedClient}
                      inFavor={false}
                    /></div>
                </div>
              </div>
              )}
          </div>

          <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
        </div>
      </div>
    </div>
  )
}

export default Home
