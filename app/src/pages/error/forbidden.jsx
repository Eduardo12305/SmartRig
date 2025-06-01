import { Link } from "react-router-dom";

export const Forbidden = () => {
    return (
      <div>
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página. Você precisa possuir uma conta</p>

        <Link to="/">Voltar a pagina inicial</Link>
      </div>
    );
  };
  
  
  