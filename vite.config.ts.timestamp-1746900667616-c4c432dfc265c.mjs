// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
      jsxImportSource: "react",
      babel: {
        plugins: [
          ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }]
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html"),
        dashboard: resolve(__vite_injected_original_dirname, "dashboard.html"),
        listings: resolve(__vite_injected_original_dirname, "listings.html"),
        addProperty: resolve(__vite_injected_original_dirname, "add-property.html"),
        login: resolve(__vite_injected_original_dirname, "login.html"),
        register: resolve(__vite_injected_original_dirname, "register.html")
      }
    }
  },
  // Add this to clear cache issues
  clearScreen: false,
  // Add explicit JSX handling
  esbuild: {
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3Qoe1xuICAgICAganN4UnVudGltZTogJ2F1dG9tYXRpYycsXG4gICAgICBqc3hJbXBvcnRTb3VyY2U6ICdyZWFjdCcsXG4gICAgICBiYWJlbDoge1xuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgWydAYmFiZWwvcGx1Z2luLXRyYW5zZm9ybS1yZWFjdC1qc3gnLCB7IHJ1bnRpbWU6ICdhdXRvbWF0aWMnIH1dXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KVxuICBdLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIG1haW46IHJlc29sdmUoX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpLFxuICAgICAgICBkYXNoYm9hcmQ6IHJlc29sdmUoX19kaXJuYW1lLCAnZGFzaGJvYXJkLmh0bWwnKSxcbiAgICAgICAgbGlzdGluZ3M6IHJlc29sdmUoX19kaXJuYW1lLCAnbGlzdGluZ3MuaHRtbCcpLFxuICAgICAgICBhZGRQcm9wZXJ0eTogcmVzb2x2ZShfX2Rpcm5hbWUsICdhZGQtcHJvcGVydHkuaHRtbCcpLFxuICAgICAgICBsb2dpbjogcmVzb2x2ZShfX2Rpcm5hbWUsICdsb2dpbi5odG1sJyksXG4gICAgICAgIHJlZ2lzdGVyOiByZXNvbHZlKF9fZGlybmFtZSwgJ3JlZ2lzdGVyLmh0bWwnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgLy8gQWRkIHRoaXMgdG8gY2xlYXIgY2FjaGUgaXNzdWVzXG4gIGNsZWFyU2NyZWVuOiBmYWxzZSxcbiAgLy8gQWRkIGV4cGxpY2l0IEpTWCBoYW5kbGluZ1xuICBlc2J1aWxkOiB7XG4gICAganN4RmFjdG9yeTogJ1JlYWN0LmNyZWF0ZUVsZW1lbnQnLFxuICAgIGpzeEZyYWdtZW50OiAnUmVhY3QuRnJhZ21lbnQnLFxuICB9LFxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBRnhCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLFlBQVk7QUFBQSxNQUNaLGlCQUFpQjtBQUFBLE1BQ2pCLE9BQU87QUFBQSxRQUNMLFNBQVM7QUFBQSxVQUNQLENBQUMscUNBQXFDLEVBQUUsU0FBUyxZQUFZLENBQUM7QUFBQSxRQUNoRTtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFFBQ3JDLFdBQVcsUUFBUSxrQ0FBVyxnQkFBZ0I7QUFBQSxRQUM5QyxVQUFVLFFBQVEsa0NBQVcsZUFBZTtBQUFBLFFBQzVDLGFBQWEsUUFBUSxrQ0FBVyxtQkFBbUI7QUFBQSxRQUNuRCxPQUFPLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFFBQ3RDLFVBQVUsUUFBUSxrQ0FBVyxlQUFlO0FBQUEsTUFDOUM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxhQUFhO0FBQUE7QUFBQSxFQUViLFNBQVM7QUFBQSxJQUNQLFlBQVk7QUFBQSxJQUNaLGFBQWE7QUFBQSxFQUNmO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
