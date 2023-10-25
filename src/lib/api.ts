import axios from 'axios';

export const getSalesData = async (startDate: string, finishDate: string) => {
  try {
    const response = await axios.get(
      `https://4771d15e-8011-4829-bafb-87c538aacc11.mock.pstmn.io/api/v0/sales/sales/list?order=ASC&page=1&take=150&start_date=${startDate}&finish_date=${finishDate}`
    );
    return response.data.data;
  } catch (error) {
    console.error('Data could not be obtained. Error fetching sales data: ', error);
    throw error;
  }
};