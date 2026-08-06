import React from 'react';
import { AuditTimelineList } from '@/components/audit/AuditTimelineList';

export const AuditTrail: React.FC = () => {
  return (
    <div className="py-2">
      <AuditTimelineList />
    </div>
  );
};
