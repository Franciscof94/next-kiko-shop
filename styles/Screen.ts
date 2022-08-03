const Screen = {
  sm: (...args: any) => {
    const styles = args;
    return `@media (min-width:576px){
              ${styles}
          } `;
  },
  md: (...args: any) => {
    const styles = args;
    return `@media (min-width:768px){
              ${styles}
          } `;
  },
  lg: (...args: any) => {
    const styles = args;
    return `@media (min-width:992px){
              ${styles}
          } `;
  },
  xl: (...args: any) => {
    const styles = args;
    return `@media (min-width:1200px){
              ${styles}
          } `;
  },
  xxl: (...args: any) => {
    const styles = args;
    return `@media (min-width:1400px){
              ${styles}
          } `;
  },
};

export default Screen;
