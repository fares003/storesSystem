import PerformanceDetails from '@/components/PerformanceDetails'
import React from 'react'

const PerformancePage = () => {

    const PerformanceFromLocal = JSON.parse(localStorage.getItem("performanceData"));
    console.log(PerformanceFromLocal );
    
  return (
    <div>
      <PerformanceDetails performanceData={PerformanceFromLocal}/>
    </div>
  )
}

export default PerformancePage
