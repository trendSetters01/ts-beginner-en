/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Dao, DaoClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'
import * as algokit from '@algorandfoundation/algokit-utils'

/* Example usage
<DaoCreateApplication
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createApplication"
  typedClient={typedClient}
  proposal={proposal}
/>
*/
// type DaoCreateApplicationArgs = Dao['methods']['createApplication(string)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: DaoClient
  setAppID: (appID: number) => void
}

const DaoCreateApplication = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [proposal, setProposal] = useState<string>('Phantom Pals Proposal')
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    //@ts-ignore
    console.warn(algokit.microAlgos(200_000));
    setLoading(true)
    console.log(`Calling createApplication`)
    await props.typedClient.create.createApplication(
      {
        proposal,
      },
      { sender },
    )

    await props.typedClient.appClient.fundAppAccount({
      sender,
      //@ts-ignore
      amount: algokit.microAlgos(200_000)
    });
    //@ts-ignore
    await props.typedClient.bootstrap({}, { sender, sendParams: { fee: algokit.microAlgos(2_000) } });

    const { appId } = await props.typedClient.appClient.getAppReference();
    props.setAppID(Number(appId))

    setLoading(false)
  }

  return (
    <div>
      <input type="text"
        className="input input-bordered m-2"
        value={proposal}
        onChange={(e) => setProposal(e.target.value)} />
      <button className={props.buttonClass} onClick={callMethod}>
        {loading ? props.buttonLoadingNode || props.buttonNode : props.buttonNode}
      </button>
    </div>
  )
}

export default DaoCreateApplication
