import CategoryPostService from "@services/CategoryPostService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "reactstrap";
import CategoryPostTab from "./CategoryPost";

const CategoryPostEdit = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await CategoryPostService.detailCategoryPost(id);
      if (result.isSuccess) {
        setData(result.data);
      }
    })();
  }, []);

  return data ? (
    <CategoryPostTab initial={data} />
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Danh mục Không tồn tại</h4>
    </Alert>
  );
};
export default CategoryPostEdit;
