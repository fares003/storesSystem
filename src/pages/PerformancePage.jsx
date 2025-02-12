import PerformanceDetails from '@/components/PerformanceDetails'
import { usePerformanceContext } from '@/contexts/PerformanceContext';
import React from 'react'

const PerformancePage = () => {

    const { performanceData } = usePerformanceContext() ;
    
  return (
    <div>
      <PerformanceDetails performanceData={performanceData}/>
    </div>
  )
}

export default PerformancePage
