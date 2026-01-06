import React from 'react';
import Svg, { Path } from 'react-native-svg';

const StudentIcon = ({ color = '#666', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V3H13V9H21ZM12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13ZM18 20V22H6V20C6 17.79 9.58 16 12 16C14.42 16 18 17.79 18 20Z"
      fill={color}
    />
  </Svg>
);

export default StudentIcon;

