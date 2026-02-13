"use client";

import { ConnectKitButton } from "connectkit";
import { useAccount, useBalance, useSendTransaction } from "wagmi";
import { parseEther, formatUnits, type Address } from "viem";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({ address });
  const { sendTransaction, isPending, isSuccess, data: hash } = useSendTransaction();

  // --- FIX LOGIKA (MANUAL FORMAT) ---
  // Di wagmi v2, property 'formatted' sudah tidak ada
  // Kita harus format manual menggunakan formatUnits dari viem
  const displayBalance = balance 
    ? `${formatUnits(balance.value, balance.decimals).slice(0, 6)} ${balance.symbol}` 
    : "0.00 ETH";
  // ----------------------------------------

  const handlePayment = () => {
    const receiverAddress: Address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; 
    sendTransaction({
      to: receiverAddress,
      value: parseEther("0.001"), 
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 font-mono">
      <div className="p-8 bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400 underline decoration-double">
          WEB3 LOGIC TEST v1.0
        </h1>
        
        <div className="flex justify-center mb-6">
          <ConnectKitButton />
        </div>

        {isConnected && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-500 uppercase tracking-tighter">Status: Connected</p>
              <p className="text-xl font-bold text-green-400 mt-1">
                {isBalanceLoading ? "Fetching Data..." : displayBalance}
              </p>
            </div>
            
            <button
              disabled={isPending}
              onClick={handlePayment}
              className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 rounded-xl font-bold transition-all active:scale-95"
            >
              {isPending ? "Confirming..." : "Send 0.001 ETH (Sepolia)"}
            </button>

            {isSuccess && (
              <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-xs text-green-400">
                <p className="font-bold">TRANSACTION BROADCASTED</p>
                <p className="truncate mt-1">Hash: {hash}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}