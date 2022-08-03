import React, { FC } from 'react'
import styled from 'styled-components'

interface Props {
    title: string | number;
    subTitle: string;
    icon?: JSX.Element;
}

const SummaryTile: FC<Props> = ({ title, subTitle, icon }) => {
    return (
        <Wrapper>
            <div>
                <div>
                    {icon}
                </div>
                <div>
                    <div>
                        {title}
                    </div>
                    <div>
                        {subTitle}
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    > div {
        display: flex;
        align-items: center;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
        border-radius: var(--border-radius);
        padding: 1rem;
        min-width: 250px;
        width: 100%;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        &:hover {
            background-color: var(--grey-color-10);
        }
        >div:last-child {
            margin-left: 1.2rem;
            >div:first-child {
                font-size: 3em;
            }
            display: flex;
            flex-direction: column;
        }
    }
`

export default SummaryTile