import React from 'react'
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg'

import Button from '../../components/Button'
import Input from '../../components/Input'

import { Container, Content, Background } from './styles'

const SingUp: React.FC = () => (
  <>
    <Container>
      <Background />
      <Content>
        <img src={logoImg} alt="GoBarber" />

        <form>
          <h1>Faça seu Cadastro</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            placeholder="Senha"
            type="password"
          />

          <Button type="submit">Cadastrar</Button>
        </form>

        <a href="login">
          <FiArrowLeft />
          Voltar para Logon
        </a>
      </Content>
    </Container>
  </>
)

export default SingUp
