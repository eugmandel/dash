import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

// Helper function to generate realistic names (unchanged)
const generateName = () => {
  const firstNames = ["John", "Emma", "Michael", "Sophia", "William", "Olivia", "James", "Ava", "Benjamin", "Isabella", "Daniel", "Mia", "Alexander", "Charlotte", "David", "Amelia", "Joseph", "Harper", "Andrew", "Evelyn"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

// Helper function to generate realistic account names (unchanged)
const generateAccountName = () => {
  const businessTypes = [
    "Dental Clinic", "Recruiting Agency", "Law Firm", "Design Studio", "Consulting Group",
    "Marketing Agency", "IT Solutions", "Accounting Firm", "Real Estate Agency", "Fitness Center",
    "Coffee Shop", "Bakery", "Restaurant", "Bookstore", "Pharmacy",
    "Auto Repair Shop", "Photography Studio", "Yoga Studio", "Pet Grooming", "Landscaping Service"
  ];
  const adjectives = ["Premier", "Elite", "Innovative", "Trusted", "Advanced", "Creative", "Professional", "Reliable", "Expert", "Precision"];
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
  
  const type = businessTypes[Math.floor(Math.random() * businessTypes.length)];
  const adj = Math.random() > 0.2 ? `${adjectives[Math.floor(Math.random() * adjectives.length)]} ` : "";
  const city = Math.random() > 0.3 ? ` of ${cities[Math.floor(Math.random() * cities.length)]}` : "";
  
  return `${adj}${type}${city}`;
};

// New helper function to generate UID
const generateUID = () => {
  const length = Math.floor(Math.random() * 3) + 8; // Random length between 8 and 10
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
};

// Mock data generator (updated to include UID)
const generateAccountData = (weeks, isActive) => {
  let exUsers = Math.floor(Math.random() * 10) + 5;
  let purchasedLicenses = Math.floor(Math.random() * 1) + 1;

  return Array.from({ length: weeks }, (_, i) => {
    exUsers += Math.floor(Math.random() * 5) - 1;
    purchasedLicenses += Math.floor(Math.random() * 10) - 3;

    exUsers = Math.min(exUsers, 5);
    exUsers = Math.max(exUsers, 0);
    purchasedLicenses = Math.min(purchasedLicenses, 10);
    purchasedLicenses = Math.max(purchasedLicenses, 0);

    return {
      week: `Week ${i + 1}`,
      exUsers,
      purchasedLicenses,
      assignedLicenses: isActive ? Math.floor(Math.random() * purchasedLicenses) : 0,
      recordingsProcessed: isActive ? Math.floor(Math.random() * 1000) + 500 : 0,
      loggedInUsers: isActive ? Math.floor(Math.random() * exUsers) : 0,
      recordingInteractions: isActive ? Math.floor(Math.random() * 500) + 100 : 0,
    };
  });
};

const generateAccounts = (numAccounts) => {
  return Array.from({ length: numAccounts }, (_, i) => {
    const isActive = Math.random() > 0.3;
    return {
      id: i + 1,
      name: generateAccountName(),
      uid: generateUID(),
      csm: generateName(),
      data: generateAccountData(52, isActive),
    };
  });
};

const metricGroups = {
  licenses: {
    metrics: ['purchasedLicenses', 'assignedLicenses'],
    color: '#007bff',
    label: 'Licenses'
  },
  exUsers: {
    metrics: ['exUsers'],
    color: '#28a745',
    label: 'EX Users'
  },
  recordingsProcessed: {
    metrics: ['recordingsProcessed'],
    color: '#17a2b8',
    label: 'Recordings Processed'
  },
  loggedInUsers: {
    metrics: ['loggedInUsers'],
    color: '#dc3545',
    label: 'Logged In Users'
  },
  recordingInteractions: {
    metrics: ['recordingInteractions'],
    color: '#6610f2',
    label: 'Recording Interactions'
  }
};

const metricNames = {
  exUsers: 'EX users with >100 calls a month',
  purchasedLicenses: 'Purchased Licenses',
  assignedLicenses: 'Assigned Licenses',
  recordingsProcessed: 'Recordings Processed',
  loggedInUsers: 'Logged In Users',
  recordingInteractions: 'Recording Interactions'
};

const MetricSelector = ({ selectedMetrics, setSelectedMetrics }) => {
  const toggleMetric = (metric) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric) 
        : [...prev, metric]
    );
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Select Metrics</h5>
        <div className="d-flex flex-wrap gap-2">
          {Object.entries(metricNames).map(([key, name]) => (
            <div key={key} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`metric-${key}`}
                checked={selectedMetrics.includes(key)}
                onChange={() => toggleMetric(key)}
              />
              <label className="form-check-label" htmlFor={`metric-${key}`}>
                {name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MultiAxisLineChart = ({ data, selectedMetrics }) => {
  const [activeMetrics, setActiveMetrics] = useState(selectedMetrics);

  useEffect(() => {
    setActiveMetrics(selectedMetrics);
  }, [selectedMetrics]);

  const toggleMetric = (metric) => {
    setActiveMetrics(prev =>
      prev.includes(metric) ? prev.filter(m => m !== metric) : [...prev, metric]
    );
  };

  const visibleGroups = Object.entries(metricGroups).filter(([_, group]) =>
    group.metrics.some(metric => activeMetrics.includes(metric))
  );

  return (
    <div>
      <div className="mb-3">
        {Object.entries(metricNames).map(([metric, name]) => (
          <button
            key={metric}
            className={`btn btn-sm me-2 mb-2 ${activeMetrics.includes(metric) ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => toggleMetric(metric)}
          >
            {name}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <Tooltip />
          <Legend />
          {visibleGroups.map(([groupKey, group], index) => (
            <YAxis
              key={groupKey}
              yAxisId={groupKey}
              orientation={index % 2 === 0 ? "left" : "right"}
              stroke={group.color}
            >
              <Label
                value={group.label}
                angle={-90}
                position={index % 2 === 0 ? "insideLeft" : "insideRight"}
                style={{ textAnchor: 'middle' }}
              />
            </YAxis>
          ))}
          {visibleGroups.map(([groupKey, group]) =>
            group.metrics.filter(metric => activeMetrics.includes(metric)).map(metric => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                name={metricNames[metric]}
                stroke={group.color}
                yAxisId={groupKey}
                dot={false}
              />
            ))
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [activeTab, setActiveTab] = useState('currentWeek');
  const [selectedMetrics, setSelectedMetrics] = useState(Object.keys(metricNames));
  const [aggregateData, setAggregateData] = useState([]);

  useEffect(() => {
    const generatedAccounts = generateAccounts(50);
    setAccounts(generatedAccounts);

    const aggregated = generatedAccounts[0].data.map((_, weekIndex) => {
      const weekData = { week: `Week ${weekIndex + 1}` };
      Object.keys(metricNames).forEach(metric => {
        let sum = generatedAccounts.reduce((acc, account) => 
          acc + account.data.slice(0, weekIndex + 1).reduce((sum, week) => sum + week[metric], 0)
        , 0);
        sum += Math.floor(Math.random() * (sum * 0.1));
        weekData[metric] = sum;
      });
      return weekData;
    });
    setAggregateData(aggregated);
  }, []);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedAccounts = [...accounts].sort((a, b) => {
    if (sortColumn === 'name' || sortColumn === 'uid' || sortColumn === 'csm') {
      return sortDirection === 'asc' 
        ? a[sortColumn].localeCompare(b[sortColumn])
        : b[sortColumn].localeCompare(a[sortColumn]);
    } else {
      const aValue = a.data[a.data.length - 1][sortColumn];
      const bValue = b.data[b.data.length - 1][sortColumn];
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
  });

  const filteredAccounts = sortedAccounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">RingSense for Sales Dashboard</h1>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'currentWeek' ? 'active' : ''}`}
            onClick={() => setActiveTab('currentWeek')}
          >
            Current Week
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'historical' ? 'active' : ''}`}
            onClick={() => setActiveTab('historical')}
          >
            Historical Data
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'aggregate' ? 'active' : ''}`}
            onClick={() => setActiveTab('aggregate')}
          >
            Aggregate Data
          </button>
        </li>
      </ul>

      {activeTab === 'currentWeek' && (
        <div>
          <input
            type="text"
            className="form-control mb-4"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Account Name</th>
                  <th onClick={() => handleSort('uid')} style={{ cursor: 'pointer' }}>UID</th>
                  {Object.entries(metricNames).map(([key, name]) => (
                    <th key={key} onClick={() => handleSort(key)} style={{ cursor: 'pointer' }}>{name}</th>
                  ))}
                  <th onClick={() => handleSort('csm')} style={{ cursor: 'pointer' }}>CSM</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map(account => (
                  <tr key={account.id}>
                    <td>{account.name}</td>
                    <td>{account.uid}</td>
                    {Object.keys(metricNames).map(metric => (
                      <td key={metric}>
                        {account.data[account.data.length - 1][metric].toLocaleString()}
                      </td>
                    ))}
                    <td>{account.csm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'historical' && (
        <div>
          <select 
            className="form-select mb-4"
            onChange={(e) => setSelectedAccount(accounts.find(a => a.id.toString() === e.target.value))}
          >
            <option value="">Select an account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id.toString()}>{account.name}</option>
            ))}
          </select>
          
          {selectedAccount && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">{selectedAccount.name}</h5>
                <MultiAxisLineChart data={selectedAccount.data} selectedMetrics={selectedMetrics} />
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'aggregate' && (
        <div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Aggregate Data</h5>
              <MultiAxisLineChart data={aggregateData} selectedMetrics={selectedMetrics} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;