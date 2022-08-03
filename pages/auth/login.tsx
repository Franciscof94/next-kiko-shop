import { useEffect } from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { AuthLayout } from "../../components/layouts";
import { ButtonPrimary } from "../../share/Button";
import { TextFields } from '../../components/ui/TextFields';
import { CredentialsError } from '../../share/CredentialsError';

import { AppDispatch, RootState } from '../../store/store';
import { checkToken, loginUser, reset } from '../../store/features/authSlice';
import Cookies from 'js-cookie';



type values = {
  email: number | string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isError, isLoggedIn, isSuccess } = useSelector((state: RootState) => state.authUser);
 

  useEffect(() => {
    dispatch(checkToken())
  }, [dispatch]);

  useEffect(() => {
    if (!isLoggedIn) return
    const destination = router.query.p?.toString() || '/';
    router.replace(destination);
  }, [isLoggedIn, router]);

  if (isLoggedIn) return <></>


  const validateLogin = Yup.object({
    email: Yup.string()
      .email("Email incorrecto").required("El email es requerido"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es requerida"),
  });


  const handleSubmit = async ({ email, password }: values) => {
    await dispatch(loginUser({ email, password }))
  };

  return (
    <AuthLayout title="Ingresar">
      <Wrapper>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={(values) => handleSubmit(values)}
          validationSchema={validateLogin}
        >
          {(formik) => {

            return <Form>
              <h1>Iniciar Sesión</h1>
              <div>
                <TextFields label="Email" name="email" type="string" />
              </div>
              <div>
                <TextFields label="Password" name="password" type="password" />
              </div>
              {isError && <CredentialsError variant="primary"><RiErrorWarningLine fontSize={25} style={{ marginRight: '0.2rem' }} />No reconocemos ese usuario / contraseña</CredentialsError>}
              <ButtonPrimary type="submit" >Ingresar</ButtonPrimary>
              <NextLink href={router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'}>¿No tienes cuenta?</NextLink>
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
  > form {
    > div {
      margin: 1.5rem 0;
    }
  }
  a {
    color: var(--black-color)
  }
`;


export default LoginPage;
