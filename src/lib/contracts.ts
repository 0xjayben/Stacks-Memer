import { clarityValues, callReadOnlyFunction } from './stacks-transactions';
import { STACKSMEMER_CONTRACT_ADDRESS, STACKSMEMER_CONTRACT_NAME, type TokenRegistrationArgs, type TokenVoteArgs } from '../types/contracts';

/**
 * Returns the object passed to `signContractCall` for registering a token.
 */
export async function buildRegisterTokenOptions(args: TokenRegistrationArgs) {
  const { standardPrincipalCV, stringAsciiCV } = await clarityValues();
  
  return {
    contractAddress: STACKSMEMER_CONTRACT_ADDRESS,
    contractName: STACKSMEMER_CONTRACT_NAME,
    functionName: 'register-token',
    functionArgs: [
      standardPrincipalCV(args.contractId),
      stringAsciiCV(args.name.substring(0, 64)),
      stringAsciiCV(args.symbol.substring(0, 16))
    ]
  };
}

/**
 * Returns the object passed to `signContractCall` for voting for a token.
 */
export async function buildVoteTokenOptions(args: TokenVoteArgs) {
  const { standardPrincipalCV } = await clarityValues();
  
  return {
    contractAddress: STACKSMEMER_CONTRACT_ADDRESS,
    contractName: STACKSMEMER_CONTRACT_NAME,
    functionName: 'vote-token',
    functionArgs: [
      standardPrincipalCV(args.contractId)
    ]
  };
}

/**
 * Retrieves the on-chain properties of a registered token.
 */
export async function getTokenOnChain(contractId: string) {
  const { standardPrincipalCV } = await clarityValues();
  const args = [standardPrincipalCV(contractId)];
  
  const result = await callReadOnlyFunction(
    STACKSMEMER_CONTRACT_ADDRESS,
    STACKSMEMER_CONTRACT_NAME,
    'get-token',
    args
  );
  
  return result;
}

/**
 * Retrieves the total number of on-chain votes for a token.
 */
export async function getTokenVotesOnChain(contractId: string): Promise<number | null> {
  const { standardPrincipalCV } = await clarityValues();
  const args = [standardPrincipalCV(contractId)];
  
  const result: any = await callReadOnlyFunction(
    STACKSMEMER_CONTRACT_ADDRESS,
    STACKSMEMER_CONTRACT_NAME,
    'get-votes',
    args
  );
  
  // result comes back as `{ value: "10" }` or similar depending on `cvToJSON`
  if (result && result.value !== undefined) {
    return parseInt(result.value, 10);
  }
  return null;
}

/**
 * Checks if a specific wallet has already voted for a token.
 */
export async function hasWalletVotedOnChain(contractId: string, voterAddress: string): Promise<boolean> {
  const { standardPrincipalCV } = await clarityValues();
  const args = [
    standardPrincipalCV(contractId),
    standardPrincipalCV(voterAddress)
  ];
  
  const result: any = await callReadOnlyFunction(
    STACKSMEMER_CONTRACT_ADDRESS,
    STACKSMEMER_CONTRACT_NAME,
    'has-voted',
    args
  );

  return result?.value?.voted?.value === true;
}
