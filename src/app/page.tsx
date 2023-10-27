'use client'

import React, { useEffect, useState } from 'react'
import { getSalesData } from '../lib/api'
import dayjs from 'dayjs'
import numeral from 'numeral'
import _ from 'lodash'
import GeneratePDF from "@/components/GeneratePDF";
import Filter from '@/components/Filter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faFileExport } from '@fortawesome/free-solid-svg-icons';

type SaleData = {
  id: number;
  date: string;
  sale_code: string;
  customer: {
    name: string;
  };
  delivery_fee: number
  total_including_ppn: number
  total: number;
}

export default function Home() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [finishDate, setFinishDate] = useState<Date | null>(null);
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [clickedDate, setClickedDate] = useState<string | null>(null);
  const uniqueDates = Array.from(new Set(salesData.map((sale) => sale.date)));
  const sortedUniqueDates = uniqueDates.sort(
    (a, b) => dayjs(a).unix() - dayjs(b).unix()
  );
  let formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
  let formattedFinishDate = finishDate ? dayjs(finishDate).format('YYYY-MM-DD') : '';

  const formattedDates = sortedUniqueDates.map((date) => {
    const formattedDate = dayjs(date).format('DD MMMM YYYY');
    return formattedDate;
  });

  const handleFilterChange = (startDate: Date, finishDate: Date | null) => {
    console.log('11111--------');
    console.log(salesData);

    const filteredData = salesData.filter((sale) => {
      const saleDate = dayjs(sale.date);
      if (finishDate !== null) {
        if (finishDate !== startDate) {
          console.log('masuk 1');
          return saleDate.isAfter(startDate) && saleDate.isBefore(finishDate);
        } else {
          console.log('masuk 2');
          return saleDate.isSame(startDate);
        }
      } else {
        console.log('masuk 3');
        return saleDate.isAfter(startDate);
      }
    });
    console.log('22222--------');
    
    console.log(filteredData);
    console.log(startDate);
    console.log(finishDate);



    setSalesData(filteredData);
  };

  const setSalesDataInHome = (data: SaleData[]) => {
    setSalesData(data);
  };

  useEffect(() => {
    getSalesData(formattedStartDate, formattedFinishDate)
      .then((data: SaleData[]) => {
        const sortedData = _.orderBy(data, [(sale) => dayjs(sale.date)], ['asc']);
        setSalesData(sortedData);
        setSalesDataInHome(sortedData);
      })
      .catch((error) => {
        console.error('Error fetching sales data: ', error);
      });
  }, [formattedStartDate, formattedFinishDate]);

  return (
    <div className="font-poppins m-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-3xl font-bold self-center">Laporan Penjualan</div>
        <div className="justify-self-end grid grid-cols-2 gap-3 self-center">
          <div className="self-center">
            <Filter onFilterChange={handleFilterChange} />
          </div>
          <div>
            <button
              type="submit"
              className="my-5 self-center justify-center rounded-md border border-transparent bg-gray-600 px-8 py-3 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={() => GeneratePDF(salesData, dayjs(formattedStartDate).format('DD MMMM YYYY'), dayjs(formattedFinishDate).format('DD MMMM YYYY'), 'range')}

            >
              <FontAwesomeIcon icon={faFileExport} className="text-lg mr-2" /> Export
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="mx-6">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="pl-8 px-1 py-2 bg-gray-600 text-white text-left">Nota Penjualan</th>
                <th className="px-1 py-5 bg-gray-600 text-white text-left">Customer</th>
                <th className="px-8 py-2 bg-gray-600 text-white text-right">Total (Rp)</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-solid'>
              {formattedDates.map((date) => (
                <React.Fragment key={date}>
                  <tr>
                    <td className="pl-8 px-4 py-3">
                      {clickedDate === date ? (
                        <FontAwesomeIcon className='mr-4' icon={faCaretUp} onClick={() => setClickedDate(null)} />
                      ) : (
                        <FontAwesomeIcon className='mr-4' icon={faCaretDown} onClick={() => setClickedDate(date)} />
                      )}
                      {date}
                      <FontAwesomeIcon
                        className='ml-20'
                        icon={faFileExport}
                        style={{ color: 'grey' }}
                        onClick={() => GeneratePDF(salesData, date, null, 'single')}
                      />
                    </td>
                    <td className="px-4 py-3"></td>
                    <td className="pr-8 px-4 py-3 text-right">{numeral(salesData
                      .filter((sale) => dayjs(sale.date).format('DD MMMM YYYY') === date)
                      .reduce((acc, sale) => acc + sale.total, 0)).format('0,0')}</td>
                  </tr>
                  {clickedDate === date &&
                    salesData
                      .filter((sale) => dayjs(sale.date).format('DD MMMM YYYY') === clickedDate)
                      .map((sale) => (
                        <tr className='divide-y divide-solid' key={sale.id}>
                          <td className="pl-14 px-4 py-3">{sale.sale_code}</td>
                          <td className="px-4 py-3">{sale.customer.name}</td>
                          <td className="pr-8 px-4 py-3 text-right">{numeral(sale.total).format('0,0')}</td>
                        </tr>
                      ))}
                </React.Fragment>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

