import { createSystem, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          primary: {
            value: "#1E90FF"
          },
          primaryHover: {
            value: "#1C86EE",
          },
          secondary: {
            value: "#FF6347",
          },
          secondaryHover: {
            value: "#FF4500",
          },
          neutrals: {
            high: {
              value: "#F5F5F5"
            },
            medium: {
              value: "#D3D3D3"
            }
          }
        }
      }
    }
  }
});

const theme = createSystem(config);

export default theme;