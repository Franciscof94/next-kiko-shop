import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NextLink from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import { BiSearch, BiCart } from "react-icons/bi";
import { IoClose } from 'react-icons/io5';

import Logo from "../../assets/logo.png";
import { ButtonSecondary } from "../../share/Button";
import { toggleMenu } from "../../store/features/toggleMenuSlice";
import { AppDispatch, RootState } from "../../store/store";
import Screen from "../../styles/Screen";
import useWindowDimensions from "../../hooks/useResize";

interface Props {
  isSearchVisible: boolean
}

export const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {numberOfItems} = useSelector((state: RootState) => state.cart);
  

  const size = useWindowDimensions();

  const { asPath, push } = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false)

 
  


  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
    dispatch(toggleMenu(false));
  };




  return (
    <Wrapper isSearchVisible={isSearchVisible}>
      <div>
        <NextLink href="/" passHref>
          <>
          <Image width={90} height={25} src={Logo} alt="logo" />
          </>
        </NextLink>
      </div>
      {isSearchVisible && size.width!! > 900 && <div></div>}
      {size.width!! > 900 && !isSearchVisible && <div>
        <NextLink href="/category/men" passHref>
          <ButtonSecondary bgColor={asPath === "/category/men" ? true : false} onClick={() => dispatch(toggleMenu(false))}>Hombres</ButtonSecondary>
        </NextLink>

        <NextLink href="/category/women" passHref>
          <ButtonSecondary  bgColor={asPath === "/category/women" ? true : false} onClick={() => dispatch(toggleMenu(false))}> Mujeres</ButtonSecondary>
        </NextLink>

        <NextLink href="/category/kid" passHref>
          <ButtonSecondary  bgColor={asPath === "/category/kid" ? true : false} onClick={() => dispatch(toggleMenu(false))}>Niños</ButtonSecondary>
        </NextLink>
      </div>}


      <div>
        <div>
          {isSearchVisible && size.width!! > 900 &&
            <div>
              <input
                type="text"
                placeholder="Buscar"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                onKeyPress={(e) => (e.key === "Enter" ? onSearchTerm() : null)}
              />
            </div>
          }
          <div>
            {searchTerm.length && isSearchVisible ?
              <div onClick={() => { setIsSearchVisible(false); setSearchTerm('') }}><IoClose fontSize={27} color="#676767" /></div> :
              <div onClick={() => { setIsSearchVisible(!isSearchVisible); size.width!! < 900 && dispatch(toggleMenu(true)) }}> <BiSearch fontSize={27} color="#676767" /></div>}
          </div>
        </div>
        <div>
          <div>{numberOfItems > 9 ? '+9' : numberOfItems}</div>
          <NextLink href="/cart" passHref>
            <>
            <BiCart fontSize={27} color="#676767" />
            </>
          </NextLink>
        </div>
        <div onClick={() => dispatch(toggleMenu(true))}>Menu</div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div<Props>`
  display: grid;
  min-height: 81px;
  margin: 0 1.3rem;
    grid-template-columns: minmax(90px, 517px) minmax(
      90px,
      517px
    );
  ${Screen.md`
  margin: 0 auto;
  grid-template-columns: minmax(250px, 417px) minmax(250px, 417px) minmax(
    250px,
    417px
  );
`}
  padding: 1rem 0;
  max-width: 1250px;
  

  > div:first-child {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    
  }
 

  > div:nth-child(2) {
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      color: var(--black-color);
      font-weight: 600;
    }

  }
 
  > div:last-child {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    > div:first-child {
      display: flex;
      margin: 0.4rem;
      border-bottom: ${props => props.isSearchVisible ? '0.13rem solid var(--grey-color-50)' : null};
      > div:first-child {
        
      }
      > div:last-child {
        cursor: pointer;
      }
    }
    > div:nth-child(2) {
      position: relative;
      margin: 0.4rem;
      cursor: pointer;
      > div {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--blue-color);
        color: white;
        left: 1rem;
        bottom: 1.2rem;
        height: 20px;
        width: 20px;
        border-radius: 50%;
      }
    }
    > div:last-child {
      margin: 0.4rem;
      font-size: 1.1em;
      font-weight: 500;
      cursor: pointer;
    }
  }
`;
