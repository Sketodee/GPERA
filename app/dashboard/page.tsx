import React from 'react'
import DashboardComp from './components/DashboardComp'
import { getSession } from '@/lib/getSession'
import { redirect } from 'next/navigation'

const Dashboard = async () => {
  const session = await getSession()
  const user = session?.user 
  if(!user) redirect('/login')
  return (
<div>
  {user.isActive && <DashboardComp />}
</div>
    // <DashboardComp />
  )
}

export default Dashboard