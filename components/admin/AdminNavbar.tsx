import React, { useState } from 'react'
import NextLink from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { toggleMenu } from '../../store/features/toggleMenuSlice';
import Logo from "../../assets/logo.png";



const AdminNavbar = () => {

    const dispatch = useDispatch<AppDispatch>();

    return (
        <Wrapper>
            <div>
                <div>
                    <NextLink href="/" passHref>
                        <Image width={90} height={25} src={Logo} alt="logo" />
                    </NextLink>
                </div>

                <div onClick={() => dispatch(toggleMenu(true))}>Menu</div>
            </div>
        </Wrapper>
    )
}
const Wrapper = styled.div`
display: flex;
justify-content: center;
margin: 0 2rem;
align-items: center;
min-height: 81px;
    > div {
        display: flex;
        justify-content: space-between;
        max-width: 1250px;
        width: 100%;
        >div:last-child {
            margin: 0.4rem;
            font-size: 1.1em;
            font-weight: 500;
            cursor: pointer;
        }
    }
`

export default AdminNavbar