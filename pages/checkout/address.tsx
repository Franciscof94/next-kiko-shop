import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { ShopLayout } from "../../components/layouts";
import { Button } from "../../share/Button";
import { TextFields } from '../../components/ui/TextFields';

import { AppDispatch, RootState } from '../../store/store';
import { countries, jwt } from '../../utils';
import Cookies from 'js-cookie';
import { GetServerSideProps } from 'next';
import Screen from '../../styles/Screen';


type values = {
  name: string,
  lastName: string,
  address: string,
  address2: string,
  zipCode: string,
  phone: string,
  city: string,
  state: string
};



const AddressPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const validateLogin = Yup.object({
    name: Yup.string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre debe tener menos de 50 caracteres")
      .required("El nombre es requerido"),
    lastName: Yup.string()
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido debe tener menos de 50 caracteres")
      .required("El apellido es requerido"),
    address: Yup.string()
      .min(2, "La dirección debe tener al menos 2 caracteres")
      .max(50, "La dirección debe tener menos de 50 caracteres")
      .required("La dirección es requerida"),
    zipCode: Yup.string()
      .min(2, "El código postal debe tener al menos 2 caracteres")
      .max(50, "El código postal debe tener menos de 50 caracteres")
      .required("El código postal es requerido"),
    phone: Yup.string()
      .min(2, "El teléfono debe tener al menos 2 caracteres")
      .max(50, "El teléfono debe tener menos de 50 caracteres")
      .required("El teléfono es requerido"),
    city: Yup.string()
      .min(2, "La ciudad debe tener al menos 2 caracteres")
      .max(50, "La ciudad debe tener menos de 50 caracteres")
      .required("La ciudad es requerida"),
   
  });



  const handleSubmit = async ({ name, lastName, address, address2, zipCode, phone, city, state }: values) => {
      Cookies.set('name', name),
      Cookies.set('lastName', lastName),
      Cookies.set('address', address),
      Cookies.set('address2', address2),
      Cookies.set('zipCode', zipCode),
      Cookies.set('phone', phone),
      Cookies.set('city', city),
      Cookies.set('state', state)

      router.push('/checkout/summary');
  };

  return (
    <ShopLayout title="Dirección de entrega" pageDescription="Confirmar dirección del destino">
      <Wrapper>
        <Formik
          enableReinitialize
          initialValues={{
            name: Cookies.get('name') || '',
            lastName: Cookies.get('lastName') || '',
            address: Cookies.get('address') || '',
            address2: Cookies.get('address2') || '',
            zipCode: Cookies.get('zipCode') || '',
            phone: Cookies.get('phone') || '',
            city: Cookies.get('city') || '',
            state: Cookies.get('state') || ''
          }}
          onSubmit={(values) => handleSubmit(values)}
          validationSchema={validateLogin}
        >
          {(formik) => {

            return <Form>
              <h1>Dirección de entrega</h1>
              <div>
                <div>
                  <TextFields label="Nombre" name="name" type="string" />
                </div>
                <div>
                  <TextFields label="Apellido" name="lastName" type="string" />
                </div>
                <div>
                  <TextFields label="Dirección" name="address" type="string" />
                </div>
                <div>
                  <TextFields label="Dirección 2 (opcional)" name="address2" type="string" />
                </div>
                <div>
                  <TextFields label="Código postal" name="zipCode" type="string" />
                </div>
                <div>
                  <TextFields label="Teléfono" name="phone" type="string" />
                </div>
                <div>
                  <TextFields label="Ciudad" name="city" type="string" />
                </div>
                <div>
                  <TextFields label="País" name="state" type="string" />
                </div>
              </div>
              <Button type="submit" variant="primary">Revisar pedido</Button>
            </Form>
          }}
        </Formik>
      </Wrapper>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = '' } = req.cookies
  let isValidToken = false

  try {
    await jwt.isValidToken(token)
    isValidToken = true;
  } catch (error) {
    isValidToken = false
  }

  if (!isValidToken) {
    return {
      redirect: {
        destination: '/auth/login?p=/checkout/address',
        permanent: false,
      }
    }
  }

  return {
    props: {

    }
  }
}

const Wrapper = styled.div`
 > form {
  h1 {
    margin-bottom: 1rem
  }
  button {
    width: 250px;
    margin: 1.4rem 0;
  }
  >div{
    display: grid;
    grid-template-rows: auto auto;
    grid-gap: 1.2rem;

    ${Screen.sm`
      grid-template-columns: auto auto;
    `}
    >div:last-child {
      >div:first-child {
        position: relative;
        > div:last-child {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          ${Screen.sm`
            top: 20px;
            right: 20px;
          `}
        }
      }
      > div:last-child {

   
        
        div {
          position: relative;
          .menu {
            position: absolute;
            background-color: white;
            width: 100%;
            max-height: 25vh;
            overflow-y: scroll;
            padding: 0.5rem 0;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            > div {
              cursor: pointer;
              padding: 0.4rem 0.8rem;
              transition: all 0.2s ease-in-out;
              &:hover {
                background-color: #f5f5f5;
              }
            }
          }
        }
    }
  }
 }
`;


export default AddressPage;
