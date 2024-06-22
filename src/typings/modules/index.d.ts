// import original module declarations
import "solid-styled-components";

// and extend them!
declare module "solid-styled-components" {
  export interface DefaultTheme {
    colors: any;
  }
}

declare module "materialize-css";
