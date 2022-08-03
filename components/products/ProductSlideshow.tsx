import { FC } from "react";
import Image from "next/image";
import { Slide } from 'react-slideshow-image';

import 'react-slideshow-image/dist/styles.css';
import styles from './ProductSlideshow.module.css';

import styled from "styled-components";

interface Props {
  images: string[];
}

export const ProductSlideshow: FC<Props> = ({ images }) => {


  return (
    <Slide
        easing="ease"
        duration={ 7000 }
        indicators
    >
        {
            images.map( image =>  {
                const url = `/products/${ image }`;
                return (
                    <div className={ styles['each-slide'] } key={ image }>
                        <div style={{
                            backgroundImage: `url(${ url })`,
                            backgroundSize: 'cover'
                        }}>
                        </div>
                    </div>
                )

            })
        }

    </Slide>
  );
};

const Wrapper = styled.div`

`

const ImageStyled = styled.div`
width: 100%;
color: yellow;
> span {
  position: unset !important;
}
.image {
  object-fit: contain;
  width: 100% !important;
  position: relative !important;
  height: unset !important;
}
`

