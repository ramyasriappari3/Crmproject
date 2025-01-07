import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import {formatNumberToIndianSystem}  from '@Src/utils/globalUtilities';


const TDSGraphStatus: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);
      const data = {
        payable: 10000000,
        received: 7000000,
        pending: 3000000,
      };

      const option: echarts.EChartsOption = {
        title: {
          text: 'TDS Collection Status',
          padding: [0, 10, 10, 15], // Top, Right, Bottom, Left
          textStyle: {
            color: '#25272D', // Title text color
            fontSize: 17, // Title font size
            fontWeight: 700, // Title font weight
            fontFamily: 'Arial', // Title font family
          },
        },
        legend: {
          bottom: 0,
          itemGap: 50,
          itemWidth: 10,
          itemHeight: 10, // Set the height of the legend icon
          data: [
            { name: 'TDS Payable', icon: 'circle' },
            { name: 'TDS Received', icon: 'circle' },
            { name: 'Pending TDS', icon: 'circle' }
          ],
          formatter: (name) => {
            switch (name) {
              case 'TDS Payable':
                return `{payable|\n\nTDS Payable}\n{payableValue|\n₹${formatNumberToIndianSystem(data.payable)}}`;
              case 'TDS Received':
                return `{received|\n\nTDS Received}\n{receivedValue|\n₹${formatNumberToIndianSystem(data.received)}}`;
              case 'Pending TDS':
                return `{pending|\n\nPending TDS}\n{pendingValue|\n₹${formatNumberToIndianSystem(data.pending)}}`;
              default:
                return name;
            }
          },
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            rich: {
              payable: {
                color: '#FF9E2C', // Orange color for TDS Payable
              },
              payableValue: {
                color: '#000',
                fontSize: 12, // Decrease font size for the value
                fontWeight : 'bold'
              },
              received: {
                color: '#2BBF7D', // Green color for TDS Received
              },
              receivedValue: {
                color: '#000',
                fontSize: 12, // Decrease font size for the value
                fontWeight : 'bold'
              },
              pending: {
                color: '#926BFA', // Purple color for Pending TDS
                
              },
              pendingValue: {
                color: '#000',
                fontSize: 12, // Decrease font size for the value
                fontWeight : 'bold'
              },
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '20%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: [''],
          axisLine: {
              show: true,
              lineStyle: {
                  type: 'dashed', // Makes the X-axis line dashed
                  color: '#ccc', // Optional: Customize the color of the dashed line
                  width: 1, // Optional: Customize the width of the dashed line
              },
          },
      },
        yAxis: {
          type: 'value',
          min: 1000000, // Start the Y-axis from 100k
          max: 10000000,
          axisLabel: {
            formatter: (value) => `₹${(value / 1000).toLocaleString()}k`,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed', // Makes the split line dashed (use 'dotted' for dotted lines)
              color: '#ccc', // Optional: Customize the color of the line
              width: 1, // Optional: Customize the width of the line
          },
          },
        },
        series: [
          {
            name: 'TDS Payable',
            type: 'bar',
            barWidth: '10%',
            barGap: '60%',
            data: [data.payable],
            itemStyle: {
              color: '#FF9E2C',
              borderRadius: [10, 10, 0, 0],
            },
            label: {
              show: false,
            },
          },
          {
            name: 'TDS Received',
            type: 'bar',
            barWidth: '10%',
            barGap: '60%',
            data: [data.received],
            itemStyle: {
              color: '#2BBF7D',
              borderRadius: [10, 10, 0, 0],
            },
            label: {
              show: false,
            },
          },
          {
            name: 'Pending TDS',
            type: 'bar',
            barWidth: '10%',
            barGap: '60%',
            data: [data.pending],
            itemStyle: {
              color: '#926BFA',
              borderRadius: [10, 10, 0, 0],
            },
            label: {
              show: false,
            },
          },
        ],
      };

      myChart.setOption(option);

      // Handle window resize
      const handleResize = () => {
        myChart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        myChart.dispose();
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '350px', marginTop: '5%' }} />;
};

export default TDSGraphStatus;
