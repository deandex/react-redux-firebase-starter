import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';

const RangeBarChart = ({ colors, categories, series }) => {
  const options = {
    colors,
    chart: {
      toolbar: {
        show: false,
      },
    },
    distributed: true,
    legend: {
      horizontalAlign: 'right',
      fontSize: '10px',
      markers: {
        width: 10,
        height: 10,
        radius: 99999,
      },
      itemMargin: {
        vertical: 10,
      },
    },
    xaxis: {
      categories,
      labels: {
        rotate: 0,
        hideOverlappingLabels: false,
        trim: true,
        style: {
          fontSize: '10px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '10px',
        },
      },
    },
    dataLabels: { enabled: false },
  };

  return <Chart options={options} series={series} type="bar" height="100%" />;
};

RangeBarChart.propTypes = {
  colors: PropTypes.instanceOf(Array).isRequired,
  categories: PropTypes.instanceOf(Array).isRequired,
  series: PropTypes.instanceOf(Array).isRequired,
};

export default React.memo(RangeBarChart);
