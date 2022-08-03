import styled, { css } from "styled-components";

interface Props {
  variant: string;
}

export const CredentialsError = styled.span<Props>`
  ${({ variant }) => {
    switch (variant) {
      case "primary":
        return css`
            color: white;
            font-size: 0.83em;
            background-color: var(--red-color);
            padding: 0.2rem;
            border-radius: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0.6rem 0;
        `;
      default:
        break;
    }
  }}
`;
