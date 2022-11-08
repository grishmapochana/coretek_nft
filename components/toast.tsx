import React from 'react'

interface toast {
    type: string,
    msg: string
}

export default function Toast({type, msg}: toast) {
    console.log({type, msg});
    
  return (
    <div></div>
  )
}
