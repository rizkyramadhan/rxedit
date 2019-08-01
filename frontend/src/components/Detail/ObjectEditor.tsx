import React from "react";
import { toJS } from "mobx";

export default ({ detail, type }: any) => {
  // if (type === "ObjectLiteralExpression") {
  //   if (typeof value === "string") {
  //   }
  // }

  console.log(toJS(detail));

  return <div />;
};
