import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs'
import numeral from 'numeral'

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

export default function GeneratePDF(saleData: SaleData[], startDate: string, finishDate: string | null = null, type: string) {
  const doc = new jsPDF();
  const tableColumn = ["Tanggal", "Jumlah (Rp)", "Biaya Kirim (Rp)", "Sub Total (Rp)"];
  const tableRows: (string | number)[][] = [];

  if (type === 'range') {
    saleData.forEach((sale) => {
      const saleData = [
        dayjs(sale.date).format('DD MMMM YYYY'),
        numeral(sale.total).format('0,0'),
        sale.delivery_fee,
        numeral(sale.total_including_ppn).format('0,0')
      ];
      tableRows.push(saleData);
    });
  } else {
    const filteredData = saleData
      .filter((sale) => dayjs(sale.date).format('DD MMMM YYYY') === startDate);

    filteredData.forEach((sale) => {
      const saleData = [
        dayjs(sale.date).format('DD MMMM YYYY'),
        numeral(sale.total).format('0,0'),
        sale.delivery_fee,
        numeral(sale.total_including_ppn).format('0,0')
      ];
      tableRows.push(saleData);
    });
  }

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40
  });

  if (type === 'range' && finishDate !== 'Invalid Date') {
    doc.text("GRAHA BANGUNAN", 1, 1);
    doc.text("Laporan Penjualan Summary Per Hari", 15, 25);
    doc.text(`Tanggal : ${startDate} - ${finishDate}`, 15, 35);
    doc.save(`Laporan Penjualan ${startDate} - ${finishDate}.pdf`);
  } else {
      doc.text("GRAHA BANGUNAN", 15, 15);
      doc.text("Laporan Penjualan Summary Per Hari", 15, 25);
      doc.text(`Tanggal : ${startDate}`, 15, 35);
      doc.save(`Laporan Penjualan ${startDate}.pdf`);
  }
};
