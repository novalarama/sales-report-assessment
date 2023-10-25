'use client'

import React, { useEffect, useState } from 'react';
import { getSalesData } from '../lib/api';
import './SalesTable.css';
import dayjs from 'dayjs';
import numeral from 'numeral'
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faFileExport } from '@fortawesome/free-solid-svg-icons';

type SaleData = {
    id: number;
    date: string;
    sale_code: string;
    customer: {
        name: string;
    };
    total: number;
}

export default function SalesTable() {
    const [salesData, setSalesData] = useState<SaleData[]>([]);
    const [clickedDate, setClickedDate] = useState<string | null>(null);
    const uniqueDates = Array.from(new Set(salesData.map((sale) => sale.date)));
    const sortedUniqueDates = uniqueDates.sort(
        (a, b) => dayjs(a).unix() - dayjs(b).unix()
    );

    const formattedDates = sortedUniqueDates.map((date) => {
        const formattedDate = dayjs(date).format('DD MMMM YYYY');
        return formattedDate;
    });

    useEffect(() => {
        getSalesData('2023-10-24', '2023-10-25')
            .then((data: SaleData[]) => {
                const sortedData = _.orderBy(data, [(sale) => dayjs(sale.date)], ['asc']);
                setSalesData(sortedData);
            })
            .catch((error) => {
                console.error('Error fetching sales data: ', error);
            });
    }, []);

    return (
        <div>
            <h1>Laporan Penjualan</h1>
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
                                        <FontAwesomeIcon className='ml-20' icon={faFileExport} style={{ color: 'grey' }}
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
    );
};
