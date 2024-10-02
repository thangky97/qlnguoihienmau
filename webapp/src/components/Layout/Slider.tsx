import { ROUTES } from "@Constants/route"
import { useNavigate } from "react-router"

export default function Slider() {
  const navigate = useNavigate()
  const LIST_HEADER = [
    {
      name: "Doanh nghiệp tư nhân",
      path: ROUTES.BUSINESS
    },
    {
      name: "Chính phủ, tổ chức công lập",
      path: ROUTES.GOVERMENT
    }
  ]
  const onMobileHeaderRedirect = (path: string) => {
    navigate(path)
  }

  return (
    <header id="header" className={`header-mobile flex-col w-[250px]`}>
      <div className="flex flex-column w-full">
        <nav id="navbar" className="nav-menu navbar w-full">
          <ul>
            {
              LIST_HEADER.map(item => {
                return (
                  <li className={`whitespace-nowrap ${window.location.pathname === item.path ? 'selected' : ''}`}>
                    <span
                      className="nav-link"
                      onClick={() => onMobileHeaderRedirect(item.path)}
                    >{item.name}</span>
                  </li>
                )
              })
            }
          </ul>
        </nav>
      </div>
    </header>
  )
}