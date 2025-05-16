import { RodapeContainer, RodapeDiv, RodapeDiv2 } from "./css/rodape.styled.jsx";

export const Rodape = () => {
  return (
    <RodapeContainer>
      <RodapeDiv>
        <RodapeDiv2>
          <span><b>SmartRig</b></span>
          <a href="register">Sua Privacidade</a>
          <a href="register">Sobre nós</a>
          <a href="register">Trabalhe com a gente</a>
        </RodapeDiv2>
        <RodapeDiv2>
          <span><b>Contatos</b></span>
          <a href="register">teste@gmail.com</a>
          <a href="register">00 11 111111111</a>
        </RodapeDiv2>
        <RodapeDiv2>
          <span><b>Links</b></span>
          <a href="register">Serviços</a>
          <a href="register">Empresa</a>
          <a href="register">Sobre</a>
        </RodapeDiv2>
        <RodapeDiv2>
          <span><b>Outros</b></span>
          <a href="register">Políticas de Privacidade</a>
        </RodapeDiv2>
      </RodapeDiv>
    </RodapeContainer>
  );
}
