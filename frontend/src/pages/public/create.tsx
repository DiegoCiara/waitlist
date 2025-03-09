import { ModeToggle } from '@/components/mode-toggle/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCustomer } from '@/context/customer-context';
import { useLoading } from '@/context/loading-context';
import { formatPhone } from '@/utils/formats';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SignUp() {
  const { onLoading, offLoading } = useLoading();
  const { id } = useParams();
  const { createCustomer } = useCustomer();

  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  function setUser(column: string, value: string) {
    setData({ ...data, [column]: value });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await onLoading();
    try {
      e.preventDefault();
      if (data.name === '' || data.email === '') {
        toast.warn('Preencha as credenciais corretamnete');
      } else {
        const response = await createCustomer(id!, data);
        console.log(response);
        if (response.status === 201) {
          return toast.success(response.data.message);
        }
      }
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

  const disabled = data.name === '' || data.phone === '' || data.email === '';

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
        <CardHeader>
          <CardTitle>Case AI</CardTitle>
          <CardDescription>Lista de espera</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Increva-se</CardTitle>
              <CardDescription>
                Inscreva-se na lista de espera para receber a versão beta no
                lançamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="Seu nome"
                  value={data.name}
                  onChange={(e) => setUser('name', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className="">
                  Telefone
                </Label>
                <Input
                  type="text"
                  id="phone"
                  placeholder="(XX) XXXXX-XXXX"
                  autoFocus
                  maxLength={15}
                  value={formatPhone(data.phone)}
                  onChange={(e) => setUser('phone', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="">
                  E-mail
                </Label>
                <Input
                  id="email"
                  placeholder="Seu melhor e-mail"
                  autoFocus
                  value={data.email}
                  onChange={(e) => setUser('email', e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={disabled}>
                Entrar
              </Button>
            </CardFooter>
          </Card>
        </form>
          <ModeToggle/>
      </section>
    );
}
