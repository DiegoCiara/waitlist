import { ModeToggle } from '@/components/mode-toggle/mode-toggle';
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCustomer } from '@/context/customer-context';
import { useLoading } from '@/context/loading-context';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Count() {
  const { onLoading, offLoading } = useLoading();
  const { id } = useParams();
  const { getCount } = useCustomer();

  const [data, setData] = useState(0);

  const getCustomersCount = async () => {
    await onLoading();
    try {
      const response = await getCount(id!);
      setData(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
    } finally {
      await offLoading();
    }
  };

  useEffect(() => {
    getCustomersCount();
  }, []);

  if (!id) {
    return (
      <span>
        Ops, você entrou no link errado, verifique o link correto e tente
        novamente.
      </span>
    );
  }

  if (id)
    return (
      <section className="flex flex-col gap-0 items-center h-[100vh] justify-center">
        <CardHeader className='text-center'>
          <CardTitle>Case AI</CardTitle>
          <CardDescription>Lista de espera</CardDescription>
        </CardHeader>
        <CardTitle className='text-green-500 m-10 text-4xl'>{data}</CardTitle>
        <ModeToggle />
      </section>
    );
}
