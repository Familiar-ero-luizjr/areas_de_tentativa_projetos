import styled from 'styled-components';
/** Base visual compartilhada de telas compactas. Cada página mantém um arquivo .styles.ts próprio. */
export const BasePageSection = styled.section`
  width: 100%;
  .lead {
    color: var(--aj-color-muted);
    line-height: 1.6;
    font-size: 15px;
    margin: 0 0 24px;
  }
`;
