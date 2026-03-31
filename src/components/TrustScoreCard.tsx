import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, AlertTriangle, XCircle, Phone, MapPin, Mail, Store, CreditCard, Loader2 } from 'lucide-react';
import { apiService } from '../services/apiService';

interface TrustScoreProps {
  artisanId: string;
  compact?: boolean;
}

interface TrustData {
  artisanId: string;
  shopName: string;
  ownerName: string;
  verified: boolean;
  trustScore: {
    score: number;
    level: string;
    fraudRisk: string;
    paymentRecommendation: string;
    verification: {
      phone: boolean;
      email: boolean;
      location: boolean;
      shop: boolean;
      socialPresence: string;
    };
    profileCompleteness: number;
    pricingRealism: number;
    productConsistency: number;
    aiAnalysis: string;
    lastAnalyzed: string;
  };
}

const levelConfig: Record<string, { color: string; bg: string; label: string; icon: any }> = {
  HIGHLY_TRUSTED: { color: 'text-green-700', bg: 'bg-green-50 border-green-200', label: 'Highly Trusted', icon: CheckCircle2 },
  TRUSTED: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', label: 'Trusted Seller', icon: Shield },
  MODERATE: { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', label: 'Under Review', icon: AlertTriangle },
  RISKY: { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', label: 'Risky Seller', icon: AlertTriangle },
  HIGH_RISK: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', label: 'High Risk', icon: XCircle },
};

const paymentConfig: Record<string, { badge: string; color: string; message: string }> = {
  DIRECT: { badge: '🟢 Safe to Pay Directly', color: 'text-green-700 bg-green-50', message: 'This seller is highly trusted.' },
  ESCROW: { badge: '🟡 Escrow Recommended', color: 'text-yellow-700 bg-yellow-50', message: 'Platform escrow adds protection.' },
  COD: { badge: '🔴 COD Recommended', color: 'text-red-700 bg-red-50', message: 'Cash on Delivery is recommended.' },
};

// Compact badge for product cards
export const TrustBadge: React.FC<{ score: number; level: string; verified: boolean }> = ({ score, level, verified }) => {
  const config = levelConfig[level] || levelConfig.MODERATE;

  return (
    <div className={`inline-flex items-center space-x-1.5 px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}>
      {verified ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <Shield className="h-3 w-3" />
      )}
      <span>{score}/100</span>
    </div>
  );
};

// Full trust score card for product detail modal
const TrustScoreCard: React.FC<TrustScoreProps> = ({ artisanId, compact = false }) => {
  const [trustData, setTrustData] = useState<TrustData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrust = async () => {
      try {
        const data = await apiService.getTrustScore(artisanId);
        setTrustData(data);
      } catch {
        // Trust data not available yet
      } finally {
        setLoading(false);
      }
    };
    if (artisanId) fetchTrust();
  }, [artisanId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Checking trust score...
      </div>
    );
  }

  if (!trustData || !trustData.trustScore || trustData.trustScore.score === 0) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <Shield className="h-5 w-5" />
          <span className="text-sm">Trust score not yet analyzed</span>
        </div>
      </div>
    );
  }

  const ts = trustData.trustScore;
  const config = levelConfig[ts.level] || levelConfig.MODERATE;
  const Icon = config.icon;
  const payment = paymentConfig[ts.paymentRecommendation] || paymentConfig.ESCROW;

  // Score ring progress
  const circumference = 2 * Math.PI * 36;
  const progress = (ts.score / 100) * circumference;
  const scoreColor = ts.score >= 70 ? '#22c55e' : ts.score >= 50 ? '#eab308' : '#ef4444';

  if (compact) {
    return <TrustBadge score={ts.score} level={ts.level} verified={trustData.verified} />;
  }

  return (
    <div className={`rounded-xl border p-5 space-y-4 ${config.bg}`}>
      {/* Header with score ring */}
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="36" fill="none"
              stroke={scoreColor} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" style={{ color: scoreColor }}>{ts.score}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Icon className={`h-5 w-5 ${config.color}`} />
            <span className={`font-semibold ${config.color}`}>{config.label}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {trustData.verified ? '✅ Verified Artisan' : '⏳ Verification Pending'}
          </p>
        </div>
      </div>

      {/* Verification checks */}
      <div className="grid grid-cols-2 gap-2">
        <VerifyItem icon={Phone} label="Phone" verified={ts.verification?.phone} />
        <VerifyItem icon={Mail} label="Email" verified={ts.verification?.email} />
        <VerifyItem icon={MapPin} label="Location" verified={ts.verification?.location} />
        <VerifyItem icon={Store} label="Shop Exists" verified={ts.verification?.shop} />
      </div>

      {/* Payment safety */}
      <div className={`flex items-center space-x-2 p-3 rounded-lg ${payment.color}`}>
        <CreditCard className="h-4 w-4 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">{payment.badge}</p>
          <p className="text-xs opacity-80">{payment.message}</p>
        </div>
      </div>

      {/* AI analysis summary — fully displayed */}
      {ts.aiAnalysis && (
        <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
            🧠 AI Trust Analysis Report
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {ts.aiAnalysis}
          </p>
        </div>
      )}

      {/* Detailed Scores */}
      <div className="p-4 bg-white/40 dark:bg-gray-800/40 rounded-lg space-y-3">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">📊 Detailed Scores</p>

        <ScoreBar label="Profile Completeness" value={ts.profileCompleteness} />
        <ScoreBar label="Pricing Realism" value={ts.pricingRealism ?? 50} />
        <ScoreBar label="Product Consistency" value={ts.productConsistency ?? 50} />

        {ts.verification?.socialPresence && ts.verification.socialPresence !== 'NONE' && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Social Presence</span>
            <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
              ts.verification.socialPresence === 'HIGH' ? 'bg-green-100 text-green-700' :
              ts.verification.socialPresence === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {ts.verification.socialPresence}
            </span>
          </div>
        )}

        {ts.lastAnalyzed && (
          <p className="text-xs text-gray-400 mt-2">
            Last analyzed: {new Date(ts.lastAnalyzed).toLocaleString()}
          </p>
        )}
      </div>

      {/* Fraud warning */}
      {ts.fraudRisk === 'HIGH' && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-800 dark:text-red-300 font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1.5" />
            ⚠️ This seller is under verification. Payment protection recommended.
          </p>
        </div>
      )}

      {ts.fraudRisk === 'MEDIUM' && (
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1.5" />
            ⚠️ Moderate risk detected. Platform escrow is recommended for safe transactions.
          </p>
        </div>
      )}
    </div>
  );
};

const VerifyItem: React.FC<{ icon: any; label: string; verified?: boolean }> = ({ icon: Icon, label, verified }) => (
  <div className={`flex items-center space-x-2 text-sm px-2 py-1.5 rounded-lg ${verified ? 'text-green-700 bg-green-50/50' : 'text-gray-400 bg-gray-100/50'}`}>
    <Icon className="h-3.5 w-3.5" />
    <span>{label}</span>
    {verified ? <CheckCircle2 className="h-3 w-3 ml-auto" /> : <XCircle className="h-3 w-3 ml-auto opacity-40" />}
  </div>
);

const ScoreBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  const barColor = value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-800 dark:text-gray-200">{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
};

export default TrustScoreCard;
