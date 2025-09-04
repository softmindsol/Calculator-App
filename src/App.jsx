import React, { useState, useEffect, useCallback } from 'react';
// If you have a logo, you can import it like this:
// import YourLogo from './path/to/your/logo.png';

// --- COMPONENTS (Defined outside of App for performance) ---

const InputField = ({ label, value, onChange, placeholder, unit }) => (
  <div className="mb-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border min-h-[60px] flex flex-col justify-center">

          <label className="block text-gray-600 text-sm font-bold -mb-1">
              {label}
          </label>

          <div className="flex items-center">
              {/* --- CHANGE IS HERE --- */}
              {/* The dollar sign now only shows if 'unit' is '$' AND 'value' is not empty */}
              {unit === '$' && value && (
                  <span className="text-lg font-bold text-gray-900 mr-1">
                      $
                  </span>
              )}
              <input
                  type="number"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className={`
                      w-full bg-transparent p-0 focus:outline-none
                      text-lg font-bold text-gray-900 
                      placeholder:text-lg placeholder:font-normal placeholder:text-gray-400
                  `}
              />
              {/* --- AND CHANGE IS HERE --- */}
              {/* The percent sign now only shows if 'unit' is '%' AND 'value' is not empty */}
              {unit === '%' && value && (
                  <span className="text-lg font-bold text-gray-900 ml-1">
                      %
                  </span>
              )}
          </div>
      </div>
  </div>
);



const ResultDisplay = ({ label, value, unit, status }) => (
  <div className="mb-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border min-h-[60px] relative">
          <div className="text-xs text-gray-500 font-medium mb-1">
              {label}
          </div>
          <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">
                  {value !== null ? `${value.toFixed(2)}${unit}` : 'N/A'}
              </span>
              {status && (
                  <span className={`text-base font-semibold text-right ${status.color}`}>
                      {status.text}
                  </span>
              )}
          </div>
      </div>
  </div>
);


const App = () => {
  const [investmentCost, setInvestmentCost] = useState('');
  const [annualNetSales, setAnnualNetSales] = useState('');
  const [ebitdaPercentage, setEbitdaPercentage] = useState('');
  const [annualRentCam, setAnnualRentCam] = useState('');

  const [salesToInvestmentRatio, setSalesToInvestmentRatio] = useState(null);
  const [paybackPeriod, setPaybackPeriod] = useState(null);
  const [roi, setRoi] = useState(null);
  const [rentFactor, setRentFactor] = useState(null);

  const benchmarks = {
    salesToInvestmentRatio: 1.5,
    paybackPeriod: { ideal: 5, max: 7 },
    roi: 20,
    rentFactor: 10,
  };

  const calculateMetrics = useCallback(() => {
    const tic = parseFloat(investmentCost);
    const pans = parseFloat(annualNetSales);
    const ebitdaPct = parseFloat(ebitdaPercentage) / 100;
    const arc = parseFloat(annualRentCam);

    if (isNaN(tic) || isNaN(pans) || isNaN(ebitdaPct) || isNaN(arc)) {
      setSalesToInvestmentRatio(null);
      setPaybackPeriod(null);
      setRoi(null);
      setRentFactor(null);
      return;
    }

    const pae = pans * ebitdaPct;
    setSalesToInvestmentRatio(tic > 0 ? pans / tic : null);
    setPaybackPeriod(pae > 0 ? tic / pae : null);
    setRoi(tic > 0 ? (pae / tic) * 100 : null);
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
      case 'rentFactor':
        return value < benchmark ? { text: 'Meets Target', color: 'text-green-600' } : { text: 'High', color: 'text-red-600' };
      default:
        return { text: '', color: '' };
    }
  };


  return (
    <div className="min-h-screen bg-[#0a2351] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="bg-[#f4f3e8] p-6 sm:p-8 lg:p-10 xl:p-12 rounded-2xl shadow-2xl w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl">
        
        <div className="flex justify-center mb-6">
            {/* <img src={YourLogo} alt="Your Company Logo" className="h-12" /> */}
            <div className="w-24 h-12 bg-gray-300 flex items-center justify-center rounded-lg">
                <span className="text-xs text-gray-500">Your Logo</span>
            </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a2351] mb-6 text-center">
          Restaurant Real Estate Profitability Calculator
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-lg mx-auto">
          Quickly assess the financial viability of a potential franchise location using our proven unit economics framework.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 xl:gap-x-16">
          {/* Inputs Section */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0a2351] mb-4 border-b pb-2">Inputs</h2>
            <InputField label="Total Investment Cost" value={investmentCost} onChange={setInvestmentCost} placeholder="e.g., 500000" unit="$" />
            <InputField label="Projected Annual Net Sales" value={annualNetSales} onChange={setAnnualNetSales} placeholder="e.g., 1500000" unit="$" />
            <InputField label="Projected Annual EBITDA (%)" value={ebitdaPercentage} onChange={setEbitdaPercentage} placeholder="e.g., 12.5" unit="%" />
            <InputField label="Annual Rent + CAM" value={annualRentCam} onChange={setAnnualRentCam} placeholder="e.g., 120000" unit="$" />
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0a2351] mb-4 border-b pb-2">Results</h2>
            <ResultDisplay label="Sales-to-Investment Ratio" value={salesToInvestmentRatio} unit=":1" status={getBenchmarkStatus(salesToInvestmentRatio, benchmarks.salesToInvestmentRatio, 'salesToInvestmentRatio')} />
            <ResultDisplay label="Payback Period" value={paybackPeriod} unit=" Years" status={getBenchmarkStatus(paybackPeriod, benchmarks.paybackPeriod, 'paybackPeriod')} />
            <ResultDisplay label="Rent Factor" value={rentFactor} unit="%" status={getBenchmarkStatus(rentFactor, benchmarks.rentFactor, 'rentFactor')} />
          </div>
        </div>

        <div className="mt-8 lg:mt-12 text-center border-t pt-8 lg:pt-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#0a2351] mb-4">Ready for a Deeper Dive?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            This calculator is just the start. If you want to analyze your entire pipeline, de-risk your growth, and consistently pick high-performing locations, let's talk.
          </p>
          <button
            onClick={() => alert('Ideally, this would open a calendar or contact form.')}
            className="bg-[#ffc700] hover:bg-[#e6b800] text-black font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            Book Your Free Unit Economics Deep Dive
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;