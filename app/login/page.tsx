import React from 'react';
import LoginComp from './components/LoginComp';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/getSession';


const Login = async  () => {
  const session = await getSession()
  const user = session?.user 
  if(user) redirect("/")
  return (
    <LoginComp />
  );
};

export default Login;