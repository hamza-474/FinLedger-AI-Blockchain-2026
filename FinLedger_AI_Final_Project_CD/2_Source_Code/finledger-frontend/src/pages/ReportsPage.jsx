import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMonthlyReport, getYearlyReport, exportTransactions } from '../api/reportApi';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import StatCard from '../components/dashboard/StatCard';
import LineChart from '../components/reports/LineChart';
import BarChart from '../components/reports/BarChart';
import DoughnutChart from '../components/reports/DoughnutChart';
import toast from 'react-hot-toast';
import { Calendar, Download, PieChart, TrendingUp, BarChart2, DownloadCloud, ClipboardCopy, ListOrdered } from 'lucide-react';
import useTitle from '../hooks/useTitle';

const ReportsPage = () => {
  useTitle('Financial Reports');

  const [activeTab, setActiveTab] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const tabs = [
    { id: 'monthly', label: 'Monthly Report', icon: PieChart },
    { id: 'yearly', label: 'Yearly Report', icon: TrendingUp },
    { id: 'export', label: 'Data Export', icon: DownloadCloud }
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-accent/20 text-accent rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <BarChart2 size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Financial Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">Deep dive analytics, charts, and data exports</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 border-b border-dark-border pb-px custom-scrollbar shrink-0">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${isActive
                ? 'border-accent text-accent bg-accent/10 rounded-t-lg'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-dark-border/50 rounded-t-lg'
                }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {activeTab === 'monthly' && <MonthlyTab month={selectedMonth} setMonth={setSelectedMonth} />}
        {activeTab === 'yearly' && <YearlyTab year={selectedYear} setYear={setSelectedYear} />}
        {activeTab === 'export' && <ExportTab />}
      </div>
    </div>
  );
};

// --- TAB COMPONENTS ---

