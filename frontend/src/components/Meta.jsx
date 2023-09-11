import { Helmet } from "react-helmet-async";

export default function Meta({ title, description, keywords }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
}

Meta.defaultProps = {
  title: "Welcom to ProShop",
  description:
    "We sell the best products at reasonable price with best qualities",
  keywords:
    "electronics, buy electronics, cheap electronics, quality electronics",
};
