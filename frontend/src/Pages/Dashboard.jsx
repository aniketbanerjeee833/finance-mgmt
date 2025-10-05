import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, AlertCircle, FileText } from 'lucide-react';

import salesData from '../sale.json';
import purchaseData from '../purchase.json';
// const salesData = [
//   {
//     "Party_Name": "John Doe",
//     "Party_Phone": "1234567890",
//     "Invoice_Date": "2023-08-01",
//     "Invoice_Number": "INV123",
//     "State_Of_Supply": "Gujarat",
//     "Total_Amount": 270.00,
//     "Total_Received": 70.00,
//     "Balance_Due": 200.00,
//     "items": [
//       {
//         "Item_Name": "Monitor",
//         "Quantity": 2,
//         "Unit": "pcs",
//         "Sale_Price": 100,
//         "Discount": 0,
//         "Tax_Type": "GST 5%",
//         "Tax_Amount": 105,
//         "Amount": 210
//       },
//       {
//         "Item_Name": "Keyboard",
//         "Quantity": 1,
//         "Unit": "pcs",
//         "Sale_Price": 50,
//         "Discount": 0,
//         "Tax_Type": "GST 5%",
//         "Tax_Amount": 10,
//         "Amount": 60
//       }
//     ]
//   },
//   {
//     "Party_Name": "John Doe",
//     "Party_Phone": "1234567890",
//     "Invoice_Date": "2023-08-01",
//     "Invoice_Number": "INV124",
//     "State_Of_Supply": "Gujarat",
//     "Total_Amount": 370.00,
//     "Total_Received": 70.00,
//     "Balance_Due": 300.00,
//     "items": [
//       {
//         "Item_Name": "cctv",
//         "Quantity": 2,
//         "Unit": "pcs",
//         "Sale_Price": 100,
//         "Discount": 0,
//         "Tax_Type": "GST 5%",
//         "Tax_Amount": 105,
//         "Amount": 210
//       },
//       {
//         "Item_Name": "headphone",
//         "Quantity": 3,
//         "Unit": "pcs",
//         "Sale_Price": 50,
//         "Discount": 0,
//         "Tax_Type": "GST 5%",
//         "Tax_Amount": 10,
//         "Amount": 160
//       }
//     ]
//   }
// ];

// const purchaseData = [
//   {
//     "Party_Name": "A",
//     "Party_Phone": "1234567890",
//     "Bill_Date": "2023-08-01",
//     "Bill_Number": "1234",
//     "State_Of_Supply": "Gujarat",
//     "Total_Amount": 200.00,
//     "Total_Paid": 0.00,
//     "Balance_Due": 200.00,
//     "items": [
//       {
//         "Item_Name": "Monitor",
//         "Quantity": 1,
//         "Unit": "pcs",
//         "Purchase_Price": 100,
//         "Discount": 0,
//         "Tax_Type": "GST 0%",
//         "Tax_Amount": 0,
//         "Amount": 100
//       },
//       {
//         "Item_Name": "Keyboard",
//         "Quantity": 1,
//         "Unit": "pcs",
//         "Purchase_Price": 100,
//         "Discount": 0,
//         "Tax_Type": "GST 0%",
//         "Tax_Amount": 0,
//         "Amount": 100
//       }
//     ]
//   },
//   {
//     "Party_Name": "B",
//     "Party_Phone": "1234567890",
//     "Bill_Date": "2023-08-01",
//     "Bill_Number": "1235",
//     "State_Of_Supply": "Gujarat",
//     "Total_Amount": 300.00,
//     "Total_Paid": 0.00,
//     "Balance_Due": 300.00,
//     "items": [
//       {
//         "Item_Name": "cctv",
//         "Quantity": 2,
//         "Unit": "pcs",
//         "Purchase_Price": 90,
//         "Discount": 0,
//         "Tax_Type": "GST 0%",
//         "Tax_Amount": 0,
//         "Amount": 180
//       },
//       {
//         "Item_Name": "headphone",
//         "Quantity": 3,
//         "Unit": "pcs",
//         "Purchase_Price": 40,
//         "Discount": 0,
//         "Tax_Type": "GST 0%",
//         "Tax_Amount": 0,
//         "Amount": 120
//       }
//     ]
//   }
// ];

