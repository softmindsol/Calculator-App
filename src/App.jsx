import React, { useState, useEffect, useCallback } from 'react';

const App = () => {
  const [investmentCost, setInvestmentCost] = useState('');
  const [annualNetSales, setAnnualNetSales] = useState('');
  const [ebitdaPercentage, setEbitdaPercentage] = useState(''); // User inputs percentage
  const [annualRentCam, setAnnualRentCam] = useState('');

  const [salesToInvestmentRatio, setSalesToInvestmentRatio] = useState(null);
  const [paybackPeriod, setPaybackPeriod] = useState(null);
  const [roi, setRoi] = useState(null);
  const [rentFactor, setRentFactor] = useState(null);

  // Benchmarks from your framework
  const benchmarks = {
    salesToInvestmentRatio: 1.5, // > 1.5
    paybackPeriod: { ideal: 5, max: 7 }, // < 7; ideally < 5
    roi: 20, // > 20%
    rentFactor: 10, // < 10%
  };

  const calculateMetrics = useCallback(() => {
    const tic = parseFloat(investmentCost);
    const pans = parseFloat(annualNetSales);
    const ebitdaPct = parseFloat(ebitdaPercentage) / 100; // Convert to decimal
    const arc = parseFloat(annualRentCam);

    if (isNaN(tic) || isNaN(pans) || isNaN(ebitdaPct) || isNaN(arc)) {
      setSalesToInvestmentRatio(null);
      setPaybackPeriod(null);
      setRoi(null);
      setRentFactor(null);
      return;
    }

    // Projected Annual EBITDA (PAE)
    const pae = pans * ebitdaPct;

    // Sales-to-Investment Ratio
    setSalesToInvestmentRatio(tic > 0 ? pans / tic : null);

    // Payback Period (Yrs)
    setPaybackPeriod(pae > 0 ? tic / pae : null);

    // ROI (%)
    setRoi(tic > 0 ? (pae / tic) * 100 : null);

    // Rent Factor (%)
    setRentFactor(pans > 0 ? (arc / pans) * 100 : null);

  }, [investmentCost, annualNetSales, ebitdaPercentage, annualRentCam]);

  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  const getBenchmarkStatus = (value, benchmark, type) => {
    if (value === null) return { text: 'N/A', color: 'text-gray-500' };

    switch (type) {
      case 'salesToInvestmentRatio':
        return value > benchmark ? { text: 'Meets Target', color: 'text-green-600' } : { text: 'Below Target', color: 'text-red-600' };
      case 'paybackPeriod':
        if (value <= benchmark.ideal) return { text: 'Excellent', color: 'text-green-600' };
        if (value < benchmark.max) return { text: 'Good', color: 'text-yellow-600' };
        return { text: 'High Risk', color: 'text-red-600' };
      case 'roi':
        return value > benchmark ? { text: 'Meets Target', color: 'text-green-600' } : { text: 'Below Target', color: 'text-red-600' };
      case 'rentFactor':
        return value < benchmark ? { text: 'Meets Target', color: 'text-green-600' } : { text: 'High', color: 'text-red-600' };
      default:
        return { text: '', color: '' };
    }
  };


  const InputField = ({ label, value, onChange, placeholder, unit }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="flex items-center border rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="shadow-none appearance-none border-none rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
        />
        {unit && <span className="mr-3 text-gray-500 text-lg font-semibold">{unit}</span>}
      </div>
    </div>
  );

  const ResultDisplay = ({ label, value, unit, status }) => (
    <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4 flex justify-between items-center">
      <span className="text-gray-700 font-semibold">{label}:</span>
      <div className="flex flex-col items-end">
        <span className="text-xl font-bold text-gray-900">
          {value !== null ? `${value.toFixed(2)}${unit}` : 'N/A'}
        </span>
        {status && <span className={`text-sm ${status.color}`}>{status.text}</span>}
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-blue-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Franchise Profitability Calculator
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-md mx-auto">
          Quickly assess the financial viability of a potential franchise location using our proven unit economics framework.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Inputs</h2>
            <InputField
              label="Total Investment Cost"
              value={investmentCost}
              onChange={setInvestmentCost}
              placeholder="e.g., 500000"
              unit="$"
            />
            <InputField
              label="Projected Annual Net Sales"
              value={annualNetSales}
              onChange={setAnnualNetSales}
              placeholder="e.g., 1500000"
              unit="$"
            />
            <InputField
              label="Projected Annual EBITDA (%)"
              value={ebitdaPercentage}
              onChange={setEbitdaPercentage}
              placeholder="e.g., 12.5"
              unit="%"
            />
            <InputField
              label="Annual Rent + CAM"
              value={annualRentCam}
              onChange={setAnnualRentCam}
              placeholder="e.g., 120000"
              unit="$"
            />
          </div>

          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Results</h2>
            <ResultDisplay
              label="Sales-to-Investment Ratio"
              value={salesToInvestmentRatio}
              unit=":1"
              status={getBenchmarkStatus(salesToInvestmentRatio, benchmarks.salesToInvestmentRatio, 'salesToInvestmentRatio')}
            />
            <ResultDisplay
              label="Payback Period"
              value={paybackPeriod}
              unit=" Years"
              status={getBenchmarkStatus(paybackPeriod, benchmarks.paybackPeriod, 'paybackPeriod')}
            />
            {/* <ResultDisplay
              label="ROI"
              value={roi}
              unit="%"
              status={getBenchmarkStatus(roi, benchmarks.roi, 'roi')}
            /> */}
            <ResultDisplay
              label="Rent Factor"
              value={rentFactor}
              unit="%"
              status={getBenchmarkStatus(rentFactor, benchmarks.rentFactor, 'rentFactor')}
            />


          </div>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready for a Deeper Dive?</h2>
          <p className="text-gray-600 mb-6">
            This calculator is just the start. If you want to analyze your entire pipeline, de-risk your growth, and consistently pick high-performing locations, let's talk.
          </p>
          <button
            onClick={() => alert('Ideally, this would open a calendar or contact form for your "Unit Economics Deep Dive."')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Book Your Free Unit Economics Deep Dive
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

