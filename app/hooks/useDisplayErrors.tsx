import * as React from "react";
import errorHandler from "../utils/errorHandler";

import { AppErrors } from "../types";

const useDisplayErrors = (errors: AppErrors | undefined) => {
  React.useEffect(() => {
    errorHandler.displayErrors(errors?.fieldErrors);
  }, [errors?.lastUpdatedAt]);
};

export default useDisplayErrors;
