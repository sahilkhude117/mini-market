"use client";

import { useEffect, useState } from "react";
import { useWalletUi } from "@wallet-ui/react";
import { referralAPI } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ReferralPage() {
  const { account } = useWalletUi();
  const publicKey = account?.address;
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<any[]>([]);
  const [inputReferralCode, setInputReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [totalFees, setTotalFees] = useState(0);

  useEffect(() => {
    if (publicKey) {
      loadReferralData();
    }
  }, [publicKey]);

  const loadReferralData = async () => {
    if (!publicKey) return;

    try {
      setLoading(true);
      const data = await referralAPI.get({
        wallet: publicKey.toString(),
        referralCode: "",
      });
      setReferralCode(data.code);
      setReferrals(data.referrals || []);
      
      // Calculate total fees
      const total = data.referrals?.reduce((sum: number, ref: any) => sum + (ref.fee || 0), 0) || 0;
      setTotalFees(total);
    } catch (error) {
      console.error("Failed to load referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseReferralCode = async () => {
    if (!publicKey || !inputReferralCode) return;

    try {
      setLoading(true);
      const data = await referralAPI.get({
        wallet: publicKey.toString(),
        referralCode: inputReferralCode,
      });
      toast.success("Referral code applied successfully!");
      setReferralCode(data.code);
      setInputReferralCode("");
    } catch (error: any) {
      console.error("Failed to apply referral code:", error);
      toast.error(error.response?.data?.error || "Invalid referral code");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!publicKey || totalFees === 0) return;

    try {
      setClaimLoading(true);
      await referralAPI.claim({
        wallet: publicKey.toString(),
        amount: totalFees,
      });
      toast.success("Rewards claimed successfully!");
      await loadReferralData();
    } catch (error) {
      console.error("Failed to claim rewards:", error);
      toast.error("Failed to claim rewards");
    } finally {
      setClaimLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied to clipboard!");
  };

  if (!publicKey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="mb-6">Please connect your wallet to access referrals</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Referral Program</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Referrals</h3>
          <p className="text-3xl font-bold">{referrals.length}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Fees Earned</h3>
          <p className="text-3xl font-bold">{totalFees.toFixed(4)} SOL</p>
          {totalFees > 0 && (
            <Button
              onClick={handleClaimRewards}
              disabled={claimLoading}
              className="mt-4 w-full"
            >
              {claimLoading ? "Claiming..." : "Claim Rewards"}
            </Button>
          )}
        </Card>
      </div>

      {/* Your Referral Code */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Your Referral Code</h2>
        <div className="flex gap-2">
          <Input value={referralCode} readOnly className="flex-1" />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Share this code with friends and earn rewards when they use the platform!
        </p>
      </Card>

      {/* Use Referral Code */}
      {!referralCode && (
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Use a Referral Code</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="referral">Enter Referral Code</Label>
              <Input
                id="referral"
                value={inputReferralCode}
                onChange={(e) => setInputReferralCode(e.target.value)}
                placeholder="Enter code..."
              />
            </div>
            <Button
              onClick={handleUseReferralCode}
              disabled={loading || !inputReferralCode}
              className="w-full"
            >
              {loading ? "Applying..." : "Apply Code"}
            </Button>
          </div>
        </Card>
      )}

      {/* Referrals List */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Referrals</h2>
        {referrals.length > 0 ? (
          <div className="space-y-3">
            {referrals.map((referral: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-mono text-sm">{referral.wallet}</p>
                  <p className="text-sm text-gray-500">
                    Fees: {referral.fee?.toFixed(4) || 0} SOL
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Level: {referral.referredLevel || 0}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No referrals yet. Start sharing your code!</p>
        )}
      </Card>

      {/* How it Works */}
      <Card className="p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="font-bold text-green-500">Level 0:</span>
            <span>Earn 0.35% (70% of 0.5%) from direct referrals' trading fees</span>
          </div>
          <div className="flex gap-3">
            <span className="font-bold text-blue-500">Level 1:</span>
            <span>Earn 0.1% (20% of 0.5%) from second-level referrals</span>
          </div>
          <div className="flex gap-3">
            <span className="font-bold text-purple-500">Level 2:</span>
            <span>Earn 0.05% (10% of 0.5%) from third-level referrals</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
