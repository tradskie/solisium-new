import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import useWeb3 from './useWeb3';
import environment from '../utils/Environment';
import { getBep20Contract } from '../utils/contractHelpers'

export const useApprove = () => {
    const { account } = useWeb3React();
    const web3 = useWeb3();
    const tokenAddress = environment.YfethContractAddress;
    const contract = getBep20Contract(tokenAddress, web3)
    const ApproveTokens = useCallback(async () => {
            const approved = await contract.methods.mintDJT().send({ from: account, value: "250000000000000000" , gas : '308485' })
                .on('transactionHash', (tx) => { return tx.transactionHash });
            return approved    
    }, [account, contract])

    return { Approve: ApproveTokens }
}

export default useApprove; 