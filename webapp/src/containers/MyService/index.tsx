import { IResponse } from "@Constants/models";
import { ROUTES } from "@Constants/route";
import utils, { Toast } from "@Helper/utils";
import productActions from "@Store/actions/productActions";
import { Form, Table } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import Spinner from "@Components/Spinner/Fallback-spinner";

function MyService() {
  const [products, setProducts] = useState<any>([]);
  const { t: translation, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<any>(true);

  function formatPrice(n: any, currency: any) {
    return (
      currency +
      n.toFixed(0).replace(/./g, function (c: any, i: any, a: any) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "." + c : c;
      })
    );
  }

  const columns = [
    {
      title: translation("product_name"),
      render: (row: any) => {
        if (row?.product_names?.length > 0) {
          return row?.product_names[0]?.name;
        } else {
          return "";
        }
      }
    },
    {
      title: translation("total_product"),
      render: (row: any) => {
        if (row?.total_product > 0) {
          return row?.total_product;
        } else {
          return 1;
        }
      }
    },
    {
      title: translation("price"),
      key: "price",
      render: (row: any) => {
        if (row) {
          if (row?.product_prices?.length > 0 && row?.lang) {
            return (
              utils.number_to_price(row?.product_prices[0]?.price) +
              " " +
              utils.getMoneyByLang(row?.lang)
            );
          } else {
            return 0;
          }
        }
      }
    },
    {
      title: translation("discount"),
      // dataIndex: "discount",
      key: "discount",
      render: (row: any) => {
        if (row?.discount) {
          return (
            (utils.number_to_price(row?.discount) || utils.number_to_price(0)) +
            " " +
            utils.getMoneyByLang(row?.lang)
          );
        } else {
          return (
            utils.number_to_price(0) + " " + utils.getMoneyByLang(row?.lang)
          );
        }
      }
    },
    {
      title: translation("total_price"),

      key: "total_price",
      render: (row: any) => {
        if (row?.total_price && row?.lang) {
          return (
            utils.number_to_price(row?.total_price) +
            " " +
            utils.getMoneyByLang(row?.lang)
          );
        } else {
          return 0 + " " + utils.getMoneyByLang(row?.lang);
        }
      }
    },
    {
      title: translation("status"),

      key: "status",
      render: (row: any) => {
        if (
          row?.transaction?.id &&
          row?.transaction?.status &&
          row?.transaction?.status === "paid"
        ) {
          return translation("successful");
        } else {
          return translation("processing");
        }
      }
    }
  ];

  return (
    <div className="px-5 xl:px-0 my-service table-course">
      <div className="mb-4 text-center">
        <span className="text-color text-2xl font-bold">
          {translation("my_cart")}
        </span>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {products?.length > 0 ? (
            <Table dataSource={products} columns={columns} />
          ) : (
            <div className="text-center py-5 text-[16px] text-[#EE4D2D]">
              {translation("cart is empty")}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyService;
