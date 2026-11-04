import { NavLink, Outlet } from "react-router";
import Logo from "../components/logo";
import LangSwitch from "../components/lang-switch";
import { useLocale } from "../locales";

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "current" : undefined;

export default function Layout() {
  const { t } = useLocale()
  return (
    <div className="layout">
      <header>
        <Logo />
        <nav>
          <NavLink className={navClass} to="/" end>{t.layout.home}</NavLink>
          <NavLink className={navClass} to="/cities">{t.layout.cities}</NavLink>
          <NavLink className={navClass} to="/my-profile">{t.layout.myProfile}</NavLink>
          <LangSwitch />
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}