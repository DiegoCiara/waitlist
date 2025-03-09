export function formatCurrency(value: string) {
  const numberValue = parseFloat(value);
  if (isNaN(numberValue)) return 'R$ 0,00';
  return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

}

export function formatStatus(value: string){
  if(value === 'UNSUBMITED'){
    return 'Não submetida'
  } else {
    return 'Submetida'
  }

}
export function formatDate(isoDateString: string) {
  const date = new Date(isoDateString);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function getInitials(name: string) {
  if(!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return (
    parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
  );
}


export function formatPhone(phone: string) {
  if (phone) {
    phone = phone.toString();
    phone = phone.replace(/[^*\d]/g, ''); // Remove tudo o que não é dígito exceto o asterisco

    // Verifica se o número tem 7 ou 8 dígitos após o DDD
    phone = phone.replace(/^(\d{2})(\d{7,8})$/, (match, ddd, rest) => {
      if (rest.length === 8 && !rest.startsWith('9')) {
        return `${ddd}9${rest}`;
      }
      return match;
    });

    phone = phone.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses em volta dos dois primeiros dígitos
    phone = phone.replace(/(\d)(\d{4})$/, '$1-$2'); // Coloca hífen entre o quarto e o quinto dígitos
  }
  return phone;
}