const MonthlyTab = ({ month, setMonth }) => {
  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['report-monthly', month],
    queryFn: () => getMonthlyReport(month)
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const data = response?.data || {};

  // Format Doughnut Data
  const expensesByCategory = data.expensesByCategory || [];
  const doughnutData = {
    labels: expensesByCategory.map(item => item._id),
    datasets: [{
      data: expensesByCategory.map(item => item.total),
      backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'],
      borderColor: '#1e293b',
      borderWidth: 2
    }]
  };

  // Format Bar Data (Income vs Expense)
  const barData = {
    labels: ['Cash Flow'],
    datasets: [
      { label: 'Income', data: [data.totalIncome || 0], backgroundColor: '#10b981', borderRadius: 6 },
      { label: 'Expenses', data: [data.totalExpenses || 0], backgroundColor: '#ef4444', borderRadius: 6 }
    ]
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex justify-between items-center bg-dark-card p-5 rounded-xl border border-dark-border shadow-lg">
        <h2 className="text-lg font-bold text-white flex items-center gap-3"><Calendar size={22} className="text-accent" /> Select Target Month</h2>
        <input
          type="month"
          className="input w-auto text-sm bg-dark-bg border-accent/30 focus:border-accent"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Income" value={data.totalIncome || 0} variant="green" />
        <StatCard title="Total Expenses" value={data.totalExpenses || 0} variant="red" />
        <StatCard title="Net Balance" value={data.balance || 0} variant="blue" />
        <StatCard title="Total Transactions" value={data.transactionCount || 0} variant="blue" isCurrency={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card h-96 flex flex-col border-dark-border/50">
          <h3 className="font-bold text-white mb-6 text-lg tracking-wide">Expenses by Category</h3>
          <div className="flex-1 relative pb-4">
            {expensesByCategory.length > 0 ? (
              <DoughnutChart data={doughnutData} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-dark-bg/50 rounded-xl border border-dashed border-dark-border">
                <PieChart size={40} className="opacity-20 mb-2" />
                <p>No expenses recorded</p>
              </div>
            )}
          </div>
        </div>

        <div className="card h-96 flex flex-col border-dark-border/50">
          <h3 className="font-bold text-white mb-6 text-lg tracking-wide">Income vs Expenses</h3>
          <div className="flex-1 relative pb-4">
            <BarChart data={barData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card border-dark-border/50">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-lg tracking-wide"><ListOrdered size={20} className="text-accent" /> Top 5 Expenses</h3>
          <div className="space-y-4">
            {(data.topExpenses || []).length === 0 && <div className="text-gray-500 text-center py-10 bg-dark-bg/50 rounded-xl border border-dashed border-dark-border">No top expenses to display</div>}
            {(data.topExpenses || []).map((exp, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-dark-bg rounded-xl border border-dark-border hover:border-accent/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-gray-400 font-black text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-white text-[15px]">{exp.title}</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5"><span className="text-accent">{exp.category}</span> • {new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="font-black text-red-400 text-lg">-PKR {exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card border-dark-border/50">
          <h3 className="font-bold text-white mb-6 text-lg tracking-wide">Budget Utilization</h3>
          <div className="space-y-6">
            {(data.budgetStatus || []).length === 0 && <div className="text-gray-500 text-center py-10 bg-dark-bg/50 rounded-xl border border-dashed border-dark-border">No budgets set</div>}
            {(data.budgetStatus || []).map((budget, idx) => {
              const percent = Math.min((budget.spentAmount / budget.limitAmount) * 100, 100);
              const color = percent >= 100 ? 'bg-red-500' : percent >= 80 ? 'bg-yellow-500' : 'bg-emerald-500';
              return (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-200 tracking-wide">{budget.category}</span>
                    <span className="text-gray-400 font-medium font-mono">PKR {budget.spentAmount.toLocaleString()} <span className="opacity-50">/</span> PKR {budget.limitAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 bg-dark-bg rounded-full overflow-hidden border border-dark-border/50">
                    <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const YearlyTab = ({ year, setYear }) => {
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['report-yearly', year],
    queryFn: () => getYearlyReport(year)
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const yearlyData = response?.data || [];

  const labels = yearlyData.map(d => d.month);

  const barData = {
    labels,
    datasets: [
      { label: 'Income', data: yearlyData.map(d => d.income), backgroundColor: '#10b981', borderRadius: 4 },
      { label: 'Expenses', data: yearlyData.map(d => d.expenses), backgroundColor: '#ef4444', borderRadius: 4 }
    ]
  };

  let cumulative = 0;
  const lineData = {
    labels,
    datasets: [
      {
        label: 'Running Balance',
        data: yearlyData.map(d => { cumulative += d.balance; return cumulative; }),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1e293b',
        pointBorderColor: '#6366f1',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex justify-between items-center bg-dark-card p-5 rounded-xl border border-dark-border shadow-lg">
        <h2 className="text-lg font-bold text-white flex items-center gap-3"><Calendar size={22} className="text-accent" /> Select Target Year</h2>
        <select
          className="input w-auto text-sm bg-dark-bg border-accent/30 focus:border-accent"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="card h-[450px] flex flex-col border-dark-border/50">
        <h3 className="font-bold text-white mb-6 text-lg tracking-wide">Monthly Income vs Expenses</h3>
        <div className="flex-1 relative pb-4">
          <BarChart data={barData} />
        </div>
      </div>

      <div className="card h-[450px] flex flex-col border-dark-border/50">
        <h3 className="font-bold text-white mb-6 text-lg tracking-wide">Cumulative Net Balance Projection</h3>
        <div className="flex-1 relative pb-4">
          <LineChart data={lineData} />
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-dark-border/50 shadow-xl">
        <div className="p-5 border-b border-dark-border bg-dark-bg/50">
          <h3 className="font-bold text-white text-lg tracking-wide">Annual Data Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-dark-bg/80 border-b border-dark-border text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-bold">Month</th>
                <th className="px-6 py-4 font-bold text-right">Income</th>
                <th className="px-6 py-4 font-bold text-right">Expenses</th>
                <th className="px-6 py-4 font-bold text-right">Net Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {yearlyData.map((d, idx) => (
                <tr key={idx} className="hover:bg-dark-bg/50 transition-colors">
                  <td className="px-6 py-4 text-[15px] font-bold text-white">{d.month}</td>
                  <td className="px-6 py-4 text-[15px] font-black text-emerald-400 text-right">+PKR {d.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 text-[15px] font-black text-red-400 text-right">-PKR {d.expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className={`px-6 py-4 text-[15px] font-black text-right bg-dark-bg/30 ${d.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    PKR {d.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ExportTab = () => {
  const [filters, setFilters] = useState({ month: new Date().toISOString().slice(0, 7), type: '', category: '' });

  const categories = ['Salary', 'Rent', 'Equipment', 'Revenue', 'Utilities', 'Software', 'Other'];

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['export-preview', filters],
    queryFn: () => exportTransactions(filters)
  });

  const previewData = response?.data || [];

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(previewData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `finledger_export_${filters.month}.json`);
    dlAnchorElem.click();
    toast.success('JSON file downloaded successfully!');
  };

  const handleDownloadCSV = () => {
    if (previewData.length === 0) return;

    const headers = ['Title', 'Amount', 'Type', 'Category', 'Description', 'Date', 'Block Index', 'Block Hash'];
    const csvRows = [
      headers.join(','),
      ...previewData.map(item => [
        `"${item.title.replace(/"/g, '""')}"`,
        item.amount,
        item.type,
        `"${item.category.replace(/"/g, '""')}"`,
        `"${(item.description || '').replace(/"/g, '""')}"`,
        new Date(item.date).toLocaleDateString(),
        item.blockIndex || '',
        item.blockHash || ''
      ].join(','))
    ];

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join('\n'));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", csvContent);
    dlAnchorElem.setAttribute("download", `finledger_export_${filters.month}.csv`);
    dlAnchorElem.click();
    toast.success('CSV file downloaded successfully!');
  };

  const handleDownloadPDF = () => {
    if (previewData.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to export PDF');
      return;
    }

    const totalIncome = previewData.filter(d => d.type === 'income').reduce((sum, d) => sum + d.amount, 0);
    const totalExpense = previewData.filter(d => d.type === 'expense').reduce((sum, d) => sum + d.amount, 0);
    const netBalance = totalIncome - totalExpense;

    const tableRows = previewData.map(item => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-weight: bold; color: #1e293b;">${item.title}</td>
        <td style="padding: 10px; text-transform: uppercase; font-size: 11px;">
          <span style="padding: 2px 6px; border-radius: 4px; font-weight: bold; ${item.type === 'income' ? 'background: #d1fae5; color: #065f46;' : 'background: #fee2e2; color: #991b1b;'}">
            ${item.type}
          </span>
        </td>
        <td style="padding: 10px; color: #475569;">${item.category}</td>
        <td style="padding: 10px; font-family: monospace; color: #475569;">${new Date(item.date).toLocaleDateString()}</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; ${item.type === 'income' ? 'color: #10b981;' : 'color: #ef4444;'}">
          PKR ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>FinLedger AI - Financial Statement</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155; margin: 40px; line-height: 1.5; }
            .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: 900; color: #4f46e5; letter-spacing: -1px; }
            .meta-info { text-align: right; font-size: 13px; color: #64748b; }
            .title { font-size: 20px; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; color: #1e293b; text-align: center; }
            
            .summary-cards { display: grid; grid-template-cols: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: center; }
            .card-label { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b; letter-spacing: 0.5px; }
            .card-value { font-size: 18px; font-weight: 800; margin-top: 5px; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 50px; font-size: 13px; }
            th { background: #f1f5f9; padding: 12px 10px; text-align: left; font-weight: bold; color: #475569; border-bottom: 2px solid #cbd5e1; }
            
            .footer { border-top: 1px solid #e2e8f0; padding-top: 30px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; margin-top: 50px; }
            .signatures { display: flex; justify-content: space-between; margin-top: 60px; font-size: 13px; }
            .sig-box { width: 200px; border-top: 1px solid #475569; text-align: center; padding-top: 5px; }
            
            @media print {
              body { margin: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div>
              <div class="logo">FINLEDGER AI</div>
              <div style="font-size: 12px; color: #64748b; font-weight: bold;">Blockchain-Enabled Audit Ledger</div>
            </div>
            <div class="meta-info">
              <div><strong>Generated Date:</strong> ${new Date().toLocaleDateString()}</div>
              <div><strong>Target Month:</strong> ${filters.month || 'All History'}</div>
              <div><strong>Organization ID:</strong> ${previewData[0]?.organization || 'N/A'}</div>
            </div>
          </div>
          
          <div class="title">Official Financial Audit Report</div>
          
          <div class="summary-cards">
            <div class="card" style="border-left: 4px solid #10b981;">
              <div class="card-label">Total Inflow (Income)</div>
              <div class="card-value" style="color: #059669;">PKR ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="card" style="border-left: 4px solid #ef4444;">
              <div class="card-label">Total Outflow (Expenses)</div>
              <div class="card-value" style="color: #dc2626;">PKR ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="card" style="border-left: 4px solid #6366f1;">
              <div class="card-label">Net Balance</div>
              <div class="card-value" style="color: #4f46e5;">PKR ${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th style="padding: 10px;">Transaction Title</th>
                <th style="padding: 10px;">Type</th>
                <th style="padding: 10px;">Category</th>
                <th style="padding: 10px;">Date</th>
                <th style="padding: 10px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          
          <div class="signatures">
            <div class="sig-box">Auditor Signature</div>
            <div class="sig-box">Financial Manager</div>
          </div>
          
          <div class="footer">
            <div>Verification: <strong>SECURED BY CRYPTOGRAPHIC BLOCKCHAIN LEDGER</strong></div>
            <div>Page 1 of 1</div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    toast.success('Print-ready PDF layout opened!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(previewData, null, 2));
    toast.success('JSON payload copied to clipboard!');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="card p-8 border-2 border-accent/20 shadow-[0_0_30px_rgba(99,102,241,0.05)] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-dark-card to-dark-bg">
        <h2 className="text-2xl font-black text-white mb-6 tracking-wide">Export Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Select Month</label>
            <input
              type="month"
              className="input w-full bg-dark-bg border-dark-border"
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Transaction Type</label>
            <select
              className="input w-full bg-dark-bg border-dark-border"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Category</label>
            <select
              className="input w-full bg-dark-bg border-dark-border"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-6 border-t border-dark-border">
          <button
            onClick={handleDownload}
            disabled={previewData.length === 0}
            className="btn-primary flex items-center gap-2 px-6 py-3 font-bold text-[14px]"
          >
            <Download size={18} /> Export to JSON
          </button>
          <button
            onClick={handleDownloadCSV}
            disabled={previewData.length === 0}
            className="btn-primary bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-white flex items-center gap-2 px-6 py-3 font-bold text-[14px]"
          >
            <Download size={18} /> Export to CSV
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={previewData.length === 0}
            className="btn-primary bg-rose-600 hover:bg-rose-700 border-rose-500 text-white flex items-center gap-2 px-6 py-3 font-bold text-[14px]"
          >
            <Download size={18} /> Export to PDF
          </button>
          <button
            onClick={handleCopy}
            disabled={previewData.length === 0}
            className="px-5 py-3 bg-dark-bg border border-dark-border text-white font-bold text-[14px] rounded-xl hover:bg-dark-border hover:text-accent transition-all flex items-center gap-2"
          >
            <ClipboardCopy size={18} /> Copy JSON
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-dark-border/50 shadow-xl">
        <div className="p-5 border-b border-dark-border bg-dark-bg/50 flex justify-between items-center">
          <h3 className="font-bold text-white text-lg tracking-wide">Data Preview</h3>
          <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent rounded-md text-xs font-bold uppercase tracking-wider">{previewData.length} records found</span>
        </div>
        <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
          {isLoading ? (
            <div className="p-16 text-center text-gray-500 flex flex-col items-center">
              <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4"></span>
              Loading preview data...
            </div>
          ) : previewData.length === 0 ? (
            <div className="p-16 text-center text-gray-500 bg-dark-bg/30">No records match the current filters</div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 bg-dark-bg z-10 shadow-md">
                <tr className="border-b border-dark-border text-[11px] uppercase tracking-widest text-gray-400 font-black">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Block Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {previewData.map((d, idx) => (
                  <tr key={idx} className="hover:bg-dark-bg/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{d.title}</td>
                    <td className={`px-6 py-4 text-sm font-black ${d.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      PKR {d.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded border ${d.type === 'income' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' : 'text-red-400 border-red-400/20 bg-red-400/10'}`}>
                        {d.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">{new Date(d.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500 truncate max-w-[150px]">{d.blockHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
