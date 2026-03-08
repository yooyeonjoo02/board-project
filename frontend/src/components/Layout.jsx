// import Navbar from "./Navbar";

// export default function Layout({ children }) {
//   return (
//     <>
//       <Navbar />
//       <main>{children}</main>
//     </>
//   );
// }

import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="appMain">
        <Outlet />
      </main>
    </>
  );
}