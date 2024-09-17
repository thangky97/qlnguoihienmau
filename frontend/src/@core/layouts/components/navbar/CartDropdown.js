import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import NumberInput from "@components/number-input";
import { ShoppingCart, X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

const CartDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const store = useSelector((state) => state.ecommerce);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const renderCartItems = () => {
    if (store.cart.length) {
      let total = 0;

      return (
        <Fragment>
          <PerfectScrollbar
            options={{
              wheelPropagation: false,
            }}
            className="scrollable-container media-list"
          >
            {store.cart.map((item) => {
              total += item.price;

              return (
                <Media key={item.id} className="align-items-center">
                  <img
                    className="d-block rounded mr-1"
                    src={item.image}
                    alt={item.name}
                    width="62"
                  />
                  <Media body>
                    <X size={14} className="cart-item-remove" />
                    <div className="media-heading">
                      <h6 className="cart-item-title">
                        <Link
                          className="text-body"
                          to={`/apps/ecommerce/product/${item.slug}`}
                        >
                          {item.name}
                        </Link>
                      </h6>
                      <small className="cart-item-by">by {item.brand}</small>
                    </div>
                    <div className="cart-item-qty">
                      <NumberInput
                        min={1}
                        max={10}
                        size="sm"
                        className="p-0"
                        value={item.qty}
                        style={{ width: "7rem", height: "2.15rem" }}
                      />
                    </div>
                    <h5 className="cart-item-price">${item.price}</h5>
                  </Media>
                </Media>
              );
            })}
          </PerfectScrollbar>
          <li className="dropdown-menu-footer">
            <div className="d-flex justify-content-between mb-1">
              <h6 className="font-weight-bolder mb-0">Total:</h6>
              <h6 className="text-primary font-weight-bolder mb-0">
                ${Number(total.toFixed(2))}
              </h6>
            </div>
            <Button.Ripple
              tag={Link}
              to="/apps/ecommerce/checkout"
              color="primary"
              block
              onClick={toggle}
            >
              Checkout
            </Button.Ripple>
          </li>
        </Fragment>
      );
    } else {
      return <p className="m-0 p-1 text-center">Your cart is empty</p>;
    }
  };

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      tag="li"
      className="dropdown-cart nav-item mr-25"
    >
      <DropdownToggle tag="a" className="nav-link position-relative">
        <ShoppingCart className="ficon" />
        {store.cart.length > 0 ? (
          <Badge pill color="primary" className="badge-up">
            {store.cart.length}
          </Badge>
        ) : null}
      </DropdownToggle>
      <DropdownMenu
        right
        tag="ul"
        className="dropdown-menu-media dropdown-cart mt-0"
      >
        <li className="dropdown-menu-header">
          <DropdownItem tag="div" className="d-flex" header>
            <h4 className="notification-title mb-0 mr-auto">My Cart</h4>
            <Badge color="light-primary" pill>
              {store.cart.length || 0} Items
            </Badge>
          </DropdownItem>
        </li>
        {renderCartItems()}
      </DropdownMenu>
    </Dropdown>
  );
};

export default CartDropdown;
