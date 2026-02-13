"use client";

import { ConnectKitButton } from "connectkit";
import { useAccount, useBalance, useSendTransaction, useReadContract } from "wagmi";
import { parseEther, formatUnits, type Address } from "viem";

// 1. DATA: Kamus Bahasa (ABI) - Kita cuma butuh fungsi 'balanceOf' dan 'decimals'
const usdtAbi = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
  }
] as const;

// 2. DATA: Alamat Rumah USDT di Sepolia Testnet
const usdtAddress = "0xaA8E23Fb1079EA71e0a56F48a2aAA518d3d58BDC"; 

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: ethBalance, isLoading: isEthLoading } = useBalance({ address });
  const { sendTransaction, isPending, isSuccess, data: hash } = useSendTransaction();

  // 3. LOGIC: Panggil Smart Contract untuk cek saldo USDT
  const { data: usdtRawBalance } = useReadContract({
    address: usdtAddress,
    abi: usdtAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined, // Kirim alamat user sebagai parameter
    query: { enabled: !!address }, // Cuma jalankan kalau user sudah connect
  });

  // 4. LOGIC: Format Tampilan ETH
  const displayEth = ethBalance 
    ? `${formatUnits(ethBalance.value, ethBalance.decimals).slice(0, 6)} ETH` 
    : "0.00 ETH";

  // 5. LOGIC: Format Tampilan USDT (Default decimals biasanya 6 atau 18, kita hardcode 6 utk Sepolia USDT ini)
  const displayUsdt = usdtRawBalance 
    ? `${formatUnits(usdtRawBalance, 6)} USDT`
    : "0.00 USDT";

  const handlePayment = () => {
    const receiverAddress: Address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; 
    sendTransaction({ to: receiverAddress, value: parseEther("0.001") });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <nav className="flex justify-between items-center p-6 border-b border-gray-800 backdrop-blur-md fixed w-full top-0 z-10">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          MY PORTFOLIO
        </div>
        <ConnectKitButton />
      </nav>

      <main className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
        <div className="max-w-xl w-full space-y-8">
          
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight">
              Web3 <span className="text-blue-500">Dashboard</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Multi-asset tracker running on Sepolia Testnet.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            {!isConnected ? (
              <div className="text-center py-10 space-y-4">
                <div className="inline-block p-4 bg-gray-700/50 rounded-full mb-2">🔒</div>
                <h3 className="text-xl font-bold">Wallet Disconnected</h3>
                <p className="text-gray-400">Connect wallet to view your assets.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* ASSET CARD 1: ETH */}
                <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-700 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Native Token</p>
                    <p className="text-2xl font-bold text-white mt-1">{isEthLoading ? "..." : displayEth}</p>
                  </div>
                  <div className="bg-blue-900/30 p-2 rounded-lg text-blue-400 font-bold">ETH</div>
                </div>

                {/* ASSET CARD 2: USDT (NEW) */}
                <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-700 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Tether USD</p>
                    <p className="text-2xl font-bold text-green-400 mt-1">{displayUsdt}</p>
                  </div>
                  <div className="bg-green-900/30 p-2 rounded-lg text-green-400 font-bold">USDT</div>
                </div>

                <div className="h-px bg-gray-700 my-4"></div>

                <button
                  disabled={isPending}
                  onClick={handlePayment}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25"
                >
                  {isPending ? "Processing..." : "Test Transaction (Send ETH)"}
                </button>

                {isSuccess && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <p className="font-bold text-green-400">✓ Transaction Sent!</p>
                    <p className="text-xs text-green-300/70 truncate mt-1">Tx: {hash}</p>
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