import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PurchaseRequest, Quotation, VendorProfile, AuditLog } from '@/types';
import { INITIAL_REQUESTS, INITIAL_QUOTATIONS, MOCK_VENDORS, MOCK_AUDIT_LOGS } from '@/mock/mockData';
import axios from 'axios';

interface ProcurementContextType {
  requests: PurchaseRequest[];
  quotations: Quotation[];
  vendors: VendorProfile[];
  auditLogs: AuditLog[];
  activeRequest: PurchaseRequest | null;
  setActiveRequest: (req: PurchaseRequest | null) => void;
  addRequest: (req: Omit<PurchaseRequest, 'id' | 'numQuotations' | 'updatedAt'>) => string;
  editRequest: (id: string, updated: Partial<PurchaseRequest>) => void;
  deleteRequest: (id: string) => void;
  addQuotation: (quote: Quotation) => void;
  deleteQuotation: (id: string) => void;
  updateQuotation: (id: string, updated: Partial<Quotation>) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

export const ProcurementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<PurchaseRequest[]>(INITIAL_REQUESTS);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [vendors] = useState<VendorProfile[]>(MOCK_VENDORS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [activeRequest, setActiveRequestState] = useState<PurchaseRequest | null>(null);

  useEffect(() => {
    // Initial fetch from fastapi if active
    axios.get('http://localhost:8000/purchase-requests')
      .then((res) => {
        if (res.data) setRequests(res.data);
      })
      .catch(() => {});

    axios.get('http://localhost:8000/audit-trail')
      .then((res) => {
        if (res.data) setAuditLogs(res.data);
      })
      .catch(() => {});
  }, []);

  const setActiveRequest = (req: PurchaseRequest | null) => {
    setActiveRequestState(req);
  };

  const addRequest = (req: Omit<PurchaseRequest, 'id' | 'numQuotations' | 'updatedAt'>): string => {
    const newId = `PR-${Math.floor(2000 + Math.random() * 100)}`;
    const newRequest: PurchaseRequest = {
      ...req,
      id: newId,
      numQuotations: 0,
      updatedAt: 'Just now',
    };
    setRequests((prev) => [newRequest, ...prev]);
    
    axios.post('http://localhost:8000/purchase-requests', req)
      .then((res) => {
        if (res.data) {
          setRequests((prev) => prev.map((r) => r.id === newId ? res.data : r));
        }
      })
      .catch(() => {});

    addAuditLog({
      agent: req.officer,
      action: 'Create Purchase Request',
      decision: `${newId} Initialized`,
      reason: `Requisition created for department ${req.department} with budget $${req.budget.toLocaleString()}`,
      status: 'Completed',
      requestId: newId
    });

    return newId;
  };

  const editRequest = (id: string, updated: Partial<PurchaseRequest>) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, ...updated, updatedAt: 'Just now' } : req))
    );
    if (activeRequest?.id === id) {
      setActiveRequestState((prev) => (prev ? { ...prev, ...updated } : null));
    }

    addAuditLog({
      agent: updated.officer || 'Sarah Jenkins',
      action: 'Edit Purchase Request',
      decision: `${id} Modified`,
      reason: 'Updated requisition parameters and target delivery date',
      status: 'Completed',
      requestId: id
    });
  };

  const deleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
    setQuotations((prev) => prev.filter((q) => q.requestId !== id));
    if (activeRequest?.id === id) {
      setActiveRequestState(null);
    }

    addAuditLog({
      agent: 'Sarah Jenkins',
      action: 'Delete Purchase Request',
      decision: `${id} Deleted`,
      reason: 'Removed requisition and associated documents',
      status: 'Completed',
      requestId: id
    });
  };

  const addQuotation = (quote: Quotation) => {
    setQuotations((prev) => [quote, ...prev]);
    // Increment quotation count on the associated request
    setRequests((prev) =>
      prev.map((req) =>
        req.id === quote.requestId
          ? { ...req, numQuotations: req.numQuotations + 1, updatedAt: 'Just now' }
          : req
      )
    );

    addAuditLog({
      agent: 'Extraction-Agent',
      action: 'Quotation Processed',
      decision: `Parsed ${quote.quoteNumber}`,
      reason: `Extracted ${quote.vendorName} quotation with ${quote.confidence}% confidence`,
      status: 'Completed',
      vendor: quote.vendorName,
      requestId: quote.requestId
    });
  };

  const deleteQuotation = (id: string) => {
    const quote = quotations.find((q) => q.id === id);
    if (!quote) return;
    setQuotations((prev) => prev.filter((q) => q.id !== id));
    setRequests((prev) =>
      prev.map((req) =>
        req.id === quote.requestId
          ? { ...req, numQuotations: Math.max(0, req.numQuotations - 1), updatedAt: 'Just now' }
          : req
      )
    );

    addAuditLog({
      agent: 'Sarah Jenkins',
      action: 'Delete Quotation',
      decision: `Deleted ${quote.quoteNumber}`,
      reason: 'Removed quotation reference from library',
      status: 'Completed',
      vendor: quote.vendorName,
      requestId: quote.requestId
    });
  };

  const updateQuotation = (id: string, updated: Partial<Quotation>) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
    );
  };

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newId = `AUD-${Math.floor(100 + Math.random() * 900)}`;
    const newLog: AuditLog = {
      ...log,
      id: newId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <ProcurementContext.Provider
      value={{
        requests,
        quotations,
        vendors,
        auditLogs,
        activeRequest,
        setActiveRequest,
        addRequest,
        editRequest,
        deleteRequest,
        addQuotation,
        deleteQuotation,
        updateQuotation,
        addAuditLog,
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
};
