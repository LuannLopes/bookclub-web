import { Flex, Image, useToast } from '@chakra-ui/react'
import { Button, Input, Link, Text } from 'components'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from 'react-query'
import { registerCall } from 'services/api/requests'

export const RegisterScreen = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const mutation = useMutation((newUser) => registerCall(newUser), {
    onError: (error) => {
      toast({
        title: 'Falha ao criar a conta.',
        description:
          error?.response?.data?.error || 'Por favor, tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    },
    onSuccess: () => {
      toast({
        title: 'Conta criada com sucesso.',
        status: 'success',
        duration: 6000,
        isClosable: true
      })
      navigate('/')
    }
  })

  const { handleSubmit, values, handleChange, errors } = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'Nome deve conter no mínimo 3 caracteres.')
        .required('Nome obrigatório'),
      email: Yup.string()
        .email('E-mail inválido')
        .required('E-mail obrigatório'),
      password: Yup.string()
        .min(6, 'A senha deve conter no mínimo 6 caracteres.')
        .required('Senha obrigatória'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais')
        .required('Confirmar senha obrigatório')
    }),
    onSubmit: (data) => {
      mutation.mutate(data)
    }
  })

  return (
    <Flex flexDir="row" w="100vw" h="100vh">
      <Flex
        alignItems={['center', 'flex-start']}
        justifyContent="center"
        padding={['24px', '48px', '80px', '112px']}
        flexDir="column"
        w={['100%', '100%', '100%', '40%']}
        h="100%"
      >
        <Flex flexDir="column" w={['100%', '100%', '100%', '416px']}>
          <Image src="/img/logo.svg" alt="BookClub Logo" w="160px" h="48px" />
          <Text.ScreenTitle mt="48px">Cadastro</Text.ScreenTitle>
          <Input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            mt="24px"
            placeholder="Nome completo"
          />
          <Input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            mt="16px"
            placeholder="E-mail"
          />
          <Input.Password
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            mt="16px"
            placeholder="Senha"
          />
          <Input.Password
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            mt="16px"
            placeholder="confirmar senha"
          />
          <Button
            mt="24px"
            isLoading={mutation.isLoading}
            onClick={handleSubmit}
          >
            Cadastrar
          </Button>
          <Link.Action
            onClick={() => navigate('/')}
            mt="48px"
            text="Já possui uma conta? "
            actionText="Faça login aqui"
          />
        </Flex>
      </Flex>
      <Flex
        w={['0%', '0%', '0%', '60%']}
        h="100vh"
        backgroundImage="url('/img/auth_background.svg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        borderTopLeftRadius="32px"
        borderBottomLeftRadius="32px"
      />
    </Flex>
  )
}
