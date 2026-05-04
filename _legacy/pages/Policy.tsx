import React, { useEffect, useState } from 'react';
import { getPolicies } from '../services/mockDatabase';
import { Policy as PolicyType } from '../types';

interface PolicyProps {
  policyId: string;
}

const Policy: React.FC<PolicyProps> = ({ policyId }) => {
  const [policy, setPolicy] = useState<PolicyType | null>(null);

  useEffect(() => {
    getPolicies().then(policies => {
      const found = policies.find(p => p.id === policyId);
      setPolicy(found || null);
    });
  }, [policyId]);

  if (!policy) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <p className="text-gray-500">Document niet gevonden.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{policy.title}</h1>
        <p className="text-sm text-gray-400 mb-12">Laatst bijgewerkt: {policy.lastUpdated}</p>
        
        <div className="prose prose-lg prose-gray max-w-none whitespace-pre-line">
           {policy.content}
        </div>
      </div>
    </div>
  );
};

export default Policy;