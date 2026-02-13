"use client";

import { ConnectKitButton } from "connectkit";
import { useAccount, useBalance, useSendTransaction } from "wagmi";
import { parseEther, formatUnits, type Address } from "viem";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({ address });
  const { sendTransaction, isPending, isSuccess, data: hash } = useSendTransaction();

  const displayBalance = balance 
    ? `${formatUnits(balance.value, balance.decimals).slice(0, 6)} ${balance.symbol}` 
    : "0.00 ETH";

  const handlePayment = () => {
    const receiverAddress: Address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; 
    sendTransaction({ to: receiverAddress, value: parseEther("0.001") });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800 backdrop-blur-md fixed w-full top-0 z-10">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          MY PORTFOLIO
        </div>
        <ConnectKitButton />
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
        <div className="max-w-xl w-full space-y-8">
          
          {/* HEADER */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight">
              Web3 <span className="text-blue-500">Payment</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Secure blockchain interaction demo running on Sepolia Testnet.
            </p>
          </div>

          {/* CARD */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>

            {!isConnected ? (
              <div className="text-center py-10 space-y-4">
                <div className="inline-block p-4 bg-gray-700/50 rounded-full mb-2">
                  🔒
                </div>
                <h3 className="text-xl font-bold">Wallet Disconnected</h3>
                <p className="text-gray-400">Please connect your wallet to access the dashboard.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* BALANCE DISPLAY */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-2xl border border-gray-600">
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-1">Total Balance</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-white">
                      {isBalanceLoading ? "..." : displayBalance.split(" ")[0]}
                    </span>
                    <span className="text-xl text-blue-400 font-medium">
                      {balance?.symbol}
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <button
                  disabled={isPending}
                  onClick={handlePayment}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/25"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : "Send 0.001 ETH to Vitalik"}
                </button>

                {/* SUCCESS MESSAGE */}
                {isSuccess && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start gap-3">
                    <div className="bg-green-500/20 p-2 rounded-full text-green-400">✓</div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-green-400">Transaction Successful!</p>
                      <p className="text-xs text-green-300/70 truncate mt-1 font-mono">Tx: {hash}</p>
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${hash}`}
                        target="_blank"
                        className="text-xs text-blue-400 hover:underline mt-2 block"
                      >
                        View on Explorer ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}