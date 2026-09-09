import React, { useState, useEffect } from 'react';
import { voucherApi } from '../../api/voucherApi';
import SearchFilterBar from '../../components/SearchFilterBar';
import VoucherTable from '../../components/VoucherTable';

export default function AccountsVoucherList() {
  const [vouchers, setVouchers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    department: '',
    amountMin: '',
    amountMax: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    fetchVouchers();
  }, [filters]);

  const fetchVouchers = async () => {
    try {
      setIsLoading(true);
      const res = await voucherApi.list(filters);
      setVouchers(res.data.vouchers);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to load accounts vouchers list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      category: '',
      department: '',
      amountMin: '',
      amountMax: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    });
  };

  return (
    <div className="page-shell">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight">
          Accounts & finance records
        </h1>
        <p className="text-sm text-ink-500 mt-1">
          Company-wide ledger of expense vouchers across departments and statuses.
        </p>
      </div>

      <SearchFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      <VoucherTable
        vouchers={vouchers}
        pagination={pagination}
        isLoading={isLoading}
        userRole="ACCOUNTS"
        onPageChange={(page) => setFilters({ ...filters, page })}
      />
    </div>
  );
}
