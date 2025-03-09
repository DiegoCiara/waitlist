import { api } from '@/api/api';
import { Customer } from '@/@types/Customer';
import { AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';

interface CustomerContextInterface {
  createCustomer: (id: string, data: Customer) => Promise<AxiosResponse>;
  getCount: (id: string) => Promise<AxiosResponse>;
}

const CustomerContext = createContext<
  CustomerContextInterface | undefined
>(undefined);

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider = ({ children }: CustomerProviderProps) => {

  async function createCustomer(id: string,  data: Customer) {
    const response = await api.post('/customer', data, {
      headers:{
        userId: id
      }
    });
    return response;
  }

  async function getCount(id: string) {
    const response = await api.get('/customer/count', {
      headers:{
        userId: id
      }
    });
    return response;
  }

  return (
    <CustomerContext.Provider
      value={{
        createCustomer,
        getCount
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error(
      'useCustomer must be used within an CustomerProvider',
    );
  }
  return context;
};
