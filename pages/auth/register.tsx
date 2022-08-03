import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { AuthLayout } from "../../components/layouts";
import { Button, ButtonPrimary } from "../../share/Button";
import { TextFields } from '../../components/ui/TextFields';
import { CredentialsError } from '../../share/CredentialsError';
import { RiErrorWarningLine } from 'react-icons/ri';
import {  checkToken, registerUser, reset } from '../../store/features/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';


type values = {
  name: string
  email: number | string;
  password: string;
};

const RegisterPage = () => {
  const router = useRouter()

  const dispatch = useDispatch<AppDispatch>();
  const { user, isError, isLoggedIn } = useSelector((state: RootState) => state.authUser);

  useEffect(() => {
    dispatch(checkToken())
  }, [dispatch])

  useEffect(() => {
    const destination = router.query.p?.toString() || '/';
    if (isLoggedIn && user) {
      router.replace(destination);
    }
  }, [router, isLoggedIn, user])

  if(isLoggedIn && user) return <></>



  const validateLogin = Yup.object({
    name: Yup.string()
      .min(2, "El nombre debe ser de 2 caracteres o más")
      .required("El nombre es requerido"),
    email: Yup.string()
      .email("Email incorrecto").required("El email es requerido"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es requerida"),
  });

 
  

  const handleSubmit = async ({ name, email, password }: values) => {

    await dispatch(registerUser({ name, email, password }))
  };

  return (
    <AuthLayout title="Crear cuenta">
      <Wrapper>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
          }}
          onSubmit={(values) => handleSubmit(values)}
          validationSchema={validateLogin}
        >
          {(formik) => {

            return <Form>
              <h1>Crear cuenta</h1>
              <div>
                <TextFields label="Nombre" name="name" type="string" />
              </div>
              <div>
                <TextFields label="Email" name="email" type="string" />
              </div>
              <div>
                <TextFields label="Password" name="password" type="password" />
              </div>
              {isError && <CredentialsError variant="primary"><RiErrorWarningLine fontSize={25} style={{ marginRight: '0.2rem' }} />El usuario ya existe</CredentialsError>}
              <ButtonPrimary type="submit">Registrarse</ButtonPrimary>
              <NextLink href={router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'}>¿Ya tienes cuenta?</NextLink>
            </Form>
          }}
        </Formik>
      </Wrapper>
    </AuthLayout>
  );
};

const Wrapper = styled.div`
  width: 370px;
  padding: 10px 20px;
  text-align: center;

  h1 {
    font-weight: 500;
  }
  > div {
    div:first-child {
      position: relative;
      label {
        .placeholderUp {
          padding-bottom: 0.5rem;
          transform: translate(0, -0.9em) scale(1);
          font-size: 0.8em;
        }
      }
    }
    div:last-child {
      position: relative;
    }
  }
  a {
    color: var(--black-color)
  }
`;


export default RegisterPage;
