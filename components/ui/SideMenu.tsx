import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";

import styled from "styled-components";

import { BiSearch } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { RiCoupon4Line, RiWomenLine, RiShieldUserLine } from "react-icons/ri";
import { AiOutlineMan } from "react-icons/ai";
import { FaChild, FaShapes } from "react-icons/fa";
import { MdOutlineVpnKey, MdOutlineDashboard } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { AppDispatch, RootState } from "../../store/store";
import { toggleMenu } from "../../store/features/toggleMenuSlice";
import { checkToken, logout } from '../../store/features/authSlice';
import useWindowDimensions from "../../hooks/useResize";



interface Styled {
  openMenu: boolean;
}


export const SideMenu = () => {

  const router = useRouter();
  const openMenu = useSelector((state: RootState) => state.toggleMenu.toggleMenu);
  const { isLoggedIn, user, isSuccess } = useSelector((state: RootState) => state.authUser);
  const size = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();
  const myRef = useRef<HTMLDivElement>(null)


  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    dispatch(checkToken())
  }, [dispatch])


  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    router.push(`/search/${searchTerm}`);
    dispatch(toggleMenu(false));
  };

  const handleClickOutside = (e: any) => {
    if (myRef.current && !myRef.current?.contains(e.target)) {
      dispatch(toggleMenu(false));
    }
  };





  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });


  return (
    <Wrapper openMenu={openMenu} ref={myRef}>
      <div >
        <div>
          <input
            type="text"
            placeholder="Buscar"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            onKeyPress={(e) => (e.key === "Enter" ? onSearchTerm() : null)}
          />
          <BiSearch fontSize={25} color="#676767" />
        </div>
        {isLoggedIn && <><div>
          <div>
            <CgProfile fontSize={23} color="#676767" />
          </div>
          <NextLink href="/profile" passHref>
            <div onClick={() => dispatch(toggleMenu(false))}>Perfil</div>
          </NextLink>
        </div>
          <div>
            <div>
              <RiCoupon4Line fontSize={23} color="#676767" />
            </div>
            <NextLink href="/orders/history" passHref>
              <div onClick={() => dispatch(toggleMenu(false))}>Mis Ordenes</div>
            </NextLink>
          </div> </>}
        {size.width!! < 900 && <><div>
          <div>
            <AiOutlineMan fontSize={23} color="#676767" />
          </div>
          <NextLink href="/category/men" passHref>
            <div onClick={() => dispatch(toggleMenu(false))}>Hombres</div>
          </NextLink>
        </div>
          <div>
            <div>
              <RiWomenLine fontSize={23} color="#676767" />
            </div>
            <NextLink href="/category/women" passHref>
              <div onClick={() => dispatch(toggleMenu(false))}>Mujeres</div>
            </NextLink>
          </div>
          <div>
            <div>
              <FaChild fontSize={23} color="#676767" />
            </div>
            <NextLink href="/category/kid" passHref>
              <div onClick={() => dispatch(toggleMenu(false))}>Niños</div>
            </NextLink>
          </div> </>}
        {isLoggedIn ? <div onClick={() => { dispatch(logout()); dispatch(toggleMenu(false)) }}>
          <div>
            <FiLogOut fontSize={23} color="#676767" />
          </div>

          <div>Salir</div>

        </div>
          :
          <div>
            <div>
              <MdOutlineVpnKey fontSize={23} color="#676767" />
            </div>
            <NextLink href={`/auth/login?p=${router.asPath}`} passHref>
              <div onClick={() => dispatch(toggleMenu(false))}>Ingresar</div>
            </NextLink>
          </div>}
        <hr />
        {user?.role === "admin" &&
          <>
            <span>Admin Panel</span> 
            <div>
              <div>
                <MdOutlineDashboard fontSize={23} color="#676767" />
              </div>
              <NextLink href='/admin/' passHref>
                <div onClick={() => dispatch(toggleMenu(false))}>Dashboard</div>
              </NextLink>
            </div>
            {/* <div>
              <div>
                <FaShapes fontSize={23} color="#676767" />
              </div>
              <NextLink href="/" passHref>
                <div>Productos</div>
              </NextLink>
            </div> */}
            <div>
              <div>
                <RiCoupon4Line fontSize={23} color="#676767" />
              </div>
              <NextLink href="/admin/orders" passHref>
                <div onClick={() => dispatch(toggleMenu(false))}>Ordenes</div>
              </NextLink>
            </div>
            <div>
              <div>
                <RiShieldUserLine fontSize={23} color="#676767" />
              </div>
              <NextLink href="/admin/users" passHref>
                <div onClick={() => dispatch(toggleMenu(false))}>Usuarios</div>
              </NextLink>
            </div></>}
      </div>
    </Wrapper>
  );
};




const Wrapper = styled.div<Styled>`
  background-color: #fff;
  z-index: 15;
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 260px;
  padding: 1.6rem;
  transition: all 0.6s;
  transform: ${({ openMenu }) =>
    openMenu ? "translateX(0)" : "translateX(100%)"};
  > div {
    > div:first-child {
      border-bottom: 0.13rem solid var(--grey-color-40);
    }
    > div:nth-child(2) {
      margin-top: 0.7rem;
    }
    > div {
      cursor: pointer;
      display: flex;
      margin: 0.9rem 0;
      font-weight: 500;
      > div:last-child {
        margin-left: 1.2rem;
      }
      > input {
        width: 100%;
        padding: 0.5rem;
      }
    }
  }
`;
