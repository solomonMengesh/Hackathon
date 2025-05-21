import { Button } from 'flowbite-react'
import React from 'react'

const AdminDashboard = () => {
  return (
    <div className='flex flex-col gap-5 ml-10 py-7'>
      
      <div>
        <h1 className='text-5xl'>Kelem Meda Technology</h1>
        <p className='text-3xl'>Employee Sallary</p>
      </div>
      <div className='bg-green-400 w-[330px] p-2 rounded-lg'>
         <p>Gross Pay</p><br/>
        <Button className='px-7 py-4 '>
        <h1 className='text-3xl'>144,678,589</h1>
        <p className='ml-2'>Birr</p>
        </Button>
        </div>

    </div>
  )
}

export default AdminDashboard