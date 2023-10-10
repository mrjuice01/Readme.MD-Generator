import styled, { css, DefaultTheme } from 'styled-components';

export const Container = styled.div`
  width: 100%;
`;

export const Label = styled.span`
  ${({ theme }) => css`
    display: block;
    font-weight: ${theme.font.weights.bold};
    margin-bottom: ${theme.spacings.xsmall};
    width: 100%;
  `}
`;

type InputProps = {
  as?: string;
};

const inputModifiers = {
  textarea: (theme: DefaultTheme) => css`
    resize: none;
    min-height: 10rem;
    height: 10rem;
    max-height: 10rem;

    padding-right: ${theme.spacings.small};

    &::-webkit-scrollbar {
      width: 0.8rem;
      overflow: hidden;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: ${theme.colors.border};
    }
  `,
};

export const Input = styled.input<InputProps>`
  ${({ theme, as = '' }) => css`
    width: 100%;
    background: transparent;
    border-radius: ${theme.border.radius};
    border-width: ${theme.border.width};
    border-color: ${theme.colors.border};
    border-style: solid;
    padding: 8px 12px;

    ${as === 'textarea' && inputModifiers.textarea(theme)};
  `}
`;
