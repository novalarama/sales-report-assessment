'use client'

import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';

type FilterProps = {
    onFilterChange: (startDate: Date, finishDate: Date | null) => void;
}

export default function Filter({ onFilterChange }: FilterProps) {
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedFinishDate, setSelectedFinishDate] = useState<Date | null>(null);

  const handleStartDateChange = (date: Date) => {
    setSelectedStartDate(date);
    if (selectedFinishDate && dayjs(date).isAfter(dayjs(selectedFinishDate))) {
      setSelectedFinishDate(date);
      onFilterChange(date, date);
    } else {
      onFilterChange(date, selectedFinishDate);
    }
  };

  const handleFinishDateChange = (date: Date) => {
    setSelectedFinishDate(date);
    onFilterChange(selectedStartDate, date);
  };

  return (
    <div className="inline-flex bg-white rounded border border-gray-300 h-14">
      <div className='grid grid-rows-2 m-2'>
        <div className="justify-self-start text-center text-gray-400 text-xs font-normal">Tanggal Mulai</div>
        <DatePicker
          selected={selectedStartDate}
          onChange={handleStartDateChange}
          dateFormat="dd MMMM yyyy"
        />
      </div>
      <div className='grid grid-rows-2 m-2'>
        <div className="justify-self-start text-center text-gray-400 text-xs font-normal">Tanggal Berakhir</div>
        <DatePicker
          selected={selectedFinishDate}
          onChange={handleFinishDateChange}
          dateFormat="dd MMMM yyyy"
          className="flex-col justify-start items-end gap-px inline-flex"
          minDate={selectedStartDate}
          isClearable={true}
        />
      </div>
    </div>
  );
}
