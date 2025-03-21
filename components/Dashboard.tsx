import React from 'react'

interface User {
  id: string;
  email?: string;
}

type Props = {
  user: User | null;
}

const Dashboard = ({ user }: Props) => {
  console.log(user)
  return (
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard