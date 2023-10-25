import React, { useEffect, useState } from 'react';
import { getSalesData } from '../lib/api';

const SalesTable = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    getSalesData('2023-10-24', '2023-10-25')
      .then((data) => {
        setSalesData(data);
      })
      .catch((error) => {
        console.error('Error fetching sales data: ', error);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="title">Sales Data</h1>
      <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Category</th>
            <th>Country</th>
            <th>Units Sold</th>
            <th>Unit Price</th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        {/* <tbody>
          {salesData.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.date}</td>
              <td>{sale.product}</td>
              <td>{sale.category}</td>
              <td>{sale.country}</td>
              <td>{sale.units_sold}</td>
              <td>{sale.unit_price}</td>
              <td>{sale.total_revenue}</td>
            </tr>
          ))}
        </tbody> */}
      </table>
    </div>
  );
};

export default SalesTable;
