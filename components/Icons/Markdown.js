import React from 'react'

export default ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox='0 0 26 16' {...props}>
    <path d='M24.115,0 L1.885,0 C0.845,0 0,0.832 0,1.856 L0,14.144 C0,15.168 0.845,16 1.885,16 L24.115,16 C25.155,16 26,15.168 26,14.144 L26,1.856 C26,0.832 25.155,1.13686838e-15 24.115,0 Z M14.4642857,12.8 L11.25,12.8 L11.25,8 L8.87142857,11.072 L6.42857143,8 L6.42857143,12.8 L3.21428571,12.8 L3.21428571,3.2 L6.42857143,3.2 L8.87142857,6.4 L11.25,3.2 L14.4642857,3.2 L14.4642857,12.8 Z M19.2857143,13.568 L15.3,8 L17.6785714,8 L17.6785714,3.2 L20.8928571,3.2 L20.8928571,8 L23.3357143,8 L19.2857143,13.568 L19.2857143,13.568 Z' fill='currentColor' />
  </svg>
)