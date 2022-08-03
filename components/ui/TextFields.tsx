import React, { useState } from 'react';
import { ErrorMessage, useField } from "formik";
import styled from 'styled-components';
import Screen from '../../styles/Screen';

interface WrapperStyled {
  show: boolean,
}

interface InputStyled {
  invalid: boolean
}

type PropTypes = {
  label: string;
  name: string;
  type: string;
  readOnly?: boolean;
  value?: string; 
};



export const TextFields = ({ label, ...props }: PropTypes) => {
  const [field, meta] = useField(props);

  const [show, setShow] = useState<boolean>(false);
  

  const handleFocus = () => {
    setShow(true);
  };

  const handleBlur = () => {
    !field.value && setShow(false);
  };



  return (
    <Wrapper show={show}>
      <label className={show ? "placeholderUp" : ""}>{label}</label>
      <InputFields
        {...field}
        {...props}
        onBlur={handleBlur}
        onFocus={handleFocus}
        autoComplete="off"
        invalid={meta.error && meta.touched ? true : false}
        placeholder={label}
      />
      <ErrorMessage component="div" name={field.name} className="error" />
    </Wrapper>
  )
}

const Wrapper = styled.div<WrapperStyled>`

position: relative;
> label {
  position: absolute;
  transform: translate(0, calc(6% + 1em)) scale(1);
  left: .8em;
  transition: all 0.3s
  margin-bottom: 0.5rem;
  transition: var(--main-transition);
  opacity: 0;
  z-index: -1;
}

.placeholderUp {
  opacity: 1;
  z-index: 15;
  transform: translate(0, .1em) scale(1);
}

input:focus::-webkit-input-placeholder{
  opacity: ${props => props.show ? "0" : "1"};
}
.error {
  color: var(--red-color);
  display: flex;
  font-size: 0.84em;
  align-items: start;
  margin: 0.5rem 0;
}

`

export const InputFields = styled.input<InputStyled>`
  color: var(--black-color);
  font-size: 1em;
  padding: 1rem 0.5rem 0.5rem 0.8rem;
  height: 41px;
  ${Screen.sm`
  height: 61px;
  `}
  width: 100%;
  background-color: var(--grey-color-10);
  border-bottom: ${props => props.invalid ? "0.13rem solid var(--red-color)" : "0.13rem solid var(--grey-color-50)"};

 
`
