import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';

const RadialBarChart = ({
  colors,
  gradientToColors,
  labels,
  series,
  hideLabelName,
  hideLabelValue,
  hollowSize,
  offsetX,
  offsetY,
  width,
  height,
  labelFontSize,
  valueFontSize,
  total,
}) => {
  const options = {
    colors,
    plotOptions: {
      radialBar: {
        offsetX,
        offsetY,
        hollow: {
          margin: 0,
          size: hollowSize,
          background: '#fff',
        },
        track: {
          margin: 0,
          // dropShadow: {
          //   enabled: true,
          //   top: 2,
          //   left: 0,
          //   blur: 4,
          //   opacity: 0.15,
          // },
        },
        dataLabels: {
          name: {
            show: !hideLabelName,
            offsetY: 16,
            color: '#2C2C2C',
            fontSize: labelFontSize,
          },
          value: {
            show: !hideLabelValue,
            offsetY: -15,
            color: '#2C2C2C',
            fontSize: valueFontSize,
            formatter(val) {
              return total > -1 ? total : `${val}%`;
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        gradientToColors,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels,
  };

  return <Chart options={options} series={series} type="radialBar" width={width} height={height} />;
};

RadialBarChart.propTypes = {
  colors: PropTypes.instanceOf(Array).isRequired,
  gradientToColors: PropTypes.instanceOf(Array).isRequired,
  series: PropTypes.instanceOf(Array).isRequired,
  labels: PropTypes.instanceOf(Array),
  hideLabelName: PropTypes.bool,
  hideLabelValue: PropTypes.bool,
  hollowSize: PropTypes.string,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  width: PropTypes.string,
  height: PropTypes.string,
  labelFontSize: PropTypes.string,
  valueFontSize: PropTypes.string,
  total: PropTypes.number,
};

RadialBarChart.defaultProps = {
  labels: [],
  hideLabelName: false,
  hideLabelValue: false,
  hollowSize: '76%',
  offsetX: 0,
  offsetY: 0,
  width: '100%',
  height: '100%',
  labelFontSize: '9px',
  valueFontSize: '22px',
  total: -1,
};

export default React.memo(RadialBarChart);
