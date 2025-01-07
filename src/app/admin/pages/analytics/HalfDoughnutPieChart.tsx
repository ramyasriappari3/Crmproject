import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const SemiPieChart = (props: { pieChatApplicationStatus: any }) => {
  const { pieChatApplicationStatus } = props;
  const chartRef = useRef<HTMLDivElement>(null);

  const ApplicationStatusColor = [
    { name: "Login Not Sent", color: '#926BFA' },
    { name: "Not Submitted", color: '#FB4C61' },
    { name: "Submitted", color: '#4381FF' },
    { name: "Re-Draft", color: '#FF9E2C' },
    { name: "Approved", color: '#2BBF7D' }
  ];

  const mergedArray = pieChatApplicationStatus.map((item: any) => {
    const colorItem = ApplicationStatusColor.find(color => color.name === item.name);
    return { 
      ...item, 
      itemStyle: { color: colorItem ? colorItem.color : null }
    };
  });

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const legendData = mergedArray.map((item: any) => item.name);

      const option: echarts.EChartsOption = {
        title: {
          text: 'Application Status',
          padding: [0, 0, 10, 20],
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
            // Create a circle icon using a small HTML element
            const iconHtml = `<span style="display:inline-block;margin-right:5px;width:10px;height:10px;background-color:${color};border-radius:50%;"></span>`;
            // Display the name with the icon and the value below it
            return `${iconHtml}${name}<br/> &nbsp;&nbsp;&nbsp;${value}`;
          }
        },
        legend: [{
          bottom: '5%',
          left: 'center',
          data: legendData,
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            fontSize: 12,
            color:"value",
            rich: {
              name: {
                fontSize: 12,
                fontWeight: 'normal',  // Normal font weight for the names
                lineHeight : 4
                // color: '#000',
              },
              value: {
                fontSize: 12,
                fontWeight: 'bold',  // Bold font weight for the values
                color: '#000',
              },
              ...ApplicationStatusColor.reduce((acc, curr) => {
                acc[curr.name] = { color: curr.color }; // Assign color based on ApplicationStatusColor array
                return acc;
              }, {} as Record<string, any>),
            },
          },
          formatter: (name: string) => {
            const item = mergedArray.find((dataItem: any) => dataItem.name === name);
            const value = item ? item.value : '';
            return `\n{name|\n\n${name}} \n{value|\n${value}}`;
          },
        }],
        
        series: [
          {
            type: 'pie',
            radius: ['83%', '93%'],
            center: ['50%', '50%'],
            startAngle: 180,
            top: '20%',
            endAngle: 360,
            data: mergedArray,
            label: {
              show: false,
            },
          },
        ],
      };

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, [pieChatApplicationStatus]);

  return <div ref={chartRef} style={{ width: '100%', height: '410px', marginTop: '20px' }} />;
};

export default SemiPieChart;