export default function Dashboard() {
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  // Calculate metrics
  const totalSales = salesData.reduce((sum, sale) => sum + sale.Total_Amount, 0);
  const totalPurchases = purchaseData.reduce((sum, purchase) => sum + purchase.Total_Amount, 0);
  const totalReceivables = salesData.reduce((sum, sale) => sum + sale.Balance_Due, 0);
  const totalPayables = purchaseData.reduce((sum, purchase) => sum + purchase.Balance_Due, 0);
  const profit = totalSales - totalPurchases;
  const profitMargin = ((profit / totalSales) * 100).toFixed(1);

  // Item-wise analysis
  const itemAnalysis = {};
  
  salesData.forEach(sale => {
    sale.items.forEach(item => {
      if (!itemAnalysis[item.Item_Name]) {
        itemAnalysis[item.Item_Name] = { 
          name: item.Item_Name, 
          soldQty: 0, 
          soldAmount: 0,
          purchasedQty: 0,
          purchasedAmount: 0
        };
      }
      itemAnalysis[item.Item_Name].soldQty += item.Quantity;
      itemAnalysis[item.Item_Name].soldAmount += item.Amount;
    });
  });

  purchaseData.forEach(purchase => {
    purchase.items.forEach(item => {
      if (!itemAnalysis[item.Item_Name]) {
        itemAnalysis[item.Item_Name] = { 
          name: item.Item_Name, 
          soldQty: 0, 
          soldAmount: 0,
          purchasedQty: 0,
          purchasedAmount: 0
        };
      }
      itemAnalysis[item.Item_Name].purchasedQty += item.Quantity;
      itemAnalysis[item.Item_Name].purchasedAmount += item.Amount;
    });
  });

  const itemChartData = Object.values(itemAnalysis).map(item => ({
    name: item.name,
    sales: item.soldAmount,
    purchases: item.purchasedAmount,
    profit: item.soldAmount - item.purchasedAmount
  }));

  const pieData = Object.values(itemAnalysis).map(item => ({
    name: item.name,
    value: item.soldAmount
  }));


 const salesDataMonthWise = months.map((month, index) => {
  const monthlySales = salesData
    .filter(sale => new Date(sale.Invoice_Date).getMonth() === index)
    .reduce((sum, sale) => sum + (sale.Total_Amount || 0), 0);

  const monthlyPurchases = purchaseData
    .filter(purchase => new Date(purchase.Bill_Date).getMonth() === index)
    .reduce((sum, purchase) => sum + (purchase.Total_Amount || 0), 0);

  return {
    name: month,
    sales: monthlySales,
    purchases: monthlyPurchases,
    profit: monthlySales - monthlyPurchases
  };
});

// const partyWiseData={}
// salesData.forEach(sale => {
//   if (!partyWiseData[sale.Party_Name]) {
//     partyWiseData[sale.Party_Name] = 
//         sale.reduce((sum, item) => sum + item.Total_Amount, 0);
    
//   }
const allSalePartyNames = salesData.map(sale => sale.Party_Name);
const allPurchasePartyNames = purchaseData.map(purchase => purchase.Party_Name);
const allNames = [...new Set([...allSalePartyNames, ...allPurchasePartyNames])];

const partyWiseData = allNames.map(name => {
  const totalSales = salesData
    .filter(sale => sale.Party_Name === name)
    .reduce((sum, sale) => sum + sale.Total_Amount, 0);

  const totalPurchases = purchaseData
    .filter(purchase => purchase.Party_Name === name)
    .reduce((sum, purchase) => sum + purchase.Total_Amount, 0);

  return {
    name,
    sales: totalSales,
    purchases: totalPurchases,
    profit: totalSales - totalPurchases,
  };
});


  console.log(salesDataMonthWise,partyWiseData)
 

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow ">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">₹{value.toLocaleString()}</h3>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {title.split(/\s+/).length>1&&<span className='text-sm text-gray-600 cursor-pointer'>View all {title.split(/\s+/)[1]}</span>}
    </div>
  );

  return (
<div className="max-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Sales & Purchase Analytics</p>
            </div>
            {/* <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-xl font-bold text-green-600">₹{profit.toLocaleString()}</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">{profitMargin}%</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 overflow-auto">
        {/* Tabs */}
        {/* <div className="flex space-x-2 mb-8 bg-white p-1 rounded-lg shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'sales'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sales
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'purchases'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Purchases
          </button>
        </div> */}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Sales"
            value={totalSales}
            icon={TrendingUp}
            trend="up"
            trendValue="+12.5%"
            color="bg-blue-600"
          />
          <StatCard
            title="Total Purchases"
            value={totalPurchases}
            icon={ShoppingCart}
                 trend="up"
            trendValue="+12.5%"
            color="bg-purple-600"
          />
          <StatCard
            title="Receivables"
            value={totalReceivables}
            icon={AlertCircle}
            color="bg-orange-600"
          />
          <StatCard
            title="Payables"
            value={totalPayables}
            icon={DollarSign}
            color="bg-red-600"
          />
          <StatCard
            title="Profit"
            value={profit}
            icon={profitMargin > 0 ? TrendingUp : TrendingDown}
            trend={profitMargin > 0 ? 'up' : 'down'}
            trendValue={profitMargin + '%'}
            color={profitMargin > 0 ? "bg-green-600" : "bg-red-600"}
          />
        </div>

       
          <>

  {/* 📊 Bar Chart (takes 2/3 width on desktop) */}
  

 <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 sm:p-6">
  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center sm:text-left">
    Month-wise Sales, Purchases & Profit
  </h3>

  <div
    className="
      w-full
      h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px]
      overflow-x-auto 
      
      rounded-lg
    "
  >
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={salesDataMonthWise}
        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          stroke="#6b7280"
          tick={{ fontSize: 12 }}
          interval={0}
        />
        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        />
        <Legend
          wrapperStyle={{
            fontSize: "12px",
            paddingTop: "10px",
          }}
        />
        <Bar dataKey="sales" fill="#3b82f6" name="Sales" radius={[6, 6, 0, 0]} />
        <Bar
          dataKey="purchases"
          fill="#8b5cf6"
          name="Purchases"
          radius={[6, 6, 0, 0]}
        />
        <Bar
          dataKey="profit"
          fill="#10b981"
          name="Profit"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

 

  {/* 🥧 Pie Chart (1/3 width on desktop) */}
{/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col items-center justify-center">
  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">
    Party-wise Revenue Distribution
  </h3>

  <div className="w-full h-[250px] sm:h-[350px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={partyWiseData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          dataKey="sales" // Each slice size = total sales
          nameKey="name"
          fill="#3b82f6"
          label={({ name, percent }) =>
            percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
          }
        >
          {partyWiseData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <p className="font-semibold text-gray-800">{data.name}</p>
                  <p className="text-sm text-blue-600">
                    Sales: ₹{data.sales.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-600">
                    Purchases: ₹{data.purchases.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm ${
                      data.profit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Profit: ₹{data.profit.toLocaleString()}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />

        <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{ fontSize: "12px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div> */}
<div className="bg-white mb-4 rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 ">
  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 text-center">
    Party-wise Sales, Purchases & Profit Distribution
  </h3>



  {/* Responsive 1-3 column grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    
    {/* 🟦 SALES PIE */}
    <div className="flex flex-col items-center justify-center w-full">
      <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2 text-center">
        Sales Distribution
      </h4>
      <div className="w-full h-[220px] sm:h-[250px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={partyWiseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              dataKey="sales"
              nameKey="name"
            >
              {partyWiseData.map((entry, index) => (
                <Cell key={`sales-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString()}`}
              labelFormatter={(label) => `Party: ${label}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* 🟪 PURCHASE PIE */}
    <div className="flex flex-col items-center justify-center w-full">
      <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2 text-center">
        Purchases Distribution
      </h4>
      <div className="w-full h-[220px] sm:h-[250px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={partyWiseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              dataKey="purchases"
              nameKey="name"
            >
              {partyWiseData.map((entry, index) => (
                <Cell key={`purchase-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString()}`}
              labelFormatter={(label) => `Party: ${label}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* 🟩 PROFIT PIE */}
    <div className="flex flex-col items-center justify-center w-full">
      <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2 text-center">
        Profit Distribution by Party
      </h4>
      <div className="w-full h-[220px] sm:h-[250px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={partyWiseData.map((party) => ({
                ...party,
                profit: Math.max(party.profit, 0), // ✅ No negative slices
              }))}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              dataKey="profit"
              nameKey="name"
            >
              {partyWiseData.map((entry, index) => (
                <Cell
                  key={`party-${index}`}
                  fill={entry.profit > 0 ? COLORS[index % COLORS.length] : "#d1d5db"}
                />
              ))}
            </Pie>

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <p className="font-semibold text-gray-800">{data.name}</p>
                      <p className="text-sm text-green-600">
                        Profit: ₹{Math.max(data.profit, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-600">
                        Sales: ₹{data.sales.toLocaleString()}
                      </p>
                      <p className="text-sm text-purple-600">
                        Purchases: ₹{data.purchases.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Legend Indicators */}
     
    </div>
  </div>
   <div className="mt-6 flex overflow-x-auto justify-center align-center space-x-4 pb-2">
  {partyWiseData.map((party, index) => (
    <div key={party.name} className="flex items-center space-x-2 flex-shrink-0">
      <span
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: COLORS[index % COLORS.length] }}
      ></span>
      <span className="text-gray-700 text-sm">{party.name}</span>
    </div>
  ))}
</div>
</div>

 



{/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 col-span-1 lg:col-span-2">
    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center lg:text-left">
     Party Wise Analysis
    </h3>

    <div className="max-w-full overflow-x-auto h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={partyWiseData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} interval={0} />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="sales" fill="#3b82f6" name="Sales" radius={[6, 6, 0, 0]} />
          <Bar dataKey="purchases" fill="#8b5cf6" name="Purchases" radius={[6, 6, 0, 0]} />
          <Bar dataKey="profit" fill="#10b981" name="Profit" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div> */}





            {/* Product Performance Table */}
     {/* Product Performance Table */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 
                overflow-y-auto overflow-x-auto
               p-4 sm:p-6
                w-full">
  <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Product Performance</h3>
  </div>

  <div className="min-w-full">
    <table className="w-full text-sm sm:text-base">
      <thead className="bg-gray-50 sticky top-[57px] sm:top-[65px] z-10">
        <tr>
          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Product</th>
          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Sold Qty</th>
          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Sales Revenue</th>
          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Purchase Cost</th>
          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Profit</th>
          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Margin</th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {Object.values(itemAnalysis).map((item, idx) => {
          const profit = item.soldAmount - item.purchasedAmount;
          const margin = item.soldAmount > 0 ? ((profit / item.soldAmount) * 100).toFixed(1) : 0;

          return (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                </div>
              </td>
              <td className="px-4 sm:px-6 py-3 text-sm text-gray-700">{item.soldQty}</td>
              <td className="px-4 sm:px-6 py-3 text-sm font-medium text-gray-900">₹{item.soldAmount.toLocaleString()}</td>
              <td className="px-4 sm:px-6 py-3 text-sm text-gray-700">₹{item.purchasedAmount.toLocaleString()}</td>
              <td className="px-4 sm:px-6 py-3">
                <span className={`text-sm font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{profit.toLocaleString()}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-3">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                  margin >= 20 ? 'bg-green-100 text-green-800' : 
                  margin >= 10 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {margin}%
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>

          </>
       

        {/* {activeTab === 'sales' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sales Invoices</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salesData.map((sale, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{sale.Invoice_Number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sale.Party_Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sale.Invoice_Date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{sale.Total_Amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">₹{sale.Total_Received.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          sale.Balance_Due === 0 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          ₹{sale.Balance_Due.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Purchase Bills</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseData.map((purchase, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-purple-600 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{purchase.Bill_Number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{purchase.Party_Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{purchase.Bill_Date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{purchase.Total_Amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">₹{purchase.Total_Paid.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          purchase.Balance_Due === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          ₹{purchase.Balance_Due.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}

{/* <div className="flex flex-col items-center justify-center">
      <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2">
        Profit Distribution
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={partyWiseData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="profit"
            nameKey="name"
          >
            {partyWiseData.map((entry, index) => (
              <Cell
                key={`profit-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `₹${value.toLocaleString()}`}
            labelFormatter={(label) => `Party: ${label}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div> 
     <div className="flex flex-col items-center justify-center ">
  <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2">
    Profit / Loss Distribution by Party
  </h4>

  <ResponsiveContainer width="100%" height={200}>
    <PieChart>
     
      <Pie
        data={partyWiseData.filter((p) => p.profit >= 0)}
        cx="50%"
        cy="50%"
        dataKey="profit"
        nameKey="name"
        outerRadius={100}
        innerRadius={70}
        fill="#22c55e"
        labelLine={false}
        label={({ name }) => name}
      >
        {partyWiseData
          .filter((p) => p.profit >= 0)
          .map((entry, index) => (
            <Cell key={`profit-${index}`} fill="#22c55e" />
          ))}
      </Pie>

   
      <Pie
        data={partyWiseData.filter((p) => p.profit < 0)}
        cx="50%"
        cy="50%"
        dataKey={(entry) => Math.abs(entry.profit)} // absolute loss
        nameKey="name"
        outerRadius={65}
        innerRadius={40}
        fill="#ef4444"
        labelLine={false}
        label={({ name }) => name}
      >
        {partyWiseData
          .filter((p) => p.profit < 0)
          .map((entry, index) => (
            <Cell key={`loss-${index}`} fill="#ef4444" />
          ))}
      </Pie>

      <Tooltip
        content={({ active, payload }) => {
          if (active && payload && payload.length) {
            const data = payload[0].payload;
            const isProfit = data.profit >= 0;
            return (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <p className="font-semibold text-gray-800">{data.name}</p>
                <p
                  className={`text-sm ${
                    isProfit ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isProfit ? "Profit" : "Loss"}: ₹
                  {Math.abs(data.profit).toLocaleString()}
                </p>
              </div>
            );
          }
          return null;
        }}
      />
    </PieChart>
  </ResponsiveContainer>

  <div className="mt-4 flex items-center gap-6 flex-wrap justify-center">
    <div className="flex items-center space-x-2">
      <span className="w-4 h-4 bg-green-500 rounded-full"></span>
      <span className="text-sm text-gray-700">Profit</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="w-4 h-4 bg-red-500 rounded-full"></span>
      <span className="text-sm text-gray-700">Loss</span>
    </div>
  </div>
</div> */}