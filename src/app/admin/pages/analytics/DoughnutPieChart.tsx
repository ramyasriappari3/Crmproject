import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import {formatNumberToIndianSystem}  from '@Src/utils/globalUtilities';

const DoughnutPieChart = (props: { totalInvoiceAmount: any, totalReceiptAmount: any, totalUnbilledAmount: any, totalOverDueAmount: any, paymentDoughNut: any }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { paymentDoughNut } = props;

  const doughnutColors = ['#00BA62', '#FB4C61', '#f97700', '#90a4ae'];

  const coloredData = paymentDoughNut.map((item: any, index: number) => ({
    ...item,
    itemStyle: {
      color: doughnutColors[index % doughnutColors.length], // Cycle through colors
    }
  }));

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option: echarts.EChartsOption = {
        title: {
          text: 'Payment Collection Status',
          padding: [20, 20, 0, 20],  
          textStyle: {
            color: '#25272D',
            fontSize: 17,
            fontWeight: 700,
            fontFamily: 'Arial',
          },    
        },
        tooltip: {
          trigger: 'item',
          align: 'center',
          formatter: (params: any) => {
            const { name, value, color } = params;
            // Add a circle icon using a small HTML element
            const iconHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:10px;background-color:${color};border-radius:50%;"></span>`;
            
            // Style the name with a smaller font size
            const styledName = `<span style="font-size:13px;">${name}</span>`;
            
            // Add padding and style to the value with a smaller font size
            const paddedValue = `<span style="display:inline-block;padding-left:10px;font-size:13px;">${formatNumberToIndianSystem(Math.round(value))}</span>`;
            
            return `${iconHtml}${styledName}<br/> &nbsp;&nbsp;${paddedValue}`;
          }
        },
        legend: [{
          icon: 'circle',
          itemWidth: 12,
          itemHeight: 12,
          bottom: '5%',
          left: 'center',
          padding: [20, 0, 0, 0],
          textStyle: {
            color: "value",
            fontSize: 12,
            rich: {
              name: {
                fontSize: 12,
                fontWeight: 400,
                padding: [0, 10, 0, 0], // General padding for all items
                lineHeight: 5,
              },
              value: {
                fontSize: 12,
                color: '#000',
                fontWeight: 'bold',
                padding: [0, 0, 0, 0], // General padding for all items
              },
            },
          },
          formatter: (name: string) => {
            const item = paymentDoughNut?.find((data: any) => data.name === name);
            const index = paymentDoughNut?.findIndex((data: any) => data.name === name);
            const color = doughnutColors[index % doughnutColors.length];
            
            let value = item ? item.value : '';
            const rupeeSymbol = '₹'; // Rupee symbol
        
            // Format the name and value with the rupee symbol
            const adjustedName = name === 'Total Amount Due' ? ' ' + name : name;
            const adjustedValue = name === 'Total Amount Due' ? '       ' + `₹${formatNumberToIndianSystem( Math.round(value))}` : `₹${formatNumberToIndianSystem(Math.round(value))}`;
          
            return `{name|${adjustedName}} {value|${adjustedValue}}`;
          },
          
        }],
        
        
        series: [
          {
           
            type: 'pie',
            radius: ['60%', '70%'],
            bottom: '20%',
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: coloredData,
          },
        ],
      };

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, [paymentDoughNut]);

  return <div ref={chartRef} style={{ width: '100%', height: '428px' }} />;
};

export default DoughnutPieChart;
