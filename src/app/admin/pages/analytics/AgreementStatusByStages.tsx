import React, { useEffect, useState } from 'react';
import Api from '../../api/Api';
import { useAppDispatch } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import ReactECharts from 'echarts-for-react';

const EChartComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const [agreementStatus, setAgreementStatus] = useState<any>({});

  const getAgreementStatus = async () => {
    dispatch(showSpinner()); // Show spinner before the API call
    const { data, status: responseStatus }: any = await Api.get('crm_aggrement_status', {});
    if (responseStatus) {
      setAgreementStatus(data);
    } else {
      setAgreementStatus({});
    }
    dispatch(hideSpinner()); // Hide spinner after the API call
  };

  useEffect(() => {
    getAgreementStatus();
  }, []);

  // ECharts option configuration
  const option = {
    title: {
      text: 'Customers By Agreement Stage',
      padding: [15, 10, 10, 10],
      textStyle: {
        color: '#25272D',
        fontSize: 17,
        fontWeight: 700,
        fontFamily: 'Arial',
      },
    },
    dataset: {
      source: [
        ['amount', 'product'],
        [23, 'AOS Signed Copy Uploaded'],
        [40, 'AOS Draft (Approved by customer)'],
        [120, 'Car Parking Selection & Allotment Done'],
        [agreementStatus?.ten_percentage_payment || 0, '10% Payment Done'],
      ],
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.value[1]}<br/>${params.value[0]}`; // Product name on the first line, amount on the second line
      },
      textStyle: {
        fontSize: 11, // Set the font size of the tooltip text
        color: '#000', // Optional: set the color
      },
    },
    grid: {
      containLabel: true,
      left: '2.5%',
      right: '40%',
    },
    xAxis: { name: '' },
    yAxis: { type: 'category' },
    series: [
      {
        type: 'bar',
        encode: {
          x: 'amount',
          y: 'product',
        },
        itemStyle: {
          color: (params: any) => {
            const colors = ['#FB4C61', '#FEB704', '#20C4A1', '#027EFB'];
            return colors[params?.dataIndex % colors.length]; // Color based on data index
          },
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ width: '800px', height: '400px' }}
    />
  );
};

export default EChartComponent;
